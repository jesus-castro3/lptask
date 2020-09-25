import Decimal from 'decimal.js';
import nc from 'next-connect';

import { ADD } from '../../../constants';
import updateBalance from '../../../services/updateBalance';
import stringCalculator from '../../../services/stringCalculator';

const handler = nc()
  .post(async (req, res) => {
    const { cookies } = req;
    try {
      const { equation } = JSON.parse(req.body);
  
      const balance = await updateBalance(cookies.userId, ADD);
      const total = stringCalculator(equation);
      res.statusCode = 201;
      res.json({ total, balance });
    } catch (e) {
      res.statusCode = 500;
      res.send('Unable to complete add operation', e);
      res.json({
        error: true
      });
    }
  });

export default handler;