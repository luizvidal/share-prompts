import {
	createPrompt,
	deletePrompt,
	fetchPrompts,
	fetchUserPrompts,
	fetchPromptById,
	updatePrompt,
} from "@/actions/prompts";
import { CreatePromptInput, Prompt, UpdatePromptInput } from "@/types";
import { useCallback, useState } from "react";

export const usePrompts = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [prompts, setPrompts] = useState<Prompt[]>([]);
	const [activeTag, setActiveTag] = useState<string | null>(null);

	const loadPrompts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchPrompts();
			setPrompts(data);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Unknown error"));
		} finally {
			setLoading(false);
		}
	}, []);

	const loadUserPrompts = useCallback(async (userId: string) => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchUserPrompts(userId);
			setPrompts(data);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Unknown error"));
		} finally {
			setLoading(false);
		}
	}, []);

	const loadPromptById = useCallback(async (id: string) => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchPromptById(id);
			return data;
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Unknown error"));
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const create = useCallback(async (input: CreatePromptInput) => {
		try {
			setLoading(true);
			setError(null);

			if (!input.userId) {
				throw new Error("User ID is required");
			}

			const data = await createPrompt(input);

			if (!data) {
				throw new Error("Failed to create prompt");
			}

			setPrompts((prev) => [data, ...prev]); // Add to start of list
			return data;
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error("Failed to create prompt");
			setError(error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	const update = useCallback(async (input: UpdatePromptInput) => {
		try {
			setLoading(true);
			setError(null);
			const data = await updatePrompt(input);
			setPrompts((prev) =>
				prev.map((prompt) => (prompt._id === input.id ? data : prompt))
			);
			return data;
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Unknown error"));
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const removePrompt = useCallback(async (id: string) => {
		try {
			setLoading(true);
			setError(null);

			const result = await deletePrompt(id);

			if (!result.success) {
				throw new Error("Failed to delete prompt");
			}

			setPrompts((prev) => prev.filter((prompt) => prompt._id !== id));
			return result;
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error("Failed to delete prompt");
			setError(error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	const searchPrompts = useCallback(
		(searchText: string) => {
			const searchTerm = searchText.toLowerCase();
			return prompts.filter(
				(prompt) =>
					prompt.tag.toLowerCase().includes(searchTerm) ||
					prompt.creator.username.toLowerCase().includes(searchTerm) ||
					prompt.prompt.toLowerCase().includes(searchTerm)
			);
		},
		[prompts]
	);

	const handleTagClick = useCallback((tag: string) => {
		// If clicking the same tag again, clear the filter
		setActiveTag((currentTag) => (currentTag === tag ? null : tag));
	}, []);

	const getFilteredPrompts = useCallback(() => {
		if (!activeTag) return prompts;
		return prompts.filter(
			(prompt) => prompt.tag.toLowerCase() === activeTag.toLowerCase()
		);
	}, [prompts, activeTag]);

	return {
		loading,
		error,
		prompts: getFilteredPrompts(), // Return filtered prompts instead of raw prompts
		activeTag,
		searchPrompts,
		handleTagClick,
		loadPrompts,
		loadUserPrompts,
		loadPromptById,
		create,
		update,
		removePrompt,
	};
};
