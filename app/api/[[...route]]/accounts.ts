
import {Hono} from "hono"

import { acccount, insertAccountsSchema } from "@/db/schema"

import {zValidator} from "@hono/zod-validator"
import {z} from "zod"
import {createId} from  "@paralleldrive/cuid2"

import {db} from "@/db/drizzle"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { HTTPException } from "hono/http-exception"
import { eq , and , inArray } from "drizzle-orm"


const app = new Hono()
    .get("/", clerkMiddleware() ,async(c)=>{ 
        const auth = getAuth(c);

        if(!auth?.userId){
            throw new HTTPException(401, { message: 'User Unauthorised' })
        }

        const data = await db.select({
            id : acccount.id,
            name : acccount.name

        }).from(acccount)
     return c.json({data})
    })

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

            const [data] = await db
                                .select({
                                    id : acccount.id,
                                    name : acccount.name
                                }) .from (acccount)
                                .where(
                                    and(
                                        eq(acccount.userId , auth?.userId),
                                        eq(acccount.id , id)
                                    ),
                                );
            if(!data){
                return c.json({error : "Not found"} , 404)
            }

            return c.json({data});
        }

    )

    .post("/",
     
         clerkMiddleware(),
         async (c)=>{
        const auth = getAuth(c)

        // const values : any = await c.req.text()

        const bodyText = await c.req.text();
        // const values = JSON.parse(body);
        const values  = JSON.parse(bodyText);


        if (!auth?.userId) {
            return c.json({ error: "unauthorised" });
        }

        // Ensure `values.name` exists before using it
        if (!values?.name) {
            return c.json({ error: "Name is required" }, 400);
        }

      
        console.log(values)

      

        const [data] = await db.insert(acccount).values({
            id : createId(),
            userId : auth?.userId,
           ...values
        }).returning()

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

            const data = await db
                        .delete(acccount)
                        .where(
                            and(
                                eq(acccount.userId,auth.userId),
                                inArray(acccount.id, values.ids)
                            )
                        ).returning({
                            id : acccount.id
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
          "json",
          insertAccountsSchema.pick({
            name: true,
          })
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
    
          const [data] = await db
            .update(acccount)
            .set(values)
            .where(and(eq(acccount.userId, auth.userId), eq(acccount.id, id)))
            .returning();
    
          if (!data) {
            return c.json({ error: "Not found" }, 404);
          }
    
          return c.json({ data });
        }
      )

      .delete(
        "/:id",
        clerkMiddleware(),
        zValidator(
          "param",
          z.object({
            id: z.string().optional(),
          })
        ),
        async (c) => {
          const auth = getAuth(c);
          const { id } = c.req.valid("param");
    
          if (!id) {
            return c.json({ error: "Missing id" }, 400);
          }
    
          if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
          }
    
          const [data] = await db
            .delete(acccount)
            .where(and(eq(acccount.userId, auth.userId), eq(acccount.id, id)))
            .returning({
              id: acccount.id
            } );
    
          if (!data) {
            return c.json({ error: "Not found" }, 404);
          }
    
          return c.json({ data });
        }
      );


export default app