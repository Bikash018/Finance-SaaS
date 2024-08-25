
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
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts"
import { insertAccountsSchema } from "@/db/schema"
import { z } from "zod"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { userGetAccount } from "@/features/accounts/api/use-get-account"
import { Loader2 } from "lucide-react"

const formSchema = insertAccountsSchema.pick({
  name : true
})

type FormValues = z.input<typeof formSchema>
export function EditAccountSheet() {

  const { isOpen , onClose , id } = useOpenAccount()

  const accountQuery = userGetAccount(id)


  
  const isLoading = accountQuery.isLoading;

  

  const defaultValues = accountQuery.data ? 
    {  name : accountQuery.data.name} :
    {name : ""}


  const mutation = useCreateAccount()

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
          <SheetTitle>Add Account</SheetTitle>
         
        </SheetHeader>

        {isLoading ? (
            <div
              className="absolute inset-0 flex items-center 
          justify-center"
            >
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm onSubmit={onSubmit} disabled={false} defaultValues={defaultValues}/>
          )}
      
         
         
      </SheetContent>
    </Sheet>
  )
}
