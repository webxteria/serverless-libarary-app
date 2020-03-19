const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2'});
const DB = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');


exports.handler = function (event, context, callback) {
    
    let params = {
      TableName: "Books",
      Item: {
        uuid : uuidv4(),
        authorName: event.authorName,
        name : event.name,
        releaseDate: event.releaseDate
      }
    };
    
    console.log(DB.put(params, (err, data) => {
        
       if(err) {
            callback(err, null)
       }else{
          callback(null, params.Item)
       }
            
    }));
    
};
