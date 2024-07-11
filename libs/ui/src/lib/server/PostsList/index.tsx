export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

interface Props {
  posts: Post[];
}

export const PostsList = ({ posts }: Props): JSX.Element => {
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
