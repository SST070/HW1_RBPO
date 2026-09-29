import { randomUUID } from "node:crypto";
import { ApiError, CreateNoteInput, Note, UpdateNoteInput } from "./types.js";

const MAX_TITLE_LENGTH = 120;
const MAX_CONTENT_LENGTH = 10_000;
const MAX_TAG_LENGTH = 32;
const MAX_TAGS = 12;

export class NotesStore {
  private readonly notes = new Map<string, Note>();

  list(ownerId: string): Note[] {
    return [...this.notes.values()]
      .filter((note) => note.ownerId === ownerId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  get(ownerId: string, id: string): Note {
    const note = this.notes.get(id);
    if (!note || note.ownerId !== ownerId) {
      throw new ApiError(404, "not_found", "Note was not found");
    }
    return note;
  }

  create(ownerId: string, input: CreateNoteInput): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      ownerId,
      title: validateTitle(input.title),
      content: validateContent(input.content ?? ""),
      tags: validateTags(input.tags ?? []),
      archived: false,
      createdAt: now,
      updatedAt: now
    };

    this.notes.set(note.id, note);
    return note;
  }

  update(ownerId: string, id: string, input: UpdateNoteInput): Note {
    const current = this.get(ownerId, id);
    const next: Note = {
      ...current,
      title: input.title === undefined ? current.title : validateTitle(input.title),
      content:
        input.content === undefined
          ? current.content
          : validateContent(input.content),
      tags: input.tags === undefined ? current.tags : validateTags(input.tags),
      archived:
        input.archived === undefined
          ? current.archived
          : validateArchived(input.archived),
      updatedAt: new Date().toISOString()
    };

    this.notes.set(id, next);
    return next;
  }

  delete(ownerId: string, id: string): void {
    this.get(ownerId, id);
    this.notes.delete(id);
  }
}

export function validateTitle(title: unknown): string {
  if (typeof title !== "string") {
    throw new ApiError(400, "validation_error", "Title must be a string");
  }

  const trimmed = title.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_TITLE_LENGTH) {
    throw new ApiError(
      400,
      "validation_error",
      `Title must be 1-${MAX_TITLE_LENGTH} characters`
    );
  }

  return trimmed;
}

export function validateContent(content: unknown): string {
  if (typeof content !== "string") {
    throw new ApiError(400, "validation_error", "Content must be a string");
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    throw new ApiError(
      400,
      "validation_error",
      `Content must be at most ${MAX_CONTENT_LENGTH} characters`
    );
  }

  return content;
}

export function validateTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) {
    throw new ApiError(400, "validation_error", "Tags must be an array");
  }

  if (tags.length > MAX_TAGS) {
    throw new ApiError(400, "validation_error", `At most ${MAX_TAGS} tags are allowed`);
  }

  const normalized = tags.map((tag) => {
    if (typeof tag !== "string") {
      throw new ApiError(400, "validation_error", "Each tag must be a string");
    }
    const trimmed = tag.trim().toLowerCase();
    if (trimmed.length === 0 || trimmed.length > MAX_TAG_LENGTH) {
      throw new ApiError(
        400,
        "validation_error",
        `Each tag must be 1-${MAX_TAG_LENGTH} characters`
      );
    }
    return trimmed;
  });

  return [...new Set(normalized)];
}

function validateArchived(archived: unknown): boolean {
  if (typeof archived !== "boolean") {
    throw new ApiError(400, "validation_error", "Archived must be a boolean");
  }

  return archived;
}
