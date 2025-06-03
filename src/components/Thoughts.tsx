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

  useEffect(() => {
    actions.getThoughts({ post }).then(({ data, error }) => {
      if (data) {
        setThoughts(data);
      }
    });
  }, []);

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
            <Header username={thought.username} date={thought.date} />
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
  username: string;
  date: Date;
}

function Header({ username, date }: HeaderProps) {
  return (
    <header class={classes.header}>
      <div class={classes.left}>
        <span class={classes.author}>{username}</span>
        <FormattedDate date={date} />
      </div>
    </header>
  );
}

function FormattedDate({ date }: { date: Date }) {
  const formatted = formatRelative(date, new Date());
  return (
    <p>
      <time datetime={date.toISOString()}>{formatted}</time>
    </p>
  );
}
