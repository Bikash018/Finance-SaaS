import { useNewAccount } from "@/features/accounts/hooks/use-new-account"
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

const formSchema = insertAccountsSchema.pick({
  name : true
})

type FormValues = z.input<typeof formSchema>
export function NewAccountSheet() {

  const { isOpen , onClose } = useNewAccount()

  const mutation = useCreateAccount()

  const onSubmit = (values : FormValues)=>{
    mutation.mutate(values)
    
    
    
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
      
          <AccountForm onSubmit={onSubmit} disabled={false}/>
         
      </SheetContent>
    </Sheet>
  )
}
