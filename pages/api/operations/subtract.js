import nc from 'next-connect'
import calculatorMiddleware from '../../../services/calculatorMiddleware';
import stringCalculator from '../../../services/stringCalculator';

const handler = nc()
  .use(calculatorMiddleware)
  .post(async (req, res) => {
    console.log('subtract:::');
    try {
      const { balance } = req;
      const { equation } = req.body;
      const total = stringCalculator(equation);
      console.log(total);
      res.statusCode = 201;
      res.json({ total, balance });
    } catch(e) {
      console.error(e);
      res.statusCode = 500;
      res.json({
        error: true,
        errorMsg: 'Unable to complete subtract operation'
      });
    }
  });

export default handler;