const Joi = require("joi");
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Client = mongoose.model("Client", clientSchema);
// clientSchema.index({ email: 1 }, { unique: true, sparse: true });

exports.clientSchema = clientSchema;
exports.Client = Client;
