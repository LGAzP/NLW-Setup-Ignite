import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";

export function HabitsEmpty() {
  const { navigate } = useNavigation();
  return (
    <View>
      <Text className="text-zinc-400 text-base">
        Você ainda não está monitorando nenhum hábito{" "}
      </Text>
      <Text
        className="text-violet-400 text-base underline"
        onPress={() => navigate("new")}
      >
        comece cadastrando um.
      </Text>
    </View>
  );
}
