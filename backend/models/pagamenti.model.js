const db = require('../config/db');

// Verifica se esiste un pagamento per un ordine
exports.getByOrdine = async (id_ordine) => {
  const result = await db.query(
    `SELECT * FROM pagamenti WHERE id_ordine = $1`,
    [id_ordine]
  );
  return result.rows[0];
};

// Crea un nuovo pagamento
exports.create = async (id_ordine, importo, metodo_pagamento, stato_pagamento = 'in_attesa') => {
  const result = await db.query(
    `INSERT INTO pagamenti (id_ordine, importo, metodo_pagamento, stato_pagamento)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [id_ordine, importo, metodo_pagamento, stato_pagamento]
  );
  return result.rows[0];
};

// Aggiorna stato pagamento
exports.updateStato = async (id_ordine, stato_pagamento) => {
  const result = await db.query(
    `UPDATE pagamenti SET stato_pagamento = $1 WHERE id_ordine = $2 RETURNING *`,
    [stato_pagamento, id_ordine]
  );
  return result.rows[0];
};

// Elimina pagamento
exports.deleteByOrdine = async (id_ordine) => {
  const result = await db.query(
    `DELETE FROM pagamenti WHERE id_ordine = $1 RETURNING *`,
    [id_ordine]
  );
  return result.rows[0];
};
