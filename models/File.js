const mongoose = require("mongoose");
const { profile } = require("node:console");
const { type } = require("node:os");

// schema
const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);
module.exports = File;
