"use client";

import Profile from "@/components/Profile";
import { usePrompts } from "@/hooks/usePrompts";
import { use, useEffect, useState } from "react";

const UserProfile = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params);

	const { prompts, loading, loadUserPrompts } = usePrompts();

	const [name, setName] = useState<string>();

	useEffect(() => {
		loadUserPrompts(id);
	}, [id, loadUserPrompts]);

	useEffect(() => {
		if (prompts.length) {
			setName(prompts[0].creator.username);
		}
	}, [prompts]);

	if (loading) {
		return <div className="flex-center">Loading...</div>;
	}

	return (
		<Profile
			name={name}
			desc={`Welcome to ${name}'s personalized profile page. Explore ${name}'s exceptional prompts and be inspired by the power of their imagination`}
			data={prompts}
		/>
	);
};

export default UserProfile;
