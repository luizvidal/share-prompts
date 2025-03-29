import { Types } from "mongoose";
import { User, UserDocument } from "./user";

export interface Prompt {
	_id: string;
	creator: User;
	prompt: string;
	tag: string;
}

export interface PromptDocument extends Omit<Prompt, "_id" | "creator"> {
	_id: Types.ObjectId;
	creator: Types.ObjectId | UserDocument;
}
