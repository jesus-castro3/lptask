import nc from 'next-connect'
import stringCalculator from '../../../services/stringCalculator';
import calculatorMiddleware from '../../../services/calculatorMiddleware';

const handler = nc()
  .use(calculatorMiddleware)
  .post(async (req, res) => {
    try {
      const { balance } = req;
      const { equation } = req.body;
      const total = stringCalculator(equation);
      console.log('TOTTAL:', total);
      res.statusCode = 201;
      res.json({
        total,
        balance
      });
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.json({
        error: true,
        errorMsg: 'Unable to complete requested operation'
      });
    }
  });

export default handler;
