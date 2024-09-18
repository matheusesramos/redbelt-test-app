import { View, Text, Button, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Incident } from '../types/incident';
import { fetchIncidents } from '../api/incidents';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function HomeScreen() {
  const { authState, onLogout } = useAuth();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const loadIncidents = async () => {
        if (!authState.token) {
          setError("Token is required to fetch incidents.");
          return;
        }

        setLoading(true);
        setError(null);
        try {
          const data = await fetchIncidents(authState.token);
          setIncidents(data);
        } catch (error) {
          console.error(error);
          setError("Failed to load incidents. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      loadIncidents();

      // Optionally, you can return a cleanup function if needed
      return () => {
        setLoading(false);
        setError(null);
        setIncidents([]);
      };
    }, [authState.token])
  );


  return (
    <View className="flex-1 flex-col gap-y-8">
      <View style={{ paddingTop: insets.top }} className="bg-red-500">
        <View className="bg-red-500 px-6 py-6 flex flex-row items-center justify-between">
          <View className="flex flex-col gap-y-1">
            <Text className="text-white text-lg">Welcome, {authState.user?.name.split(' ')[0]}</Text>
            <Text className="text-white text-2xl font-bold">Incidents Manager</Text>
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

      <View className="flex-1 flex-col gap-y-8 relative"><View className="w-full flex-1">
        <TouchableOpacity onPress={() => navigate('NewIncident')} className='absolute z-20 bottom-12 right-12 w-16 h-16 bg-red-500 flex items-center justify-center rounded-full'>
          <Ionicons name='add' size={24} color="#FFFFFF" />
        </TouchableOpacity>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ef4444" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500 text-base text-center">{error}</Text>
          </View>
        ) : (
          <FlatList
            data={incidents}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View className='w-full'>
                <Text className='text-zinc-500'>No incidents to show</Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                className="rounded-md p-4 flex flex-row items-center gap-x-2 w-full bg-white shadow"
                activeOpacity={0.7}
                onPress={() => navigate('Incident', { incident: item })}
              >
                <View className='flex-1 flex-row items-center'>
                  <View className='mr-2'>
                    <Ionicons name="alert-circle" size={28} color="#ef4444" />
                  </View>
                  <View className="flex-col gap-y-1">
                    <Text className="text-base font-medium text-zinc-700">{item.name}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" className="text-zinc-400">{item.criticality}</Text>
                  </View>
                </View>

                <View>
                  <Ionicons name="chevron-forward" size={20} color="#ef4444" />
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48, gap: 16 }}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
      </View>
    </View>
  )
}