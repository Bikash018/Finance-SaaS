import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod"
import { z } from "zod";

export const acccount = pgTable("accounts" , {
    id : text("id").primaryKey(),
    plaidId : text("plaid_id"),
    name : text("name").notNull(),
    userId : text("user_id").notNull(),
}) 

export const accountsRelations = relations(acccount, ({ many }) => ({
    transactions: many(transactions)
}))

export const insertAccountsSchema = createInsertSchema(acccount);


export const categories = pgTable("categories" , {
    id : text("id").primaryKey(),
    plaidId : text("plaid_id"),
    name : text("name").notNull(),
    userId : text("user_id").notNull(),
}) 

export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions)
}))

export const insertCategoriesSchema = createInsertSchema(categories);

export const transactions = pgTable("transactions" , {
    id : text("id").primaryKey(),
    amount : integer("amount").notNull(),
    payee : text("payee").notNull(),
    notes  : text("notes"),
   date : timestamp ("date" , { mode : "date"}).notNull(),
   accountId : text("account_id").references(() => acccount.id , {
    onDelete : "cascade"
   }).notNull(),
   categoryId : text("category_id").references(() => categories.id , {
    onDelete : "set null"
   })
   

   
})

export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(acccount, {
        fields: [transactions.accountId],
        references: [acccount.id]
    }),
    categories: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id]
    })
}))

export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
})