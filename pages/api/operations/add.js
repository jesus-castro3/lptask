import Decimal from 'decimal.js';

import updateBalance from '../../../services/updateBalance';

export default (req, res) => {
  if(req.method === 'GET') {
    return handleGET(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}

async function handleGET(req, res) {
  const balance = await updateBalance();
  
  const { numbers } = req.body;
  const total = numbers.reduce((accum, num) => Decimal(num).add(accum).toNumber(), 0);
  res.statusCode = 201;
  res.json({ total, balance });
}
