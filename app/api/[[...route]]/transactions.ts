
import {Hono} from "hono"

import {transactions , insertTransactionSchema,  acccount } from "@/db/schema"

import {zValidator} from "@hono/zod-validator"
import {z} from "zod"
import {createId} from  "@paralleldrive/cuid2"

import {db} from "@/db/drizzle"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { HTTPException } from "hono/http-exception"
import { eq , and , inArray, gte, lte, desc, sql } from "drizzle-orm"
import { subDays, parse } from "date-fns";


const app = new Hono()
  //   .get("/", 
  //     zValidator(
  //       "query",
  //       z.object({
  //         from: z.string().optional(),
  //         to: z.string().optional(),
  //         accountId: z.string().optional(),
  //       })
  //     ),
  //     clerkMiddleware() ,async(c)=>{ 
  //       const auth = getAuth(c);

  //       const { from, to, accountId } = c.req.valid("query");

  //       if(!auth?.userId){
  //           throw new HTTPException(401, { message: 'User Unauthorised' })
  //       }

  //       const defaultTo = new Date();
  //       const defaultFrom = subDays(defaultTo, 30);
  
  //       const startDate = from
  //       ? parse(from, "yyyy-MM-dd", new Date())
  //       : defaultFrom;
  //     const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

  //     const data = await db
  //       .select({
  //         id: transactions.id,
  //         date: transactions.date,
  //         category: categories.name,
  //         categoryId: transactions.categoryId,
  //         payee: transactions.payee,
  //         amount: transactions.amount,
  //         notes: transactions.notes,
  //         account: acccount.name,
  //         accountId: transactions.accountId,
  //       })
  //       .from(transactions)
  //       .innerJoin(acccount, eq(transactions.accountId, acccount.id))
  //       .leftJoin(categories, eq(transactions.categoryId, categories.id))
  //       .where(
  //         and(
  //           accountId ? eq(transactions.accountId, acccount) : undefined,
  //           eq(acccount.userId, auth.userId),
  //           gte(transactions.date, startDate),
  //           lte(transactions.date, endDate)
  //         )
  //       )
  //       .orderBy(desc(transactions.date));
  //     return c.json({ data });
  //   }
  // )

    .get("/:id" , 
        zValidator("param" , z.object({
            id : z.string().optional()
        })),
        clerkMiddleware(),

        async(c) => {
            const auth = getAuth(c)
            const {id} = c.req.valid("param")

            if(!id){
                return c.json({error : "Missing Id"} , 401)
            }

            if(!auth?.userId) {
                return c.json({error: "Unauthorised"} , 401)
            }

            const userId = auth?.userId as string;

            const [data] = await db
                .select({
                  id: transactions.id,
                  date: transactions.date,
 
                  categoryId: transactions.categoryId,
                  payee: transactions.payee,
                  amount: transactions.amount,
                  notes: transactions.notes,
                  
                  accountId: transactions.accountId,
                })
                .from(transactions)
                .innerJoin(acccount, eq(transactions.accountId, acccount.id))
                .where(
                  and(
                    eq(transactions.id, id),
                    eq(acccount.userId, userId)
                  )
                );
            if(!data){
                return c.json({error : "Not found"} , 404)
            }

            return c.json({data});
        }

    )

    .post("/",
     
         clerkMiddleware(),
         zValidator(
          "json",
          insertTransactionSchema.omit({
            id: true,
          })
        ),
         async (c)=>{
        const auth = getAuth(c)

        // const values : any = await c.req.text()

        const bodyText = await c.req.text();
        // const values = JSON.parse(body);
        // const values  = JSON.parse(bodyText);
        const values = c.req.valid("json");


        if (!auth?.userId) {
            return c.json({ error: "unauthorised" });
        }

        // Ensure `values.name` exists before using it
        // if (!values?.name) {
        //     return c.json({ error: "Name is required" }, 400);
        // }



      

        const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...values,
        })
        .returning();

        return c.json({data})
    })

    .post("/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                ids : z.array(z.string())
            }),
        ),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({ error: "unauthorised" },401);
            }

            const transactionsToDelete = db.$with("tranasactions_to_delete").as(
              db
                .select({
                  id: transactions.id,
                })
                .from(transactions)
                .innerJoin(acccount, eq(transactions.accountId, acccount.id))
                .where(
                  and(
                    inArray(transactions.id, values.ids),
                    eq(acccount.userId, auth.userId)
                  )
                )
            );
      

            const data = await db
                        .with(transactionsToDelete)
                        .delete(transactions)
                        .where(
                            inArray(
                              transactions.id,
                              sql `(select id from  ${transactionsToDelete})`
                            )
                        ).returning({
                            id : transactions.id
                        })
                    
                return c.json({data})
        }
    )
    .patch(
        "/:id",
        clerkMiddleware(),
        zValidator(
          "param",
          z.object({
            id: z.string().optional(),
          })
        ),
        zValidator(
          'json',
          insertTransactionSchema.omit({
            id: true,
          
          }),
        ),
        async (c) => {
          const auth = getAuth(c);
          const { id } = c.req.valid("param");
          const values = c.req.valid("json");
    
          if (!id) {
            return c.json({ error: "Missing id" }, 400);
          }
    
          if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
          }

          const transactionsToUpdate = db
          .$with('transactions_to_update')
          .as(db
            .select({ id: transactions.id })
            .from(transactions)
            .innerJoin(acccount, eq(transactions.accountId, acccount.id))
            .where(and(
              eq(transactions.id, id),
              eq(acccount.userId, auth.userId),
            )),
          );
    
          const [data] = await db
            .with(transactionsToUpdate)
            .update(transactions)
            .set({
              ...values,
            })
            .where(
              inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`),
            )
            .returning();
    
          if (!data) {
            return c.json({ error: "Not found" }, 404);
          }
    
          return c.json({ data });
        }
      )

      .delete(
        '/:id',
        clerkMiddleware(),
        zValidator('param', z.object({
          id: z.string().optional(),
        })),
        async (c) => {
          const auth = getAuth(c);
          const { id } = c.req.valid('param');
    
          if (!id) {
            return c.json({ error: 'Missing id' }, 400);
          }
          if (!auth?.userId) {
            return c.json({ error: 'Unauthorized' }, 401);
          }
          // Common Table Expressiongs (CTE's) to check authorId matches accountId matches with userId
          const transactionsToDelete = db
            .$with('transactions_to_delete')
            .as(db
              .select({ id: transactions.id })
              .from(transactions)
              .innerJoin(acccount, eq(transactions.accountId, acccount.id))
              .where(and(
                eq(transactions.id, id),
                eq(acccount.userId, auth.userId),
              )),
            );
    
          const [data] = await db
            .with(transactionsToDelete)
            .delete(transactions)
            .where(
              inArray(transactions.id, sql`(select id from ${transactionsToDelete})`),
            )
    
            .returning({
              id: transactions.id,
            });
          if (!data) {
            return c.json({ error: 'Not Found' }, 404);
          }
          return c.json({ data });
        },
      )


export default app