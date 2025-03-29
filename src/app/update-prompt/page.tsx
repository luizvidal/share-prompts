"use client";

import Form from "@/components/Form";
import { usePrompts } from "@/hooks/usePrompts";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditPrompt = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const promptId = searchParams.get("id");
	const { loading, update, loadPromptById } = usePrompts();

	const [post, setPost] = useState({
		prompt: "",
		tag: "",
	});

	useEffect(() => {
		const getPromptDetails = async () => {
			if (!promptId) return;

			try {
				const data = await loadPromptById(promptId);
				setPost({
					prompt: data.prompt,
					tag: data.tag.replace("#", ""),
				});
			} catch (error) {
				console.error("Error loading prompt:", error);
			}
		};

		if (promptId) getPromptDetails();
	}, [promptId, loadPromptById]);

	const updatePrompt = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!promptId) return alert("Prompt ID not found");

		try {
			await update({
				id: promptId,
				prompt: post.prompt,
				tag: post.tag,
			});
			router.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Form
			type="Edit"
			post={post}
			setPost={setPost}
			submitting={loading}
			handleSubmit={updatePrompt}
		/>
	);
};

export default EditPrompt;
