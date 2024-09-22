"use client";
import { SessionProvider } from "next-auth/react";

const Provider: any = ({ children, session }) => (
	<SessionProvider session={session}>{children}</SessionProvider>
);

export default Provider;
