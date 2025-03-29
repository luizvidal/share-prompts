"use client";

import { Prompt } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface PromptCardProps {
	post: Prompt;
	handleEdit?: (post: Prompt) => void;
	handleDelete?: (post: Prompt) => void;
	handleTagClick?: (tag: string) => void;
	activeTag?: string;
}

const DeleteConfirmModal = ({
	onConfirm,
	onCancel,
	isDeleting,
}: {
	onConfirm: () => void;
	onCancel: () => void;
	isDeleting: boolean;
}) => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
		onClick={onCancel}
	>
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: 20, opacity: 0 }}
			className="rounded-xl border border-gray-200 bg-white/95 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur p-5"
			onClick={(e) => e.stopPropagation()}
		>
			<h3 className="font-helvetica font-bold text-xl text-gray-900 mb-3">
				Delete Prompt
			</h3>
			<p className="font-inter text-sm text-gray-600 mb-6">
				Are you sure you want to delete this prompt? This action cannot be
				undone.
			</p>
			<div className="flex justify-end gap-3">
				<button
					onClick={onCancel}
					className="outline_btn cursor-pointer"
					disabled={isDeleting}
				>
					Cancel
				</button>
				<button
					onClick={onConfirm}
					className="rounded-full border border-white bg-red-600 hover:bg-red-700 cursor-pointer py-1.5 px-5 text-white transition-all text-center text-sm font-inter flex items-center justify-center"
					disabled={isDeleting}
				>
					{isDeleting ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							<span>Deleting...</span>
						</div>
					) : (
						"Delete"
					)}
				</button>
			</div>
		</motion.div>
	</motion.div>
);

const PromptCard = ({
	post,
	handleEdit,
	handleDelete,
	handleTagClick,
	activeTag,
}: PromptCardProps) => {
	const { data: session } = useSession();

	const router = useRouter();

	const [copied, setCopied] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		setIsOwner(session?.user?._id === post.creator._id);
	}, [session?.user?._id, post.creator._id]);

	const handleProfileClick = useCallback(() => {
		if (isOwner) {
			router.push("/profile");
		} else {
			router.push(`/profile/${post.creator._id}`);
		}
	}, [isOwner, router, post.creator._id]);

	const handleCopy = useCallback(() => {
		setCopied(true);
		navigator.clipboard.writeText(post.prompt);
		setTimeout(() => setCopied(false), 3000);
	}, [post.prompt]);

	const handleDeleteClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setShowDeleteConfirm(true);
	}, []);

	const handleConfirmDelete = async () => {
		try {
			setIsDeleting(true);
			await handleDelete?.(post);
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	const handleCancelDelete = () => {
		setShowDeleteConfirm(false);
	};

	const handleTagClickWrapper = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			if (handleTagClick) {
				handleTagClick(post.tag);
			}
		},
		[handleTagClick, post.tag]
	);

	const isActiveTag = activeTag === post.tag;

	return (
		<article className="prompt_card">
			<header className="flex justify-between items-start gap-10">
				<button
					type="button"
					className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
					onClick={handleProfileClick}
				>
					<Image
						src={post.creator.image}
						alt={`${post.creator.username}'s profile`}
						width={40}
						height={40}
						className="rounded-full object-contain"
					/>

					<div className="flex flex-col">
						<h3 className="font-helvetica font-semibold text-gray-900 text-start">
							{post.creator.username}
						</h3>
						<p className="font-inter text-sm text-gray-500">
							{post.creator.email}
						</p>
					</div>
				</button>

				<button
					type="button"
					className="copy_btn"
					onClick={handleCopy}
					aria-label={copied ? "Copied!" : "Copy prompt"}
				>
					<Image
						src={copied ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"}
						alt={copied ? "Copied!" : "Copy"}
						width={12}
						height={12}
					/>
				</button>
			</header>

			<div className="flex flex-col flex-1">
				<p className="my-4 font-helvetica text-sm text-gray-700 line-clamp-6">
					{post.prompt}
				</p>

				<div className="mt-auto flex flex-col gap-2">
					<button
						type="button"
						className={`font-inter text-sm cursor-pointer transition-colors self-start ${
							isActiveTag
								? "bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
								: "blue_gradient"
						}`}
						onClick={handleTagClickWrapper}
					>
						{post.tag}
					</button>

					{(handleEdit || handleDelete) && (
						<div className="flex gap-2 items-center self-end">
							{handleEdit && (
								<button
									className="text-sm green_gradient cursor-pointer"
									onClick={() => handleEdit(post)}
								>
									Edit
								</button>
							)}
							{handleDelete && (
								<button
									className="text-sm orange_gradient cursor-pointer"
									onClick={handleDeleteClick}
								>
									Delete
								</button>
							)}
						</div>
					)}
				</div>
			</div>

			<AnimatePresence>
				{showDeleteConfirm && (
					<DeleteConfirmModal
						onConfirm={handleConfirmDelete}
						onCancel={handleCancelDelete}
						isDeleting={isDeleting}
					/>
				)}
			</AnimatePresence>
		</article>
	);
};

export default PromptCard;
