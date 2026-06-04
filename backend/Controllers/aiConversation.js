import Conversation from "../Models/conversation.js";

export const createAIConversation = async (
  req,
  res
) => {
  try {

    const userId = req.user._id;
    const aiUserId = process.env.AI_USER_ID;

    if (!aiUserId) {
      return res.status(500).json({
        error: "AI_USER_ID is missing in backend/.env"
      });
    }

    const existingConversation =
      await Conversation.findOne({
        members: {
          $all: [
            userId,
            aiUserId
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
          aiUserId
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
