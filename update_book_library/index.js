const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2'});
const DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) =>{
    
    console.log(event, event.pathParameters);
    
    let params = {
      TableName: "Books",
      key: {
        uuid: event.query.uuid
      },
      Item: {
        authorName: event.authorName,
        name : event.name,
        releaseDate: event.releaseDate
      }
    };
    
    DB.update(params, (err, data) => {
        
       if(err) {
            return { statusCode:500, message: err}
       }else{
           return { statusCode:200, message: params.Item}
       }
            
    });
    
};
