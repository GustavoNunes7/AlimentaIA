function preverDesperdicio(dados) {
  let desperdicio = 0;

  desperdicio += Number(dados.pessoas) * 0.12;

  desperdicio -= Number(dados.aceitacao) * 0.3;

  desperdicio += Number(dados.temperatura) * 0.15;

  if (dados.clima === "Chuvoso") {
    desperdicio += 10;
  }

  if (desperdicio < 0) {
    desperdicio = 0;
  }

  return Number(desperdicio.toFixed(2));
}

module.exports = {
  preverDesperdicio,
};
