const asyncHandler = require("express-async-handler");
const Message = require("../model/messageModel");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user?._id,
    content: content,
    chat: chatId,
  };
  
  try {
    var message = await Message.create(newMessage);
     
    message = await message.populate("sender", "name pic");
   
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async(req,res)=>{
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat", "chatName");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error (error.message);
  }
})

const messages = asyncHandler(async(req,res)=>{
    await Message.deleteMany({});
    res.status(200).json({ success: true, message: "All messages deleted" });
})


module.exports = { sendMessage, allMessages, messages };
