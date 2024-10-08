"use client"

import { NewAccountSheet } from "@/features/accounts/components/new-accounts-sheet"

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"

import { NewCategorySheet } from "@/features/categories/components/new-categories-sheet"

import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet"
import { NewTransactionsSheet } from "@/features/transactions/components/new-transactions-sheet"

import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet"
import { Edit } from "lucide-react"



export const SheetProvider = ()=>{
    return (
        <>
            <NewAccountSheet/>
            <EditAccountSheet/>
            <NewCategorySheet/>
            <EditCategorySheet/>    
            <NewTransactionsSheet/>
            <EditTransactionSheet/>

        </>
    )
}