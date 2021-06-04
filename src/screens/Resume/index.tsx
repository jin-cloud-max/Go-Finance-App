import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { useAuth } from '../../hooks/auth';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import {
   Container,
   Title,
   Header,
   Content,
   ChartContainer,
   MonthSelect,
   MonthSelectButton,
   MonthSelectIcon,
   Month,
   LoadContainer
} from './styles';


interface TransactionData {
   type: 'positive' | 'negative'
   name: string;
   amount: string;
   category: string;
   date: string;
}

interface CategoryData {
   key: string;
   name: string;
   total: number;
   formattedTotal: string;
   color: string;
   formattedPercent: string;
   percent: number;
}

export function Resume() {
   const [isLoading, setIsLoading] = useState(false)
   const [selectedDate, setSelectedDate] = useState(new Date())
   const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

   const theme = useTheme()
   const { user } = useAuth()

   function handleDateChange(action: 'next' | 'prev') {

      if (action === 'next') {
         setSelectedDate(addMonths(selectedDate, 1))
      } else {
         setSelectedDate(subMonths(selectedDate, 1))
      }
   }

   async function loadData() {
      setIsLoading(true)
      const dataKey = `@gofinance:transactions_user:${user.id}`
      const response = await AsyncStorage.getItem(dataKey)
      const formattedResponse = response ? JSON.parse(response) : []

      const expensives = formattedResponse
         .filter((expensive: TransactionData) =>
            expensive.type === 'negative' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
         ) // Só tirar o filtro de type que retorna tudo
      
      const expensivesTotal = expensives
         .reduce((accumulator: number, expensive: TransactionData) => {
            return accumulator + Number(expensive.amount)
         }, 0)
      
      const totalByCategory: CategoryData[] = []

      categories.forEach((category) => {
         let sumCategory = 0

         expensives.forEach((expensive: TransactionData) => {
            if (expensive.category === category.key) {
               sumCategory += Number(expensive.amount)
            }
         })

         if (sumCategory > 0) {
            const formattedTotal = sumCategory.toLocaleString('pt-BR', {
               style: 'currency',
               currency: 'BRL'
            })

            const percent = (sumCategory / expensivesTotal * 100)
            const formattedPercent = `${percent.toFixed(2).replace('.', ',')}%`


            totalByCategory.push({
               key: category.key,
               name: category.name,
               color: category.color,
               total: sumCategory,
               formattedTotal,
               percent,
               formattedPercent
            })
         } 

      })

      setTotalByCategories(totalByCategory)
      setIsLoading(false)
   }

   useFocusEffect(
      useCallback(() => {
         loadData()
      }, [selectedDate])
   )

   return (
      <Container>
         
         <Header>
            <Title>Resumo por categoria</Title>
         </Header>

         {
            isLoading ?
               <LoadContainer>
                  <ActivityIndicator
                     color={theme.colors.primary}
                     size="large"
                  />
               </LoadContainer> :
           
            <Content
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{
                  paddingHorizontal: 24,
                  paddingBottom: useBottomTabBarHeight(),
               }}
            >
               <MonthSelect>
                  <MonthSelectButton
                     onPress={() => handleDateChange('prev')}
                  >
                     <MonthSelectIcon name="chevron-left" />
                  </MonthSelectButton>

                  <Month>
                     { format(selectedDate, 'MMMM, yyyy', { locale: ptBR }) }
                  </Month>

                  <MonthSelectButton
                     onPress={() => handleDateChange('next')}
                  >
                     <MonthSelectIcon name="chevron-right" />
                  </MonthSelectButton>
               </MonthSelect>
               <ChartContainer>
                  <VictoryPie
                     data={totalByCategories}
                     colorScale={totalByCategories.map(category => category.color)}
                     style={{
                        labels: {
                           fontSize: RFValue(18),
                           fontWeight: 'bold',
                           fill: theme.colors.shape
                        }
                     }}
                     labelRadius={70}
                     x="formattedPercent"
                     y="total"
                  />
               </ChartContainer>
               {
                  totalByCategories.map(category => (
                     <HistoryCard
                        key={category.key}
                        color={category.color}
                        title={category.name}
                        amount={category.formattedTotal}
                     />
                  ))
               }
            </Content>
         }
      </Container>
   )
}
