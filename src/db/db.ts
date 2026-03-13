import { connect } from "mongoose";

export const connectDB = async () => {
    try {
        const { connection } = await connect(process.env.MONGO_URI!);
        console.log("MongoDB connected", connection.host);
    } catch (error) {
        process.exit(1);
        console.log(error);
    }
};
