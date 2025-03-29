import { MongoDoc } from "@/types";
import { Document } from "mongoose";

export const serialize = <T extends MongoDoc>(doc: T | Document): T => {
	const plainObj = doc instanceof Document ? doc.toObject() : doc;
	const serialized = JSON.parse(JSON.stringify(plainObj));

	if (serialized._id) {
		serialized._id = serialized._id.toString();
	}

	Object.keys(serialized).forEach((key) => {
		if (serialized[key]?._id) {
			serialized[key]._id = serialized[key]._id.toString();
		}
		if (Array.isArray(serialized[key])) {
			serialized[key] = serialized[key].map((item: any) =>
				item?._id ? { ...item, _id: item._id.toString() } : item
			);
		}
	});

	return serialized as T;
};

export const serializeMany = <T extends MongoDoc>(
	docs: (T | Document)[]
): T[] => {
	return docs.map((doc) => serialize<T>(doc));
};
