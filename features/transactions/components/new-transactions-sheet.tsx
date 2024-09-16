
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


import { useCreateTransactions } from "@/features/transactions/api/use-create-transactions"

import { insertTransactionSchema } from "@/db/schema"
import { z } from "zod"
import { useNewTransactions } from "@/features/transactions/hooks/use-new-transactions"
import { useCreateCategory } from "@/features/categories/api/use-create-categories"
import { userGetCategories } from "@/features/categories/api/use-get-categories"
import { userGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts"
import TransactionForm from "@/features/transactions/components/transaction-form"
import { Loader2 } from "lucide-react"

const formSchema = insertTransactionSchema.omit({
  id : true
})

type FormValues = z.input<typeof formSchema>
export function NewTransactionsSheet() {

 const {isOpen , onClose} = useNewTransactions()

  const createMutation = useCreateTransactions()

  const categoryMutations = useCreateCategory()

  const categoryQuery = userGetCategories()

  const onCreateCategory = (name : string)=>{   
    categoryMutations.mutate({name})
  }

  const categoryOptions = (categoryQuery?.data ?? []).map((category)=>({
    label : category.name,
    value : category.id
  }))


  const accountQuery = userGetAccounts()
  const accountMutation = useCreateAccount()

  const onCreateAccount = (name: string) => accountMutation.mutate({
    name,
  });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
  createMutation.isPending ||
  categoryMutations.isPending ||
  accountMutation.isPending;

const isLoading =
  categoryQuery.isLoading ||
  accountQuery.isLoading;


  const onSubmit = (values : FormValues)=>{
    createMutation.mutate(values, {
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
          <SheetTitle>Add New Transactions</SheetTitle>
         
        </SheetHeader>
      
        {isLoading
          ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          )
          : (
            <TransactionForm
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
            
          )}
         
      </SheetContent>
    </Sheet>
  )
}
