const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/Message')
//const Message2 = require('./models/Message2')
const Credit = require('./models/Credit')
//const Credit2 = require('./models/Credit2')
const uuidv1 = require('uuid/v1');
const connectCounter = 0;

class _dbService {
    constructor(){
        //this.DBURL = 'mongodb://mongodb:27017/messages';
        this.DBURL = 'mongodb://localhost:27017/messages';
        this.DBURL2 = 'mongodb://mongodb:27018/messages2';
        //this.DBURL2 = 'mongodb://localhost:27018/messages2';
        this.uuidWallet = uuidv1();
        //this.uuidWallet2 = uuidv1();
        this.lock = false;
        this.lock2 = false;
        this.queue = [];
        this.queue2 = [];
        this.main = {db: null, op: 0, Message: null, Credit: null};
        this.second = {db: null, op: 0, Message: null, Credit: null};
        
        //this.qlength = this.queue.length;
    }

    connect(url) {
        mongoose.connect(url, { useNewUrlParser: true})
        .then(x => {
            console.log(`Connected to Mongo. DB: "${x.connections[0].name}"`);
            if (main.db == null) this.main = {db: x.connections[0].name, Message: Message, Credit: Credit};
            else this.main = {db: x.connections[0].name, Message: Message, Credit: Credit};
            console.log(this.main)
            this.createWallet(5, this.uuidWallet)
            
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
    addCredit(amount){
        return Credit.findOneAndUpdate({uuid: this.uuidWallet}, { $inc: { amount: amount }}, {new:true})
    }
    payMessage(price){
        return Credit.findOneAndUpdate({uuid: this.uuidWallet}, { $inc: { amount: -price }}, {new:true})
    }

    getCredit() {
        return Credit.findOne({uuid: this.uuidWallet})
    }

    enqueue(uuid) {
        this.queue.unshift(uuid);
    }
    dequeue() {
        this.queue.pop();
    }

}


const dbService = new _dbService();
module.exports = dbService;