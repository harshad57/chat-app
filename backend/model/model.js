const mongoose = require('mongoose');

const usermodel = new mongoose.Schema({
    chatName: { type: String, trim: true },
    grpchat: { type: Boolean, default: false },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    latestmsg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'msg',
    },
    grpadmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
},
    {
        timestamps: true,
    });

const mdl = mongoose.model('users', usermodel);

module.exports = mdl;