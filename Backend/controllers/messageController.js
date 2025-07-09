import Conversation from "../models/conversation.model.js"
import { Message } from "../models/message.model.js"
import { getRecevierSocketID, io } from "../socket/socket.js"

export async function sendMessage(req, res) {
    try {
        const senderID = req.user.userID;
        const receiverID = req.params.id;
        const { message } = req.body;

        console.log(senderID);
        console.log(receiverID);


        if (!senderID || !receiverID) {
            return res.status(401).json({
                success: false,
                message: "both the id's required",
            });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderID, receiverID] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderID, receiverID],
            });
        }


        const newMessage = await Message.create({
            senderID,
            receiverID,
            message,
        });


        conversation.messages.push(newMessage._id);
        await conversation.save();


        const receiverSocketID = getRecevierSocketID(receiverID);
        if (receiverSocketID) {
            io.to(receiverSocketID).emit('newMessage', newMessage);
        }

        // const senderSocketID = getRecevierSocketID(senderID);
        // if (senderSocketID) {
        //     io.to(senderSocketID).emit('newMessage', newMessage);
        // }

        return res.status(201).json({
            success: true,
            message: newMessage,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}


export async function getMessages(req, res) {

    try {

        const senderID = req.user.userID
        const receiverID = req.params.id

        if (!senderID || !receiverID) {
            return res.status(401).json({
                success: false,
                message: "both the id's required",
            });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderID, receiverID] },
        }).populate("messages")

        if (!conversation) {
            return res.status(401).json({
                success: false,
                message: "conversation not found",
            });
        }

        return res.status(200).json({
            success: true,
            conversation
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}






