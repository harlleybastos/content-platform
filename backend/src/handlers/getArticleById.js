const documentClient = require("../utils/database");

const ARTICLES_TABLE_NAME = process.env.ARTICLES_TABLE;

module.exports.handler = async (event, context, callback) => {
  const articleId = event.pathParameters.id; // Assuming you're using API Gateway and have set up a route like /articles/{id}
  const bodyData = JSON.parse(event.body);

  if (!articleId) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({ error: "Article ID is required" }),
    });
  }

  try {
    const params = {
      TableName: ARTICLES_TABLE_NAME,
      Key: {
        id: articleId.toString(), // Assuming 'id' is the primary key for your table
        title: bodyData.title,
      },
    };

    const data = await documentClient.get(params).promise();

    if (!data.Item) {
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({ error: "Article not found" }),
      });
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    });
  } catch (error) {
    console.error(error);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    });
  }
};
