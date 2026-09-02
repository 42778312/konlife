import { Platform, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { eventShareUrl, shareOrigin } from './shareId.ts';
import type { EventItem } from '../data/mockEvents.ts';

export type ShareNightResult = 'shared' | 'copied' | 'cancelled' | 'failed';

function isAbort(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const name = 'name' in error ? String(error.name) : '';
  return name === 'AbortError';
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to execCommand
  }
  if (typeof document === 'undefined') return false;
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'fixed';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.focus();
  el.select();
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(el);
  }
}

export function nightShareText(event: EventItem): { title: string; text: string; url: string } {
  const origin = shareOrigin() || Linking.createURL('/').replace(/\/+$/, '');
  const url = eventShareUrl(event.id, origin);
  return {
    title: event.title,
    text: `${event.title} · ${event.venue}, ${event.city} · ${event.date}`,
    url,
  };
}

async function shareOnWeb(payload: { title: string; text: string; url: string }): Promise<ShareNightResult> {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  if (nav && typeof nav.share === 'function') {
    const data = { title: payload.title, text: payload.text, url: payload.url };
    const allowed = typeof nav.canShare !== 'function' || nav.canShare(data);
    if (allowed) {
      try {
        await nav.share(data);
        return 'shared';
      } catch (error) {
        if (isAbort(error)) return 'cancelled';
      }
    }
  }
  return (await copyText(payload.url)) ? 'copied' : 'failed';
}

export async function shareNight(event: EventItem): Promise<ShareNightResult> {
  const payload = nightShareText(event);
  if (!payload.url) return 'failed';

  if (Platform.OS === 'web') {
    return shareOnWeb(payload);
  }

  try {
    const result = await Share.share(
      Platform.OS === 'ios'
        ? { title: payload.title, message: payload.text, url: payload.url }
        : { title: payload.title, message: `${payload.text}\n${payload.url}` },
    );
    if (result.action === Share.dismissedAction) return 'cancelled';
    return 'shared';
  } catch {
    return 'cancelled';
  }
}
