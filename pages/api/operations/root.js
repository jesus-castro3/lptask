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
  const [first, second] = numbers;
  let total = 0;
  // do we still have a remainder
  // multiply it by root
  if (second) {
    total = Decimal(first).times(Decimal.sqrt(second)).toNumber();
  } else {
    total = Decimal.sqrt(first).toNumber();
  }
  console.log(total, first, second)
  res.statusCode = 201;
  res.json({ total, balance });
}