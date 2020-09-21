import Decimal from 'decimal.js';
import updateBalance from '../../../services/updateBalance';

export default (req, res) => {
  if (req.method === 'POST') {
    return handlePOST(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}

async function handlePOST(req, res) {
  //TODO: add valid user and type
  const { cookies } = req;
  const { numbers, operations, } = JSON.parse(req.body);
  const first = numbers.shift();
  const balance = await updateBalance(cookies.userId, ADD);

  const total = numbers.reduce((accum, num, idx) => {
    let res;
    switch (operations[idx]) {
      case '+':
        res = Decimal(num).add(accum).toNumber();
        break;
      case '-':
        res = Decimal(accum).sub(num).toNumber();
        break;
      case 'x':
        res = Decimal(accum).times(num).toNumber()
        break;
      case '/':
        res = Decimal.div(accum, num).toNumber();
        break;
      default:
        res = 0;
        break;
    }
    return res;
  }, first);

  res.statusCode = 201;
  res.json({
    total,
    balance
  });
}
