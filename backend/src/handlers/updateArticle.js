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
      UpdateExpression:
        "set #content = :content ,  #category = :category , #author = :author , #authorProfilePhoto = :authorProfilePhoto , #date = :date ,  #draft = :draft , #comments = :comments , #metaTitle = :metaTitle , #metaDescription = :metaDescription , #keywords = :keywords",
      ExpressionAttributeNames: {
        "#content": "content",
        "#category": "category",
        "#author": "author",
        "#authorProfilePhoto": "authorProfilePhoto",
        "#date": "date",
        "#draft": "draft",
        "#comments": "comments",
        "#metaTitle": "metaTitle",
        "#metaDescription": "metaDescription",
        "#keywords": "keywords",
      },
      ExpressionAttributeValues: {
        ":content": data.content,
        ":category": data.category,
        ":author": data.author,
        ":authorProfilePhoto": data.authorProfilePhoto,
        ":date": data.date,
        ":draft": false,
        ":comments": data.comments,
        ":metaTitle": data.metaTitle,
        ":metaDescription": data.metaDescription,
        ":keywords": data.keywords,
      },
      ConditionExpression: "attribute_exists(id)",
    };

    await documentClient.update(params).promise();

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    });
  }
};
