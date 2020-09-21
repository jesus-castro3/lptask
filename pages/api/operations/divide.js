import Decimal from 'decimal.js';
import updateBalance from '../../../services/updateBalance';
import { DIVIDE } from '../../../contants';

export default (req, res) => {
  if(req.method === 'POST') {
    return handlePOST(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}
    
async function handlePOST(req, res) {
  const { cookies } = req;
  const { numbers } = JSON.parse(req.body);
  const balance = await updateBalance(cookies.userId, DIVIDE);
  const first = numbers.shift();
  const total = numbers.reduce((accum, num) => Decimal.div(accum, num).toNumber(), first);
  res.statusCode = 201;
  res.json({ total, balance });
}
