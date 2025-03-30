import Nav from "@/components/Nav";
import Provider from "@/components/Provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "SharePrompts",
	description: "Discover & Share AI Prompts",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} antialiased`}>
				<Provider>
					<div className="main">
						<div className="gradient" />
					</div>

					<main className="app">
						<Nav />
						{children}
					</main>
				</Provider>
			</body>
		</html>
	);
}
