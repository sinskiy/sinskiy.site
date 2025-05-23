import { getCollection, type CollectionEntry } from "astro:content";

export function sortPosts(posts: CollectionEntry<"posts">[]) {
  return posts.sort((a, b) => {
    if (!a.data.pubDate || !b.data.pubDate) {
      return 0;
    } else {
      return b.data.pubDate.getTime() - a.data.pubDate.getTime();
    }
  });
}

export async function getAllPostsSorted() {
  const posts = await getCollection("posts");
  const sortedPosts = sortPosts(posts);
  return sortedPosts;
}
