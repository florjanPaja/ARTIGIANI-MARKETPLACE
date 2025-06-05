const pagamentiModel = require('../models/pagamenti.model');

exports.creaPagamento = async (req, res) => {
  const { id_ordine, importo, metodo_pagamento } = req.body;
  const pagamento = await pagamentiModel.create(id_ordine, importo, metodo_pagamento);
  res.status(201).json(pagamento);
};
