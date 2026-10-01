import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 9007),
  mongoUrl: required("MONGODB_URL"),
  mongoName: process.env.MONGODB_NAME ?? "personal-finance",
  jwtSecret: required("JWT_SECRET"),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  isProduction: process.env.NODE_ENV === "production",
};
