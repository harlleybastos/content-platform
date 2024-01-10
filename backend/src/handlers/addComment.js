const documentClient = require("../utils/database");

const ARTICLES_TABLE_NAME = process.env.ARTICLES_TABLE;

module.exports.handler = async (event, context, callback) => {
  const id = event.pathParameters.id;
  const data = JSON.parse(event.body);

  try {
    const params = {
      TableName: ARTICLES_TABLE_NAME,
      Key: {
        id: id.toString(),
        title: data.title,
      },
      UpdateExpression: "SET comments = list_append(comments, :newComment)",
      ExpressionAttributeValues: {
        ":newComment": [
          {
            userName: data.userName,
            userPhoto: data.userPhoto,
            comment: data.comment,
            rating: data.rating,
            date: data.date,
            isApproved: data.isApproved,
          },
        ],
      },
      ConditionExpression: "attribute_exists(id)",
    };

    await documentClient.update(params).promise();

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: "Comment added!" }),
    });
  } catch (error) {
    console.error(error);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    });
  }
};
