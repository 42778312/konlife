import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { EventItem } from '@/data/mockEvents';
import { colors, fonts, space, type } from '@/constants/theme';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { IconButton } from '@/components/ui/IconButton';
import { EventDetailBody } from '@/components/events/EventDetailBody';
import { shareNight } from '@/lib/shareNight';

type EventDetailViewProps = {
  event: EventItem;
  onClose?: () => void;
  embedded?: boolean;
};

export function EventDetailView({ event, onClose }: EventDetailViewProps) {
  const insets = useSafeAreaInsets();

  const onShare = () => {
    void shareNight(event);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: space['4xl'] + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <RemoteImage uri={event.image} alt={event.title} containerStyle={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(22,22,22,0.35)', 'transparent', colors.overlayHeavy]}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
            <IconButton icon={ArrowLeft} variant="surface" size={18} color={colors.fg} accessibilityLabel="Close event" onPress={onClose} />
            <IconButton icon={Share2} variant="surface" size={18} color={colors.fg} accessibilityLabel="Share night" onPress={onShare} />
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.when}>{event.date}</Text>
            <Text style={styles.title} accessibilityRole="header">
              {event.title}
            </Text>
            <Text style={styles.venue}>
              {event.venue} · {event.city}
            </Text>
          </View>
        </View>

        <EventDetailBody event={event} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  hero: { width: '100%', height: 420, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
  },
  heroMeta: { padding: space.xl, gap: 6 },
  when: { ...type.overline, color: colors.highlighter },
  title: {
    fontFamily: fonts.displayBlack,
    fontSize: 44,
    lineHeight: 46,
    color: colors.fg,
  },
  venue: { ...type.title, color: colors.subtle },
});
