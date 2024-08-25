"use client"

import { NewAccountSheet } from "@/features/accounts/components/new-accounts-sheet"

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"



export const SheetProvider = ()=>{
    return (
        <>
            <NewAccountSheet/>
            <EditAccountSheet/>

        </>
    )
}