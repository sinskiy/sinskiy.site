import rss from "@astrojs/rss";
import { getAllPostsSorted } from "../posts";

export async function GET(context) {
  const posts = await getAllPostsSorted();
  return rss({
    title: "sinskiy's blog",
    description: "mainly programming articles from dima sinskiy",
    site: context.site,
    items: posts.map((post) => ({
      link: `/${post.id}/`,
      ...post.data,
    })),
  });
}
