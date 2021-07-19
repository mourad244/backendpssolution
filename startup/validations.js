const Joi = require("joi");

module.exports = {
  accessoire: (accessoire) => {
    const schema = Joi.object({
      name: Joi.string().min(3),
      image: Joi.string().min(5).max(255),
    });
    return schema.validate(accessoire);
  },
  avi: (avi) => {
    const schema = Joi.object({
      client: Joi.string().min(5).max(255).required().email(),
      note: Joi.number(),
      comment: Joi.string(),
      product: Joi.objectId(),
    });
    return schema.validate(avi);
  },
  client: (client) => {
    const schema = Joi.object({
      email: Joi.string().min(5).max(50).required().email(),
    });

    return schema.validate(client);
  },
  devi: (devi) => {
    const schema = Joi.object({
      client: Joi.string().min(5).max(50).required().email(),
      objetMessage: Joi.string().required(),
      message: Joi.string().required(),
    });
    return schema.validate(devi);
  },
  product: (product) => {
    const schema = Joi.object({
      name: Joi.string().max(255).required(),
      type: Joi.objectId().required(),
      images: Joi.array(),
      avis: Joi.array().items(Joi.objectId()),
      description: Joi.array(),
    });

    return schema.validate(product);
  },
  productCategorie: (productCategorie) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      images: Joi.array().allow(null),
      description: Joi.string().max(255).allow(""),
    });
    return schema.validate(productCategorie);
  },
  productType: (productType) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      images: Joi.array().allow(null),
      description: Joi.string().max(255).allow(""),
      categorie: Joi.objectId().required(),
      products: Joi.array().items(Joi.objectId()),
    });
    return schema.validate(productType);
  },
  service: (service) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      categorie: Joi.objectId().required(),
      desc1: Joi.string().allow(""),
      desc2: Joi.string().allow(""),
      caracteristiques: Joi.array(),
      images: Joi.array(),
      accessoires: Joi.array(),
    });

    return schema.validate(service);
  },
  serviceCategorie: (categorieSvc) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      smallDesc: Joi.string().max(255).allow(""),
      largeDesc: Joi.array().items(Joi.string()),
      images: Joi.array(),
      assistance: Joi.array().items(Joi.string()),
      services: Joi.array().items(Joi.objectId()),
    });
    return schema.validate(categorieSvc);
  },
  user: (user) => {
    const schema = Joi.object({
      name: Joi.string().min(2).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(user);
  },
};
