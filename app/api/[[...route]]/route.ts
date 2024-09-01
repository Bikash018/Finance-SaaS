import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { handle } from 'hono/vercel'
import accounts from "./accounts"
import categories from "./categories"
import { HTTPException } from 'hono/http-exception'

export const runtime = 'edge'

const app = new Hono().basePath('/api')


app.onError((err, c) => {
    if (err instanceof HTTPException) {
      // Get the custom response
      return err.getResponse()
    }

    return new Response('An unexpected error occurred', { status: 500 });
    //...
  })





const routes = app
    .route("/accounts", accounts)
    .route("/categories", categories)



// app.get('/hello', clerkMiddleware(), (c) => {

//   const auth = getAuth(c)

//   if (!auth?.userId) {
//     return c.json({
//       message: 'You are not logged in.'
//     })
//   }
//   return c.json({
//     message: 'Hello Next.js!',
//   })
// })

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes