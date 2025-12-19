import fs from "fs";
import path from "path";
import z from "zod";
import { config } from "dotenv";

// Try multiple paths for .env file to support different environments
const possibleEnvPaths = [
  path.resolve(__dirname, "../../.env"), // From dist/src to project root
  path.resolve(process.cwd(), ".env"), // From current working directory
  "/app/.env", // Docker/LXC absolute path
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`✓ Loading .env from: ${envPath}`);
    config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log("⚠ No .env file found at any of these paths:");
  possibleEnvPaths.forEach((p) => console.log(`  - ${p}`));
  console.log("⚠ Using system environment variables only");
}

const configSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  GUEST_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  GUEST_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  INITIAL_EMAIL_OWNER: z.string(),
  INITIAL_PASSWORD_OWNER: z.string(),
  DOMAIN: z.string(),
  PROTOCOL: z.string(),
  UPLOAD_FOLDER: z.string(),
  CLIENT_URL: z.string(),
  GOOGLE_REDIRECT_CLIENT_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_AUTHORIZED_REDIRECT_URI: z.string(),
  PRODUCTION: z.enum(["true", "false"]).transform((val) => val === "true"),
  PRODUCTION_URL: z.string(),
  SERVER_TIMEZONE: z.string(),
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  console.error("\n❌ Environment variables validation failed:");
  console.error("=".repeat(60));
  configServer.error.issues.forEach((issue) => {
    console.error(`  • ${issue.path.join(".")}: ${issue.message}`);
    if (issue.code === "invalid_type" && "received" in issue && issue.received === "undefined") {
      console.error(`    (Missing required variable: ${issue.path.join(".")})`);
    }
  });
  console.error("=".repeat(60));
  console.error("\n💡 Tip: Make sure .env file exists and all required variables are set");
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}
const envConfig = configServer.data;
export const API_URL = envConfig.PRODUCTION
  ? envConfig.PRODUCTION_URL
  : `${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`;
export default envConfig;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}
