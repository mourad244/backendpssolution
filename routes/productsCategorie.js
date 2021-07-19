const express = require("express");
const { ProductCategorie } = require("../models/productCategorie");
const auth = require("../middleware/auth");
const validations = require("../startup/validations");
const getPathData = require("../middleware/getPathData");
const uploadImages = require("../middleware/uploadImages");
const deleteImages = require("../middleware/deleteImages");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const router = express.Router();

router.get("/", async (req, res) => {
  const productsCategorie = await ProductCategorie.find()
    .select("-__v")
    .sort("name");
  res.send(productsCategorie);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }

  const { error } = validations.productCategorie(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }

  const { name, description } = req.body;
  const { image: images } = getPathData(req.files);
  const productCategorie = new ProductCategorie({
    name: name,
    description: description,
    // images: req.files != undefined ? req.files.path : "",
    images: images ? images.map((file) => file.path) : [],
  });
  await productCategorie.save();
  res.send(productCategorie);
});

router.put("/:id", auth, async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (error) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${error}`,
    });
  }
  const { error } = validations.productCategorie(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }

  const productCategorie = await ProductCategorie.findOne({
    _id: req.params.id,
  });
  if (!productCategorie) {
    deleteImages(req.files);
    return res
      .status(404)
      .send(" la categorie produit avec cette id n'existe pas.");
  }

  const { name, description } = req.body;
  const { image: images } = getPathData(req.files);

  if (name) productCategorie.name = name;
  if (description) productCategorie.description = description;
  if (images) productCategorie.images.push(...images.map((file) => file.path));

  await productCategorie.save();
  res.send(productCategorie);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const productCategorie = await ProductCategorie.findById(
    req.params.id
  ).select("-__v");

  if (!productCategorie)
    return res
      .status(404)
      .send("la categorie produit avec cette id n'existe pas.");

  res.send(productCategorie);
});

router.delete("/:id", auth, async (req, res) => {
  const productCategorie = await ProductCategorie.findByIdAndRemove(
    req.params.id
  );
  if (!productCategorie)
    return res
      .status(404)
      .send("la categorie produit avec cette id n'existe pas.");

  if (productCategorie.images) deleteImages(productCategorie.images);

  res.send(productCategorie);
});

module.exports = router;
