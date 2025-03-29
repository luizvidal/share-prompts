import { Types } from "mongoose";

export interface User {
	_id: string;
	email: string;
	username: string;
	image: string;
}

export interface UserDocument extends Omit<User, "_id"> {
	_id: Types.ObjectId;
}
