'use strict';

const express = require('express')
const AWS = require('aws-sdk')

const PORT = 8080
const DynamoDBTable = process.env.DynamoDBTable
const dynamodbDocumentClient = new AWS.DynamoDB.DocumentClient()
const app = express()

app.use(express.json())

app.put('/product/:productId', (req, res, next) => {

    var productId = req.params.productId
    var elData = req.body

    if( 'productId' in elData && elData.productId != productId ){
        return next({ status: 400, message: "productId in path is different from productId in payload" })
    }

    elData.productId = productId
    var params = {
        Item: elData, 
        TableName: DynamoDBTable
    }

    dynamodbDocumentClient.put(params, (err, data) => {
        if (err) next(err)
        else res.status(200).json( params.Item )
    })

})

app.get('/product/:productId', (req, res, next) => {
    
    var productId = req.params.productId
    var params = {
        Key: { "productId": productId }, 
        TableName: DynamoDBTable
    }

    dynamodbDocumentClient.get(params, (err, data) => {
        if (err) next(err)
        else res.status(200).json( data.Item || {} )
    })

})

app.use((err, req, res, next) => {
    console.log(err)
    res.status( err.status || err.statusCode|| 500 ).json({ message: err.message })
})

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' })
})

app.listen( PORT, () => console.log(`nubank-demo-products ${PORT}!`) )
