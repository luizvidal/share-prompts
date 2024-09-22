import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { serverErrorResponse, successResponse } from "@utils/responses";

export const GET = async (req, { params }) => {
	try {
		await connectToDB();

		const prompts = await Prompt.find({
			creator: params.id,
		}).populate("creator");

		return successResponse(prompts);
	} catch (error) {
		return serverErrorResponse();
	}
};
