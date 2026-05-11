import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { GameCard } from "../components/GameCard";
import { Logo } from "../components/Logo";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type HomeScreenProps = {
  onOpenLogin: () => void;
  onOpenGame: () => void;
  onOpenProfile: () => void;
};

export function HomeScreen({ onOpenLogin, onOpenGame, onOpenProfile }: HomeScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Logo />
      <View style={styles.hero}>
        <Text style={styles.kicker}>Central NBA</Text>
        <Text style={styles.title}>Toda a NBA no seu bolso.</Text>
        <Text style={styles.description}>
          Placar, detalhes de jogos, conta, time favorito e notificações futuras em uma experiência mobile do NBA Radar.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button onPress={onOpenLogin}>Entrar</Button>
        <Button variant="secondary" onPress={onOpenProfile}>Meu radar</Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jogos de hoje</Text>
        <GameCard visitorTeam="NBA" homeTeam="Radar" status="Preparado para API" score="Rotas internas do web" />
        <Button variant="secondary" onPress={onOpenGame}>Abrir detalhe de jogo</Button>
      </View>
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
    gap: spacing.xl
  },
  hero: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    gap: spacing.md
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.4
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900"
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md
  },
  section: {
    gap: spacing.md
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  }
});
