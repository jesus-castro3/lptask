import Decimal from 'decimal.js';
import { ADD } from '../../../contants';
import updateBalance from '../../../services/updateBalance';
import stringCalculator from 'string-calculator';

export default (req, res) => {
  if (req.method === 'POST') {
    return handlePOST(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}

async function handlePOST(req, res) {
  const { cookies } = req;
  const { equation } = JSON.parse(req.body);
  const balance = await updateBalance(cookies.userId, ADD);

  const total = stringCalculator(equation);

  res.statusCode = 201;
  res.json({
    total,
    balance
  });
}
