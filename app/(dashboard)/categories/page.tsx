"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useNewCategory } from "@/features/categories/hooks/use-new-category"
import { Plus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { userGetCategories } from "@/features/categories/api/use-get-categories"
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories"




const CategoriesPage = ()=>{
    const newCategory = useNewCategory()
    const deleteCategories = useBulkDeleteCategories()
    const categoryQuery = userGetCategories() 
    const categories = categoryQuery.data || []

    const isDisabled = 
    categoryQuery.isLoading || deleteCategories.isPending
    return(
        <div className="max-w-2xl mx-auto mt-2">
            <Card className="flex flex-col p-2">
                <CardHeader>
                    <CardTitle>Add Categories</CardTitle>
                 
                </CardHeader>
                <Button onClick={newCategory.onOpen}>     
                    <Plus className=" size-4 mr-2"/>
                    Add New
                </Button>
                <CardContent className="w-full mt-2">
                <DataTable columns={columns} data={categories} onDelete={(row)=> {
                    const ids = row.map((r) => r.original.id)
                    deleteCategories.mutate({ids})

                }} disabled={isDisabled} />
                </CardContent>
                </Card>
        </div>
    )
}

export default CategoriesPage