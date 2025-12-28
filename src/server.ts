import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 3000;

const main = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`The server is on running port localhost:${port}`);
    });
  } catch (error: any) {
    console.error(error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();