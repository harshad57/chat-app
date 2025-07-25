const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    text: { type: String, trim: true },
    image: { type: String },
    seen: { type: Boolean, default: false },
},
    {
        timestamps: true,
    }
);

const Msg = mongoose.model('msg', msgSchema);
module.exports = Msg;