import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { serverErrorResponse, successResponse } from "@utils/responses";

export const POST = async (req) => {
	const { userId, prompt, tag } = await req.json();

	try {
		await connectToDB();

		const newPrompt = new Prompt({
			creator: userId,
			prompt: prompt,
			tag: "#" + tag.replaceAll(" ", "_").replaceAll("#", ""),
		});

		await newPrompt.save();

		return successResponse(newPrompt, 201);
	} catch (error) {
		console.log(error);
		return serverErrorResponse();
	}
};
