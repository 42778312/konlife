import { Link, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found', headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.kicker}>KONSTANZ</Text>
        <Text style={styles.title}>This screen doesn’t exist.</Text>
        <Link href="/" asChild>
          <Pressable style={styles.btn}>
            <Text style={styles.btnText}>Back home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  kicker: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.neon,
    letterSpacing: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
    marginBottom: 8,
  },
  btn: {
    backgroundColor: colors.neon,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: radius['2xl'],
    minHeight: 48,
    cursor: 'pointer',
  },
  btnText: {
    fontFamily: fonts.extrabold,
    fontSize: 14,
    color: colors.black,
  },
});
