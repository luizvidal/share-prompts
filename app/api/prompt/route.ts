import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { successResponse } from "@utils/responses";

export const GET = async (req) => {
	try {
		await connectToDB();

		const prompts = await Prompt.find({}).populate("creator");

		return successResponse(prompts);
	} catch (error) {
		return serverErrorResponse();
	}
};
