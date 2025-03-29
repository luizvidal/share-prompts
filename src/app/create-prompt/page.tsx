"use client";

import Form from "@/components/Form";
import { usePrompts } from "@/hooks/usePrompts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CreatePrompt = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { create, loading } = usePrompts();
	const [post, setPost] = useState({
		prompt: "",
		tag: "",
	});

	const createPrompt = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("CreatePrompt handler called"); // Debug log

		if (!session?.user) {
			toast.error("Please sign in to create a prompt");
			return;
		}

		try {
			console.log("Creating prompt with data:", post); // Debug log

			if (session.user) {
				await create({
					userId: session.user._id!,
					prompt: post.prompt,
					tag: post.tag,
				});
			}

			toast.success("Prompt created successfully!");
			router.push("/");
		} catch (error) {
			console.error("Create prompt error:", error); // Debug log
			toast.error("Failed to create prompt");
		}
	};

	return (
		<Form
			type="Create"
			post={post}
			setPost={setPost}
			submitting={loading}
			handleSubmit={createPrompt}
		/>
	);
};

export default CreatePrompt;
