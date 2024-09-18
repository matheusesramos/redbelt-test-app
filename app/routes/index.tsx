import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AuthStack } from './AuthStack'
import { AppStack } from './AppStack'
import { useAuth } from '../context/AuthContext'

export function Router() {
  const { authState } = useAuth()

  return (
    <NavigationContainer>
      {authState.authenticated ? <AppStack /> : <AuthStack />}
      {/* <AuthStack /> */}
    </NavigationContainer>
  )
}
