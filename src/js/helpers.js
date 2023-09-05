import { TIMEOUT_SEC } from "./config.js";

/**
 * Creates a timeout
 * @param {number} s Number of seconds before timeout
 * @returns A promise that rejects with an error after s seconds have passed
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // Throw an error if response failed
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Gets the data from the URL in the form of an object
 * @param {string} url The URL to be fetched
 * @returns A promise with the data from the url as the resolved value
 */
// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);

//     return data;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const send = fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([send, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
