import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../components/Button";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type RegisterScreenProps = {
  onBack: () => void;
  onFavoriteTeam: () => void;
};

export function RegisterScreen({ onBack, onFavoriteTeam }: RegisterScreenProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Crie sua conta.</Text>
      <Text style={styles.text}>Estrutura pronta para conectar cadastro Supabase e onboarding do time favorito.</Text>
      <TextInput placeholder="Nome" placeholderTextColor={colors.textMuted} style={styles.input} />
      <TextInput placeholder="Email" placeholderTextColor={colors.textMuted} style={styles.input} />
      <TextInput placeholder="Senha" placeholderTextColor={colors.textMuted} secureTextEntry style={styles.input} />
      <Button onPress={onFavoriteTeam}>Continuar</Button>
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 14,
    padding: spacing.lg
  }
});
