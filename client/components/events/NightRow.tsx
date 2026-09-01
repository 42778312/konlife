import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import type { EventItem } from '@/data/mockEvents';
import { colors, fonts, MIN_TOUCH, type, webCursor } from '@/constants/theme';
import { useEventExpand } from '@/context/EventExpandContext';
import { useSavedEvents } from '@/context/SavedEventsProvider';
import { measureView } from '@/lib/measure';
import { successTick } from '@/lib/haptics';

type NightRowProps = {
  event: EventItem;
  instanceId?: string;
  showTime?: boolean;
};

export function NightRow({ event, instanceId = 'row', showTime = false }: NightRowProps) {
  const { openEvent } = useEventExpand();
  const { isSaved, toggleSaved } = useSavedEvents();
  const saved = isSaved(event.id);
  const ref = useRef<View>(null);

  const onOpen = async () => {
    const rect = await measureView(ref, 0);
    openEvent(event.id, instanceId, rect);
  };

  return (
    <View ref={ref} collapsable={false} style={[styles.row, saved && styles.marked]}>
      <Pressable
        onPress={onOpen}
        style={[styles.main, webCursor]}
        accessibilityRole="button"
        accessibilityLabel={`${event.title} at ${event.venue}, ${event.time}, ${event.price}`}
      >
        {showTime ? <Text style={styles.inlineTime}>{event.time}</Text> : null}
        <View style={styles.copy}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.venue}>{event.venue}</Text>
        </View>
        <Text style={styles.price}>{event.price}</Text>
        <ArrowRight size={16} color={colors.ink} strokeWidth={2} />
      </Pressable>
      <Pressable
        onPress={() => {
          toggleSaved(event.id);
          successTick();
        }}
        style={[styles.mark, webCursor]}
        accessibilityRole="button"
        accessibilityState={{ selected: saved }}
        accessibilityLabel={saved ? `Remove ${event.title} from weekend` : `Mark ${event.title} I'm going`}
      >
        <View style={[styles.markSwatch, saved && styles.markOn]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.rule,
    minHeight: 72,
  },
  marked: {
    backgroundColor: colors.highlighter,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 4,
    minHeight: MIN_TOUCH,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...type.title,
  },
  venue: {
    ...type.meta,
    marginTop: 2,
  },
  price: {
    ...type.label,
    minWidth: 40,
    textAlign: 'right',
  },
  inlineTime: {
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 20,
    width: 52,
    color: colors.ink,
  },
  mark: {
    width: MIN_TOUCH,
    minHeight: MIN_TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markSwatch: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: colors.ink,
    backgroundColor: 'transparent',
  },
  markOn: {
    backgroundColor: colors.ink,
  },
});
