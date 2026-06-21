import { execSync } from "child_process";

function resolveBackendUrl() {
  const fromBackend = process.env.BACKEND_URL?.trim();
  if (fromBackend) {
    return fromBackend.replace(/\/$/, "").replace(/\/api\/?$/, "");
  }

  const fromVite = process.env.VITE_API_URL?.trim();
  if (fromVite) {
    return fromVite.replace(/\/$/, "").replace(/\/api\/?$/, "");
  }

  return "http://localhost:5000";
}

const backend = resolveBackendUrl();
const apiUrl = `${backend}/api`;
console.log("Building frontend with API:", apiUrl);

execSync("npx vite build", {
  stdio: "inherit",
  env: { ...process.env, VITE_API_URL: apiUrl },
});
