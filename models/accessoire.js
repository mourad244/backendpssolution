const mongoose = require("mongoose");
const Joi = require("joi");

const accessoireSchema = new mongoose.Schema({
  name: { type: String },
  image: {
    type: String,
    // minlength: 5,
    // maxlength: 255,
  },
});

const Accessoire = mongoose.model("Accessoire", accessoireSchema);

exports.accessoireSchema = accessoireSchema;
exports.Accessoire = Accessoire;
