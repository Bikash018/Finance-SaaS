
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import CategoryForm from "@/features/categories/components/category-form"
import { useCreateTransactions } from "@/features/transactions/api/use-create-transactions"

import { insertTransactionSchema } from "@/db/schema"
import { z } from "zod"
import { useNewTransactions } from "@/features/transactions/hooks/use-new-transactions"

const formSchema = insertTransactionSchema.omit({
  id : true
})

type FormValues = z.input<typeof formSchema>
export function NewTransactionsSheet() {

 const {isOpen , onClose} = useNewTransactions()

  const mutation = useCreateTransactions()

  const onSubmit = (values : FormValues)=>{
    mutation.mutate(values, {
      onSuccess: () => {
        onClose() // Close the sheet after successful mutation
      },
    })
    
    
  }
  return (
    <Sheet open = {isOpen} onOpenChange={onClose}>
      {/* <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Category</SheetTitle>
         
        </SheetHeader>
      
       <p>TODO Transactions Form</p>
         
      </SheetContent>
    </Sheet>
  )
}
