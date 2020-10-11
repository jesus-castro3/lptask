import calculatorHandler from '../../../services/calculatorMiddleware';
import stringCalculator from '../../../services/stringCalculator';

const handler = calculatorHandler
  .post(async (req, res) => {

    try {
      const { balance } = req;
      //@TODO: integrate random string into stringCalculator
      let randomString = '';
      // we generate a 24 char string
      for (let i = 0; i < 24; i++) {
        // Generate a random char from charcode directory o(n) from 65 to 95 chartcode range
        let char = String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65);
        randomString += char;
        if (i % 6 === 0 && i !== 0) {
          randomString += '-'
        }
      }
      res.statusCode = 201;
      res.json({
        total: randomString,
        balance
      });
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.json({ error: true, total: 'Unable to complete random operation' });
    } 
  });

export default handler;