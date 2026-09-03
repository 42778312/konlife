import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Phone } from 'lucide-react-native';
import { colors, fonts, MIN_TOUCH, paperShadow, radius, space, type, webCursor } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { RidePlaceField } from '@/components/ride/RidePlaceField';
import type { RidePlace } from '@/components/ride/rideTypes';
import type { TaxiQuote } from '@/lib/api/taxi';
import { formatDuration, formatFare } from '@/lib/ride/format';
import { TARIFF_SOURCE } from '@/lib/ride/taxi';

type RideSheetProps = {
  fromText: string;
  toText: string;
  onFromChange: (text: string) => void;
  onToChange: (text: string) => void;
  onFromFocus: () => void;
  onToFocus: () => void;
  onLocate: () => void;
  suggestions: RidePlace[];
  onPick: (place: RidePlace) => void;
  quoting: boolean;
  quote: TaxiQuote | null;
  error: string | null;
  onCall: () => void;
};

export function RideSheet({
  fromText,
  toText,
  onFromChange,
  onToChange,
  onFromFocus,
  onToFocus,
  onLocate,
  suggestions,
  onPick,
  quoting,
  quote,
  error,
  onCall,
}: RideSheetProps) {
  const showSuggestions = suggestions.length > 0 && !quote;
  const showIntro = !fromText && !toText && !quoting && !quote && !error;

  return (
    <View style={[styles.plate, paperShadow]}>
      {showIntro ? (
        <Text style={styles.title} accessibilityRole="header">
          Get home from the night.
        </Text>
      ) : null}
      <View style={styles.fields}>
        <RidePlaceField
          kind="origin"
          value={fromText}
          onChangeText={onFromChange}
          onFocus={onFromFocus}
          placeholder="From"
          accessibilityLabel="Pickup"
          onLocate={onLocate}
          locateLabel="Use current location"
        />
        <RidePlaceField
          kind="destination"
          value={toText}
          onChangeText={onToChange}
          onFocus={onToFocus}
          placeholder="Where to?"
          accessibilityLabel="Drop-off"
        />
      </View>
      {showSuggestions ? (
        <View style={styles.suggest}>
          {suggestions.map((place) => (
            <Pressable
              key={place.id}
              onPress={() => onPick(place)}
              style={[styles.suggestRow, webCursor]}
              accessibilityRole="button"
              accessibilityLabel={place.label}
            >
              <Text style={styles.suggestLabel} numberOfLines={1}>
                {place.label}
              </Text>
              {place.detail ? (
                <Text style={styles.suggestDetail} numberOfLines={1}>
                  {place.detail}
                </Text>
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : null}
      {quoting ? <Skeleton style={styles.quoteSk} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {quote && !quoting ? (
        <View style={styles.quote}>
          <Text style={type.heroPrice}>{`About ${formatFare(quote.fare_eur)}`}</Text>
          <Text style={styles.meta}>
            {formatDuration(quote.duration_s)} · {quote.tariff_label}
          </Text>
          <Text style={styles.disclaimer}>{quote.disclaimer}</Text>
          <Button label="Call taxi" icon={Phone} onPress={onCall} accessibilityLabel="Choose a taxi to call" />
          <Text style={styles.source}>{TARIFF_SOURCE}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderRadius: radius['2xl'],
    padding: space.xl,
    gap: space.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  title: { ...type.section, fontSize: 22, lineHeight: 26 },
  fields: { gap: 8 },
  suggest: { gap: 2 },
  suggestRow: {
    minHeight: MIN_TOUCH,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  suggestLabel: { ...type.label },
  suggestDetail: { ...type.meta },
  quoteSk: { height: 88, borderRadius: radius.md },
  error: { ...type.meta, color: colors.rose },
  quote: { gap: 8 },
  meta: { ...type.meta },
  disclaimer: { ...type.meta, fontSize: 12, lineHeight: 16 },
  source: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: colors.muted,
    textAlign: 'center',
  },
});
