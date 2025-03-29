import mongoose, { Model } from "mongoose";
import { UserDocument } from "@/types/models/user";
import { PromptDocument } from "@/types/models/prompt";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required!"],
  },
  image: {
    type: String,
  },
});

const PromptSchema = new mongoose.Schema<PromptDocument>({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required"],
  },
  tag: {
    type: String,
    required: [true, "Tag is required"],
  },
});

export const User = (mongoose.models.User as Model<UserDocument>) || mongoose.model("User", UserSchema);
export const Prompt = (mongoose.models.Prompt as Model<PromptDocument>) || mongoose.model("Prompt", PromptSchema);