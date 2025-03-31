import { ChatMessage } from "../models/index.js";
import { io } from "../utils/index.js";

async function sendText(req, res) {
    const { chat_id, message } = req.body;
    const { user_id } = req.user;
  
    const chat_message = new ChatMessage({
        chat: chat_id,
        user: user_id,
        message,
        type: "TEXT",
    });
  
    try {
        await chat_message.save();
        const data = await chat_message.populate("user");
        io.sockets.in(chat_id).emit("message", data);
        io.sockets.in(`${chat_id}_notify`).emit("message_notify", data);
        res.status(201).send(data);
    } catch (error) {
        res.status(400).send({ msg: "Error al enviar el mensaje", error: error.message });
    }
}

async function getAll(req, res) {
    const { chat_id } = req.params;

    try {
        const messages = await ChatMessage.find({ chat: chat_id })
            .sort({ createdAt: 1 })
            .populate('user');
        
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send({ msg: "Error al obtener los mensajes", error: error.message });
    }
}

async function getTotalMessages(req, res) {
    const { chat_id } = req.params;

    try {
        const total = await ChatMessage.count({ chat: chat_id });
        res.status(200).send({ total });
    } catch (error) {
        res.status(500).send({ msg: "Error al obtener el total de mensajes", error: error.message });
    }
}

async function getLastMessage(req, res) {
    const { chat_id } = req.params;

    try {
        const message = await ChatMessage.findOne({ chat: chat_id })
            .sort({ createdAt: -1 })
            .populate('user');
        
        res.status(200).send(message || {});
    } catch (error) {
        res.status(500).send({ msg: "Error al obtener el último mensaje", error: error.message });
    }
}

async function sendImage(req, res) {
    const { chat_id } = req.body;
    const { user_id } = req.user;

    if (!req.files.image) {
        return res.status(400).send({ msg: "No se ha subido ninguna imagen" });
    }

    const imagePath = req.files.image.path;

    const chat_message = new ChatMessage({
        chat: chat_id,
        user: user_id,
        message: imagePath,
        type: "IMAGE",
    });

    try {
        await chat_message.save();
        const data = await chat_message.populate("user");
        io.sockets.in(chat_id).emit("message", data);
        io.sockets.in(`${chat_id}_notify`).emit("message_notify", data);
        res.status(201).send(data);
    } catch (error) {
        res.status(400).send({ msg: "Error al enviar la imagen", error: error.message });
    }
}

export const ChatMessageController = {
    sendText,
    getAll,
    getTotalMessages,
    getLastMessage,
    sendImage,
};
