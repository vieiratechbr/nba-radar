import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type LoginScreenProps = {
  onRegister: () => void;
  onBack: () => void;
};

export function LoginScreen({ onRegister, onBack }: LoginScreenProps) {
  return (
    <View style={styles.screen}>
      <Logo />
      <Text style={styles.title}>Bem-vindo de volta.</Text>
      <Text style={styles.text}>Login será conectado ao Supabase Auth do projeto web.</Text>
      <TextInput placeholder="Email" placeholderTextColor={colors.textMuted} style={styles.input} />
      <TextInput placeholder="Senha" placeholderTextColor={colors.textMuted} secureTextEntry style={styles.input} />
      <Button>Entrar</Button>
      <Button variant="secondary" onPress={onRegister}>Criar conta</Button>
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
