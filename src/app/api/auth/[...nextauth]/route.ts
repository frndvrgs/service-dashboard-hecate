import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import { default as nodemailer } from "nodemailer";
import { settings } from "../../../../settings";
import {
  makeEmailHTMLTemplate,
  makeEmailTextTemplate,
} from "../../email/template";
import type { Adapter } from "next-auth/adapters";
import type { NextAuthOptions } from "next-auth";

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const authOptions: NextAuthOptions = {
  adapter: PostgresAdapter(pool) as Adapter, // Type seems wrong, using assertion, to be checked
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    // EmailProvider({
    //   server: {
    //     // pool: true,
    //     // secure: true,
    //     host: "smtp.sendgrid.net",
    //     port: 587,
    //     auth: {
    //       user: "apikey",
    //       pass: process.env.SENDGRID_API_KEY,
    //     },
    //   },
    //   from: process.env.SENDGRID_EMAIL_FROM,
    //   async sendVerificationRequest({
    //     identifier: email,
    //     url,
    //     provider: { server, from },
    //   }) {
    //     console.log("Sending email to:", email);
    //     console.log("Verification URL:", url);

    //     const { host } = new URL(url);
    //     const transport = nodemailer.createTransport(server);

    //     try {
    //       const name = settings.APP.SERVICE_NAME;
    //       const result = await transport.sendMail({
    //         to: email,
    //         from: from,
    //         subject: `Sign in to ${host}`,
    //         text: makeEmailTextTemplate({ url, host }),
    //         html: makeEmailHTMLTemplate({ url, name, host, email }),
    //       });

    //       const failed = result.rejected.concat(result.pending).filter(Boolean);
    //       if (failed.length) {
    //         throw new Error(
    //           `Email(s) (${failed.join(", ")}) could not be sent`,
    //         );
    //       }

    //       console.log("Verification email sent successfully");
    //     } catch (error) {
    //       console.error("Error sending verification email", error);
    //       throw new Error("Failed to send verification email");
    //     } finally {
    //       transport.close();
    //     }
    //   },
    // }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
    error: "/error",
  },
  callbacks: {
    async signIn({ account, user, profile, email }) {
      console.log("signIn", account);

      if (account?.provider === "github") {
        console.log("github login", user, profile);
      }

      if (account?.provider === "google") {
        console.log("google login", user, profile);
      }

      if (account?.provider === "email") {
        console.log("e-mail login", user, profile, email);
        // await db.connect();
        // const userExists = await User.findOne({
        //   email: user.email,  //the user object has an email property, which contains the email the user entered.
        // });
        // if (userExists) {
        //   return true;   //if the email exists in the User collection, email them a magic login link
        // } else {
        //   return "/register";
        // }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        if (url.includes("/api/auth/signin") || url.includes("/login")) {
          return `${baseUrl}/dashboard`;
        }
        return url;
      } else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    },
    async jwt({ token, user }) {
      // to be improved with cms user scopes
      return { ...token, ...user };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
