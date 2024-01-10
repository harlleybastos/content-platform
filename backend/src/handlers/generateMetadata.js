const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports.handler = async (event) => {
  try {
    const articleContent = JSON.parse(event.body).content;

    const metadata = await generateSEOMetadata(articleContent);

    return {
      statusCode: 200,
      body: JSON.stringify(metadata),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

const generateSEOMetadata = async (content) => {
  const initialPrompt = `Generate SEO metadata for the following article content: ${content}`;

  const params = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: initialPrompt },
      { role: "user", content: "Generate a meta title for this article." },
      {
        role: "user",
        content: "Generate a meta description for this article.",
      },
      { role: "user", content: "Generate some keywords for this article." },
    ],
  };

  const response = await openai.chat.completions.create(params);
  const assistantMessages =
    response?.choices[0]?.message?.content.split("\n\n");

  return {
    metaTitle: assistantMessages[0],
    metaDescription: assistantMessages[1],
    keywords: assistantMessages[2],
  };
};
