import { ActionOptions } from "@/types";
import { Document } from "mongoose";
import { connectToDB } from "./database";
import { serialize, serializeMany } from "./mongoose";

export const createAction = <TInput = void, TOutput = unknown>(
	handler: (
		input: TInput
	) => Promise<TOutput | Document | (Document | TOutput)[]>,
	options: ActionOptions<TInput> = { serialize: true }
) => {
	return async (input: TInput): Promise<TOutput> => {
		try {
			await connectToDB();

			if (options.validate) {
				const isValid = await options.validate(input);
				if (!isValid) throw new Error("Invalid input");
			}

			const result = await handler(input);

			if (options.serializeMany && Array.isArray(result)) {
				return serializeMany(result as Document[]) as TOutput;
			}

			if (options.serialize) {
				return serialize(result as Document) as TOutput;
			}

			return result as TOutput;
		} catch (error) {
			throw error instanceof Error ? error : new Error("Action failed");
		}
	};
};
