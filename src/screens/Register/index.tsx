import React, { useState } from 'react'
import { Modal } from 'react-native'
import { useForm } from 'react-hook-form'

import { CategorySelect } from '../CategorySelect';

import { Input } from '../../components/Forms/Input';
import { InputForm } from '../../components/Forms/InputForm';
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

interface FormData {
   name: string;
   amount: string;
}

export function Register() {
   const [transactionType, setTransactionType] = useState('')
   const [categoryModalOpen, setCategoryModalOpen] = useState(false)

   const [category, setCategory] = useState({
      key: 'category',
      name: 'Categoria',
   })

   const {
      control,
      handleSubmit
   } = useForm()

   function handleTransactionsTypeSelect(type: 'up' | 'down') {
      setTransactionType(type)
   }

   function handleCloseSelectCategoryModal() {
      setCategoryModalOpen(false)
   }

   function handleOpenSelectCategoryModal() {
      setCategoryModalOpen(true)
   }

   function handleRegister(form: FormData) {
      const data = {
         name: form.name,
         amount: form.amount,
         category: category.key,
         transactionType
      }

      console.log(data)
   } 

   return (
      <Container>
         <Header>
            <Title>Cadastro</Title>
         </Header>
         
         <Form>
            <Fields>
               <InputForm
                  name="name"
                  control={control}
                  placeholder="Nome"
               />

               <InputForm
                  name="amount"
                  control={control}
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

            <Button
               title="Enviar"
               onPress={handleSubmit(handleRegister)}
            />
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
