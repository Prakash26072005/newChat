import Conversation from "../Models/conversation.js";

export const createAIConversation = async (
  req,
  res
) => {
  try {

    const userId = req.user._id;

    const existingConversation =
      await Conversation.findOne({
        members: {
          $all: [
            userId,
            process.env.AI_USER_ID
          ]
        }
      }).populate("members");

    if (existingConversation) {
      return res.status(200).json(
        existingConversation
      );
    }

    const conversation =
      await Conversation.create({
        members: [
          userId,
          process.env.AI_USER_ID
        ]
      });

    const populatedConversation =
      await conversation.populate(
        "members",
        "-password"
      );

    res.status(201).json(
      populatedConversation
    );

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Server Error"
    });
  }
};