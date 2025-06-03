import type { ThoughtNoPost } from "../thoughts";
import { actions } from "astro:actions";
import MarkdownIt from "markdown-it";
import { useEffect, useState } from "preact/hooks";
import classes from "./Thoughts.module.css";
import FormattedDate from "./FormattedDate.astro";

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
            <header class={classes.header}>
              <div class={classes.left}>
                <span class={classes.author}>{thought.username}</span>
                <FormattedDate
                  date={thought.date}
                  short={false}
                  className={classes.time}
                />
              </div>
            </header>
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
