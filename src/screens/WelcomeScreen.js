
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";

export default function WelcomeScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const smallScreen = height < 740;

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          { minHeight: height - 35 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        <ImageBackground
          source={require("../../assets/welcome.png")}
          resizeMode="cover"
          style={[
            styles.backgroundImage,
            {
              height: width * 1.5,
              width: width,
            },
          ]}
          imageStyle={styles.imageStyle}
        />

       
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Ionicons
              name="calendar"
              size={23}
              color={colors.white}
            />
          </View>

          <Text style={styles.brand}>EventEase</Text>
        </View>

     
        <View style={styles.intro}>
          <Text
            style={[
              styles.title,
              smallScreen && styles.titleSmall,
            ]}
          >
            Vivez des{"\n"}
            <Text style={styles.highlight}>
              moments qui comptent
            </Text>
          </Text>

          <Text style={styles.subtitle}>
            Découvrez, créez et participez à des événements
            près de chez vous avec EventEase.
          </Text>
        </View>

       
        <View style={styles.imageSpace} />

      
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Login")}
          >
            <LinearGradient
              colors={[
                colors.primary,
                colors.primaryDark,
              ]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                Commencer
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color={colors.white}
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondary}>
              Créer un compte
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 22,
  },

  backgroundImage: {
    position: "absolute",
    top: 199,
    left: 0,
    
  },

  imageStyle: {
    opacity: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    paddingTop: 22,
    zIndex: 1,
  },

  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    fontSize: 21,
    fontWeight: "900",
    color: colors.primaryDark,
  },

  intro: {
    paddingHorizontal: 28,
    paddingTop: 55,
    zIndex: 1,
  },

  title: {
    fontSize: 35,
    lineHeight: 43,
    fontWeight: "900",
    color: colors.primary,
  },

  titleSmall: {
    fontSize: 30,
    lineHeight: 38,
  },

  highlight: {
    color: colors.text,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.muted,
    marginTop: 14,
    maxWidth: 290,
  },

  imageSpace: {
    flexGrow: 1,
    minHeight: 260,
  },

  footer: {
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 8,
    gap: 10,
    zIndex: 2,
    backgroundColor: colors.background,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },

  button: {
    height: 56,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },

  secondaryButton: {
    paddingVertical: 10,
    alignItems: "center",
  },

  secondary: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
