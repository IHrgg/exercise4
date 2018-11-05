const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/Message')
const Credit = require('./models/Credit')
const uuidv1 = require('uuid/v1');
const connectCounter = 0;

class _dbService {
    constructor(){
        this.DBURL = 'mongodb://mongodb:27017/messages';
        this.uuidWallet = uuidv1();
        this.locked = false;
        this.queue = [];
        this.qlength = this.queue.length;
    }

    connect() {
        mongoose.connect(this.DBURL, { useNewUrlParser: true})
        .then(x => {
            console.log(`Connected to Mongo. DB: "${x.connections[0].name}"`);
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
        return Credit.findOne()
    }

    lock(uuid) {
        if (this.locked == false ){
            this.locked = true;
            return uuid;
        } else {
            this.queue.unshift(uuid)
            return this.queue.pop();
        }
    }
    unlock() {
        this.locked = false;
        let uuid = this.queue.pop();
        this.qlength = this.queue.length;
        if (this.queue.length > 0){
            this.lock(uuid);
        }
    }
    enqueue(uuid) {
        this.queue.unshift(uuid);
        this.qlength = this.queue.length;
    }

}


const dbService = new _dbService();
module.exports = dbService;