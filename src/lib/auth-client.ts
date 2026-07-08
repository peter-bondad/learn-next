import { createAuthClient } from "better-auth/client";
import { env } from "./env";

const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [],
});

export default authClient;
