import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { insertAccountsSchema } from '@/db/schema';
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

const formSchema = insertAccountsSchema.pick({
  name : true
})

type FormValues = z.input<typeof formSchema>

type Props = {
  id? : string;
  defaultValues? : FormValues;
  onSubmit : (values : FormValues) => void;
  onDelete? : ()=> void;
  disabled? : boolean 
}

const AccountForm = ( {
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
    onSubmit(values)
  }

 


  return (
    // <form className=" flex flex-col gap-4">
    //   <div className='flex flex-col gap-4'>
    //     <div className=''> <label htmlFor="username" className="block text-sm font-medium p-2 mb-4">
    //       Account Name
    //     </label></div>

    //     <div><Input
    //       id="Account Name"
    //       name="name"
    //       value={formData.name}
    //     className={cn(
    //         "mt-1 block w-full outline-none border-none focus:outline-none focus:border-transparent focus:ring-0",
         
    //       )}
    //       onChange={handleInputChange}
         
    //       placeholder="Enter your username"
    //     /></div>
       
        
    //   </div>

   

    //   <div className="flex space-x-4 ">
    //     <Button  onClick={handleSaveChanges}>
    //       Save Changes
    //     </Button>
    //     <Button variant="destructive" onClick={handleDeleteAccount}>
    //       Delete Account
    //     </Button>
    //   </div>
    // </form>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-4  '> 
          <FormField
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
                    placeholder='Eg Credit Card Bank Account'
                    {...field}
                  />
                </FormControl>
              </FormItem>
              )}
          />
          {
            <Button className='w-full p-3'>
           { id? "Save Changes" : "Create Account"}
            </Button>
          }
      </form>
    </Form>
  );
};

export default AccountForm;
