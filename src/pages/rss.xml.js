import rss from "@astrojs/rss";
import { getAllPostsSorted } from "../blogs";

export async function GET(context) {
  const blogs = await getAllPostsSorted();
  return rss({
    title: "sinskiy's blog",
    description: "mainly programming articles from dima sinskiy",
    site: context.site,
    items: blogs.map((post) => ({
      link: `/${post.id}/`,
      ...post.data,
    })),
  });
}
