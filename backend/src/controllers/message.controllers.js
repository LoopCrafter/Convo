import cloudinary from "../../lib/cloudinary.js";
import { getReceiverId, io } from "../../lib/socket.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedinUserId = req.user.id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedinUserId },
    }).select("-password -__v");
    res.status(200).json({ users: filteredUsers, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server Error", success: false });
  }
};

const getMessagesWithUser = async (req, res) => {
  const userToChatId = req.params.id;
  const myId = req.user.id;
  try {
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userToChatId },
        { sender: userToChatId, receiver: myId },
      ],
    });

    res.status(200).json({ messages, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server Error", success: false });
  }
};

const sendMessageToUser = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const { text, image } = req.body;
    const senderId = req.user.id;
    let imageUrl;
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadedResponse.secure_url;
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = getReceiverId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ message: newMessage, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server Error", success: false });
  }
};

export { getUsersForSidebar, getMessagesWithUser, sendMessageToUser };
