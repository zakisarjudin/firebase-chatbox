const { Configuration, OpenAIApi } = require("openai");
const OPENAI_API_KEY = "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";

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const createCompletion = async function (prompt = "") {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  return response;
};
