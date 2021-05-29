import React, { useState } from 'react'

import { Input } from '../../components/Forms/Input';
import { Button } from '../../components/Forms/Button';

import {
   Container,
   Header,
   Title,
   Form,
   Fields,
   TransactionsType
} from "./styles";
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { SelectCategory } from '../../components/Forms/SelectCategory';

export function Register() {
   const [transactionType, setTransactionType] = useState('')

   function handleTransactionsTypeSelect(type: 'up' | 'down') {
      setTransactionType(type)
   }

   return (
      <Container>
         <Header>
            <Title>Cadastro</Title>
         </Header>
         
         <Form>
            <Fields>
               <Input
                  placeholder="Nome"
               />

               <Input
                  placeholder="Preço"
               />

               <TransactionsType>
                  <TransactionTypeButton
                     type="up"
                     title="Income"
                     onPress={() => handleTransactionsTypeSelect('up')}
                     isActive={transactionType === 'up'}
                  />
                  <TransactionTypeButton
                     type="down"
                     title="Outcome"
                     onPress={() => handleTransactionsTypeSelect('down')}
                     isActive={transactionType === 'down'}

                  />
               </TransactionsType>

               <SelectCategory title="Título"/>
            </Fields>

            <Button title="Enviar"/>
         </Form>

      </Container>
   )
}
