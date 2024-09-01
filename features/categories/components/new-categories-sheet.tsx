
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
import { useCreateCategory } from "@/features/categories/api/use-create-categories"
import { useNewCategory } from "@/features/categories/hooks/use-new-category"
import  { insertCategoriesSchema } from "@/db/schema"
import { z } from "zod"

const formSchema = insertCategoriesSchema.pick({
  name : true
})

type FormValues = z.input<typeof formSchema>
export function NewCategorySheet() {

 const {isOpen , onClose} = useNewCategory()

  const mutation = useCreateCategory()

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
      
          <CategoryForm onSubmit={onSubmit} disabled={false}/>
         
      </SheetContent>
    </Sheet>
  )
}
