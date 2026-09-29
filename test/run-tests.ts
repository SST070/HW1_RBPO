import assert from "node:assert/strict";
import { AddressInfo } from "node:net";
import { startNotesServer } from "../src/http.js";
import { NotesStore, validateTags, validateTitle } from "../src/store.js";

const token = "test-token";
const server = await startNotesServer({
  port: 0,
  token,
  store: new NotesStore()
});

try {
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  assert.equal(validateTitle("  Plan "), "Plan");
  assert.deepEqual(validateTags(["Work", "work", "EK1"]), ["work", "ek1"]);

  const unauthorized = await fetch(`${baseUrl}/notes`);
  assert.equal(unauthorized.status, 401);

  const created = await request(baseUrl, "POST", "/notes", {
    title: "Security concept",
    content: "Draft SR/T/D chains",
    tags: ["EK1", "Security"]
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.note.title, "Security concept");
  assert.deepEqual(created.body.note.tags, ["ek1", "security"]);

  const listed = await request(baseUrl, "GET", "/notes");
  assert.equal(listed.status, 200);
  assert.equal(listed.body.notes.length, 1);

  const updated = await request(baseUrl, "PATCH", `/notes/${created.body.note.id}`, {
    archived: true
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.note.archived, true);

  const removed = await request(baseUrl, "DELETE", `/notes/${created.body.note.id}`);
  assert.equal(removed.status, 204);

  const missing = await request(baseUrl, "GET", `/notes/${created.body.note.id}`);
  assert.equal(missing.status, 404);
} finally {
  server.close();
}

async function request(
  baseUrl: string,
  method: string,
  path: string,
  body?: unknown
): Promise<{ status: number; body: any }> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  return {
    status: response.status,
    body: response.status === 204 ? undefined : await response.json()
  };
}
