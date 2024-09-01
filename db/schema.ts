import { pgTable, text } from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod"

export const acccount = pgTable("accounts" , {
    id : text("id").primaryKey(),
    plaidId : text("plaid_id"),
    name : text("name").notNull(),
    userId : text("user_id").notNull(),
}) 

export const insertAccountsSchema = createInsertSchema(acccount);


export const categories = pgTable("categories" , {
    id : text("id").primaryKey(),
    plaidId : text("plaid_id"),
    name : text("name").notNull(),
    userId : text("user_id").notNull(),
}) 

export const insertCategoriesSchema = createInsertSchema(categories);