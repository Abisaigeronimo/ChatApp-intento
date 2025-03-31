import mongoose from "mongoose";

const ChatSchema = mongoose.Schema({
    participant_one: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    participant_two: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

export const Chat = mongoose.model("Chat", ChatSchema); 