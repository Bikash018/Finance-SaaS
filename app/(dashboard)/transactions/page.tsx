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
import { useNewTransactions } from "@/features/transactions/hooks/use-new-transactions"

import { Plus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"

import { useBulkDeleteCategories } from "@/features/transactions/api/use-bulk-delete-transactions"
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions"




const TransactionsPage = ()=>{
    const newTransactions = useNewTransactions()
    const deleteTransactions = useBulkDeleteCategories()
    const transactionsQuery = useGetTransactions() 
    const transactions = transactionsQuery.data || []

    const isDisabled = 
    transactionsQuery.isLoading || deleteTransactions.isPending
    return(
        <div className="max-w-2xl mx-auto mt-2">
            <Card className="flex flex-col p-2">
                <CardHeader>
                    <CardTitle>Transactions History</CardTitle>
                 
                </CardHeader>
                <Button onClick={newTransactions.onOpen}>
                    <Plus className=" size-4 mr-2"/>
                    Add New
                </Button>
                <CardContent className="w-full mt-2">
                <DataTable columns={columns} data={transactions} onDelete={(row)=> {
                    const ids = row.map((r) => r.original.id)
                    deleteTransactions.mutate({ids})

                }} disabled={isDisabled} />
                </CardContent>
                </Card>
        </div>
    )
}

export default TransactionsPage