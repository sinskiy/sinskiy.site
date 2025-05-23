import { getCollection, type CollectionEntry } from "astro:content";

export function sortBlogs(blogs: CollectionEntry<"blogs">[]) {
  return blogs.sort((a, b) => {
    if (!a.data.pubDate || !b.data.pubDate) {
      return 0;
    } else {
      return b.data.pubDate.getTime() - a.data.pubDate.getTime();
    }
  });
}

export async function getAllPostsSorted() {
  const blogs = await getCollection("blogs");
  const sortedBlogs = sortBlogs(blogs);
  return sortedBlogs;
}
