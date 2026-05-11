import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { FavoriteTeamScreen } from "./src/screens/FavoriteTeamScreen";
import { GameDetailsScreen } from "./src/screens/GameDetailsScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { colors } from "./src/theme/colors";

type Screen = "home" | "login" | "register" | "favoriteTeam" | "gameDetails" | "profile";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {screen === "home" ? (
        <HomeScreen
          onOpenLogin={() => setScreen("login")}
          onOpenGame={() => setScreen("gameDetails")}
          onOpenProfile={() => setScreen("profile")}
        />
      ) : null}
      {screen === "login" ? (
        <LoginScreen onRegister={() => setScreen("register")} onBack={() => setScreen("home")} />
      ) : null}
      {screen === "register" ? (
        <RegisterScreen onBack={() => setScreen("login")} onFavoriteTeam={() => setScreen("favoriteTeam")} />
      ) : null}
      {screen === "favoriteTeam" ? (
        <FavoriteTeamScreen onBack={() => setScreen("home")} onProfile={() => setScreen("profile")} />
      ) : null}
      {screen === "gameDetails" ? (
        <GameDetailsScreen onBack={() => setScreen("home")} />
      ) : null}
      {screen === "profile" ? (
        <ProfileScreen onFavoriteTeam={() => setScreen("favoriteTeam")} onBack={() => setScreen("home")} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  }
});
