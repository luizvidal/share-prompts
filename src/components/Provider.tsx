"use client";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import { Toaster } from "sonner";

const Provider = ({
	children,
	session,
}: Readonly<{
	children: React.ReactNode;
	session?: any;
}>) => (
	<SessionProvider session={session}>
		<Suspense fallback={null}>{children}</Suspense>
    <Toaster position="top-center" />
	</SessionProvider>
);

export default Provider;
