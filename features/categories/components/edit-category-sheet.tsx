
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


import { insertCategoriesSchema } from "@/db/schema"
import CategoryForm from "@/features/categories/components/category-form" 
import { z } from "zod"
import { useOpenCategory } from "@/features/categories/hooks/use-open-category"
import { userGetCategory } from "@/features/categories/api/use-get-category"
import { Loader2 } from "lucide-react"
import { useEditcategory } from "@/features/categories/api/use-edit-category"
import { useDeleteCategory } from "@/features/categories/api/use-delete-category"

import { useConfirm } from "@/hooks/use-confirm"

const formSchema = insertCategoriesSchema.pick({
  name : true
})

type FormValues = z.input<typeof formSchema>
export function EditCategorySheet() {

  const { isOpen , onClose , id } = useOpenCategory()

  const categoryQuery = userGetCategory(id)


  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this category?",
    "You are about to delete this category."
  );




  
  const isLoading = categoryQuery.isLoading;


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

  

  const defaultValues = categoryQuery.data ? 
    {  name : categoryQuery.data.name} :
    {name : ""}



  const editMutation = useEditcategory(id);
  const deleteMutation = useDeleteCategory(id);



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
          <SheetTitle>Edit Category</SheetTitle>
         
        </SheetHeader>

        {isLoading ? (
            <div
              className="absolute inset-0 flex items-center 
          justify-center"
            >
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm  
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
