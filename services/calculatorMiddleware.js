import nc from 'next-connect';
import updateBalance from './updateBalance';

// everytime
const calculatorMiddleware = nc()
  .use((req, res, next) => {
    req.body = JSON.parse(req.body);
    next();
  })
  .use(updateBalance)

export default calculatorMiddleware;