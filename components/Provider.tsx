"use client";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

const Provider: any = ({ children, session }) => (
	<SessionProvider session={session}>
		<Suspense fallback={null}>{children}</Suspense>
	</SessionProvider>
);

export default Provider;
