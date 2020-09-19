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

  const { numbers } = JSON.parse(req.body);
  const first = numbers.shift();
  const total = numbers.reduce((accum, num) => Decimal(accum).times(num).toNumber(), first);
  res.statusCode = 201;
  res.json({ total, balance });
}