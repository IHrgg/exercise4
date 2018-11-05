const express = require('express');
const router = express.Router();
const dbService = require('../dbService/dbService');
const validator = require('../validatorCredit');
const uuidv1 = require('uuid/v1');
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min window
    max: 10, // 100 requests per window
    message:
      ({status: "Too many requests from this IP, please try again after a minute"})
  });

  router.post('/', apiLimiter, validator(), (req, res, next) => {
    let uuid = uuidv1();  
    let {amount} = req.body
      dbService.addCredit(amount).then(credit =>{
          console.log("CREDIT ADDED", credit.amount)
          res.status(200).json({
            status: "200",
            data: credit.amount
            })
      }).catch (err => {
          console.log("ADD CREDIT ERROR")
            res.status(500).json({data: "RECHARGE FAILED, TRY AGAIN"});
            return;
      })


  })



module.exports = router;