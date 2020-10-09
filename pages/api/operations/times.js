import Decimal from 'decimal.js';
import nc from 'next-connect';
import { getSession } from 'next-auth/client';

import { TIMES } from '../../../constants';
import stringCalculator from '../../../services/stringCalculator';
import updateBalance from '../../../services/updateBalance';

const handler = nc()
  .post(async(req, res) => {
    try {
      const { user } = await getSession({ req });
      const balance = await updateBalance(user.id, TIMES);
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