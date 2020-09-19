import Decimal from 'decimal.js';
import updateBalance from '../../../services/updateBalance';

export default (req, res) => {
  if(req.method === 'GET') {
    return handleGET(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}
    
async function handleGET(req, res) {
  //TODO add valid user and type
  const balance = await updateBalance();
  const { numbers } = req.body;
  const first = numbers.shift();
  const total = numbers.reduce((accum, num) => Decimal.div(accum, num).toNumber(), first);
  res.statusCode = 201;
  res.json({ total, balance });
}
