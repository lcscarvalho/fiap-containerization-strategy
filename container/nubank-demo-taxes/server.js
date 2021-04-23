'use strict';

const express = require('express')
const AWS = require('aws-sdk')

const PORT = 8080
const DynamoDBTable = process.env.DynamoDBTable
const dynamodbDocumentClient = new AWS.DynamoDB.DocumentClient()
const app = express()

app.use(express.json())

app.put('/tax/:taxId', (req, res, next) => {

    var taxId = req.params.taxId
    var elData = req.body

    if( 'taxId' in elData && elData.taxId != taxId ){
        return next({ status: 400, message: "taxId in path is different from taxId in payload" })
    }

    elData.taxId = taxId
    var params = {
        Item: elData, 
        TableName: DynamoDBTable
    }

    dynamodbDocumentClient.put(params, (err, data) => {
        if (err) next(err)
        else res.status(200).json( params.Item )
    })

})

app.get('/tax/:taxId', (req, res, next) => {
    
    var taxId = req.params.taxId
    var params = {
        Key: { "taxId": taxId }, 
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

app.listen( PORT, () => console.log(`Petstore container listening on port ${PORT}!`) )
