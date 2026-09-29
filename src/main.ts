import { startNotesServer } from "./http.js";

const port = Number.parseInt(process.env.PORT ?? "4300", 10);
const token = process.env.NOTES_API_TOKEN;

if (!token) {
  throw new Error("NOTES_API_TOKEN environment variable is required");
}

const server = await startNotesServer({ port, token });

process.on("SIGTERM", () => {
  server.close();
});

console.log(`Notes service is listening on http://localhost:${port}`);
