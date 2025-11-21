import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Za-z0-9]{6,8}$/,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  lastClicked: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("Link", linkSchema);
