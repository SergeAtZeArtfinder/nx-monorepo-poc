import { Suspense } from 'react';

import Posts from '../components/Posts';

export default async function HomePage() {
  return (
    <main className="grid grid-cols-gutter-grid">
      <h1 className="my-4 text-3xl text-center font-bold underline col-[2/3]">
        NX Monorepo Polygon
      </h1>
      <Suspense
        fallback={
          <p className="text-center font-semibold my-4 col-[2/3]">
            Loading posts...
          </p>
        }
      >
        <Posts />
      </Suspense>
    </main>
  );
}
