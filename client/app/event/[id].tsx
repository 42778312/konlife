import { Redirect, useLocalSearchParams } from 'expo-router';
import { encodeEventShareId, firstSearchParam } from '@/lib/shareId';

export default function LegacyEventRedirect() {
  const id = firstSearchParam(useLocalSearchParams<{ id: string | string[] }>().id);
  if (!id) return <Redirect href="/" />;
  return <Redirect href={{ pathname: '/e/[code]', params: { code: encodeEventShareId(id) } }} />;
}
