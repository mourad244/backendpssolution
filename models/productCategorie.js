const mongoose = require("mongoose");
const Joi = require("joi");

const productCategorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 255,
  },
  images: {
    type: Array,
  },
});

const ProductCategorie = mongoose.model(
  "ProductCategorie",
  productCategorieSchema
);

exports.productCategorieSchema = productCategorieSchema;
exports.ProductCategorie = ProductCategorie;
