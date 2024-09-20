import { Button } from '@/components/ui/button';

import { insertTransactionSchema } from '@/db/schema';
import { DatePicker } from '@/components/date-picker';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn, convertAmountToMiliuinits } from '@/lib/utils';
import { useState } from 'react';
import { z } from 'zod';
import {useForm} from "react-hook-form"

import {zodResolver} from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,FormLabel,FormMessage
} from "@/components/ui/form"
import { Loader2, Trash } from 'lucide-react';
import { Select } from '@/components/select';
import { AmountInput } from '@/components/amount-input';
import { parse } from 'path';



const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionSchema.omit({
  id: true,

});

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

type Props = {
  id? : string;
  defaultValues? : FormValues;
  onSubmit : (values : ApiFormValues) => void;
  onDelete? : ()=> void;
  disabled? : boolean 
  accountOptions : {label : string, value : string}[]
  categoryOptions : {label : string, value : string}[]
  onCreateCategory : (name : string) => void
  onCreateAccount : (name : string) => void

}

const TransactionForm = ( {
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateCategory,
  onCreateAccount,
} : Props) => {

  const form = useForm<FormValues>({
    resolver : zodResolver(formSchema),
    defaultValues : defaultValues
  })

;

console.log(defaultValues,"defff val")



  const handleSubmit = (values : FormValues)=>{
    const amount = parseFloat(values.amount)
    const amountInMilliUnits = convertAmountToMiliuinits(amount)
    onSubmit({
      ...values,
      amount : amountInMilliUnits,
 
    })

    console.log(values,"values")
  }

  const handleDelete = ()=>{
    onDelete?.()
  }

 


  return (
  
    <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
      {/* Date */}
      <FormField
        name="date"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {/* Account */}
      <FormField
        name="accountId"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account</FormLabel>
            <FormControl>
              <Select
                placeholder="Select an account"
                options={accountOptions}
                onCreate={onCreateAccount}
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {/* Category */}
      <FormField
        name="categoryId"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Select
                placeholder="Select an category"
                options={categoryOptions}
                onCreate={onCreateCategory}
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {/* Payee input */}
      <FormField
        name="payee"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payee</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder="Add a payee"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {/* Amount input */}
      <FormField
        name="amount"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <AmountInput
                {...field}
                disabled={disabled}
                placeholder="0.00"
              />
            </FormControl>
          </FormItem>
        )}
      />
      {/* Notes textarea */}
      <FormField
        name="notes"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ''}
                disabled={disabled}
                placeholder="Optional notes"
              />
            </FormControl>
          </FormItem>
        )}
      />
      {/*  Submit/ Save Changes */}
      <Button className="w-full" disabled={disabled}>
        {disabled && (
          <Loader2
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {id ? 'Save Changes' : 'Create Transaction'}
      </Button>

      {!!id &&
        <Button
          type="button"
          disabled={disabled}
          onClick={handleDelete}
          variant="outline"
          className="w-full"
        >
          <Trash className="mr-2 size-4" />
          Delete Transaction
        </Button>}
    </form>

  </Form>
  );
};

export default TransactionForm;
