"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Provider {
	id: string;
	name: string;
	type: string;
	signinUrl: string;
	callbackUrl: string;
}

const Logo = () => (
	<Link href="/" className="flex gap-2 flex-center">
		<Image
			src="/assets/images/logo.svg"
			alt="SharePrompts Logo"
			width={30}
			height={30}
			className="object-contain"
			priority
		/>
		<p className="logo_text">SharePrompts</p>
	</Link>
);

const ProfileImage = ({
	src,
	onClick,
}: {
	src: string;
	onClick?: () => void;
}) => (
	<Image
		src={src}
		width={37}
		height={37}
		className="rounded-full cursor-pointer transition-transform hover:scale-105"
		alt="Profile"
		onClick={onClick}
	/>
);

const SignInButton = ({ provider }: { provider: Provider }) => (
	<button
		type="button"
		onClick={() => signIn(provider.id)}
		className="black_btn"
	>
		Sign in
	</button>
);

const DesktopNav = ({
	session,
	providers,
}: {
	session: any;
	providers: Record<string, Provider> | null;
}) => (
	<div className="sm:flex hidden">
		{session?.user ? (
			<div className="flex gap-3 md:gap-5">
				<Link href="/create-prompt" className="black_btn">
					Create Post
				</Link>

				<button
					type="button"
					onClick={() => signOut()}
					className="outline_btn cursor-pointer"
				>
					Sign Out
				</button>

				<Link href="/profile">
					<ProfileImage src={session.user.image} />
				</Link>
			</div>
		) : (
			<>
				{providers &&
					Object.values(providers).map((provider) => (
						<SignInButton key={provider.name} provider={provider} />
					))}
			</>
		)}
	</div>
);

const MobileDropdown = ({ onClose }: { onClose: () => void }) => (
	<motion.div
		className="dropdown"
		initial={{ opacity: 0, y: -10 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, y: -10 }}
		transition={{ duration: 0.2 }}
	>
		<Link href="/profile" className="dropdown_link" onClick={onClose}>
			My Profile
		</Link>
		<Link href="/create-prompt" className="dropdown_link" onClick={onClose}>
			Create Prompt
		</Link>
		<button
			type="button"
			onClick={() => {
				onClose();
				signOut();
			}}
			className="mt-5 w-full black_btn cursor-pointer"
		>
			Sign Out
		</button>
	</motion.div>
);

const MobileNav = ({
	session,
	providers,
}: {
	session: any;
	providers: Record<string, Provider> | null;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	const closeDropdown = useCallback(() => {
		setIsOpen(false);
	}, []);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!target.closest(".mobile-nav")) {
				closeDropdown();
			}
		};

		if (isOpen) {
			document.addEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isOpen, closeDropdown]);

	return (
		<div className="sm:hidden flex relative mobile-nav">
			{session?.user ? (
				<div className="flex">
					<ProfileImage src={session.user.image} onClick={toggleDropdown} />
					<AnimatePresence>
						{isOpen && <MobileDropdown onClose={closeDropdown} />}
					</AnimatePresence>
				</div>
			) : (
				<>
					{providers &&
						Object.values(providers).map((provider) => (
							<SignInButton key={provider.name} provider={provider} />
						))}
				</>
			)}
		</div>
	);
};

const Nav = () => {
	const { data: session } = useSession();
	const [providers, setProviders] = useState<Record<string, Provider> | null>(
		null
	);

	useEffect(() => {
		const loadProviders = async () => {
			const res = await getProviders();
			setProviders(res);
		};

		loadProviders();
	}, []);

	return (
		<nav className="flex-between w-full mb-16 pt-3" role="navigation">
			<Logo />
			<DesktopNav session={session} providers={providers} />
			<MobileNav session={session} providers={providers} />
		</nav>
	);
};

export default Nav;
