import Decimal from 'decimal.js';
import calculatorHandler from '../../../services/calculatorMiddleware';
import stringCalculator from '../../../services/stringCalculator';

const handler = calculatorHandler
  .post(async (req, res) => {
    try {
      const { balance } = req;
      const { equation } = req.body;
      // @TODO: incorporate root into stringCalculator or not? 
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
      console.error(e);
      res.statusCode = 500;
      res.json({
        error: true,
        errorMsg: 'Unable to complete root operation'
      });
    }
  });

  export default handler;