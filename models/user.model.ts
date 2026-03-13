import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
        },
    },
    {
        timestamps: true,
    },
);

export type IUser = InferSchemaType<typeof userSchema>;

export const User = model<IUser>("User", userSchema);
