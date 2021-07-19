const mongoose = require("mongoose");
const Joi = require("joi");

const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  images: {
    type: Array,
  },
  description: {
    type: String,
    maxlength: 255,
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategorie",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Product",
    },
  ],
});

const ProductType = mongoose.model("ProductType", productTypeSchema);

exports.productTypeSchema = productTypeSchema;
exports.ProductType = ProductType;
