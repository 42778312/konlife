import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { EventItem } from '@/data/mockEvents';
import { colors, layout, type } from '@/constants/theme';
import { groupByHour } from '@/lib/groupByHour';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { NightRow } from '@/components/events/NightRow';

export function TimeSpine({
  events,
  instanceId,
}: {
  events: EventItem[];
  instanceId?: string;
}) {
  const groups = groupByHour(events);
  const { desktop } = useBreakpoint();

  if (groups.length === 0) {
    return null;
  }

  return (
    <View>
      {groups.map((group) => (
        <View key={group.hour} style={styles.group}>
          <View style={[styles.rail, !desktop && styles.railCompact]}>
            <Text style={[type.hour, !desktop && styles.hourCompact]}>{group.hour}</Text>
          </View>
          <View style={styles.nights}>
            {group.events.map((event) => (
              <NightRow key={event.id} event={event} instanceId={instanceId} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.rule,
  },
  rail: {
    width: layout.railWidth,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 16,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.rule,
  },
  railCompact: {
    width: layout.railWidthCompact,
    paddingLeft: 12,
  },
  hourCompact: {
    fontSize: 28,
    lineHeight: 28,
  },
  nights: {
    flex: 1,
    minWidth: 0,
  },
});
