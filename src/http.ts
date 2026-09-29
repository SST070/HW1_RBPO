import { createServer, IncomingMessage, Server, ServerResponse } from "node:http";
import { ApiError, CreateNoteInput, UpdateNoteInput } from "./types.js";
import { NotesStore } from "./store.js";

export type NotesServerOptions = {
  port: number;
  token: string;
  store?: NotesStore;
};

type RouteContext = {
  method: string;
  pathname: string;
  noteId?: string;
};

const OWNER_ID = "default-user";
const JSON_LIMIT_BYTES = 32 * 1024;

export function startNotesServer(options: NotesServerOptions): Promise<Server> {
  const store = options.store ?? new NotesStore();
  const server = createServer((request, response) => {
    handleRequest(request, response, store, options.token).catch((error: unknown) => {
      sendError(response, error);
    });
  });

  return new Promise((resolve) => {
    server.listen(options.port, () => resolve(server));
  });
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  store: NotesStore,
  token: string
): Promise<void> {
  const route = parseRoute(request);

  if (route.method === "GET" && route.pathname === "/health") {
    sendJson(response, 200, { status: "ok", service: "notes-service" });
    return;
  }

  requireBearerToken(request, token);

  if (route.method === "GET" && route.pathname === "/notes") {
    sendJson(response, 200, { notes: store.list(OWNER_ID) });
    return;
  }

  if (route.method === "POST" && route.pathname === "/notes") {
    const input = (await readJson(request)) as CreateNoteInput;
    sendJson(response, 201, { note: store.create(OWNER_ID, input) });
    return;
  }

  if (route.noteId && route.method === "GET") {
    sendJson(response, 200, { note: store.get(OWNER_ID, route.noteId) });
    return;
  }

  if (route.noteId && route.method === "PATCH") {
    const input = (await readJson(request)) as UpdateNoteInput;
    sendJson(response, 200, { note: store.update(OWNER_ID, route.noteId, input) });
    return;
  }

  if (route.noteId && route.method === "DELETE") {
    store.delete(OWNER_ID, route.noteId);
    sendJson(response, 204, undefined);
    return;
  }

  throw new ApiError(404, "not_found", "Route was not found");
}

function parseRoute(request: IncomingMessage): RouteContext {
  const url = new URL(request.url ?? "/", "http://localhost");
  const noteMatch = /^\/notes\/([0-9a-f-]+)$/i.exec(url.pathname);

  return {
    method: request.method ?? "GET",
    pathname: noteMatch ? "/notes/:id" : url.pathname,
    noteId: noteMatch?.[1]
  };
}

function requireBearerToken(request: IncomingMessage, token: string): void {
  const header = request.headers.authorization ?? "";
  if (header !== `Bearer ${token}`) {
    throw new ApiError(401, "unauthorized", "Valid bearer token is required");
  }
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > JSON_LIMIT_BYTES) {
      throw new ApiError(400, "bad_json", "JSON body is too large");
    }
    chunks.push(buffer);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    throw new ApiError(400, "bad_json", "Request body must be valid JSON");
  }
}

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  response.statusCode = status;
  response.setHeader("X-Content-Type-Options", "nosniff");

  if (payload === undefined) {
    response.end();
    return;
  }

  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function sendError(response: ServerResponse, error: unknown): void {
  if (error instanceof ApiError) {
    sendJson(response, error.status, {
      error: {
        code: error.code,
        message: error.message
      }
    });
    return;
  }

  sendJson(response, 500, {
    error: {
      code: "internal_error",
      message: "Unexpected server error"
    }
  });
}
