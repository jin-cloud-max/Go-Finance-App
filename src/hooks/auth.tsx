import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthProviderProps {
   children: ReactNode;
}

interface User {
   id: string;
   name: string;
   email: string;
   photo?: string;
}

interface IAuthContextData {
   user: User;
   signInWithGoogle(): Promise<void>;
   signInWithApple(): Promise<void>;
   signOut(): Promise<void>;
   userStorageLoading: boolean;
}

const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
   const [user, setUser] = useState<User>({} as User)
   const [userStorageLoading, setUserStorageLoading] = useState(true)

   const userStorageKey = '@gofinance:user'

   async function signInWithGoogle() {
      try {
         const result = await Google.logInAsync({
            iosClientId: '482820331262-m5htrh3n76cvv80038399uvqbjl89r48.apps.googleusercontent.com',
            androidClientId: '482820331262-t4n5pqdj1m6kpss5vmue82imjepq92i5.apps.googleusercontent.com',
            scopes: ['profile', 'email']
         })

         if (result.type === 'success') {
            const userLogged = {
               id: String(result.user.id),
               email: result.user.email!,
               name: result.user.name!,
               photo: result.user.photoUrl!
            }

            setUser(userLogged)
            await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
         }

      } catch (error) {
         throw new Error(error)
      }
   }

   async function signInWithApple() {
      try {
         const credentials = await AppleAuthentication.signInAsync({
            requestedScopes: [
               AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
               AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ]
         })

         if (credentials) {
            const name = credentials.fullName!.givenName!
            const photo = `https://ui-avatars.com/api/?name=${name}&length=1`

            const userLogged = {
               id: String(credentials.user),
               email: credentials.email!,
               name,
               photo
            }

            setUser(userLogged)
            await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
         }

         
      } catch (error) {
         throw new Error(error)
      }
   }

   async function signOut() {
      setUser({} as User);

      await AsyncStorage.removeItem(userStorageKey)
   }

   useEffect(() => {
      async function loadUserStorageData(): Promise<void> {
         const useStoraged = await AsyncStorage.getItem(userStorageKey)

         if (useStoraged) {
            const userLogged = JSON.parse(useStoraged) as User
            setUser(userLogged)
         }
         setUserStorageLoading(false)
      }

      loadUserStorageData()
   }, [])

   return (
      <AuthContext.Provider value={{
         user,
         signInWithGoogle,
         signInWithApple,
         signOut,
         userStorageLoading
      }}>
         {children}
      </AuthContext.Provider>
   )
}

function useAuth() {
   const context = useContext(AuthContext)

   return context
}

export { AuthProvider, useAuth }
