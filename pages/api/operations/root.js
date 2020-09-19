import Decimal from 'decimal.js';

import updateBalance from '../../../services/updateBalance';

export default (req, res) => {
  if (req.method === 'POST') {
    return handlePOST(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}

async function handlePOST(req, res) {
  //TODO add valid user and type
  const balance = await updateBalance();

  const { number } = JSON.parse(req.body);
  const total = Decimal.sqrt(number).toNumber();
  res.statusCode = 201;
  res.json({ total, balance });
}