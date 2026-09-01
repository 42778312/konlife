import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import type { EventItem } from '@/data/mockEvents';
import { colors, MIN_TOUCH, radius, type, webCursor } from '@/constants/theme';
import { useCardCovered, useEventExpand } from '@/context/EventExpandContext';
import { useSavedEvents } from '@/context/SavedEventsProvider';
import { measureView } from '@/lib/measure';
import { successTick } from '@/lib/haptics';

type CalendarAgendaRowProps = {
  event: EventItem;
  featured?: boolean;
  instanceId?: string;
};

export function CalendarAgendaRow({ event, featured = false, instanceId: instanceIdProp }: CalendarAgendaRowProps) {
  const instanceId = instanceIdProp ?? `agenda-${event.id}`;
  const covered = useCardCovered(event.id, instanceId);
  const { openEvent } = useEventExpand();
  const { isSaved, toggleSaved } = useSavedEvents();
  const saved = isSaved(event.id);
  const ref = useRef<View>(null);

  const onOpen = async () => {
    const rect = await measureView(ref, radius.md);
    openEvent(event.id, instanceId, rect);
  };

  return (
    <View ref={ref} collapsable={false} style={covered ? styles.covered : undefined}>
      <Pressable
        onPress={onOpen}
        style={[styles.row, featured && styles.rowFeatured, webCursor]}
        accessibilityRole="button"
        accessibilityLabel={`${event.time} ${event.title} at ${event.venue}`}
      >
        <Text style={[styles.time, featured && styles.timeFeatured]}>{event.time}</Text>
        <View style={[styles.mark, featured ? styles.markFeatured : styles.markIdle]} />
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.venue} numberOfLines={1}>
            {event.venue}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            toggleSaved(event.id);
            successTick();
          }}
          style={[styles.save, webCursor]}
          accessibilityRole="button"
          accessibilityLabel={saved ? `Unsave ${event.title}` : `Save ${event.title}`}
        >
          <Bookmark
            size={18}
            color={saved ? colors.accentFg : colors.muted}
            fill={saved ? colors.highlighter : 'transparent'}
            strokeWidth={2.2}
          />
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  covered: { opacity: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    minHeight: MIN_TOUCH + 8,
  },
  rowFeatured: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 2,
  },
  time: {
    ...type.label,
    width: 52,
    color: colors.muted,
    fontVariant: ['tabular-nums'],
  },
  timeFeatured: { color: colors.highlighter },
  mark: {
    width: 4,
    alignSelf: 'stretch',
    minHeight: 36,
    borderRadius: 2,
  },
  markFeatured: { backgroundColor: colors.highlighter },
  markIdle: { backgroundColor: colors.zinc700 },
  body: { flex: 1, minWidth: 0, gap: 2 },
  title: { ...type.title },
  venue: { ...type.meta },
  save: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
