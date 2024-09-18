import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Incident } from '../types/incident';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deleteIncident } from '../api/incidents';

type IncidentParamsProps = {
  incident: Incident;
}

export default function IncidentScreen() {
  const { incident } = useRoute().params as IncidentParamsProps;
  const { authState, onLogout } = useAuth();
  const insets = useSafeAreaInsets();
  const { navigate, goBack } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (!authState.token) {
      setError("Token is required to save the incident.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      deleteIncident(authState.token, id);
      alert("Incident deleted successfully!");
      await new Promise(resolve => setTimeout(resolve, 1000));
      goBack();
    } catch (error) {
      // console.error("Failed to create incident:", error);
      setError("Failed to delete incident. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 flex-col gap-y-8">
      <View style={{ paddingTop: insets.top }} className="bg-red-500">
        <View className="bg-red-500 px-6 py-6 flex flex-row items-center justify-between">
          <View className='flex flex-row items-center'>
            <TouchableOpacity className='mr-4' onPress={() => goBack()}>
              <Ionicons name="arrow-back" size={24} color={"#FFFFFF"} />
            </TouchableOpacity>
            <View className="flex flex-col gap-y-1">
              <Text className="text-white text-xl font-bold">Incident details</Text>
            </View>
          </View>
          <View className="flex flex-row gap-x-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onLogout}
            >
              <Ionicons name="log-out-outline" size={30} color={"#FFFFFF"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-1 flex-col gap-y-8 px-6">
        <View className="w-full p-6 bg-white rounded-lg flex flex-col gap-y-6">
          <View className='flex flex-col gap-y-1'>
            <Text className='text-zinc-400'>Incident</Text>
            <Text className='text-zinc-500 text-base'>{incident.name}</Text>
          </View>
          <View className='flex flex-col gap-y-1'>
            <Text className='text-zinc-400'>Evidence</Text>
            <Text className='text-zinc-500 text-base'>{incident.evidence}</Text>
          </View>

          <View className='flex flex-col gap-y-1'>
            <Text className='text-zinc-400'>Criticality</Text>
            <Text className='text-zinc-500 text-base'>{incident.criticality}</Text>
          </View>

          <View className='flex flex-col gap-y-1'>
            <Text className='text-zinc-400'>Host</Text>
            <Text className='text-zinc-500 text-base'>{incident.host}</Text>
          </View>

          <View className='flex flex-col gap-y-3'>
            <TouchableOpacity
              activeOpacity={0.75}
              className="w-full h-14 bg-red-500 items-center justify-center rounded-md"
              onPress={() => navigate('EditIncident', { incident: incident })}
            >
              <Text className="text-base text-white font-bold">
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              className="w-full h-14 bg-red-500 items-center justify-center rounded-md"
              onPress={() => handleDelete(incident.id)}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base text-white font-bold">
                  Delete
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}