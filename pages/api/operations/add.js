import nc from 'next-connect';
import { getSession } from 'next-auth/client';

import { ADD } from '../../../constants';
import updateBalance from '../../../services/updateBalance';
import stringCalculator from '../../../services/stringCalculator';

const handler = nc()
  .post(async (req, res) => {
    try {
      const { user } = await getSession({ req });
      console.log('sessionss', session);
      const { equation } = JSON.parse(req.body);
  
      const balance = await updateBalance(user.id, ADD);
      const total = stringCalculator(equation);
      res.statusCode = 201;
      res.json({ total, balance });
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.send('Unable to complete add operation', e);
      res.json({
        error: true
      });
    }
  });

export default handler;