import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '@/constants/theme';
import { useEvents } from '@/context/EventsProvider';
import { useWebKeyboardInset } from '@/hooks/useWebKeyboardInset';
import { RideMap } from '@/components/ride/RideMap';
import { RideSheet } from '@/components/ride/RideSheet';
import { RideCallSheet } from '@/components/ride/RideCallSheet';
import type { RidePlace } from '@/components/ride/rideTypes';
import { ApiError } from '@/lib/api/client';
import { fetchTaxiQuote, pathToPoints, reverseRidePlace, searchRidePlaces, type TaxiQuote } from '@/lib/api/taxi';
import { getRideLocation } from '@/lib/ride/location';
import { taxiCallUrl, type TaxiCompany } from '@/lib/ride/taxi';
import { mergePlaces, venuePlaces } from '@/lib/ride/venues';
import { inRideBbox } from '@/lib/ride/bbox';
import { selectionTick } from '@/lib/haptics';

type Field = 'from' | 'to';

export function RideScreen() {
  const insets = useSafeAreaInsets();
  const kbInset = useWebKeyboardInset();
  const { events } = useEvents();

  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [from, setFrom] = useState<RidePlace | null>(null);
  const [to, setTo] = useState<RidePlace | null>(null);
  const [active, setActive] = useState<Field>('to');
  const [remote, setRemote] = useState<RidePlace[]>([]);
  const [quoting, setQuoting] = useState(false);
  const [quote, setQuote] = useState<TaxiQuote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plateH, setPlateH] = useState(220);
  const [callOpen, setCallOpen] = useState(false);

  const query = (active === 'from' ? fromText : toText).trim();
  const venues = useMemo(() => venuePlaces(events, query), [events, query]);
  const suggestions = useMemo(() => mergePlaces(venues, remote), [venues, remote]);

  useEffect(() => {
    if (query.length < 2) {
      setRemote([]);
      return;
    }
    let live = true;
    const timer = setTimeout(() => {
      void searchRidePlaces(query)
        .then((items) => {
          if (live) setRemote(items);
        })
        .catch(() => {
          if (live) setRemote([]);
        });
    }, 280);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (!from || !to) {
      setQuote(null);
      setQuoting(false);
      return;
    }
    let live = true;
    setQuoting(true);
    setError(null);
    void fetchTaxiQuote(from, to)
      .then((next) => {
        if (!live) return;
        setQuote(next);
        setQuoting(false);
      })
      .catch((err) => {
        if (!live) return;
        setQuote(null);
        setQuoting(false);
        if (err instanceof ApiError && err.status === 422) {
          setError('Stay around Konstanz — both ends need to be in the city.');
          return;
        }
        if (err instanceof ApiError && err.status === 404) {
          setError('No driving route for that trip. Try another pin.');
          return;
        }
        setError('Couldn’t find a drive. Try again in a moment.');
      });
    return () => {
      live = false;
    };
  }, [from, to]);

  const onFromChange = (text: string) => {
    setFromText(text);
    setActive('from');
    if (!from || text !== from.label) {
      setFrom(null);
      setQuote(null);
      setError(null);
    }
  };

  const onToChange = (text: string) => {
    setToText(text);
    setActive('to');
    if (!to || text !== to.label) {
      setTo(null);
      setQuote(null);
      setError(null);
    }
  };

  const onPick = (place: RidePlace) => {
    selectionTick();
    if (active === 'from') {
      setFrom(place);
      setFromText(place.label);
      setRemote([]);
      if (!to) setActive('to');
      return;
    }
    setTo(place);
    setToText(place.label);
    setRemote([]);
  };

  const onLocate = useCallback(async () => {
    selectionTick();
    const result = await getRideLocation();
    if (!result.ok) {
      setError(
        result.reason === 'denied'
          ? 'Location is off — type the pickup instead.'
          : 'Couldn’t read your location. Type the pickup.',
      );
      return;
    }
    if (!inRideBbox(result.lat, result.lng)) {
      setError('You’re outside Konstanz — type an address around the lake.');
      return;
    }
    try {
      const place = await reverseRidePlace(result.lat, result.lng);
      const next: RidePlace = place ?? {
        id: `here:${result.lat.toFixed(5)},${result.lng.toFixed(5)}`,
        label: 'Current location',
        lat: result.lat,
        lng: result.lng,
      };
      setFrom(next);
      setFromText(next.label);
      setError(null);
      if (!to) setActive('to');
    } catch {
      setFrom({
        id: `here:${result.lat.toFixed(5)},${result.lng.toFixed(5)}`,
        label: 'Current location',
        lat: result.lat,
        lng: result.lng,
      });
      setFromText('Current location');
    }
  }, [to]);

  const onCall = () => {
    selectionTick();
    setCallOpen(true);
  };

  const onPickCompany = (company: TaxiCompany) => {
    selectionTick();
    void Linking.openURL(taxiCallUrl(company.digits));
    setCallOpen(false);
  };

  const path = quote ? pathToPoints(quote.path) : null;
  const bottomPad = plateH;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={Platform.OS !== 'web'}
    >
      <View style={styles.map}>
        <RideMap origin={from} destination={to} path={path} bottomPad={bottomPad} />
      </View>
      <View
        style={[styles.sheetWrap, { paddingBottom: Math.max(insets.bottom, 12) + kbInset, paddingTop: space.sm }]}
        onLayout={(event) => setPlateH(event.nativeEvent.layout.height)}
      >
        <RideSheet
          fromText={fromText}
          toText={toText}
          onFromChange={onFromChange}
          onToChange={onToChange}
          onFromFocus={() => setActive('from')}
          onToFocus={() => setActive('to')}
          onLocate={() => void onLocate()}
          suggestions={from && to ? [] : suggestions}
          onPick={onPick}
          quoting={quoting}
          quote={quote}
          error={error}
          onCall={onCall}
        />
      </View>
      <RideCallSheet visible={callOpen} onClose={() => setCallOpen(false)} onPick={onPickCompany} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  map: { ...StyleSheet.absoluteFillObject },
  sheetWrap: {
    marginTop: 'auto',
    paddingHorizontal: space.lg,
    zIndex: 2,
  },
});
