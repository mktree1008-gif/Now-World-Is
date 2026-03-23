import type {SupportedLocale} from '@/lib/types';
import {ProfilePanel} from '@/components/profile-panel';

export default async function ProfilePage({params}: {params: Promise<{locale: SupportedLocale}>}) {
  await params;
  return <ProfilePanel />;
}
