const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'Please enter the email' ],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter the password'],
        minlength: [6,'Minimum Password length is 6 characters'] 
    }
});

// fire a function after doc saved to db
userSchema.post('save', function(doc , next ){
    console.log("new user was created and saved ",doc);
    next();
})

// fire a function before doc saved to db
userSchema.pre('save',  async function(next){
    const salt = await bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password, salt);
    next();
})

// static method to login
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
       const auth= await bcrypt.compare(password,user.password);
       if(auth){
           return user;     
       }
       throw Error('Incorrect Password !'); 
    }
    throw Error('Incorrect Email !');   

}

const User = mongoose.model('user',userSchema);
module.exports= User;

