const { Client } = require("../models/client");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const clients = await Client.find().select("-__v");
  res.send(clients);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const client = await Client.findByIdAndRemove(req.params.id);

  if (!client)
    return res.status(404).send("The client with the given ID was not found.");

  res.send(client);
});

router.get("/:id", auth, async (req, res) => {
  const client = await Client.findById(req.params.id).select("-__v");

  if (!client)
    return res.status(404).send("The client with the given ID was not found.");

  res.send(client);
});

module.exports = router;
