import Decimal from 'decimal.js';
import nc from 'next-connect';

import { TIMES } from '../../../constants';
import stringCalculator from '../../../services/stringCalculator';
import updateBalance from '../../../services/updateBalance';

const handler = nc()
  .post(async(req, res) => {
    try {
      const { cookies } = req;
      const balance = await updateBalance(cookies.userId, TIMES);
      const { equation } = JSON.parse(req.body);
      const total = stringCalculator(equation);
      res.statusCode = 201;
      res.json({ total, balance });
    } catch (e) {
      res.statusCode = 201;
      res.json({ error: true })
    }
  })

export default handler;