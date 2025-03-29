"use client";

import Profile from "@/components/Profile";
import { usePrompts } from "@/hooks/usePrompts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const MyProfile = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const { prompts, loading, loadUserPrompts, removePrompt } = usePrompts();

	useEffect(() => {
		if (status === "loading") return;

		if (!session?.user) {
			if (status === "unauthenticated") {
				toast.error("Please sign in to view your profile");
				router.push("/");
			}
			return;
		}

		loadUserPrompts(session.user._id);
	}, [session, status, router, loadUserPrompts]);

	const handleEdit = (post: any) => {
		router.push(`/update-prompt?id=${post._id}`);
	};

	const handleDelete = async (post: any) => {
		try {
			await removePrompt(post._id);
			toast.success("Prompt deleted successfully");
		} catch (error) {
			console.error("Error deleting prompt:", error);
			toast.error("Failed to delete prompt");
		}
	};

	if (loading || !session?.user) {
		return (
			<div className="flex-center min-h-[200px]">
				<div className="loader" />
			</div>
		);
	}

	return (
		<Profile
			name="My"
			desc="Welcome to your personalized profile page. Share your exceptional prompts and be inspired by others."
			data={prompts}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
		/>
	);
};

export default MyProfile;
