import React, { useState } from 'react'
import { Modal } from 'react-native'

import { Input } from '../../components/Forms/Input';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { SelectCategory } from '../../components/Forms/SelectCategory';

import {
   Container,
   Header,
   Title,
   Form,
   Fields,
   TransactionsType
} from "./styles";
import { CategorySelect } from '../CategorySelect';

export function Register() {
   const [transactionType, setTransactionType] = useState('')
   const [categoryModalOpen, setCategoryModalOpen] = useState(false)

   const [category, setCategory] = useState({
      key: 'category',
      name: 'Categoria',
   })

   function handleTransactionsTypeSelect(type: 'up' | 'down') {
      setTransactionType(type)
   }

   function handleCloseSelectCategoryModal() {
      setCategoryModalOpen(false)
   }

   function handleOpenSelectCategoryModal() {
      setCategoryModalOpen(true)
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

               <SelectCategory
                  onPress={handleOpenSelectCategoryModal}
                  title={category.name}
               />
            </Fields>

            <Button title="Enviar"/>
         </Form>

         <Modal visible={categoryModalOpen}>
            <CategorySelect
               category={category}
               setCategory={setCategory}
               closeSelectCategory={handleCloseSelectCategoryModal}
            />
         </Modal>

      </Container>
   )
}
