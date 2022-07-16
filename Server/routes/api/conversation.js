const router = require("express").Router();
const { verifyTokenAndAdmin } = require("../../middleware/auth");
const Conversation = require("../../models/Conversation");

router.post("/", async (req, res) => {
  const { sender, reciever } = req.body;
  const newConversation = new Conversation({
    sender, reciever
  });
  await newConversation.save().then((data) => {
    res.status(201).json(data)
  }).catch((error) => res.status(500).json({msg: "Error from server !!", error}))
});

router.get("/", verifyTokenAndAdmin,  async (req, res) => {
  await Conversation.find().populate('sender').populate('reciever').then((data) => {
    res.status(200).json(data);
  }).catch((error) => res.status(500).json({msg: "Error from server !!", error}))
});

module.exports = router;
