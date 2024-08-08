
import {Hono} from "hono"

import { acccount } from "@/db/schema"

import {db} from "@/db/drizzle"


const app = new Hono()
    .get("/",async(c)=>{

        const data = await db.select({
            id : acccount.id,
            name : acccount.name

        }).from(acccount)
     return c.json({data})
    })


export default app