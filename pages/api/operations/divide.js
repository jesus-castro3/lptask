import Decimal from 'decimal.js';
import updateBalance from '../../../services/updateBalance';
import nc from 'next-connect';

import stringCalculator from '../../../services/stringCalculator';
import { DIVIDE } from '../../../constants';

const handler = nc()
  .post(async (req, res) => {
    const { cookies } = req;
    try {
      const { equation } = JSON.parse(req.body);
      const balance = await updateBalance(cookies.userId, DIVIDE);
      const total = stringCalculator(equation);
      res.statusCode = 201;
      res.json({ total, balance });
    } catch(e) {
      res.statusCode = 500;
      res.send('Unable to complete divide operation');
      res.json({
        error: true
      });
    }
  });

  export default handler;
