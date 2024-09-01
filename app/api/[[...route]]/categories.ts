
import {Hono} from "hono"

import {categories , insertCategoriesSchema } from "@/db/schema"

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
            id : categories.id,
            name : categories.name

        }).from(categories)
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
                                    id : categories.id,
                                    name : categories.name
                                }) .from (categories)
                                .where(
                                    and(
                                        eq(categories.userId , auth?.userId),
                                        eq(categories.id , id)
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

      

        const [data] = await db.insert(categories).values({
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
                        .delete(categories)
                        .where(
                            and(
                                eq(categories.userId,auth.userId),
                                inArray(categories.id, values.ids)
                            )
                        ).returning({
                            id : categories.id
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
          insertCategoriesSchema.pick({
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
            .update(categories)
            .set(values)
            .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
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
            .delete(categories)
            .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
            .returning({
              id: categories.id
            } );
    
          if (!data) {
            return c.json({ error: "Not found" }, 404);
          }
    
          return c.json({ data });
        }
      );


export default app