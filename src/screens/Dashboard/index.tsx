import React, { useCallback, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/core'
import { useTheme } from 'styled-components'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'

import {
   Container,
   Header,
   UserWrapper,
   UserInfo,
   Photo,
   User,
   UserGreeting,
   UserName,
   Icon,
   HighlightCards,
   Transaction,
   Title,
   TransactionList,
   LogoutButton,
   LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
   id: string;

}

interface HighLightProps {
   amount: string;
   lastTransaction: string;
}

interface HighLightData {
   entries: HighLightProps;
   expensive: HighLightProps;
   total: HighLightProps;
}

export function Dashboard() {
   const [isLoading, setIsLoading] = useState(true)
   const [transactions, setTransactions] = useState<DataListProps[]>()
   const [highlightData, setHightLightData] = useState<HighLightData>({} as HighLightData)

   const theme = useTheme()

   function getLastTransitionData(
      collection: DataListProps[],
      type: 'positive' | 'negative'
   ) {
      const lastTransaction = new Date(
         Math.max.apply(Math, collection
            .filter(transaction => transaction.type === type)
            .map(transaction => new Date(transaction.date).getTime())
         )
      )

      return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
         month: 'long'
      })}`;
   }

   async function loadTransactions() {
      const dataKey = '@gofinance:transactions'
      const response = await AsyncStorage.getItem(dataKey)
      const transactions = response ? JSON.parse(response) : []

      let totalEntries = 0
      let totalExpensive = 0

      const transactionsFormatted: DataListProps[] = transactions
         .map((transaction: DataListProps) => {

            if (transaction.type === 'positive') {
               totalEntries += Number(transaction.amount)
            } else {
               totalExpensive += Number(transaction.amount)
            }

            const amount = Number(transaction.amount)
               .toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
               })
            
            const date = Intl.DateTimeFormat('pt-BR', {
               day: '2-digit',
               month: '2-digit',
               year: '2-digit'
            }).format(new Date(transaction.date))

         return {
            id: transaction.id,
            amount,
            name: transaction.name,
            type: transaction.type,
            date,
            category: transaction.category
         }
         })
      
      setTransactions(transactionsFormatted)

      const lastTransactionEntries = getLastTransitionData(transactions, 'positive')
      const lastTransactionExpensive = getLastTransitionData(transactions, 'negative')
      const totalInterval = `01 a ${lastTransactionExpensive}`

      const total = totalEntries - totalExpensive

      setHightLightData({
         entries: {
            amount: totalEntries.toLocaleString('pt-BR', {
               style: 'currency',
               currency: 'BRL'
            }),
            lastTransaction: `Última entrada dia ${lastTransactionEntries}`
         },
         expensive: {
            amount: totalExpensive.toLocaleString('pt-BR', {
               style: 'currency',
               currency: 'BRL'
            }),
            lastTransaction: `Última saída dia ${lastTransactionExpensive}`
         },
         total: {
            amount: total.toLocaleString('pt-BR', {
               style: 'currency',
               currency: 'BRL',
            }),
            lastTransaction: totalInterval
         },
      })

      setIsLoading(false)
   }

   useFocusEffect(
      useCallback(() => {
         loadTransactions()
      }, [])
   )

   return (
      <Container>
         
         {
            isLoading ?
               <LoadContainer>
                  <ActivityIndicator
                     color={theme.colors.primary}
                     size="large"
                  />
               </LoadContainer> :
            <>
               <Header>
                  <UserWrapper>
                     <UserInfo>
                        <Photo source={{ uri: 'https://instagram.fcgh16-1.fna.fbcdn.net/v/t51.2885-19/s150x150/16908619_1788825871438456_3209390917249138688_a.jpg?tp=1&_nc_ht=instagram.fcgh16-1.fna.fbcdn.net&_nc_ohc=D9aW_21Hi5oAX-OpQSD&edm=ABfd0MgBAAAA&ccb=7-4&oh=9f38930a5aaae34b23744157520418ee&oe=60B607AC&_nc_sid=7bff83' }}/>
                        <User>
                           <UserGreeting>Olá,</UserGreeting>
                           <UserName>Jin</UserName>
                        </User>
                     </UserInfo>

                     <LogoutButton onPress={() => {}}>
                        <Icon name="power"/>
                     </LogoutButton>
                  </UserWrapper>
               </Header>

               <HighlightCards>
                  <HighlightCard
                     title="Entradas"
                     amount={highlightData.entries.amount}
                     lastTransaction={highlightData.entries.lastTransaction}
                     type="up"
                  />

                  <HighlightCard
                     title="Saídas"
                     amount={highlightData.expensive.amount}
                     lastTransaction={highlightData.expensive.lastTransaction}
                     type="down"
                  />

                  <HighlightCard
                     title="Total"
                     amount={highlightData.total.amount}
                     lastTransaction={highlightData.total.lastTransaction}
                     type="total"
                  />
               </HighlightCards>
            
               <Transaction>
                  <Title>Listagem</Title>
                     
                  <TransactionList
                     data={transactions}
                     keyExtractor={item => item.id}
                     renderItem={({ item }) => <TransactionCard data={item} />}
                  />
                  
                  
                  
               </Transaction>
            </>
         }

      </Container>
   )
}
