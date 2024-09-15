import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { insertTransactionSchema } from '@/db/schema';
import { cn } from '@/lib/utils';
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
import { Trash } from 'lucide-react';

const formSchema = z.object({
  date : z.coerce.date(),
  accountId : z.string(),
  categoryId : z.string().nullable().optional(),
  amount : z.string(),
  notes : z.string().nullable().optional(), 
})

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
  onSubmit,
  id,
  defaultValues,
  onDelete,
  disabled
} : Props) => {

  const form = useForm<FormValues>({
    resolver : zodResolver(formSchema),
    defaultValues : defaultValues
  })

;

console.log(defaultValues,"defff val")



  const handleSubmit = (values : FormValues)=>{
    // onSubmit(values)
  }

  const handleDelete = ()=>{
    onDelete?.()
  }

 


  return (
  
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-4  '> 
          {/* <FormField
            name = "name"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>
                    Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={disabled}
                    placeholder='Eg Food Travel Rent'
                    {...field}
                  />
                </FormControl>
              </FormItem>
              )}
          /> */}
          {
            <Button className='w-full p-3'>
           { id? "Save Changes" : "Create Category"}
            </Button>
          }

        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Delete Category
          </Button>
         )}
      </form>
    </Form>
  );
};

export default TransactionForm;
