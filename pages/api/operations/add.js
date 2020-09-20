import Decimal from 'decimal.js';

import updateBalance from '../../../services/updateBalance';

export default (req, res) => {
  if(req.method === 'POST') {
    return handlePost(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}

async function handlePost(req, res) {
  const balance = await updateBalance();
  
  const { numbers } = JSON.parse(req.body);
  const total = numbers.reduce((accum, num) => Decimal(num).add(accum).toNumber(), 0);
  res.statusCode = 201;
  res.json({ total, balance });
}
