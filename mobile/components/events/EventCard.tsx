import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark, Heart } from 'lucide-react-native';
import { EventItem } from '@/data/mockEvents';
import { colors, fonts, hitSlop, radius } from '@/constants/theme';
import { useCardCovered, useEventExpand } from '@/context/EventExpandContext';
import { measureView } from '@/lib/measure';
import { PressableScale } from '@/components/ui/PressableScale';
import { RemoteImage } from '@/components/ui/RemoteImage';

type EventCardProps = {
  event: EventItem;
  variant?: 'hero' | 'horizontal' | 'list';
  instanceId?: string;
};

export function EventCard({ event, variant = 'list', instanceId: instanceIdProp }: EventCardProps) {
  const instanceId = instanceIdProp ?? `mobile-${variant}`;
  const covered = useCardCovered(event.id, instanceId);
  const { openEvent } = useEventExpand();
  const ref = useRef<View>(null);
  const radiusValue = variant === 'hero' ? 24 : 16;

  const onOpen = async () => {
    const rect = await measureView(ref, radiusValue);
    openEvent(event.id, instanceId, rect);
  };

  if (variant === 'hero') {
    return (
      <View
        ref={ref}
        collapsable={false}
        style={[styles.heroOuter, covered && styles.covered]}
      >
        <PressableScale onPress={onOpen} style={styles.heroPress} contentStyle={styles.heroInner} accessibilityLabel={event.title}>
          <RemoteImage uri={event.image} alt={event.title} containerStyle={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
            locations={[0.2, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroMeta}>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.heroVenue}>{event.venue}</Text>
            <Text style={styles.heroDate}>{event.date}</Text>
            <View style={styles.heroRow}>
              <View style={styles.tagPill}>
                <Text style={styles.tagPillText}>{event.tags.join(' · ')}</Text>
              </View>
              <Text style={styles.heroPrice}>{event.price}</Text>
            </View>
          </View>
        </PressableScale>
      </View>
    );
  }

  if (variant === 'horizontal') {
    return (
      <View
        ref={ref}
        collapsable={false}
        style={[styles.hOuter, covered && styles.covered]}
      >
        <PressableScale onPress={onOpen} style={styles.hPress} contentStyle={styles.hInner} accessibilityLabel={event.title}>
          <RemoteImage uri={event.image} alt={event.title} containerStyle={styles.hImage} />
          <View style={styles.hBody}>
            <View>
              <Text style={styles.hTitle} numberOfLines={1}>
                {event.title}
              </Text>
              <Text style={styles.hVenue}>{event.venue}</Text>
            </View>
            <View style={styles.hRow}>
              <Text style={styles.hPrice}>{event.price}</Text>
              <Pressable hitSlop={hitSlop} style={styles.iconBtn} accessibilityLabel="Save event">
                <Bookmark size={16} color={colors.zinc400} strokeWidth={2} />
              </Pressable>
            </View>
          </View>
        </PressableScale>
      </View>
    );
  }

  return (
    <View ref={ref} collapsable={false} style={[styles.listOuter, covered && styles.covered]}>
      <PressableScale onPress={onOpen} style={styles.listPress} contentStyle={styles.listInner} accessibilityLabel={event.title}>
        <RemoteImage uri={event.image} alt={event.title} containerStyle={styles.listImage} />
        <View style={styles.listBody}>
          <View>
            <View style={styles.listTitleRow}>
              <Text style={styles.listTitle} numberOfLines={1}>
                {event.title}
              </Text>
              <Pressable hitSlop={hitSlop} style={styles.iconBtn} accessibilityLabel="Like event">
                <Heart size={18} color={colors.zinc400} strokeWidth={2} />
              </Pressable>
            </View>
            <Text style={styles.listVenue}>{event.venue}</Text>
            <Text style={styles.listMeta}>📅 {event.date}</Text>
            <Text style={styles.listPrice}>🏷️ {event.price}</Text>
          </View>
          <View style={styles.listTags}>
            {event.tags.map((tag) => (
              <View key={tag} style={styles.listTag}>
                <Text style={styles.listTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  covered: {
    opacity: 0,
  },
  heroOuter: {
    width: '100%',
    height: 380,
  },
  heroPress: {
    flex: 1,
    minHeight: 380,
  },
  heroInner: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.zinc800,
  },
  heroMeta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.white,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroVenue: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.zinc300,
    marginBottom: 2,
  },
  heroDate: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.zinc400,
    marginBottom: 12,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagPill: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: colors.zinc700,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  tagPillText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.zinc300,
  },
  heroPrice: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.neon,
    letterSpacing: 0.8,
  },
  hOuter: {
    width: 170,
    height: 268,
  },
  hPress: {
    width: 170,
    minHeight: 268,
  },
  hInner: {
    flex: 1,
    height: 268,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.zinc800,
    borderRadius: 16,
    overflow: 'hidden',
  },
  hImage: {
    height: 176,
    width: '100%',
  },
  hBody: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  hTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  hVenue: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.zinc400,
    marginTop: 2,
  },
  hRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  hPrice: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.neon,
  },
  listOuter: {
    height: 144,
  },
  listPress: {
    minHeight: 144,
  },
  listInner: {
    height: 144,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'rgba(39, 39, 42, 0.8)',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  listImage: {
    width: 144,
    height: '100%',
  },
  listBody: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  listTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 4,
  },
  listTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  listVenue: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.zinc400,
    marginTop: 2,
  },
  listMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.zinc400,
    marginTop: 4,
  },
  listPrice: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.neon,
    marginTop: 4,
  },
  listTags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  listTag: {
    backgroundColor: colors.zinc900,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  listTagText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: colors.neon,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    cursor: 'pointer',
  },
});
