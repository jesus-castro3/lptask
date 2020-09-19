import Decimal from 'decimal.js';

import updateBalance from '../../../services/updateBalance';

export default (req, res) => {
  if (req.method === 'GET') {
    return handleGET(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}

async function handleGET(req, res) {
  //TODO add valid user and type
  const balance = await updateBalance();

  const { number } = req.body;
  const total = Decimal.sqrt(number).toNumber();
  res.statusCode = 201;
  res.json({ total, balance });
}