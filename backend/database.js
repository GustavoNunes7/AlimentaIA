const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./alimentaia.db");

db.serialize(() => {
  // USUÁRIOS

  db.run(`

    CREATE TABLE IF NOT EXISTS usuarios (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      nome TEXT,

      email TEXT UNIQUE,

      senha TEXT,

      cargo TEXT
    )
  `);

  // PREVISÕES

  db.run(`

    CREATE TABLE IF NOT EXISTS previsoes (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      temperatura REAL,

      pessoas INTEGER,

      aceitacao REAL,

      clima TEXT,

      desperdicio REAL,

      agua REAL,

      co2 REAL,

      usuario TEXT,

      data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // RESÍDUOS

  db.run(`

    CREATE TABLE IF NOT EXISTS residuos (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      tipo TEXT,

      quantidade REAL,

      responsavel TEXT,

      data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // CARDÁPIOS

  db.run(`

    CREATE TABLE IF NOT EXISTS cardapios (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      refeicao TEXT,

      aceitacao REAL,

      nutricionista TEXT,

      data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // PRODUÇÃO

  db.run(`

    CREATE TABLE IF NOT EXISTS producao (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      refeicoes INTEGER,

      cozinheira TEXT,

      data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // DOAÇÕES

  db.run(`

    CREATE TABLE IF NOT EXISTS doacoes (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      instituicao TEXT,

      quantidade REAL,

      distribuidora TEXT,

      data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // DIRETOR PADRÃO

  db.run(`

    INSERT OR IGNORE INTO usuarios (

      id,
      nome,
      email,
      senha,
      cargo

    )

    VALUES (

      1,
      'Administrador',
      'diretor',
      '1234',
      'Diretor'

    )
  `);
});

module.exports = db;
