export const createCompletion = async function (prompt = "") {
  let details = {
    prompt: prompt,
  };

  let formBody = [];
  for (let property in details) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  const request = await fetch("https://remarkable-marzipan-5750ff.netlify.app/.netlify/functions/server/createCompletion", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody,
  });

  return request.json();
};
