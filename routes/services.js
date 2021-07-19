const express = require("express");
const { Service } = require("../models/service");
const { ServiceCategorie } = require("../models/serviceCategorie");
const uploadImages = require("../middleware/uploadImages");
const deleteImages = require("../middleware/deleteImages");
const validations = require("../startup/validations");
const getPathData = require("../middleware/getPathData");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const fs = require("fs");

const router = express.Router();

router.get("/", async (req, res) => {
  const services = await Service.find()
    .populate("categorie", "name")
    .select("-__v")
    .sort("name");
  res.send(services);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }

  const { error } = validations.service(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }

  // to comment if sure the service categorie already fetched

  const serviceCategorie = await ServiceCategorie.findById(req.body.categorie);

  if (!serviceCategorie) {
    deleteImages(req.files);
    return res.status(400).send("Invalid categorie service.");
  }

  const { name, caracteristiques, desc1, desc2, categorie } = req.body;
  const { image: images, accessoire: accessoires } = getPathData(req.files);
  const service = new Service({
    name: name,
    caracteristiques: caracteristiques,
    desc1: desc1,
    desc2: desc2,

    images: images ? images.map((file) => file.path) : [],
    accessoires: accessoires ? accessoires.map((file) => file.path) : [],
    categorie: categorie,
  });
  // add service to serviceCategorie
  serviceCategorie.services.push(service._id);
  await service.save();
  await serviceCategorie.save();
  res.send(service);
});

router.put("/:id", auth, async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (error) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${error}`,
    });
  }

  const { error } = validations.service(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }
  const service = await Service.findOne({ _id: req.params.id });
  if (!service) {
    deleteImages(req.files);
    return res.status(404).send("The service with the given ID was not found.");
  }

  // to comment if sure the service categorie already fetched just before
  const serviceCategorie = await ServiceCategorie.findById(req.body.categorie);
  if (!serviceCategorie) {
    deleteImages(req.files);
    return res.status(400).send("Invalid categorie service.");
  }

  const { name, desc1, desc2, caracteristiques } = req.body;
  const { image: images, accessoire: accessoires } = getPathData(req.files);

  service.name = name;
  service.desc1 = desc1;
  service.desc2 = desc2;
  service.categorie = serviceCategorie;
  if (caracteristiques) {
    service.caracteristiques = caracteristiques;
  }
  if (images) service.images.push(...images.map((file) => file.path));
  if (accessoires)
    service.accessoires.push(...accessoires.map((file) => file.path));

  // verifying if serviceCategorie contains the service , and add it if not existing
  serviceCategorie.services.indexOf(req.params.id) === -1
    ? serviceCategorie.services.push(req.params.id)
    : console.log("This item already exists");
  await serviceCategorie.save();
  await service.save();

  res.send(service);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const service = await Service.findById(req.params.id)
    // .populate("Categorie", "name")
    .select("-__v");
  if (!service)
    return res.status(404).send("The service with the given ID was not found.");

  res.send(service);
});

router.delete("/:id", auth, async (req, res) => {
  const service = await Service.findByIdAndRemove(req.params.id);
  if (!service)
    return res.status(404).send("The service with the given ID was not found.");
  if (service.images) deleteImages(service.images);
  if (service.accessoires) deleteImages(service.accessoires);

  // delete service from array services of servicesCategorie
  const serviceCategorie = await ServiceCategorie.findById(service.categorie);
  const services = serviceCategorie.services;
  const index = services.indexOf(req.params.id);
  if (index > -1) services.splice(index, 1);
  serviceCategorie.services = services;
  await serviceCategorie.save();

  res.send(service);
});

module.exports = router;
