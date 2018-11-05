const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/Message')
const Credit = require('./models/Credit')
const uuidv1 = require('uuid/v1');
const connectCounter = 0;

class _dbService {
    constructor(){
        this.DBURL = 'mongodb://mongodb:27017/messages'  
    }

    connect() {
        mongoose.connect(this.DBURL, { useNewUrlParser: true})
        .then(x => {
            console.log(`Connected to Mongo. DB: "${x.connections[0].name}"`);
            this.createWallet(5, uuidv1())
        })
        .catch(err => {
            console.error("Error connecting to mongo", err);
        });

    }

    create(destination, body, status, uuid){
       return Message.create({destination: destination, body: body, status: status, uuid: uuid})
    }
    updateStatus(uuid, status){
       return Message.findOneAndUpdate({uuid: uuid}, {status: status}, {new:true})
    }
    getAll() {
        return Message.find()
    }

    createWallet(amount, uuid){
        return Credit.create({amount: amount, uuid: uuid})
    }
    addCredit(amount, uuid){
        return Credit.findOneAndUpdate({uuid: uuid}, { $inc: { amount: amount }}, {new:true})
    }
    payMessage(price, uuid){
        return Credit.findOneAndUpdate({uuid: uuid}, { $inc: { amount: -price }}, {new:true})
    }

    getCredit() {
        return Credit.findOne()
    }


}


const dbService = new _dbService();
module.exports = dbService;