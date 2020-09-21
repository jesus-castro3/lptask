import Decimal from 'decimal.js';
import { SUBTRACT } from '../../../contants';

import updateBalance from '../../../services/updateBalance';

export default (req, res) => {
  if (req.method === 'POST') {
    return handlePOST(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}

async function handlePOST(req, res) {
  const { cookies } = req;
  const balance = await updateBalance(cookies.userId, SUBTRACT);
  const { numbers } = JSON.parse(req.body);
  const first = numbers.shift();
  const total = numbers.reduce((accum, num) => Decimal(accum).sub(num).toNumber(), first);
  res.statusCode = 201;
  res.json({ total, balance });
}