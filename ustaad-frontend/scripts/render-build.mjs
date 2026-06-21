import { execSync } from "child_process";

const backend =
  process.env.BACKEND_URL ||
  process.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

const apiUrl = `${backend.replace(/\/$/, "")}/api`;

console.log("Building frontend with API:", apiUrl);

execSync("npx vite build", {
  stdio: "inherit",
  env: { ...process.env, VITE_API_URL: apiUrl },
});
