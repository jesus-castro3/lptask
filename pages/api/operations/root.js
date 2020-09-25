import Decimal from 'decimal.js';
import nc from 'next-connect';

import { ROOT } from '../../../constants';
import updateBalance from '../../../services/updateBalance';

const handler = nc()
  .post(async (req, res) => {
    const { cookies } = req;
    try {
      const balance = await updateBalance(cookies.userId, ROOT);
      // @TODO: incorporate root into stringCalculator
      const { equation } = JSON.parse(req.body);
      const [first, second] = equation.split('root');
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
    } catch (e) {
      res.statusCode = 500;
      res.send('Unable to complete operation root', e);
      res.json({
        error: true
      });
    }
  });

  export default handler;