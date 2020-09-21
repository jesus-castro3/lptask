import Decimal from 'decimal.js';
import { ROOT } from '../../../contants';

import updateBalance from '../../../services/updateBalance';

export default (req, res) => {
  if (req.method === 'POST') {
    return handlePOST(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}

async function handlePOST(req, res) {
  const { cookies } = req;
  const balance = await updateBalance(cookies.userId, ROOT);
  const { numbers } = JSON.parse(req.body);
  const [first, second] = numbers;
  let total = 0;
  // if we still have a remainder
  // multiply it by root
  if (second) {
    total = Decimal(first).times(Decimal.sqrt(second)).toNumber();
  } else {
    total = Decimal.sqrt(first).toNumber();
  }
  res.statusCode = 201;
  res.json({ total, balance });
}