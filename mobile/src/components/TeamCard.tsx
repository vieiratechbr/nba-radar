import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type TeamCardProps = {
  name: string;
  abbreviation: string;
  selected?: boolean;
  onPress?: () => void;
};

export function TeamCard({ name, abbreviation, selected = false, onPress }: TeamCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.selected]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{abbreviation}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  selected: {
    borderColor: colors.primary
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239,23,42,0.18)"
  },
  badgeText: {
    color: colors.text,
    fontWeight: "900"
  },
  name: {
    color: colors.text,
    fontWeight: "800"
  }
});
