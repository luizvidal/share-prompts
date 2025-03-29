"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface FormPost {
	prompt: string;
	tag: string;
}

interface FormProps {
	type: "Create" | "Edit";
	post: FormPost;
	setPost: (post: FormPost) => void;
	submitting: boolean;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const MAX_PROMPT_LENGTH = 1000;
const MAX_TAG_LENGTH = 50;

const FormField = ({
	label,
	help,
	error,
	children,
}: {
	label: string;
	help?: string;
	error?: string;
	children: React.ReactNode;
}) => (
	<label className="w-full">
		<span className="font-helvetica font-semibold text-base text-gray-700">
			{label}
			{help && (
				<span className="font-normal text-sm text-gray-500 ml-1">{help}</span>
			)}
		</span>
		{children}
		{error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
	</label>
);

const Form = ({ type, post, setPost, submitting, handleSubmit }: FormProps) => {
	const [errors, setErrors] = useState<Partial<Record<keyof FormPost, string>>>(
		{}
	);
	const [touched, setTouched] = useState<
		Partial<Record<keyof FormPost, boolean>>
	>({});

	const validateField = useCallback((name: keyof FormPost, value: string) => {
		switch (name) {
			case "prompt":
				if (!value.trim()) return "Prompt is required";
				if (value.length > MAX_PROMPT_LENGTH)
					return `Prompt must be less than ${MAX_PROMPT_LENGTH} characters`;
				break;
			case "tag":
				if (!value.trim()) return "Tag is required";
				if (value.length > MAX_TAG_LENGTH)
					return `Tag must be less than ${MAX_TAG_LENGTH} characters`;
				break;
		}
		return "";
	}, []);

	const handleFieldChange = useCallback(
		(name: keyof FormPost, value: string) => {
			const error = validateField(name, value);

			setPost({ ...post, [name]: value });
			setErrors((prev) => ({ ...prev, [name]: error }));
			setTouched((prev) => ({ ...prev, [name]: true }));
		},
		[post, setPost, validateField]
	);

	const handleFormSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			// Validate all fields
			const newErrors: Partial<Record<keyof FormPost, string>> = {};
			Object.entries(post).forEach(([key, value]) => {
				const error = validateField(key as keyof FormPost, value);
				if (error) newErrors[key as keyof FormPost] = error;
			});

			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				setTouched(
					Object.keys(post).reduce(
						(acc, key) => ({
							...acc,
							[key]: true,
						}),
						{}
					)
				);
				toast.error("Please fix the errors before submitting");
				return;
			}

			try {
				await handleSubmit(e);
			} catch (error) {
				console.error("Form submission error:", error);
				toast.error("Failed to submit the form");
			}
		},
		[post, handleSubmit, validateField]
	);

	const remainingPromptChars = MAX_PROMPT_LENGTH - post.prompt.length;
	const remainingTagChars = MAX_TAG_LENGTH - post.tag.length;

	return (
		<motion.section
			className="w-full max-w-full flex-start flex-col"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<h1 className="head_text text-left">
				<span className="blue_gradient">{type} Post</span>
			</h1>
			<p className="desc text-left max-w-md">
				{type} and share amazing prompts with the world, and let your
				imagination run wild with any AI-powered platform.
			</p>

			<form
				onSubmit={handleFormSubmit}
				className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
			>
				<FormField
					label="Your AI Prompt"
					error={touched.prompt ? errors.prompt : undefined}
				>
					<div className="flex flex-col gap-1">
						<textarea
							value={post.prompt}
							onChange={(e) => handleFieldChange("prompt", e.target.value)}
							placeholder="Write your prompt here..."
							className={`form_textarea ${
								touched.prompt && errors.prompt ? "border-red-500" : ""
							}`}
							onBlur={() => setTouched((prev) => ({ ...prev, prompt: true }))}
						/>
						<span className="text-sm text-gray-400 text-right">
							{remainingPromptChars} characters remaining
						</span>
					</div>
				</FormField>

				<FormField
					label="Tag"
					help="(#product, #webdevelopment, #idea)"
					error={touched.tag ? errors.tag : undefined}
				>
					<div className="flex flex-col gap-1">
						<input
							value={post.tag}
							onChange={(e) => handleFieldChange("tag", e.target.value)}
							placeholder="#tag"
							className={`form_input ${
								touched.tag && errors.tag ? "border-red-500" : ""
							}`}
							onBlur={() => setTouched((prev) => ({ ...prev, tag: true }))}
						/>
						<span className="text-sm text-gray-400 text-right">
							{remainingTagChars} characters remaining
						</span>
					</div>
				</FormField>

				<div className="flex-end mx-3 mb-5 gap-4">
					<Link
						href="/"
						className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
					>
						Cancel
					</Link>

					<button
						type="submit"
						disabled={submitting}
						onClick={(e) => {
							e.preventDefault();
							handleFormSubmit(e);
						}}
						className={`px-5 py-1.5 text-sm rounded-full text-white 
              ${
								submitting
									? "bg-gray-400 cursor-not-allowed"
									: "bg-primary-orange hover:bg-primary-orange/90"
							} 
              transition-colors`}
					>
						{submitting ? (
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								{type}ing...
							</div>
						) : (
							type
						)}
					</button>
				</div>
			</form>
		</motion.section>
	);
};

export default Form;
