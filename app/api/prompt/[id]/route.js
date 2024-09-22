import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import {
  notFoundErrorResponse,
  serverErrorResponse,
  successResponse,
} from "@utils/responses";

export const GET = async (req, { params }) => {
	try {
		await connectToDB();

		const prompt = await Prompt.findById(params.id).populate("creator");

		if (!prompt) return notFoundErrorResponse();

		return successResponse(prompt);
	} catch (error) {
		return serverErrorResponse();
	}
};

export const PATCH = async (req, { params }) => {
	const { prompt, tag } = await req.json();

	try {
		await connectToDB();

		const existingPrompt = await Prompt.findById(params.id);

		if (!existingPrompt) return notFoundErrorResponse();

		existingPrompt.prompt = prompt;
		existingPrompt.tag = tag;

		await existingPrompt.save();

		return successResponse(existingPrompt);
	} catch (error) {
		return serverErrorResponse();
	}
};

export const DELETE = async (req, { params }) => {
	try {
		await connectToDB();

		await Prompt.findByIdAndDelete(params.id);

		return successResponse("Prompt deleted successfully");
	} catch (error) {
		console.log(error);
		return serverErrorResponse();
	}
};
