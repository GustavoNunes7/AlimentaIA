document.getElementById("loginForm").addEventListener(
  "submit",

  async (e) => {
    e.preventDefault();

    const dados = {
      email: document.getElementById("email").value,

      senha: document.getElementById("senha").value,
    };

    const response = await fetch(
      "http://localhost:3000/login",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dados),
      },
    );

    if (response.ok) {
      const usuario = await response.json();

      localStorage.setItem(
        "usuario",

        JSON.stringify(usuario),
      );

      window.location.href = "dashboard.html";
    } else {
      alert("Login inválido");
    }
  },
);
