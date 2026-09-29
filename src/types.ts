export type Note = {
  id: string;
  ownerId: string;
  title: string;
  content: string;
  tags: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteInput = {
  title: string;
  content?: string;
  tags?: string[];
};

export type UpdateNoteInput = Partial<CreateNoteInput> & {
  archived?: boolean;
};

export type ApiErrorCode =
  | "bad_json"
  | "not_found"
  | "unauthorized"
  | "validation_error";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ApiErrorCode,
    message: string
  ) {
    super(message);
  }
}
