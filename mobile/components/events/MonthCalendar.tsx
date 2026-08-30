import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { EventItem } from '@/data/mockEvents';
import {
  addMonthsYmd,
  formatMonthTitle,
  isWeekendYmd,
  monthGrid,
  monthKey,
  startOfMonthYmd,
} from '@/lib/partyInsider/dates';
import { selectionTick } from '@/lib/haptics';
import { useEventExpand } from '@/context/EventExpandContext';
import { colors, fonts, MIN_TOUCH, radius, type, webCursor } from '@/constants/theme';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const MAX_PILLS = 3;
const MAX_DOTS = 3;

type MonthCalendarProps = {
  monthYmd: string;
  selectedYmd: string;
  todayYmd: string;
  eventsByDay: Map<string, EventItem[]>;
  showTitles: boolean;
  onSelectDay: (ymd: string) => void;
  onMonthChange: (ymd: string) => void;
};

function dayNumber(ymd: string): string {
  return String(Number(ymd.slice(8, 10)));
}

function isFeatured(event: EventItem): boolean {
  return Boolean(event.isFeatured || event.isPopular);
}

export function MonthCalendar({
  monthYmd,
  selectedYmd,
  todayYmd,
  eventsByDay,
  showTitles,
  onSelectDay,
  onMonthChange,
}: MonthCalendarProps) {
  const { openEvent } = useEventExpand();
  const cells = useMemo(() => monthGrid(monthYmd), [monthYmd]);
  const title = formatMonthTitle(startOfMonthYmd(monthYmd));
  const onTodayMonth = monthKey(monthYmd) === monthKey(todayYmd);

  const go = (delta: number) => {
    selectionTick();
    onMonthChange(addMonthsYmd(monthYmd, delta));
  };

  const jumpToday = () => {
    selectionTick();
    onMonthChange(todayYmd);
    onSelectDay(todayYmd);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.month} accessibilityRole="header">
          {title}
        </Text>
        <View style={styles.nav}>
          {!onTodayMonth || selectedYmd !== todayYmd ? (
            <Pressable
              onPress={jumpToday}
              style={[styles.todayHit, webCursor]}
              accessibilityRole="button"
              accessibilityLabel="Jump to today"
            >
              <Text style={styles.todayLabel}>Today</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => go(-1)}
            style={[styles.chevron, webCursor]}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
          >
            <ChevronLeft size={22} color={colors.fg} strokeWidth={2.2} />
          </Pressable>
          <Pressable
            onPress={() => go(1)}
            style={[styles.chevron, webCursor]}
            accessibilityRole="button"
            accessibilityLabel="Next month"
          >
            <ChevronRight size={22} color={colors.fg} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((label, i) => (
          <Text key={`${label}-${i}`} style={[styles.weekday, i >= 4 && styles.weekendHead]}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid} accessibilityRole="grid">
        {cells.map((cell) => {
          const events = eventsByDay.get(cell.ymd) ?? [];
          const selected = cell.ymd === selectedYmd;
          const today = cell.ymd === todayYmd;
          const weekend = isWeekendYmd(cell.ymd);
          const count = events.length;
          const pills = showTitles ? events.slice(0, MAX_PILLS) : [];
          const extra = showTitles ? Math.max(0, count - MAX_PILLS) : 0;

          return (
            <Pressable
              key={cell.ymd}
              onPress={() => {
                selectionTick();
                onSelectDay(cell.ymd);
              }}
              style={[
                styles.cell,
                showTitles && styles.cellWide,
                weekend && cell.inMonth && styles.weekendCell,
                webCursor,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={
                count
                  ? `${cell.ymd}, ${count} ${count === 1 ? 'night' : 'nights'}`
                  : cell.ymd
              }
            >
              <View
                style={[
                  styles.numWrap,
                  today && styles.numToday,
                  selected && !today && styles.numSelected,
                  selected && today && styles.numToday,
                ]}
              >
                <Text
                  style={[
                    styles.num,
                    !cell.inMonth && styles.numOutside,
                    today && styles.numOnMark,
                    selected && !today && styles.numOnMarkDark,
                  ]}
                >
                  {dayNumber(cell.ymd)}
                </Text>
              </View>

              {showTitles ? (
                <View style={styles.pills}>
                  {pills.map((event) => (
                    <Pressable
                      key={`${event.id}-${event.time}`}
                      onPress={() => {
                        selectionTick();
                        onSelectDay(cell.ymd);
                        openEvent(event.id, `cal-${event.id}`);
                      }}
                      style={[styles.pill, isFeatured(event) ? styles.pillFeatured : styles.pillIdle, webCursor]}
                      accessibilityRole="button"
                      accessibilityLabel={`${event.time} ${event.title}`}
                    >
                      <Text
                        numberOfLines={1}
                        style={[styles.pillText, isFeatured(event) && styles.pillTextFeatured]}
                      >
                        {event.time} {event.title}
                      </Text>
                    </Pressable>
                  ))}
                  {extra > 0 ? <Text style={styles.more}>+{extra}</Text> : null}
                </View>
              ) : (
                <View style={styles.dots}>
                  {events.slice(0, MAX_DOTS).map((event, i) => (
                    <View
                      key={`${event.id}-${i}`}
                      style={[styles.dot, isFeatured(event) ? styles.dotFeatured : styles.dotIdle]}
                    />
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.rule,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: MIN_TOUCH,
  },
  month: {
    ...type.section,
    fontSize: 32,
    lineHeight: 36,
    flex: 1,
  },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  todayHit: {
    minHeight: MIN_TOUCH,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  todayLabel: {
    ...type.label,
    color: colors.highlighter,
  },
  chevron: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: { flexDirection: 'row' },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  weekendHead: { color: colors.subtle },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    minHeight: 56,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 8,
    gap: 4,
  },
  cellWide: {
    minHeight: 108,
    alignItems: 'stretch',
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  weekendCell: {
    backgroundColor: 'rgba(232, 255, 74, 0.04)',
  },
  numWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  numToday: { backgroundColor: colors.highlighter },
  numSelected: { backgroundColor: colors.fg },
  num: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.fg,
    fontVariant: ['tabular-nums'],
  },
  numOutside: { color: colors.zinc700 },
  numOnMark: { color: colors.accentFg },
  numOnMarkDark: { color: colors.bg },
  dots: {
    flexDirection: 'row',
    gap: 3,
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
  },
  dotFeatured: { backgroundColor: colors.highlighter },
  dotIdle: { backgroundColor: colors.subtle },
  pills: { gap: 3, flex: 1 },
  pill: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  pillFeatured: { backgroundColor: colors.highlighter },
  pillIdle: { backgroundColor: colors.cardAlt },
  pillText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg,
  },
  pillTextFeatured: { color: colors.accentFg, fontFamily: fonts.semibold },
  more: { ...type.meta, fontSize: 11, paddingHorizontal: 5 },
});
