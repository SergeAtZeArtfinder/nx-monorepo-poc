// React server actions are async.
export async function HelloServer() {
  'use server';

  return 'Server action result';
}
