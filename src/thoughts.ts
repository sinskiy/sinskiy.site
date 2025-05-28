interface Thought {
  username: string;
  date: Date;
  message: string;
  post: string | null;
}

export type ThoughtNoPost = Omit<Thought, "post">;
