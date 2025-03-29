"use server";

import Prompt from "@/models/prompt";
import {
  CreatePromptInput,
  Prompt as PromptType,
  UpdatePromptInput,
} from "@/types";
import { createAction } from "@/utils/action";

export const fetchPrompts = createAction<void, PromptType[]>(async () => {
	return await Prompt.find({}).populate("creator", "username email image _id");
});

export const fetchUserPrompts = createAction<string, PromptType[]>(
	async (userId) => {
		return await Prompt.find({ creator: userId }).populate("creator");
	}
);

export const fetchPromptById = createAction<string, PromptType>(async (id) => {
	const prompt = await Prompt.findById(id).populate("creator");
	if (!prompt) throw new Error("Prompt not found");
	return prompt;
});

export const deletePrompt = createAction<string, { success: boolean }>(
	async (id) => {
		await Prompt.findByIdAndDelete(id);
		return { success: true };
	}
);

export const createPrompt = createAction<CreatePromptInput, PromptType>(
	async (data) => {
		try {
			const tagValue = data.tag.trim();
			const formattedTag = tagValue.startsWith("#") ? tagValue : `#${tagValue}`;

			const newPrompt = new Prompt({
				creator: data.userId,
				prompt: data.prompt,
				tag: formattedTag.replaceAll(" ", "_"),
			});

			const savedPrompt = await newPrompt.save();

			if (!savedPrompt) {
				throw new Error("Failed to save prompt");
			}

			return savedPrompt;
		} catch (error) {
			console.error("Error creating prompt:", error);
			throw error;
		}
	}
);

export const updatePrompt = createAction<UpdatePromptInput, PromptType>(
	async (data) => {
		const prompt = await Prompt.findById(data.id);
		if (!prompt) throw new Error("Prompt not found");

		const tagValue = data.tag.trim();
		const formattedTag = tagValue.startsWith("#") ? tagValue : `#${tagValue}`;

		prompt.prompt = data.prompt;
		prompt.tag = formattedTag.replaceAll(" ", "_");

		return await prompt.save();
	}
);

