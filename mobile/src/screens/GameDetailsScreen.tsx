import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type GameDetailsScreenProps = {
  onBack: () => void;
};

export function GameDetailsScreen({ onBack }: GameDetailsScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>Detalhes do jogo</Text>
      <Text style={styles.title}>Central da partida</Text>
      <View style={styles.scoreCard}>
        <Text style={styles.team}>Visitante</Text>
        <Text style={styles.score}>108 x 112</Text>
        <Text style={styles.team}>Mandante</Text>
      </View>
      <Text style={styles.text}>Próxima etapa: consumir `/api/games/:id`, lances, box score e highlights do backend web.</Text>
      <Button variant="secondary" onPress={onBack}>Voltar</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg
  },
  kicker: {
    color: colors.primary,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900"
  },
  scoreCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md
  },
  team: {
    color: colors.textMuted,
    fontWeight: "800"
  },
  score: {
    color: colors.text,
    fontSize: 38,
    fontWeight: "900"
  },
  text: {
    color: colors.textMuted,
    lineHeight: 22
  }
});
