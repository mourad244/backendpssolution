const mongoose = require("mongoose");
const Joi = require("joi");

const serviceCategorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  smallDesc: {
    type: String,
    maxlength: 255,
  },
  largeDesc: {
    type: Array,
  },
  assistance: {
    type: Array,
  },
  images: {
    type: Array,
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Service",
    },
  ],
});
const ServiceCategorie = mongoose.model("CategorieSvc", serviceCategorieSchema);

exports.categorieSvcSchema = serviceCategorieSchema;
exports.ServiceCategorie = ServiceCategorie;
