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


export function NewAccountSheet() {

  const { isOpen , onClose } = useNewAccount()
  return (
    <Sheet open = {isOpen} onOpenChange={onClose}>
      {/* <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Account</SheetTitle>
         
        </SheetHeader>
      
          <AccountForm/>
         
      </SheetContent>
    </Sheet>
  )
}
