const fetchData = (): Promise<string> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('Hello Server');
    }, 300);
  });

// React server components are async so you make database or API calls.
export async function HelloServer() {
  const greeting = await fetchData();

  return (
    <div>
      <h1>{greeting}</h1>
    </div>
  );
}
