import {NextResponse} from 'next/server';
import {readBearerToken} from '@/lib/supabase/auth';
import {getSupabaseServerClientWithToken} from '@/lib/supabase/server';

async function getAuthedClient() {
  const token = await readBearerToken();
  if (!token) {
    return {error: NextResponse.json({error: 'Login required'}, {status: 401}) as NextResponse, client: null};
  }

  const client = getSupabaseServerClientWithToken(token);
  if (!client) {
    return {
      error: NextResponse.json({error: 'Supabase is not configured'}, {status: 503}) as NextResponse,
      client: null
    };
  }

  const {data: userData, error: userError} = await client.auth.getUser();
  if (userError || !userData.user) {
    return {error: NextResponse.json({error: 'Invalid auth token'}, {status: 401}) as NextResponse, client: null};
  }

  return {error: null, client, userId: userData.user.id};
}

export async function GET() {
  const {error, client, userId} = await getAuthedClient();
  if (error) {
    return error;
  }
  if (!client || !userId) {
    return NextResponse.json({error: 'Auth context unavailable'}, {status: 401});
  }

  const {data, error: selectError} = await client
    .from('favorites')
    .select('iso2, created_at, note')
    .eq('user_id', userId)
    .order('created_at', {ascending: false});

  if (selectError) {
    return NextResponse.json({error: selectError.message}, {status: 500});
  }

  return NextResponse.json({data: data ?? []});
}

export async function POST(request: Request) {
  const {error, client, userId} = await getAuthedClient();
  if (error) {
    return error;
  }
  if (!client || !userId) {
    return NextResponse.json({error: 'Auth context unavailable'}, {status: 401});
  }

  const body = (await request.json()) as {iso2?: string; note?: string};
  const iso2 = body.iso2?.toUpperCase();

  if (!iso2 || iso2.length !== 2) {
    return NextResponse.json({error: 'Invalid iso2'}, {status: 400});
  }

  const {error: upsertError} = await client.from('favorites').upsert(
    {
      user_id: userId,
      iso2,
      note: body.note ?? null
    },
    {onConflict: 'user_id,iso2'}
  );

  if (upsertError) {
    return NextResponse.json({error: upsertError.message}, {status: 500});
  }

  return NextResponse.json({success: true});
}
