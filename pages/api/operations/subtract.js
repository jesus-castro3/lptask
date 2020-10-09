import nc from 'next-connect';
import { getSession } from 'next-auth/client';

import { SUBTRACT } from '../../../constants';
import stringCalculator from '../../../services/stringCalculator';
import updateBalance from '../../../services/updateBalance';

const handler = nc()
  .post(async (req, res) => {
    try {
      const { user } = await getSession({ req });
      const balance = await updateBalance(user.id, SUBTRACT);
      const { equation } = JSON.parse(req.body);
      const total = stringCalculator(equation);
    
      res.statusCode = 201;
      res.json({ total, balance });
    } catch(e) {
      res.statusCode = 500;
      res.send('Unable to complete subtract operation', e);
      res.json({
        error: true
      });
    }
  });

export default handler;