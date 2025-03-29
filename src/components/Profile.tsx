import { Prompt } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import PromptCard from "./PromptCard";

interface ProfileProps {
	name?: string;
	desc?: string;
	data: Prompt[];
	isLoading?: boolean;
	handleEdit?: (post: Prompt) => void;
	handleDelete?: (post: Prompt) => void;
}

const Profile = ({
	name = "Anonymous",
	desc,
	data = [],
	handleEdit,
	handleDelete,
	isLoading = false,
}: ProfileProps) => {
	if (isLoading) {
		return (
			<div className="w-full flex-center min-h-[200px]">
				<div className="loader" />
			</div>
		);
	}

	if (!data.length) {
		return (
			<section className="w-full">
				<h1 className="head_text text-left">
					<span className="blue_gradient">{name}&apos;s Profile</span>
				</h1>
				<p className="desc text-left">{desc}</p>
				<div className="mt-10 text-center text-gray-500">
					No prompts found. Start by creating one!
				</div>
			</section>
		);
	}

	return (
		<section className="w-full">
			<header>
				<h1 className="head_text text-left">
					<span className="blue_gradient">{name}&apos;s Profile</span>
				</h1>
				{desc && <p className="desc text-left">{desc}</p>}
			</header>

			<AnimatePresence mode="popLayout">
				<motion.div
					className="mt-10 prompt_layout"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
				>
					{data.map((post) => (
						<motion.div
							key={post._id}
							layout
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.3 }}
						>
							<PromptCard
								post={post}
								handleEdit={handleEdit}
								handleDelete={handleDelete}
							/>
						</motion.div>
					))}
				</motion.div>
			</AnimatePresence>
		</section>
	);
};

export default Profile;
