import type { ThoughtNoPost } from "../thoughts";
import { actions } from "astro:actions";
import MarkdownIt from "markdown-it";
import { useEffect, useState } from "preact/hooks";
import classes from "./Thoughts.module.css";
import { formatRelative } from "date-fns";

const md = new MarkdownIt({ linkify: true });

interface Props {
  post: string | undefined;
}

export default function Thoughts({ post }: Props) {
  const [thoughts, setThoughts] = useState<null | ThoughtNoPost[]>(null);
  const [error, setError] = useState("");

  function removeThought(id: string) {
    thoughts && setThoughts(thoughts?.filter((thought) => thought.id !== id));
  }

  useEffect(() => {
    actions.getThoughts({ post }).then(({ data, error }) => {
      if (data) {
        setThoughts(data);
      }
      if (error) {
        setError(error.message);
      }
    });
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (thoughts === null) {
    return <p>loading thoughts</p>;
  } else if (thoughts.length === 0) {
    return (
      <p>
        <i>no thoughts yet</i>
      </p>
    );
  }

  return (
    <ul class={classes.thoughts} role="list">
      {thoughts.map((thought) => (
        <li class={classes.thought}>
          <article>
            <Header
              {...thought}
              isOwner={thought.isOwner === 1}
              post={post}
              removeThought={removeThought}
            />
            <div
              class="text"
              dangerouslySetInnerHTML={{
                __html: md.render(thought.message).replace("<h1>", "<p>"),
              }}
            />
          </article>
        </li>
      ))}
    </ul>
  );
}

interface HeaderProps {
  id?: string;
  username: string;
  date: Date;
  isOwner: boolean;
  message: string;
  post?: string;
  removeThought: (id: string) => void;
}

function Header({
  id,
  username,
  date,
  isOwner,
  post,
  message,
  removeThought,
}: HeaderProps) {
  const [error, setError] = useState("");
  async function handleDelete() {
    if (id) {
      const { error } = await actions.deleteThought(id);
      if (error) {
        setError(error.message);
      } else {
        removeThought(id);
      }
    }
  }

  return (
    <>
      <header class={classes.header}>
        <div class={classes.left}>
          <span class={classes.author}>{username}</span>
          <FormattedDate date={date} />
        </div>
        {isOwner && id && (
          <div class={classes.right}>
            <button
              aria-label="delete"
              onClick={handleDelete}
              class={classes.activatable}
            >
              <TrashIcon />
            </button>
            <a
              href={`/post-thought${post ? `/${post}` : ""}${`?id=${encodeURIComponent(id ?? "")}&old-message=${encodeURIComponent(message)}&old-username=${encodeURIComponent(username)}`}`}
              aria-label="edit"
              class={classes.activatable}
            >
              <EditIcon />
            </a>
          </div>
        )}
      </header>
      {error && (
        <p aria-live="polite" class={classes["header-error"]}>
          {error}
        </p>
      )}
    </>
  );
}

function FormattedDate({ date }: { date: Date }) {
  const formatted = formatRelative(date, new Date());
  return (
    <p>
      <time class={classes.time} datetime={date.toISOString()}>
        {formatted}
      </time>
    </p>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="rgb(var(--foreground))"
      width="24"
      height="24"
    >
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    </svg>
  );
}
