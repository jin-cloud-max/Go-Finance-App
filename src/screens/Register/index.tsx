import React, { useEffect, useState } from 'react'
import {
   Keyboard,
   Modal,
   TouchableWithoutFeedback,
   Alert
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { CategorySelect } from '../CategorySelect';

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

const schema = Yup.object().shape({
   name: Yup.string().required('Nome é obrigatório'),
   amount: Yup.number()
      .typeError('Informe um valor numérico')
      .positive('Valor não pode ser negativo')
      .required('Valor é obrigatório')
})

export function Register() {
   const [transactionType, setTransactionType] = useState('')
   const [categoryModalOpen, setCategoryModalOpen] = useState(false)

   const dataKey = '@gofinance:transactions'


   const [category, setCategory] = useState({
      key: 'category',
      name: 'Categoria',
   })

   const {
      control,
      handleSubmit,
      formState: { errors }
   } = useForm({
      resolver: yupResolver(schema)
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

   async function handleRegister(form: FormData) {
      if (!transactionType) {
         return Alert.alert('Selecione o tipo de transação')
      }

      if (category.key === 'category') {
         return Alert.alert('Selecione a categoria')
      }

      const newTransaction = {
         name: form.name,
         amount: form.amount,
         category: category.key,
         transactionType
      }

      try {
         const data = await AsyncStorage.getItem(dataKey)

         const currentData = data ? JSON.parse(data) : []

         const dataFormatted = [
            ...currentData,
            newTransaction
         ]

         await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

      } catch (error) {
         console.log(error)
         Alert.alert('Não foi possível salvar')
      }
   }
   
   useEffect(() => {
      async function loadData() {
         const data = await AsyncStorage.getItem(dataKey)
         console.log(JSON.parse(data!))
      }

      loadData()
   }, [])

   return (
      <TouchableWithoutFeedback
         onPress={Keyboard.dismiss}
      >
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
                     autoCapitalize="sentences"
                     autoCorrect={false}
                     error={errors.name && errors.name.message}
                  />

                  <InputForm
                     name="amount"
                     control={control}
                     placeholder="Preço"
                     keyboardType="numeric"
                     error={errors.amount && errors.amount.message}
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
      </TouchableWithoutFeedback>
   )
}
