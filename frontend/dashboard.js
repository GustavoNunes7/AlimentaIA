const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  window.location.href = "login.html";
}

// =====================
// USUÁRIO
// =====================

document.getElementById("usuario").innerHTML = `

  <div class="card">

    <h2>
      👤 ${usuario.nome}
    </h2>

    <p>
      Cargo:
      ${usuario.cargo}
    </p>

  </div>
`;

// =====================
// MOSTRAR ÁREAS
// =====================

if (usuario.cargo === "Lixeiro") {
  document.getElementById("areaLixeiro").style.display = "block";
}

if (usuario.cargo === "Nutricionista") {
  document.getElementById("areaNutricionista").style.display = "block";

  ativarTemperatura();
}

if (usuario.cargo === "Cozinheira") {
  document.getElementById("areaCozinheira").style.display = "block";

  ativarTemperatura();
}

if (usuario.cargo === "Distribuidora") {
  document.getElementById("areaDistribuidora").style.display = "block";
}

if (usuario.cargo === "Diretor") {
  document.getElementById("areaDiretor").style.display = "block";

  ativarTemperatura();
}

// =====================
// TEMPERATURA
// =====================

function ativarTemperatura() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;

    const lon = position.coords.longitude;

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
    );

    const dados = await response.json();

    const campo = document.getElementById("temperatura");

    if (campo) {
      campo.value = dados.current_weather.temperature;
    }
  });
}

// =====================
// IA
// =====================

document.getElementById("formularioIA")?.addEventListener(
  "submit",

  async (e) => {
    e.preventDefault();

    const dados = {
      temperatura: document.getElementById("temperatura").value,

      pessoas: document.getElementById("pessoas").value,

      aceitacao: document.getElementById("aceitacao").value,

      clima: document.getElementById("clima").value,

      usuario: usuario.nome,
    };

    const response = await fetch(
      "http://localhost:3000/predict",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dados),
      },
    );

    const resultado = await response.json();

    document.getElementById("resultado").innerHTML = `

      <div class="card">

        <h2>
          📊 Resultado da IA
        </h2>

        <p>
          🍽 Desperdício:
          ${resultado.desperdicio} kg
        </p>

        <p>
          💧 Água economizada:
          ${resultado.agua} litros
        </p>

        <p>
          🌍 CO₂ evitado:
          ${resultado.co2} kg
        </p>

        <p>
          ⚠ ${resultado.alerta}
        </p>

      </div>
    `;

    const diretor = document.getElementById("resultadoDiretor");

    if (diretor) {
      diretor.innerHTML = `

        <div class="card">

          <p>
            Último desperdício previsto:
            ${resultado.desperdicio} kg
          </p>

        </div>
      `;
    }
  },
);
