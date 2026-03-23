import {NextResponse} from 'next/server';
import {readBearerToken} from '@/lib/supabase/auth';
import {getSupabaseServerClientWithToken} from '@/lib/supabase/server';

export async function DELETE(
  _request: Request,
  {params}: {params: Promise<{iso2: string}>}
) {
  const {iso2} = await params;
  const token = await readBearerToken();

  if (!token) {
    return NextResponse.json({error: 'Login required'}, {status: 401});
  }

  const client = getSupabaseServerClientWithToken(token);
  if (!client) {
    return NextResponse.json({error: 'Supabase is not configured'}, {status: 503});
  }

  const {data: userData, error: userError} = await client.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({error: 'Invalid auth token'}, {status: 401});
  }

  const {error} = await client
    .from('favorites')
    .delete()
    .eq('user_id', userData.user.id)
    .eq('iso2', iso2.toUpperCase());

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }

  return NextResponse.json({success: true});
}
