import { Types } from "mongoose";

export type MongoDoc = {
	_id?: Types.ObjectId | string;
	[key: string]: any;
};

export interface ActionOptions<TInput = unknown> {
	serialize?: boolean;
	serializeMany?: boolean;
	validate?: (data: TInput) => boolean | Promise<boolean>;
	requireAuth?: boolean;
	rateLimit?: {
		requests: number;
		window: number;
	};
}
