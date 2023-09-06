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

/**
 * Makes AJAX calls to an API
 * @param {String} url The URL of the API
 * @param {Object} uploadData An options object, passed in when making POST request to the API
 * @returns Promise with the data returned from the API as the resolving value
 */
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
