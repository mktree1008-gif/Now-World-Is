import {NextResponse} from 'next/server';
import {getCountryPhotos} from '@/lib/api/photos';
import {mockCountrySummaries} from '@/lib/data/mock-countries';

export async function GET(
  _request: Request,
  {params}: {params: Promise<{iso2: string}>}
) {
  const {iso2} = await params;
  const country = mockCountrySummaries.find((item) => item.iso2 === iso2.toUpperCase());
  const photos = await getCountryPhotos(country?.englishName ?? iso2, iso2.toUpperCase());

  return NextResponse.json({
    data: photos,
    fallback: photos[0]?.source === 'fallback'
  });
}
