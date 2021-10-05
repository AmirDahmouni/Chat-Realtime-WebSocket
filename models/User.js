const mongoose = require("mongoose");
const jwt=require('jsonwebtoken');
const config=require("config")

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    tel: { type: String },
    profilePicture: { type: String, default: '../../../assets/img/default-user.jpeg' },
    conversations:[{ref:"Conversation",type: mongoose.Schema.Types.ObjectId}],
    joinDate: { type: Date, default: new Date().toISOString() },
    connection: {
        lastVisit: { type: String },
        status: { type: Boolean, required: true, default: false }
    },
    address: { type: String }
  },
  { timestamps: true }
);

UserSchema.methods.generateAuth = function () {
  //generate token for user payload(_id,name,email,isAdmin) using JWT_SECRET
  // expired period 48h
  
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    config.get("jwtPrivateKey"),
    {
      expiresIn: '48h',
    }
  );
};


module.exports = mongoose.model("User", UserSchema);