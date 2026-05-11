import { StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type ProfileScreenProps = {
  onFavoriteTeam: () => void;
  onBack: () => void;
};

export function ProfileScreen({ onFavoriteTeam, onBack }: ProfileScreenProps) {
  return (
    <View style={styles.screen}>
      <Logo compact />
      <Text style={styles.title}>Seu Radar</Text>
      <Text style={styles.text}>Área preparada para conta, time favorito, próximos jogos, últimos resultados e notificações futuras.</Text>
      <View style={styles.card}>
        <Text style={styles.kicker}>Time favorito</Text>
        <Text style={styles.team}>A definir</Text>
      </View>
      <Button onPress={onFavoriteTeam}>Escolher time</Button>
      <Button variant="secondary" onPress={onBack}>Voltar</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    gap: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900"
  },
  text: {
    color: colors.textMuted,
    lineHeight: 22
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl
  },
  kicker: {
    color: colors.primary,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  team: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: spacing.sm
  }
});
