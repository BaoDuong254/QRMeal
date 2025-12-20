/* eslint-disable @typescript-eslint/no-explicit-any */
import { ManagerRoom, Role } from "@/constants/type";
import prisma from "@/database";
import { AuthError } from "@/utils/errors";
import { getChalk } from "@/utils/helpers";
import { verifyAccessToken } from "@/utils/jwt";
import fastifyPlugin from "fastify-plugin";

export const socketPlugin = fastifyPlugin(async (fastify) => {
  const chalk = await getChalk();

  console.log(chalk.magentaBright("🔌 Socket.IO plugin initializing..."));
  console.log(chalk.magentaBright("   Path:"), fastify.io.path || "/socket.io/");
  console.log(chalk.magentaBright("   Transports:"), fastify.io.engine.opts.transports);
  const corsOrigin =
    typeof fastify.io.engine.opts.cors === "object" ? fastify.io.engine.opts.cors?.origin || "*" : "function";
  console.log(chalk.magentaBright("   CORS Origin:"), corsOrigin);

  // Connection error handler
  fastify.io.engine.on("connection_error", (err: any) => {
    console.error(chalk.redBright("❌ Socket.IO connection error:"));
    console.error(chalk.redBright("   Message:"), err.message);
    console.error(chalk.redBright("   Context:"), err.context);
    console.error(chalk.redBright("   Stack:"), err.stack);
  });

  fastify.io.use(async (socket, next) => {
    console.log(chalk.yellowBright("🔑 Socket authentication attempt:"), socket.id);
    console.log(chalk.yellowBright("   Transport:"), socket.conn.transport.name);
    console.log(chalk.yellowBright("   Headers:"), JSON.stringify(socket.handshake.headers, null, 2));
    console.log(chalk.yellowBright("   Query:"), socket.handshake.query);
    console.log(chalk.yellowBright("   Auth:"), socket.handshake.auth);
    const { Authorization } = socket.handshake.auth;

    if (!Authorization) {
      console.error(chalk.redBright("❌ No Authorization header"));
      return next(new AuthError("Authorization không hợp lệ"));
    }
    const accessToken = Authorization.split(" ")[1];
    try {
      const decodedAccessToken = verifyAccessToken(accessToken);
      const { userId, role } = decodedAccessToken;
      console.log(chalk.greenBright("✅ Token verified:"), { userId, role });

      if (role === Role.Guest) {
        await prisma.socket.upsert({
          where: {
            guestId: userId,
          },
          update: {
            socketId: socket.id,
          },
          create: {
            guestId: userId,
            socketId: socket.id,
          },
        });
      } else {
        await prisma.socket.upsert({
          where: {
            accountId: userId,
          },
          update: {
            socketId: socket.id,
          },
          create: {
            accountId: userId,
            socketId: socket.id,
          },
        });
        socket.join(ManagerRoom);
      }
      socket.handshake.auth.decodedAccessToken = decodedAccessToken;
    } catch (error: unknown) {
      console.error(chalk.redBright("❌ Socket auth error:"), error);
      return next(error as Error);
    }
    next();
  });
  fastify.io.on("connection", async (socket) => {
    console.log(chalk.cyanBright("🔌 Socket connected:", socket.id));
    socket.on("disconnect", async (_reason) => {
      console.log(chalk.redBright("🔌 Socket disconnected:", socket.id));
    });
  });
});
