import Conversation from "../models/conversation.model.js"
import { Message } from "../models/message.model.js"

export async function sendMessage() {

    try {

        const senderID = req.user.id
        const { message } = req.body
        const receiverID = req.params.id

        let conversation = Conversation.findOne({ participants: { $all: [senderID, receiverID] } })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderID, receiverID]
            })
        }

        const newMessage = await Message.create({
            senderID,
            receiverID,
            message
        })

        if (newMessage) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()])

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


