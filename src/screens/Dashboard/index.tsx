import React from 'react'
import { getBottomSpace } from 'react-native-iphone-x-helper'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard } from '../../components/TransactionCard'

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
   TransactionList
} from './styles'

export function Dashboard() {
   const data = [
      {
         type: 'positive',
         title: "Desenvolvimento de site",
         amount: "R$ 12.000,00",
         category: {
            name: 'Vendas',
            icon: 'dollar-sign',
         },
         date:"13/05/2021"
      },
      {
         type: 'negative',
         title: "BK",
         amount: "R$ 26,00",
         category: {
            name: 'alimentação',
            icon: 'coffee',
         },
         date:"20/05/2021"
      },
      {
         type: 'negative',
         title: "Aluguel do apartamento",
         amount: "R$ 1.200,00",
         category: {
            name: 'Casa',
            icon: 'shopping-bag',
         },
         date:"20/05/2021"
      },
   ]

   return (
      <Container>
         <Header>
            <UserWrapper>
               <UserInfo>
                  <Photo source={{ uri: 'https://instagram.fcgh16-1.fna.fbcdn.net/v/t51.2885-19/s150x150/16908619_1788825871438456_3209390917249138688_a.jpg?tp=1&_nc_ht=instagram.fcgh16-1.fna.fbcdn.net&_nc_ohc=D9aW_21Hi5oAX-OpQSD&edm=ABfd0MgBAAAA&ccb=7-4&oh=9f38930a5aaae34b23744157520418ee&oe=60B607AC&_nc_sid=7bff83' }}/>
                  <User>
                     <UserGreeting>Olá,</UserGreeting>
                     <UserName>Jin</UserName>
                  </User>
               </UserInfo>

               <Icon name="power"/>
            </UserWrapper>
         </Header>

         <HighlightCards>
            <HighlightCard
               title="Entradas"
               amount="R$ 17.400,00"
               lastTransaction="Última entrada dia 13 de Maio"
               type="up"
            />

            <HighlightCard
               title="Saídas"
               amount="-R$ 1.000,00"
               lastTransaction="Última saída dia 14 de Maio"
               type="down"
            />

            <HighlightCard
               title="Total"
               amount="R$ 14.400,00"
               lastTransaction="Última entrada dia 14 de Maio"
               type="total"
            />
         </HighlightCards>
      
         <Transaction>
            <Title>Listagem</Title>
               
            <TransactionList
               data={data}
               renderItem={({ item }) => <TransactionCard data={item} />}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{
                  paddingBottom: getBottomSpace()
               }}
            />
            
            
            
         </Transaction>

      </Container>
   )
}
