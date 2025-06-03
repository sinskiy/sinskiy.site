interface Thought {
  id?: string;
  username: string;
  date: Date;
  message: string;
  // i don't know why it's unknown
  isOwner: unknown;
  post: string | null;
}

export type ThoughtNoPost = Omit<Thought, "post">;
