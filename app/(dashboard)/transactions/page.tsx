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
import { userGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete"




const TransactionsPage = ()=>{
    const newTransactions = useNewTransactions()
    const deleteAccounts = useBulkDeleteAccounts()
    const accountQuery = userGetAccounts() 
    const accounts = accountQuery.data || []

    const isDisabled = 
        accountQuery.isLoading || deleteAccounts.isPending
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
                <DataTable columns={columns} data={accounts} onDelete={(row)=> {
                    const ids = row.map((r) => r.original.id)
                    deleteAccounts.mutate({ids})

                }} disabled={isDisabled} />
                </CardContent>
                </Card>
        </div>
    )
}

export default TransactionsPage