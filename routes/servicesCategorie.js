const express = require("express");
const { ServiceCategorie } = require("../models/serviceCategorie");
const auth = require("../middleware/auth");
const uploadImages = require("../middleware/uploadImages");
const deleteImages = require("../middleware/deleteImages");
const validations = require("../startup/validations");
const getPathData = require("../middleware/getPathData");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const router = express.Router();

router.get("/", async (req, res) => {
  const serviceCategorie = await ServiceCategorie.find()
    .select("-__v")
    .sort("name");
  res.send(serviceCategorie);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
  const { error } = validations.serviceCategorie(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }

  const { name, smallDesc, largeDesc, assistance } = req.body;
  const { image: images } = getPathData(req.files);

  const serviceCategorie = new ServiceCategorie({
    name: name,
    smallDesc: smallDesc,
    largeDesc: largeDesc,
    assistance: assistance,
    images: images ? images.map((file) => file.path) : [],
  });
  await serviceCategorie.save();
  res.send(serviceCategorie);
});

router.put("/:id", auth, async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (error) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${error}`,
    });
  }

  const { error } = validations.serviceCategorie(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }

  const serviceCategorie = await ServiceCategorie.findOne({
    _id: req.params.id,
  });
  if (!serviceCategorie) {
    deleteImages(req.files);
    return res
      .status(404)
      .send(" la categorie service avec cette id n'existe pas.");
  }

  const { name, smallDesc, largeDesc, assistance } = req.body;
  const { image: images } = getPathData(req.files);

  if (name) serviceCategorie.name = name;
  if (smallDesc) serviceCategorie.smallDesc = smallDesc;
  if (largeDesc) serviceCategorie.largeDesc = largeDesc;
  if (assistance) serviceCategorie.assistance = assistance;
  if (images) serviceCategorie.images.push(...images.map((file) => file.path));

  await serviceCategorie.save();
  res.send(serviceCategorie);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const serviceCategorie = await ServiceCategorie.findById(req.params.id)
    .populate("services", "name images")
    .select("-__v");
  if (!serviceCategorie)
    return res
      .status(404)
      .send("la categorie service avec cette id n'existe pas.");

  res.send(serviceCategorie);
});

router.delete("/:id", auth, async (req, res) => {
  const serviceCategorie = await ServiceCategorie.findByIdAndRemove(
    req.params.id
  );

  if (!serviceCategorie)
    return res
      .status(404)
      .send("la categorie service avec cette id n'existe pas.");

  if (serviceCategorie.images) deleteImages(serviceCategorie.images);

  res.send(serviceCategorie);
});

module.exports = router;
