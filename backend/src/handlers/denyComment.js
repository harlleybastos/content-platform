const documentClient = require("../utils/database");

const ARTICLES_TABLE_NAME = process.env.ARTICLES_TABLE;

module.exports.handler = async (event, context, callback) => {
  const id = event.pathParameters.id;
  const commentIndex = event.pathParameters.commentIndex;
  const data = JSON.parse(event.body);

  try {
    const params = {
      TableName: ARTICLES_TABLE_NAME,
      Key: {
        id: id.toString(),
        title: data.title,
      },
      UpdateExpression: `REMOVE comments[${commentIndex}]`,
      ConditionExpression: "attribute_exists(id)",
    };

    await documentClient.update(params).promise();

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: "Comment denied and deleted!" }),
    });
  } catch (error) {
    console.error(error);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    });
  }
};
