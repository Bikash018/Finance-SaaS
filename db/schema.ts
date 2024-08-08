import { pgTable, text } from "drizzle-orm/pg-core";

export const acccount = pgTable("accounts" , {
    id : text("id").primaryKey(),
    plaidId : text("plaid_id"),
    name : text("name").notNull(),
    userId : text("user_id").notNull(),
})