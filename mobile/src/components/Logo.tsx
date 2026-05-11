import { Image, StyleSheet, View } from "react-native";

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <View style={styles.wrapper}>
      <Image
        source={compact ? require("../../assets/logos/logo.png") : require("../../assets/logos/logotext.png")}
        style={compact ? styles.compact : styles.full}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "flex-start"
  },
  full: {
    width: 180,
    height: 58
  },
  compact: {
    width: 48,
    height: 48
  }
});
