import { StyleSheet, Pressable, View, Alert, TextInput } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useState } from "react";
import { groupsAPI } from "@/services/api/groups";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function CreateGroup() {
  const { setSelectedGroup } = useGroupsProvider();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSetFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleCreateGroupPress = async () => {
    if (!formData.name || !formData.description) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    console.log("Create Group pressed with data:", formData);

    const res = await groupsAPI.createGroup(formData.name, formData.description);

    if (res.success) {
      Alert.alert("Success", "Group created successfully!");

      await SecureStore.setItemAsync("selectedGroup", JSON.stringify(res.data.group));
      setSelectedGroup(res.data.group);
      console.log("Group created and selected:", res.data);
      router.replace("/");
    } else {
      Alert.alert("Error", res.message || "Failed to create group.");
    }

    setFormData({
      name: "",
      description: "",
    });
  };

  return (
    <ThemedView style={styles.titleContainer}>
      <View style={styles.topContainer}>
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          Create a group
        </ThemedText>
      </View>

      <View style={{ width: "100%", gap: 16 }}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={(content) => handleSetFormData("name", content)}
          inputMode="text"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={formData.description}
          onChangeText={(content) => handleSetFormData("description", content)}
          inputMode="text"
        />
        <Pressable>
          <ThemedText
            style={{
              textAlign: "center",
              padding: 16,
              backgroundColor: "#007AFF",
              color: "#fff",
              borderRadius: 8,
            }}
            onPress={handleCreateGroupPress}
          >
            Create Group
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 64,
    paddingHorizontal: 16,
  },
  topContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  input: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#ffffff",
  },
});
