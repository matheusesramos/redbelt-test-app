import { View, Text, TouchableOpacity, Pressable, ActivityIndicator, TextInput } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { editIncident, newIncident } from '../api/incidents';
import { Incident } from '../types/incident';

type FormData = {
  name: string
  evidence: string
  criticality: string
  host: string
}

type IncidentParamsProps = {
  incident: Incident;
}

export default function EditIncidentScreen() {
  const { incident } = useRoute().params as IncidentParamsProps;
  const { authState, onLogout } = useAuth();
  const insets = useSafeAreaInsets();
  const { navigate, goBack } = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: incident.name,
      evidence: incident.evidence,
      criticality: incident.criticality,
      host: incident.host,
    }
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (data: FormData) => {
    if (!authState.token) {
      setError("Token is required to save the incident.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const editedIncidentData = await editIncident(authState.token, data.name, data.evidence, data.criticality, data.host, incident.id);
      // console.log("Incident created successfully:", newIncidentData);
      alert("Incident updated successfully!");
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('Home');
    } catch (error) {
      console.error("Failed to create incident:", error);
      setError("Failed to update incident. Please try again later.");
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
              <Text className="text-white text-lg">Incidents Manager</Text>
              <Text className="text-white text-2xl font-bold">Edit Incident</Text>
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

      <View className="bg-zinc-100 w-full px-8 gap-y-4">
        <View className="flex flex-col gap-y-2">
          <Controller
            rules={{
              required: 'Name required'
            }}
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <View className="w-full flex-row bg-white rounded-md">
                <View className="px-4 h-14 items-center justify-center rounded-l-md">
                  <Ionicons name="book-outline" color="#ef4444" size={20} />
                </View>
                <TextInput
                  placeholder="Name"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  className="flex-1 h-14 pr-4 py-2 text-base rounded-r-md"
                />
              </View>
            )}
          />
          {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
        </View>

        <View className="flex flex-col gap-y-2">
          <Controller
            rules={{
              required: 'Evidence required'
            }}
            control={control}
            name="evidence"
            render={({ field: { value, onChange } }) => (
              <View className="w-full flex-row bg-white rounded-md">
                <View className="px-4 h-14 items-center justify-center rounded-l-md">
                  <Ionicons name="document-outline" color="#ef4444" size={20} />
                </View>
                <TextInput
                  placeholder="Evidence"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  className="flex-1 h-14 pr-4 py-2 text-base rounded-r-md"
                />
              </View>
            )}
          />
          {errors.evidence && <Text className="text-red-500">{errors.evidence.message}</Text>}
        </View>

        <View className="flex flex-col gap-y-2">
          <Controller
            rules={{ required: 'Criticality required' }}
            control={control}
            name="criticality"
            render={({ field: { value, onChange } }) => (
              <View className="w-full flex-row bg-white rounded-md">
                <View className="px-4 h-14 items-center justify-center rounded-l-md">
                  <Ionicons name="warning-outline" color="#ef4444" size={20} />
                </View>
                <TextInput
                  placeholder="Criticality"
                  value={value}
                  onChangeText={onChange}
                  className="flex-1 h-14 pr-4 py-2 text-base rounded-r-md"
                />
              </View>
            )}
          />
          {errors.criticality && <Text className="text-red-500">{errors.criticality.message}</Text>}
        </View>

        <View className="flex flex-col gap-y-2">
          <Controller
            rules={{ required: 'Host required' }}
            control={control}
            name="host"
            render={({ field: { value, onChange } }) => (
              <View className="w-full flex-row bg-white rounded-md">
                <View className="px-4 h-14 items-center justify-center rounded-l-md">
                  <Ionicons name="home-outline" color="#ef4444" size={20} />
                </View>
                <TextInput
                  placeholder="Host"
                  value={value}
                  onChangeText={onChange}
                  className="flex-1 h-14 pr-4 py-2 text-base rounded-r-md"
                />
              </View>
            )}
          />
          {errors.host && <Text className="text-red-500">{errors.host.message}</Text>}
        </View>

        <View className="w-full items-center gap-y-6">
          <TouchableOpacity
            activeOpacity={0.75}
            className="w-full h-14 bg-red-500 items-center justify-center rounded-md"
            onPress={handleSubmit(save)}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-base text-white font-bold">
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}