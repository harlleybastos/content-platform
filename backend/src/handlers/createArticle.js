const uuid = require("uuid");
const documentClient = require("../utils/database");

const ARTICLES_TABLE_NAME = process.env.ARTICLES_TABLE;

module.exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);

  try {
    const params = {
      TableName: ARTICLES_TABLE_NAME,
      Item: {
        id: uuid.v4(),
        title: data.title,
        content: data.content,
        category: data.category,
        author: data.author,
        authorProfilePhoto: data.authorProfilePhoto,
        date: data.date,
        comments: [],
        draft: true,
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      },
      ConditionExpression: "attribute_not_exists(id)",
    };

    await documentClient.put(params).promise();

    callback(null, {
      statusCode: 201,
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
    callback(null, {
      statusCode: error.statusCode,
      body: JSON.stringify({ error: error.message }),
    });
  }
};
