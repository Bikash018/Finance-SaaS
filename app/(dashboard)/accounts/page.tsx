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
import { useNewAccount } from "@/features/accounts/hooks/use-new-account"
import { Plus } from "lucide-react"
import { columns, Payment } from "./columns"
import { DataTable } from "@/components/data-table"



  const data :Payment[]  = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
      {
        id: "728ed52f",
        amount: 200,
        status: "pending",
        email: "bikash@example.com",
      },
  ]
const AccountsPage = ()=>{
    const newAccount = useNewAccount()
    return(
        <div className="max-w-2xl mx-auto mt-2">
            <Card className="flex flex-col p-2">
                <CardHeader>
                    <CardTitle>Add Account</CardTitle>
                 
                </CardHeader>
                <Button onClick={newAccount.onOpen}>
                    <Plus className=" size-4 mr-2"/>
                    Add New
                </Button>
                <CardContent className="w-full mt-2">
                <DataTable columns={columns} data={data} />
                </CardContent>
                </Card>
        </div>
    )
}

export default AccountsPage