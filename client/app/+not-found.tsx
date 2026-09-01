import { useRouter, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, space, type } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Not found', headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>This night isn’t on the list.</Text>
        <Button label="Back home" onPress={() => router.replace('/')} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.metal,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space['2xl'],
    gap: 16,
  },
  title: {
    ...type.section,
    color: colors.fg,
    textAlign: 'center',
  },
});
