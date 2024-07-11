type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

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

  return (
    <ul className="col-[2/3] grid gap-2 grid-cols-gallery grid-rows-[auto]">
      {posts.map(({ id, title, body }) => {
        return (
          <li
            key={id}
            className="grid grid-rows-[subgrid] row-span-2 gap-2 rounded-xl bg-slate-200 p-2"
          >
            <h4 className="text-xl font-semibold mb-4">{title}</h4>
            <p>{body}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default Posts;
