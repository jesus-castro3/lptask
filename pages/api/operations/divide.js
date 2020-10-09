import updateBalance from '../../../services/updateBalance';
import nc from 'next-connect';
import { getSession } from 'next-auth/client';

import stringCalculator from '../../../services/stringCalculator';
import { DIVIDE } from '../../../constants';

const handler = nc()
  .post(async (req, res) => {
    try {
      const { user } = await getSession({ req });
      const { equation } = JSON.parse(req.body);
      const balance = await updateBalance(user.id, DIVIDE);
      const total = stringCalculator(equation);
      res.statusCode = 201;
      res.json({ total, balance });
    } catch(e) {
      res.statusCode = 500;
      res.json({
        error: true,
        errorMessage: e
      });
    }
  });

  export default handler;
