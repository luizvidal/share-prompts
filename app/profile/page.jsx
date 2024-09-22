"use client";

import Profile from "@components/Profile";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
	const [posts, setPosts] = useState([]);
	const router = useRouter();

	const handleEdit = (post) => {
		router.push(`/update-prompt?id=${post._id}`);
	};

	const handleDelete = async (post) => {
		const hasConfirmed = confirm(
			"Are you sure you want to delete this prompt?"
		);

		if (hasConfirmed) {
			try {
				await fetch(`/api/prompt/${post._id.toString()}`, {
					method: "DELETE",
				});

				const filteredPosts = posts.filter((p) => p._id !== post._id);

				setPosts(filteredPosts);
			} catch (error) {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		const fetchUserPrompts = async (userId) => {
			const response = await fetch(`/api/users/${userId}/posts`);
			const data = await response.json();

			setPosts(data);
		};

		const fetchSession = async () => {
			const session = await getSession();

			if (session?.user.id) fetchUserPrompts(session.user.id);
		};

		fetchSession();
	}, []);

	return (
		<Profile
			name="My"
			desc="Welcome to your personalized profile page"
			data={posts}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
		/>
	);
};

export default Page;
