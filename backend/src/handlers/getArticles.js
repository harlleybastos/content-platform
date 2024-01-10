const documentClient = require("../utils/database");

const ARTICLES_TABLE_NAME = process.env.ARTICLES_TABLE;

module.exports.handler = async (event, context, callback) => {
  try {
    const params = {
      TableName: ARTICLES_TABLE_NAME,
    };

    const data = await documentClient.scan(params).promise();

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
    callback(null, {
      statusCode: 201,
      body: JSON.stringify(data),
    });
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ data: [] }),
  });
};
