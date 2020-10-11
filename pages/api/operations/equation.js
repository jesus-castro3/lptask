import calculatorHandler from '../../../services/calculatorMiddleware';
import stringCalculator from '../../../services/stringCalculator';

const handler = calculatorHandler
  .post(async (req, res) => {
    try {
      const { balance } = req;
      const { equation } = req.body;
      const total = stringCalculator(equation);

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
