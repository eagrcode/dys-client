import CreateGroup from "@/components/ui/create-group";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export default function OnboardingCreateGroup() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <CreateGroup />;
}
