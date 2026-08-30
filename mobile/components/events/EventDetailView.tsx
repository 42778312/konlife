import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  ExternalLink,
  GraduationCap,
  Heart,
  MapPin,
  Share2,
  Ticket,
} from 'lucide-react-native';
import { EventItem } from '@/data/mockEvents';
import { colors, fonts, hitSlop, radius } from '@/constants/theme';
import { EVENT_OVERLAY_FADE_MS } from '@/lib/eventMotion';
import { successTick } from '@/lib/haptics';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { MapWidget } from '@/components/events/MapWidget';
import { PressableScale } from '@/components/ui/PressableScale';

type EventDetailViewProps = {
  event: EventItem;
  onClose?: () => void;
  embedded?: boolean;
};

export function EventDetailView({ event, onClose, embedded }: EventDetailViewProps) {
  const insets = useSafeAreaInsets();
  const [isSaved, setIsSaved] = useState(false);
  const delay = embedded ? 180 : 0;

  const onShare = async () => {
    try {
      await Share.share({
        title: event.title,
        message: `${event.title} · ${event.venue}, ${event.city} · ${event.date}`,
      });
    } catch {
      // user cancelled
    }
  };

  return (
    <View style={styles.root}>
      <Animated.View
        entering={FadeIn.delay(delay).duration(EVENT_OVERLAY_FADE_MS)}
        style={[styles.topBar, { paddingTop: embedded ? 12 : Math.max(insets.top, 8) }]}
      >
        <Pressable
          onPress={onClose}
          hitSlop={hitSlop}
          style={styles.roundBtn}
          accessibilityLabel="Close event"
        >
          <ArrowLeft size={16} color={colors.white} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.topTitle}>Event Detail</Text>
        <Pressable
          onPress={() => {
            setIsSaved(true);
            successTick();
          }}
          hitSlop={hitSlop}
          style={styles.roundBtn}
          accessibilityLabel="Bookmark event"
        >
          <Bookmark size={16} color={colors.white} strokeWidth={2.4} fill={isSaved ? colors.white : 'transparent'} />
        </Pressable>
      </Animated.View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        bounces
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.hero}>
          <RemoteImage uri={event.image} alt={event.title} containerStyle={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
            locations={[0.25, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroMeta}>
            <Text style={styles.heroTitle}>{event.title}</Text>
            <View style={styles.tagRow}>
              {event.tags.map((tag) => (
                <View key={tag} style={styles.heroTag}>
                  <Text style={styles.heroTagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <View style={styles.venueRow}>
              <MapPin size={14} color={colors.neon} strokeWidth={2.4} />
              <Text style={styles.venueText}>{event.venue}</Text>
            </View>
          </View>
        </View>

        <Animated.View
          entering={FadeInDown.delay(delay + 80).duration(EVENT_OVERLAY_FADE_MS).springify().damping(18)}
          style={styles.stack}
        >
          <View style={styles.metaCard}>
            <MetaCell icon={Calendar} label="Date" value={event.fullDate ?? event.date} border />
            <MetaCell icon={Clock} label="Time" value={event.time} border />
            <MetaCell icon={Ticket} label="Price" value={event.price} border />
            <MetaCell icon={GraduationCap} label="Type" value={event.category} />
          </View>

          <View style={styles.descCard}>
            <Text style={styles.desc}>{event.description}</Text>
            <Pressable
              onPress={() => Linking.openURL('https://www.konstanz.de')}
              style={styles.linkRow}
              hitSlop={hitSlop}
            >
              <Text style={styles.linkText}>View original event</Text>
              <ExternalLink size={14} color={colors.neon} strokeWidth={2.2} />
            </Pressable>
          </View>

          <View style={styles.actions}>
            <PressableScale
              onPress={() => {
                setIsSaved(!isSaved);
                successTick();
              }}
              style={styles.saveBtn}
              contentStyle={styles.saveInner}
            >
              <Heart size={16} color={colors.black} strokeWidth={2.4} fill={isSaved ? colors.black : 'transparent'} />
              <Text style={styles.saveLabel}>{isSaved ? 'Saved' : 'Save'}</Text>
            </PressableScale>
            <PressableScale onPress={onShare} style={styles.shareBtn} contentStyle={styles.shareInner}>
              <Share2 size={16} color={colors.white} strokeWidth={2.2} />
              <Text style={styles.shareLabel}>Share</Text>
            </PressableScale>
          </View>

          <View style={styles.venueCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.venueTitle}>{event.venue}</Text>
              <Text style={styles.venueCity}>{event.city}</Text>
              <Pressable style={styles.linkRow} hitSlop={hitSlop}>
                <Text style={styles.linkText}>Open map</Text>
                <ExternalLink size={12} color={colors.neon} strokeWidth={2.2} />
              </Pressable>
            </View>
            <View style={styles.mapPreview}>
              <MapWidget venueName={event.venue} cityName={event.city} interactive={false} compact />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function MetaCell({
  icon: Icon,
  label,
  value,
  border,
}: {
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  label: string;
  value: string;
  border?: boolean;
}) {
  return (
    <View style={[styles.metaCell, border && styles.metaBorder]}>
      <Icon size={16} color={colors.neon} strokeWidth={2.2} />
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.zinc900,
    backgroundColor: colors.bg,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.zinc900,
    borderWidth: 1,
    borderColor: colors.zinc800,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  topTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  body: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  hero: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.zinc800,
    justifyContent: 'flex-end',
  },
  heroMeta: {
    padding: 16,
    gap: 8,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.white,
    letterSpacing: 1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroTag: {
    backgroundColor: colors.neon,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  heroTagText: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    color: colors.black,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  venueText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.zinc300,
  },
  stack: {
    gap: 16,
  },
  metaCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.zinc800,
    borderRadius: radius['2xl'],
    paddingVertical: 14,
    paddingHorizontal: 4,
    flexDirection: 'row',
  },
  metaCell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  metaBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.zinc800,
  },
  metaLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.zinc400,
  },
  metaValue: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
  descCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.zinc800,
    borderRadius: radius['2xl'],
    padding: 16,
    gap: 12,
  },
  desc: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.zinc300,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 32,
    cursor: 'pointer',
  },
  linkText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.neon,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveBtn: {
    flex: 1,
    minHeight: 48,
  },
  saveInner: {
    minHeight: 48,
    backgroundColor: colors.neon,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 14,
    color: colors.black,
  },
  shareBtn: {
    flex: 1,
    minHeight: 48,
  },
  shareInner: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.zinc700,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.white,
  },
  venueCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.zinc800,
    borderRadius: radius['2xl'],
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  venueTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  venueCity: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.zinc400,
    marginTop: 2,
  },
  mapPreview: {
    width: 128,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.zinc800,
  },
});
