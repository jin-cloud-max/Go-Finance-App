import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'


import { Dashboard } from '../screens/Dashboard'
import { Register } from '../screens/Register'
// import { CategorySelect } from './src/screens/CategorySelect';

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes() {
   return (
      <Navigator>
         <Screen
            name="Listagem"
            component={Dashboard}
         />

         <Screen
            name="Cadastrar"
            component={Register}
         />
      </Navigator>
   )
}
