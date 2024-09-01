"use client"

import { NewAccountSheet } from "@/features/accounts/components/new-accounts-sheet"

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"

import { NewCategorySheet } from "@/features/categories/components/new-categories-sheet"

import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet"



export const SheetProvider = ()=>{
    return (
        <>
            <NewAccountSheet/>
            <EditAccountSheet/>
            <NewCategorySheet/>
            <EditCategorySheet/>    

        </>
    )
}