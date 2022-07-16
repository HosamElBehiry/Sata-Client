const router = require("express").Router();

const { verifytoken, verifyTokenAndAdmin } = require("../../middleware/auth");
const Conversation = require("../../models/Conversation");
const Messages = require("../../models/Message");
const Users = require("../../models/Users");

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  Messages.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) =>
      res.status(500).json({ msg: "error from server !!", error })
    );
});

router.get("/myConversationWith/:with", verifytoken, async (req, res) => {
  await Conversation.find({
    $or: [
      { sender: req.user._id, reciever: req.params.with },
      { sender: req.params.with, reciever: req.user._id },
    ],
  })
    .then(async (conversationData) => {
      const ids = [];
      conversationData.map((c) => ids.push(c._id));
      await Messages.find({ conversationId: { $in: ids } })
        .populate({
          path: "conversationId",
          populate: [
            { path: "sender", select: "fullname _id image" },
            { path: "reciever", select: "fullname _id image" },
          ],
        })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) =>
          res.status(500).json({ msg: "Error from server !!", error })
        );
    })
    .catch((error) =>
      res.status(500).json({ msg: "Error from server !!", error })
    );
});

router.post("/:to", verifytoken, async (req, res) => {
  await Users.findOne({ _id: req.params.to })
    .then(async (recieverData) => {
      await Conversation.findOne({
        sender: req.user._id,
        reciever: recieverData._id,
      })
        .then(async (conversationData) => {
          if (conversationData === null) {
            const newConversation = new Conversation({
              sender: req.user._id,
              reciever: req.params.to,
            });
            await newConversation
              .save()
              .then(async (newConversation) => {
                const new_message = new Messages({
                  conversationId: newConversation._id,
                  text: req.body.text,
                });
                await new_message
                  .save()
                  .then((newMessage) => {
                    res.status(201).json(newMessage);
                  })
                  .catch((error) =>
                    res.status(500).json({ msg: "Error from server !!", error })
                  );
              })
              .catch((error) =>
                res.status(500).json({ msg: "Error from server !!", error })
              );
          } else {
            const new_message = new Messages({
              conversationId: conversationData._id,
              text: req.body.text,
            });
            await new_message
              .save()
              .then((newMessage) => {
                res.status(201).json(newMessage);
              })
              .catch((error) =>
                res.status(500).json({ msg: "Error from server !!", error })
              );
          }
        })
        .catch((error) =>
          res.status(500).json({ msg: "error from server !!", error })
        );
    })
    .catch((error) =>
      res.status(500).json({ msg: "error from server !!", error })
    );
});

module.exports = router;
