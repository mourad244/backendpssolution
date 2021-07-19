const Joi = require("joi");
const mongoose = require("mongoose");

const deviSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  objetMessage: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
const Devi = mongoose.model("Devi", deviSchema);

exports.Devi = Devi;
