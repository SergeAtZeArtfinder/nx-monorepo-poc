import { type Post, PostsList } from '@nx-monorepo-polygon/components/server';

const fetchPosts = async (
  max: number
): Promise<[Post[], null] | [null, string]> => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!res.ok) {
      throw new Error(`Failed to fetch posts. ${res.statusText}`);
    }

    const posts: Post[] = await res.json();

    return [posts.slice(0, max), null];
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : 'Failed fetch from JsonPlaceholder API';
    return [null, msg];
  }
};

const Posts = async () => {
  const [posts, fetchError] = await fetchPosts(8);

  if (fetchError || !posts) {
    return (
      <p className="col-[2/3] text-red font-semibold text-center my-4">
        {fetchError}
      </p>
    );
  }

  return <PostsList posts={posts} />;
};

export default Posts;
