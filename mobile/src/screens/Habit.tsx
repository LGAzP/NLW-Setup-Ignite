import { useEffect, useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { api } from "../lib/axios";
import dayjs from "dayjs";
import clsx from "clsx";

import { generateProgressPercentage } from "../utils/genereta-progress-percentage";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from "../components/HabitsEmpty";

interface Params {
  date: string;
}

interface habitsInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [habitsInfo, setHabitsInfo] = useState<habitsInfoProps | null>(null);
  const route = useRoute();
  const { date } = route.params as Params;
  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");
  const isDayInPast = parsedDate.endOf("day").isBefore(new Date());

  const habitsProgress = habitsInfo?.possibleHabits.length
    ? generateProgressPercentage(
        habitsInfo.possibleHabits.length,
        habitsInfo.completedHabits.length
      )
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);
      const response = await api.get("/day", { params: { date } });
      setHabitsInfo(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Ops",
        "Não foi possivel carregar as informações dos hábitos"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`);
    const isHabitAlreadyCompleted =
      habitsInfo!.completedHabits.includes(habitId);
    let completedHabits: string[] = [];
    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(
        (id) => id != habitId
      );
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }
    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    });
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-bg px-8 pt-16">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="font-extrabold text-3xl">{dayAndMonth}</Text>

        <ProgressBar progress={habitsProgress} />
        <View
          className={clsx("mt-6", {
            ["opacity-60"]: isDayInPast,
          })}
        >
          {habitsInfo?.possibleHabits ? (
            habitsInfo?.possibleHabits.map((habit) => {
              return (
                <CheckBox
                  key={habit.id}
                  title={habit.title}
                  checked={habitsInfo.completedHabits.includes(habit.id)}
                  onPress={() => handleToggleHabit(habit.id)}
                  disabled={isDayInPast}
                />
              );
            })
          ) : (
            <HabitsEmpty />
          )}
        </View>
        {isDayInPast && (
          <Text className="mt-10 text-center">
            Você não pode editar hábitos de uma data passada
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
