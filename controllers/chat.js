import { Chat, ChatMessage } from "../models/index.js";

async function create(req, res) {
    try {
        const { participant_id_one, participant_id_two } = req.body;

        const foundOne = await Chat.findOne({
            participant_one: participant_id_one,
            participant_two: participant_id_two,
        });

        const foundTwo = await Chat.findOne({
            participant_one: participant_id_two,
            participant_two: participant_id_one,
        });

        if (foundOne || foundTwo) {
            return res.status(200).send({ msg: "Ya tienes un chat con este usuario" });
        }

        const chat = new Chat({
            participant_one: participant_id_one,
            participant_two: participant_id_two,
        });

        const chatStorage = await chat.save();
        const populatedChat = await chatStorage
            .populate([
                { path: "participant_one", select: "email firstname lastname" },
                { path: "participant_two", select: "email firstname lastname" }
            ]);

        res.status(201).send(populatedChat);
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el chat", error: error.message });
    }
}

async function getAll(req, res) {
    try {
        const { user_id } = req.user;
        const chats = await Chat.find({
            $or: [
                { participant_one: user_id },
                { participant_two: user_id }
            ]
        })
        .select('_id __v')
        .lean()
        .sort({ created_at: -1 });

        // Obtener el último mensaje para cada chat
        const arrayChats = await Promise.all(chats.map(async (chat) => {
            const lastMessage = await ChatMessage.findOne({ chat: chat._id })
                .sort({ createdAt: -1 })
                .lean();

            return {
                _id: chat._id,
                participant_one: { "↔": 24 },
                participant_two: { "↔": 24 },
                __v: chat.__v,
                last_message_date: lastMessage ? lastMessage.createdAt : null
            };
        }));

        res.status(200).send(arrayChats);
    } catch (error) {
        res.status(500).send({ msg: "Error al obtener los chats", error: error.message });
    }
}

async function deleteChat(req, res) {
    try {
        const chat_id = req.params.id;
        const deletedChat = await Chat.findByIdAndDelete(chat_id);

        if (!deletedChat) {
            return res.status(400).send({ msg: "No se encontró el chat a eliminar" });
        }

        res.status(200).send({ msg: "Chat eliminado" });
    } catch (error) {
        res.status(500).send({ msg: "Error del servidor", error: error.message });
    }
}

async function getChat(req, res) {
    try {
        const chat_id = req.params.id;
        const chatStorage = await Chat.findById(chat_id)
            .populate("participant_one")
            .populate("participant_two");

        if (!chatStorage) {
            return res.status(400).send({ msg: "No se encontró el chat" });
        }

        res.status(200).send(chatStorage);
    } catch (error) {
        res.status(500).send({ msg: "Error del servidor", error: error.message });
    }
}

export const ChatController = {
    create,
    getAll,
    deleteChat,
    getChat,
}; 