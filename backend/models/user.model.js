const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    image:{
        type:String,
        default:true
    },
    createdEvents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        default:[]
    }],
    registeredEvents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        default:[]
    }],
    approvedEvents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        default:[]
    }]
},{timestamps:true});

// Remove duplicate index declaration
// userSchema.index({ email: 1 });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
