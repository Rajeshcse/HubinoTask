const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HubinoSchema = new Schema ({
    title:String,
    price :String,
    description:String,
    employeeNo:Number,
    employeeName:String,
    DOB:String,
    experience:String,
    role:String,
    address:String,
    phone:Number

});

module.exports= mongoose.model('Hubino', HubinoSchema);