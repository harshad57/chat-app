const Msg = require("../model/msgmodel.js");
const User = require("../model/usermodel.js");
const cloudinary = require("../config/cloudinary.js");

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const filter = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenmsg = {};

    for (const user of filter) {
      const msgs = await Msg.find({ sender: user._id, receiver: userId, seen: false });
      if (msgs.length > 0) {
        unseenmsg[user._id] = msgs.length;
      }
    }

    return res.json({ success: true, users: filter, unseenmsg });

  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message || "Server Error" });
  }
};

const getmsgs = async (req, res) => {
  try {
    const { id: selectedUser } = req.params;
    const myId = req.user._id;

    const msgs = await Msg.find({
      $or: [
        { sender: myId, receiver: selectedUser },
        { sender: selectedUser, receiver: myId }
      ]
    });

    await Msg.updateMany({ sender: selectedUser, receiver: myId }, { seen: true });

    res.json({ success: true, msgs });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

const markMsg = async (req, res) => {
  try {
    const { id } = req.params;
    await Msg.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// ...existing code...
const sendmsg = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiver = req.params.id;
    const sender = req.user._id;

    if (!receiver || (!text && !image)) {
      return res.status(400).json({ success: false, msg: "Message content or receiver missing" });
    }

    let imageUrl;
    if (image) {
      const uploadres = await cloudinary.uploader.upload(image);
      imageUrl = uploadres.secure_url;
    }

    const newmsg = await Msg.create({
      sender,
      receiver,
      text,
      image: imageUrl,
    });

    const receiverSocketId = global.userSocketMap[receiver];
    const senderSocketId = global.userSocketMap[sender.toString()];

    // Emit to receiver
    if (receiverSocketId) {
      global.io.to(receiverSocketId).emit("newmsg", newmsg);
    }
    // Emit to sender (so sender also gets the new message in real time)
    if (senderSocketId) {
      global.io.to(senderSocketId).emit("newmsg", newmsg);
    }

    res.json({ success: true, newmsg });
  } catch (error) {
    console.log('server error ', error)
    res.status(500).json({ success: false, msg: error.message || "Server Error" });
  }
};
// ...existing code...

module.exports = { getAllUsers, getmsgs, markMsg, sendmsg };
