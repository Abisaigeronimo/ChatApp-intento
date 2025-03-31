import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  password: String,
  avatar: String,
});

export const User = mongoose.model("User", UserSchema);
