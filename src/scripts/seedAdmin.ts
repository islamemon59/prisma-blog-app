import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/middleware";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      role: UserRole.ADMIN,
      password: process.env.ADMIN_PASS,
    };

    const existUser = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });

    if (existUser) {
      throw new Error("User already exists");
    }

    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email as string,
        },
        data: {
          emailVerified: true,
        },
      });
    }

    console.log(signUpAdmin);
  } catch (error: any) {
    console.error(error.message);
  }
};

seedAdmin();
