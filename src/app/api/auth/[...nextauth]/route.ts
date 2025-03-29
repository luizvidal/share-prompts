import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async session({ session }) {
			try {
				await connectToDB();

				const user = await User.findOne({ email: session.user?.email });
				
				if (!user) {
					throw new Error("User not found");
				}

				return {
					...session,
					user: {
						...session.user,
						_id: user._id.toString(),
					},
				};
			} catch (error) {
				console.error("Session callback error:", error);
				return session;
			}
		},

		async signIn({ profile }) {
			try {
				await connectToDB();

				const user = await User.findOne({ email: profile?.email });

				if (!user && profile) {
					await User.create({
						email: profile.email,
						username: profile.name?.replace(/\s+/g, "_").toLowerCase(),
						image: (profile as { picture: string }).picture,
					});
				}

				return true;
			} catch (error) {
				console.error("SignIn callback error:", error);
				return false;
			}
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	// Add these options for better security and handling
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/",
		error: "/",
	},
});

export { handler as GET, handler as POST };

