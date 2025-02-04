const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true } // to add createdAt and updatedAt timings
);

const userModel = mongoose.model("notes", notesSchema);

module.exports = userModel;

//models help us to do interactions with database
