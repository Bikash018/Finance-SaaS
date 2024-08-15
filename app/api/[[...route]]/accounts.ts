
import {Hono} from "hono"

import { acccount, insertAccountsSchema } from "@/db/schema"

import {zValidator} from "@hono/zod-validator"
import {createId} from  "@paralleldrive/cuid2"

import {db} from "@/db/drizzle"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { HTTPException } from "hono/http-exception"


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


export default app