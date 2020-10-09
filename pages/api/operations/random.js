import nc from 'next-connect';
import { getSession } from 'next-auth/client';

import { RANDOM } from '../../../constants';
import updateBalance from '../../../services/updateBalance';

const handler = nc()
  .get(async (req, res) => {
    try {
      const { user } = await getSession({ req });
      const balance = await updateBalance(user.id, RANDOM);
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
      res.statusCode = 500;
      res.json({ error: true, total: 'Error', balance: 0 });
    } 
  });

export default handler;