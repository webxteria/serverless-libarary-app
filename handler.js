'use strict';

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid/v4');
const booksTable = process.env.BOOKS_TABLE;

function response( statusCode, message ) {
    return {
        statusCode: statusCode,
        headers: { 'Content-Type': 'application/json' },
        "isBase64Encoded": false,
        body: JSON.stringify(message)
    }
}

module.exports.createBook = (event, context, callback) => {

    let body = JSON.parse(event.body);

    const book = {
        uuid: uuid(),
        name: body.name,
        authorName: body.name,
        releaseDate: body.releaseDate
    }

    return db.put({
        TableName: booksTable,
        Item: book
    }).promise().then( () => {
        callback(null, response(201, book))
    }).catch( err => {
        response(err.statusCode, err)
    })
}

module.exports.getBooks = (event, context, callback) => {
    return db.scan({
        TableName: booksTable,
    }).promise().then(res => {
        callback(null, response(200, res))
    }).catch( err => {
        response(err.statusCode, err)
    })
}

module.exports.deleteBook = (event, context, callback) => {

    let uuid = event.pathParameters.bookUuid;

    return db.delete({
        TableName: booksTable,
        Key: {
            "uuid": uuid
        }
    }).promise().then(res => {
        console.log('deleted')
        callback(null, response(204, res))
    }).catch( err => {
        console.log('error', err)
        response(err.statusCode, err)
    })
}

module.exports.getBook = (event, context, callback) => {

    let uuid = event.pathParameters.bookUuid;

    let params = {
        Key: { "uuid": uuid },
        TableName: booksTable
    };

    return db.get(params).promise().then(res => {
        console.log('here in');
        callback(null, response(200, res))
    }).catch( err => {
        console.log('here out', err);
        response(404, {error: 'Book Not found'})
    })
}
