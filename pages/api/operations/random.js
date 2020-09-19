import updateBalance from '../../../services/updateBalance';

export default (req, res) => {
  if (req.method === 'POST') {
    return handlePOST(req, res);
  }
  return res.send(`${req.method} Method not supported`);
}

async function handlePOST(req, res) {
  const balance = await updateBalance();

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
  res.json({ total: randomString, balance });
}
