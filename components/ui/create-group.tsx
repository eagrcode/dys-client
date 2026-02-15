import { StyleSheet, Pressable, View, Alert, TextInput, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import { useCreateGroup } from "@/hooks/queries/useCreateGroup";
import { ApiErrorResponse } from "@/utils/types/ApiError";

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { mutate: createGroup, isPending: isCreating, isError, error } = useCreateGroup();

  const handleSetFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleCreateGroupPress = async () => {
    if (!formData.name || !formData.description) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    console.log("Create Group pressed with data:", formData);
    createGroup({ name: formData.name, description: formData.description });

    if (isError) {
      console.error(error.message, JSON.stringify(error, null, 2));
    }
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
          editable={!isCreating}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={formData.description}
          onChangeText={(content) => handleSetFormData("description", content)}
          inputMode="text"
          editable={!isCreating}
        />
        {isError && error.errors && formData.name && formData.description
          ? error.errors.map((err, index) => (
              <ThemedText key={index} style={{ color: "red" }}>
                {err.msg}
              </ThemedText>
            ))
          : isError && <ThemedText>{error?.message}</ThemedText>}

        <Pressable
          onPress={handleCreateGroupPress}
          disabled={isCreating || !formData.name || !formData.description}
          style={styles.submitBtn}
        >
          <ThemedText type="defaultSemiBold">{isCreating ? "Submitting..." : "Submit"}</ThemedText>
          <View style={{ position: "absolute", right: 16 }}>
            {isCreating ? (
              <ActivityIndicator size="small" />
            ) : (
              <ThemedText type="subtitle">{">"}</ThemedText>
            )}
          </View>
        </Pressable>
      </View>
    </ThemedView>
  );
};

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
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#0044ff",
    borderRadius: 8,
  },
});

export default CreateGroup;
