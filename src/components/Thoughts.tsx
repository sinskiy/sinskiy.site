import type { ThoughtNoPost } from "../thoughts";
import { actions } from "astro:actions";
import MarkdownIt from "markdown-it";
import { formatRelative } from "date-fns";
import { useEffect, useState } from "preact/hooks";
import classes from "./Thoughts.module.css";

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
          <div class={classes.header}>
            <address class={classes.author}>{thought.username}</address>
            <p>
              <time class={classes.time} datetime={thought.date.toISOString()}>
                {formatRelative(thought.date, new Date())}
              </time>
            </p>
          </div>
          <div
            class="text"
            dangerouslySetInnerHTML={{
              __html: md.render(thought.message).replace("<h1>", "<p>"),
            }}
          />
        </li>
      ))}
    </ul>
  );
}
