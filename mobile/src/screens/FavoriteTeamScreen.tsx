import { ScrollView, StyleSheet, Text } from "react-native";
import { Button } from "../components/Button";
import { TeamCard } from "../components/TeamCard";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type FavoriteTeamScreenProps = {
  onBack: () => void;
  onProfile: () => void;
};

const teams = [
  { name: "Los Angeles Lakers", abbreviation: "LAL" },
  { name: "Boston Celtics", abbreviation: "BOS" },
  { name: "Chicago Bulls", abbreviation: "CHI" },
  { name: "Golden State Warriors", abbreviation: "GSW" }
];

export function FavoriteTeamScreen({ onBack, onProfile }: FavoriteTeamScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Escolha seu time do coração.</Text>
      <Text style={styles.text}>A seleção será persistida no profile quando a integração mobile com Supabase for conectada.</Text>
      {teams.map((team) => (
        <TeamCard key={team.abbreviation} name={team.name} abbreviation={team.abbreviation} />
      ))}
      <Button onPress={onProfile}>Salvar e ver perfil</Button>
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
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900"
  },
  text: {
    color: colors.textMuted,
    lineHeight: 22
  }
});
