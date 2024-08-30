
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
import AccountForm from "./account-form"

import { insertAccountsSchema } from "@/db/schema"
import { z } from "zod"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { userGetAccount } from "@/features/accounts/api/use-get-account"
import { Loader2 } from "lucide-react"
import { useEditAccount } from "@/features/accounts/api/use-edit-accounts"
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account"

import { useConfirm } from "@/hooks/use-confirm"

const formSchema = insertAccountsSchema.pick({
  name : true
})

type FormValues = z.input<typeof formSchema>
export function EditAccountSheet() {

  const { isOpen , onClose , id } = useOpenAccount()

  const accountQuery = userGetAccount(id)


  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this account?",
    "You are about to delete this accaunt."
  );




  
  const isLoading = accountQuery.isLoading;


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

  

  const defaultValues = accountQuery.data ? 
    {  name : accountQuery.data.name} :
    {name : ""}



  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);



  const isPending = editMutation.isPending  || deleteMutation.isPending;
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
          <SheetTitle>Edit Account</SheetTitle>
         
        </SheetHeader>

        {isLoading ? (
            <div
              className="absolute inset-0 flex items-center 
          justify-center"
            >
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm  
              id={id} 
              onSubmit={onSubmit}
              disabled={isPending} 
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
      
         
         
      </SheetContent>
    </Sheet>
    </>
  )
}
