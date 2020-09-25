import Decimal from 'decimal.js';
import nc from 'next-connect';

import { ROOT } from '../../../constants';
import updateBalance from '../../../services/updateBalance';
import stringCalculator from '../../../services/stringCalculator';

const handler = nc()
  .post(async (req, res) => {
    const { cookies } = req;
    try {
      const balance = await updateBalance(cookies.userId, ROOT);
      // @TODO: incorporate root into stringCalculator or not? 
      const { equation } = JSON.parse(req.body);
      // might be better to split by 'root'...might
      const rootHowMany = equation.split('').filter(v => v === '√').length;
      const equationsToSolve = equation.split('√').filter(v => v);
      const remainder = (rootHowMany === equationsToSolve.length) ? 1 : equationsToSolve.shift();
      const total = equationsToSolve
        .map(val => Decimal.sqrt(stringCalculator(val)))
        .reduce((accum, val) => new Decimal(accum).times(val).toNumber(), remainder)
      
      res.statusCode = 201;
      res.json({ total, balance });
    } catch (e) {
      res.statusCode = 500;
      res.json({
        error: true,
        errorMessage: e
      });
    }
  });

  export default handler;