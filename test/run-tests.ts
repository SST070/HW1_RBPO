import assert from "node:assert/strict";
import { AddressInfo } from "node:net";
import { startNotesServer } from "../src/http.js";
import { ApiError } from "../src/types.js";
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
  assert.throws(() => validateTitle("   "), ApiError);

  const isolatedStore = new NotesStore();
  const ownerNote = isolatedStore.create("owner-a", {
    title: "Private",
    content: "Only owner-a can read this"
  });
  assert.equal(isolatedStore.get("owner-a", ownerNote.id).title, "Private");
  assert.throws(() => isolatedStore.get("owner-b", ownerNote.id), ApiError);
  assert.throws(
    () => isolatedStore.update("owner-b", ownerNote.id, { title: "Changed" }),
    ApiError
  );
  assert.throws(() => isolatedStore.delete("owner-b", ownerNote.id), ApiError);
  assert.equal(isolatedStore.get("owner-a", ownerNote.id).title, "Private");

  const unauthorized = await fetch(`${baseUrl}/notes`);
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorized.headers.get("x-content-type-options"), "nosniff");

  const wrongToken = await fetch(`${baseUrl}/notes`, {
    headers: {
      Authorization: "Bearer wrong-token"
    }
  });
  assert.equal(wrongToken.status, 401);

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
  assert.equal(listed.headers.get("x-content-type-options"), "nosniff");

  const invalidTitle = await request(baseUrl, "POST", "/notes", {
    title: " "
  });
  assert.equal(invalidTitle.status, 400);
  assert.equal(invalidTitle.body.error.code, "validation_error");
  assert.doesNotMatch(JSON.stringify(invalidTitle.body), /at\s+\w+/);

  const invalidJson = await fetch(`${baseUrl}/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: "{bad-json"
  });
  assert.equal(invalidJson.status, 400);
  const invalidJsonBody = await invalidJson.json();
  assert.equal(invalidJsonBody.error.code, "bad_json");
  assert.doesNotMatch(JSON.stringify(invalidJsonBody), /at\s+\w+/);

  const oversized = await fetch(`${baseUrl}/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "Too large",
      content: "x".repeat(33 * 1024)
    })
  });
  assert.equal(oversized.status, 400);
  assert.equal((await oversized.json()).error.code, "bad_json");

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
): Promise<{ status: number; headers: Headers; body: any }> {
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
    headers: response.headers,
    body: response.status === 204 ? undefined : await response.json()
  };
}
