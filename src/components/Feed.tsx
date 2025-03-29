"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { usePrompts } from "@/hooks/usePrompts";
import { Prompt } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import PromptCard from "./PromptCard";

interface PromptCardListProps {
	data: Prompt[];
	handleTagClick: (tag: string) => void;
	searchText: string;
}

const PromptCardList = ({
	data,
	handleTagClick,
	searchText,
}: PromptCardListProps) => {
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	if (!data.length) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="mt-10 text-center text-gray-500"
			>
				{searchText
					? `No prompts found for "${searchText}"`
					: "No prompts available. Be the first to create one!"}
			</motion.div>
		);
	}

	return (
		<motion.div
			className="mt-6 prompt_layout"
			variants={containerVariants}
			initial="hidden"
			animate="show"
		>
			<AnimatePresence mode="popLayout">
				{data.map((post) => (
					<motion.div
						key={post._id}
						variants={itemVariants}
						layout
						initial="hidden"
						animate="show"
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.3 }}
					>
						<PromptCard post={post} handleTagClick={handleTagClick} />
					</motion.div>
				))}
			</AnimatePresence>
		</motion.div>
	);
};

const SearchInput = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) => (
	<div className="relative w-full">
		<input
			type="text"
			placeholder="Search for a tag, username or prompt..."
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className="search_input peer"
		/>
		{value && (
			<button
				className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
				onClick={() => onChange("")}
				aria-label="Clear search"
			>
				×
			</button>
		)}
	</div>
);

const Feed = () => {
	const [searchText, setSearchText] = useState("");
	const debouncedSearchText = useDebounce(searchText, 300);

	const {
		loading,
		error,
		prompts,
		activeTag,
		searchPrompts,
		handleTagClick,
		loadPrompts,
	} = usePrompts();

	useEffect(() => {
		loadPrompts();
	}, [loadPrompts]);

	const handleSearchChange = useCallback(
		(value: string) => {
			// Clear the tag filter when user starts typing
			if (value && activeTag) {
				handleTagClick(activeTag);
			}
			setSearchText(value);
		},
		[activeTag, handleTagClick]
	);

	const filteredPrompts = useMemo(() => {
		if (!debouncedSearchText) return prompts;
		return searchPrompts(debouncedSearchText);
	}, [debouncedSearchText, prompts, searchPrompts]);

	return (
		<section className="feed">
			<motion.div
				className="w-full"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<SearchInput value={searchText} onChange={handleSearchChange} />

				{/* Add a fixed height container for the filter tag */}
				<div className="h-[40px] mt-4">
					{" "}
					{/* Fixed height container */}
					{activeTag && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex items-center gap-2"
						>
							<span className="text-sm text-gray-600">Filtered by tag:</span>
							<span
								className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 hover:text-blue-900"
								onClick={() => handleTagClick(activeTag)}
							>
								{activeTag}
								<button
									className="ml-2 hover:text-blue-900 cursor-pointer"
									aria-label="Clear tag filter"
								>
									×
								</button>
							</span>
						</motion.div>
					)}
				</div>
			</motion.div>

			{error ? (
				<div className="flex-center flex-col gap-4">
					<p className="text-red-500">Failed to load prompts</p>
					<button onClick={loadPrompts} className="black_btn">
						Try Again
					</button>
				</div>
			) : loading ? (
				<div className="flex-center min-h-[200px]">
					<div className="loader" />
				</div>
			) : (
				<PromptCardList
					data={filteredPrompts}
					handleTagClick={handleTagClick}
					searchText={debouncedSearchText}
				/>
			)}
		</section>
	);
};

export default Feed;
