const mongoose = require('mongoose');
const {isEmail} = require('validator')
const bcrypt = require('bcrypt');


const userSchema  = new mongoose.Schema({
    email : {
        type : String,
        required : [true,'Please enter an email'],
        unique : true,
        lowercase: true,
        validate: [isEmail,'Please enter a valid email address']
    },
    password:{
        type: String,
        required: [true, 'Please enter an password'],
        minlength : [6,'Minimum passowrd lenght is 6 characters']
    },

});

// Fire a function after doc saved to db
// userSchema.post('save',function(doc,next){
//     console.log('New user was created and saved ',doc);
//     next();
// })

// Fire a function before doc saved to db
userSchema.pre('save',async function(next)
{
    // console.log('User about to be created & saved',this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

// static method to login user
userSchema.statics.login = async function (email,password) {
    const user = await this.findOne({email});
    if(user)
    {
        if(!user.confirmed)
        {
            const auth = await bcrypt.compare(password,user.password);
            if(auth)
            {
                return user;
            }
            throw Error('incorrect password');
        }
        throw Error('Please confirm email to login');
    }
    throw Error('Incorrect mail');
}

const User = new mongoose.model('user',userSchema);

module.exports = User;

