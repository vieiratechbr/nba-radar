import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type GameCardProps = {
  homeTeam: string;
  visitorTeam: string;
  status: string;
  score?: string;
};

export function GameCard({ homeTeam, visitorTeam, status, score = "Pré-jogo" }: GameCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.status}>{status}</Text>
      <Text style={styles.matchup}>{visitorTeam}</Text>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.matchup}>{homeTeam}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm
  },
  status: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  matchup: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  score: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700"
  }
});
