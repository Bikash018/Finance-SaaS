
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


import { insertTransactionSchema} from "@/db/schema"
import CategoryForm from "@/features/categories/components/category-form" 
import { z } from "zod"
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction"
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction"
import { useNewTransactions } from "@/features/transactions/hooks/use-new-transactions"
import { useCreateCategory } from "@/features/categories/api/use-create-categories"
import { userGetCategories } from "@/features/categories/api/use-get-categories"
import { userGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts"
import { Loader2 } from "lucide-react"
import { useEditTransactions } from "../api/use-edit-transactions"
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction"

import { useConfirm } from "@/hooks/use-confirm"
import TransactionForm from "./transaction-form"
import { useCreateTransactions } from "../api/use-create-transactions"

const formSchema = insertTransactionSchema.omit({
  id : true
})

type FormValues = z.input<typeof formSchema>
export function EditTransactionSheet() {

  const { isOpen , onClose , id } = useOpenTransaction()

  const transactionQuery = useGetTransaction(id)

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


  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this Transaction?",
    "You are about to delete this transaction."
  );




  
  const isLoading =
  transactionQuery.isLoading ||
  categoryQuery.isLoading ||
  accountQuery.isLoading;


  const onDelete = async () => {
    const ok = await confirm()

    if(ok) { 
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      })
    }

  }

  
  const defaultValues = transactionQuery.data
    ? {
      accountId: transactionQuery.data.accountId,
      categoryId: transactionQuery.data.categoryId,
      amount: transactionQuery.data.amount.toString(),
      date: transactionQuery.data.date
        ? new Date(transactionQuery.data.date)
        : new Date(),
      payee: transactionQuery.data.payee,
      notes: transactionQuery.data.notes,
    }
    : {
      accountId: '',
      categoryId: '',
      amount: '',
      date: new Date(),
      payee: '',
      notes: '',
    };


  const editMutation = useEditTransactions(id);
  const deleteMutation = useDeleteTransaction(id);



  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutations.isPending ||
    accountMutation.isPending;



  const onSubmit = (values : FormValues)=>{
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose() // Close the sheet after successful mutation
      },
    })
    
    
  }
  return (
    <>
    <ConfirmDialog/>
    <Sheet open = {isOpen} onOpenChange={onClose}>
      {/* <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Transactions</SheetTitle>
         
        </SheetHeader>

        {isLoading ? (
            <div
              className="absolute inset-0 flex items-center 
          justify-center"
            >
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              onDelete={onDelete}
              defaultValues={defaultValues}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
      
         
         
      </SheetContent>
    </Sheet>
    </>
  )
}
