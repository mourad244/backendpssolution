const { Devi } = require("../models/devi");
const auth = require("../middleware/auth");
const express = require("express");
const validations = require("../startup/validations");

const { Client } = require("../models/client");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const devis = await Devi.find()
    .populate("client", "email")
    .select("-__v")
    .sort("date");
  res.send(devis);
});
router.get("/:id", auth, async (req, res) => {
  const devi = await Devi.findById(req.params.id).select("-__v");

  if (!devi) return res.status(404).send("devi avec cette id n'existe pas.");

  res.send(devi);
});

router.post("/", async (req, res) => {
  const { error } = validations.devi(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // search if client aldready exists

  const { error2 } = validations.client(req.body.email);
  if (error2) return res.status(400).send(error2.details[0].message);

  let client = await Client.findOne({ email: req.body.email });
  if (!client) {
    client = new Client({
      email: req.body.email,
    });
    await client.save();
  }

  const devi = new Devi({
    client: client._id,
    objetMessage: req.body.objetMessage,
    message: req.body.message,
  });
  await devi.save();

  res.send(devi);
});

router.delete("/:id", auth, async (req, res) => {
  const devi = await Devi.findByIdAndRemove(req.params.id);
  if (!devi) return res.status(404).send("devi avec cette id n'existe pas.");
  res.send(devi);
});

module.exports = router;
