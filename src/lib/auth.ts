import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: `"Prisma Blog App" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Verify Your Email Address",
          html: `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px;">
        
        <h2 style="color:#333;">Verify Your Email</h2>

        <p style="font-size:15px; color:#555;">
          Hi <strong>${user.name || "there"}</strong>,
        </p>

        <p style="font-size:15px; color:#555;">
          Thanks for signing up! Please confirm your email address by clicking the button below.
        </p>

        <div style="text-align:center; margin:30px 0;">
          <a href="${verificationUrl}"
             style="background:#3489BD; color:#ffffff; padding:12px 24px;
                    text-decoration:none; border-radius:6px; font-weight:bold;">
            Verify Email
          </a>
        </div>

        <p style="font-size:14px; color:#777;">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="font-size:13px; color:#3489BD; word-break:break-all;">
          ${verificationUrl}
        </p>

        <hr style="margin:30px 0;" />

        <p style="font-size:12px; color:#999;">
          If you didn’t create an account, you can safely ignore this email.
        </p>

        <p style="font-size:12px; color:#999;">
          © ${new Date().getFullYear()} Your App Name. All rights reserved.
        </p>
      </div>
    </div>
  `,
        });
      } catch (error: any) {
        console.log(error.message);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
});
