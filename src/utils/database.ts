import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
	mongoose.set("strictQuery", true);

	if (isConnected) {
		console.log("MongoDB is already connected");
		return;
	}

	if (!process.env.MONGODB_URI) {
		throw new Error("MONGODB_URI is not defined in environment variables");
	}

	try {
		const opts = {
			dbName: "share_prompt",
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
			autoIndex: true,
			retryWrites: true,
			autoCreate: true,
			bufferCommands: false, // Disable mongoose buffering
		};

		await mongoose.connect(process.env.MONGODB_URI, opts);

		isConnected = true;
		console.log("MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		throw error;
	}
};



