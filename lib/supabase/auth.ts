import {headers} from 'next/headers';

export async function readBearerToken() {
  const headerStore = await headers();
  const authHeader = headerStore.get('authorization') || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return null;
  }

  return authHeader.slice(7).trim();
}
