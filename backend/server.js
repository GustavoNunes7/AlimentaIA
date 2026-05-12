const express = require("express");

const cors = require("cors");

const db = require("./database");

const { preverDesperdicio } = require("./ia");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("../frontend"));

// HOME

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../frontend/login.html");
});

// LOGIN

app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.get(
    `
      SELECT * FROM usuarios
      WHERE email = ?
      AND senha = ?
    `,

    [email, senha],

    (err, usuario) => {
      if (!usuario) {
        return res.status(401).json({
          erro: "Login inválido",
        });
      }

      res.json(usuario);
    },
  );
});

// CADASTRO FUNCIONÁRIOS

app.post("/cadastro", (req, res) => {
  const { nome, email, senha, cargo } = req.body;

  db.run(
    `
      INSERT INTO usuarios (
        nome,
        email,
        senha,
        cargo
      )

      VALUES (?, ?, ?, ?)
    `,

    [nome, email, senha, cargo],

    function (err) {
      if (err) {
        return res.status(400).json({
          erro: "Usuário já existe",
        });
      }

      res.json({
        mensagem: "Funcionário cadastrado",
      });
    },
  );
});

// IA

app.post("/predict", (req, res) => {
  const resultado = preverDesperdicio(req.body);

  const agua = Number((resultado * 12).toFixed(2));

  const co2 = Number((resultado * 1.8).toFixed(2));

  db.run(
    `
      INSERT INTO previsoes (

        temperatura,
        pessoas,
        aceitacao,
        clima,
        desperdicio,
        agua,
        co2,
        usuario

      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,

    [
      req.body.temperatura,
      req.body.pessoas,
      req.body.aceitacao,
      req.body.clima,

      resultado,

      agua,

      co2,

      req.body.usuario,
    ],
  );

  res.json({
    desperdicio: resultado,

    agua,

    co2,

    alerta:
      resultado > 30
        ? "ALTA PROBABILIDADE DE DESPERDÍCIO"
        : "Produção Controlada",
  });
});

// RESÍDUOS

app.post("/residuos", (req, res) => {
  db.run(
    `
      INSERT INTO residuos (

        tipo,
        quantidade,
        responsavel

      )

      VALUES (?, ?, ?)
    `,

    [req.body.tipo, req.body.quantidade, req.body.responsavel],
  );

  res.json({
    mensagem: "Resíduo registrado",
  });
});

// CARDÁPIOS

app.post("/cardapios", (req, res) => {
  db.run(
    `
      INSERT INTO cardapios (

        refeicao,
        aceitacao,
        nutricionista

      )

      VALUES (?, ?, ?)
    `,

    [req.body.refeicao, req.body.aceitacao, req.body.nutricionista],
  );

  res.json({
    mensagem: "Cardápio registrado",
  });
});

// PRODUÇÃO

app.post("/producao", (req, res) => {
  db.run(
    `
      INSERT INTO producao (

        refeicoes,
        cozinheira

      )

      VALUES (?, ?)
    `,

    [req.body.refeicoes, req.body.cozinheira],
  );

  res.json({
    mensagem: "Produção registrada",
  });
});

// DOAÇÕES

app.post("/doacoes", (req, res) => {
  db.run(
    `
      INSERT INTO doacoes (

        instituicao,
        quantidade,
        distribuidora

      )

      VALUES (?, ?, ?)
    `,

    [req.body.instituicao, req.body.quantidade, req.body.distribuidora],
  );

  res.json({
    mensagem: "Doação registrada",
  });
});

// USUÁRIOS

app.get("/usuarios", (req, res) => {
  db.all(
    `
      SELECT * FROM usuarios
    `,

    [],

    (err, rows) => {
      res.json(rows);
    },
  );
});

// RELATÓRIO

app.get("/relatorio", (req, res) => {
  db.all(
    `
      SELECT * FROM previsoes
    `,

    [],

    (err, previsoes) => {
      db.all(
        `
          SELECT * FROM residuos
        `,

        [],

        (err, residuos) => {
          db.all(
            `
              SELECT * FROM doacoes
            `,

            [],

            (err, doacoes) => {
              res.json({
                previsoes,
                residuos,
                doacoes,
              });
            },
          );
        },
      );
    },
  );
});

// SERVIDOR

app.listen(3000, () => {
  console.log("=======================");

  console.log("🚀 ALIMENTAIA ONLINE");

  console.log("🌐 http://localhost:3000");

  console.log("=======================");
});
