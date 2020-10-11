/**
 * Client Side API service, using fetch
 */

/**
 * Submits calculator request both for sequential and multiple operators equation
 * e.g 5+5+5, 5/45/34*4+44
 * @param {String}
 * @param {String}
 * @return { balance: String, total: Number }
 */
export const submitNumRequest = async (equation, type = '') => {
  let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/operations/${type}`, {
    method: 'post',
    body: JSON.stringify({ equation, type })
  });
   let res = await response.json();
   return res;
}

/**
 * Returns a 24 random generated string
 * e.g KKDKS-KSKSL-URUIO-KDJHS
 * @return { balance: String, total: String }
 */
export const submitRandomStringRequest = async (type) => {
  let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/operations/${type}`, {
    method: 'post',
    body: JSON.stringify({ type })
  });
  return await response.json();
}

/**
 * Includes a root operation request √
 * @param {String}
 * @return { balance: String, total: String }
 */
export const submitRootRequest = async (equation, type) => {
  let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/operations/${type}`, {
    method: 'post',
    body: JSON.stringify({ equation, type })
  });
  return await response.json();
}

