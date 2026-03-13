import { InferSchemaType, Schema, model } from "mongoose";

const todoSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export type ITodo = InferSchemaType<typeof todoSchema>;

export const Todo = model<ITodo>("Todo", todoSchema);
