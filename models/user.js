const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
     username: { type: String, required: true }, // display name or actual username
   email: {type: String, required: true, unique: true}
});


UserSchema.plugin(passportLocalMongoose , { usernameField: "email" });

module.exports = mongoose.model('User', UserSchema);