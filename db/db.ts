import { connect } from "mongoose";

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("Missing MONGODB_URI in environment");
        }

        const { connection } = await connect(mongoUri);
        console.log("MongoDB connected", connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
