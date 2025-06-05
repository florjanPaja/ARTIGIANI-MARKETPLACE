const db = require('../config/db');

exports.create = async (id_ordine, importo, metodo_pagamento, stato_pagamento = 'in_attesa') => {
  const result = await db.query(
    `INSERT INTO pagamenti (id_ordine, importo, metodo_pagamento, stato_pagamento)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [id_ordine, importo, metodo_pagamento, stato_pagamento]
  );
  return result.rows[0];
};
