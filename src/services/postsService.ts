import { mockPosts } from "@/data/mockPosts";
import type { BlogPost } from "@/types/post";

export async function getPosts(): Promise<BlogPost[]> {
  return mockPosts;
}

export async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await getPosts();
  return posts.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getRelatedPosts(post: BlogPost): Promise<BlogPost[]> {
  const posts = await getPosts();
  return post.relatedSlugs
    .map((slug) => posts.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is BlogPost => Boolean(candidate));
}
