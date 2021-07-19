const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  images: {
    type: Array,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductType",
    required: true,
  },
  description: {
    type: Array,
  },

  avis: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Avi",
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

exports.productSchema = productSchema;
exports.Product = Product;
