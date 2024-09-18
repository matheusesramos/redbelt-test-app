import { View, Text, StyleSheet, Image, TextInput, Button, useWindowDimensions, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Controller, useForm } from "react-hook-form";
import GTSLogoLetter from '../../assets/images/gts-logo-letter.png';
import HeaderImage from '../../assets/images/header.png'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

type FormData = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

const RegisterScreen = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { onRegister } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>()
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);

  const register = async (data: FormData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = await onRegister!(data.name, data.email, data.password, data.password_confirmation);
    alert("Registration completed successfully!");
    setLoading(false);
    navigate('Login');

    if (result && result.error) {
      alert(result.msg);
    }
  }

  return (
    <View
      style={{
        paddingBottom: insets.bottom,
      }}
      className="flex-1"
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ display: 'flex', flexGrow: 1 }}
        extraScrollHeight={36}
        enableOnAndroid
      >
        <View className="flex-1 bg-zinc-100 items-center justify-center w-full px-8 gap-y-12">
          <View>
            <Text className='text-4xl font-light uppercase text-zinc-900'>Incidents<Text className='font-black text-red-500'>App</Text></Text>
          </View>
          <View className='w-full gap-y-4'>
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
                      <Ionicons name="person-outline" color="#ef4444" size={20} />
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
                  required: 'Email required',
                  pattern: {
                    message: 'Invalid email',
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
                  },
                }}
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <View className="w-full flex-row bg-white rounded-md">
                    <View className="px-4 h-14 items-center justify-center rounded-l-md">
                      <Ionicons name="at-outline" color="#ef4444" size={20} />
                    </View>
                    <TextInput
                      placeholder="E-mail"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      className="flex-1 h-14 pr-4 py-2 text-base rounded-r-md"
                    />
                  </View>
                )}
              />
              {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
            </View>

            <View className="flex flex-col gap-y-2">
              <Controller
                rules={{ required: 'Password required' }}
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <View className="w-full flex-row bg-white rounded-md">
                    <View className="px-4 h-14 items-center justify-center rounded-l-md">
                      <Ionicons name="lock-open-outline" color="#ef4444" size={20} />
                    </View>
                    <TextInput
                      placeholder="Password"
                      value={value}
                      onChangeText={onChange}
                      className="flex-1 h-14 pr-4 py-2 text-base rounded-r-md"
                      secureTextEntry
                    />
                  </View>
                )}
              />
              {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}
            </View>

            <View className="flex flex-col gap-y-2">
              <Controller
                rules={{ required: 'Password confirmation required' }}
                control={control}
                name="password_confirmation"
                render={({ field: { value, onChange } }) => (
                  <View className="w-full flex-row bg-white rounded-md">
                    <View className="px-4 h-14 items-center justify-center rounded-l-md">
                      <Ionicons name="lock-open-outline" color="#ef4444" size={20} />
                    </View>
                    <TextInput
                      placeholder="Password confirmation"
                      value={value}
                      onChangeText={onChange}
                      className="flex-1 h-14 pr-4 py-2 text-base rounded-r-md"
                      secureTextEntry
                    />
                  </View>
                )}
              />
              {errors.password_confirmation && <Text className="text-red-500">{errors.password_confirmation.message}</Text>}
            </View>

            <View className="w-full items-center gap-y-6">
              <TouchableOpacity
                activeOpacity={0.75}
                className="w-full h-14 bg-red-500 items-center justify-center rounded-md"
                onPress={handleSubmit(register)}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-base text-white font-bold">
                    Register
                  </Text>
                )}
              </TouchableOpacity>

              <Pressable onPress={() => navigate('Login')}>
                <Text className="font-bold text-gts-blue-300 text-base">
                  I already have an account
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default RegisterScreen