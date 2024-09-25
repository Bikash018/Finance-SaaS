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
import { useState } from "react"
import { UploadButton } from "./upload-button"
import { ImportCard } from "./import-card"



enum VARIANTS {
    // eslint-disable-next-line no-unused-vars
    LIST = 'LIST', IMPORT = 'IMPORT'
  }
  
  const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {}, // will be used by a package
  };




const TransactionsPage = ()=>{
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
    const newTransactions = useNewTransactions()
    const deleteTransactions = useBulkDeleteCategories()
    const transactionsQuery = useGetTransactions() 
    const transactions = transactionsQuery.data || []

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
      };
      const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
      };

    const isDisabled = 
    transactionsQuery.isLoading || deleteTransactions.isPending

    if (variant === VARIANTS.IMPORT) {
        return (
          <>
            {/* <AccountDialog /> */}
            <ImportCard
              data={importResults.data}
              onCancel={onCancelImport}
              onSubmit={() => {}}
            />
          </>
        );
      }
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
                <UploadButton onUpload={onUpload} />
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