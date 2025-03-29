export interface CreatePromptInput {
	userId: string;
	prompt: string;
	tag: string;
}

export interface UpdatePromptInput {
	id: string;
	prompt: string;
	tag: string;
}
