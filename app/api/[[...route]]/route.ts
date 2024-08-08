import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { handle } from 'hono/vercel'
import accounts from "./accounts"

export const runtime = 'edge'

const app = new Hono().basePath('/api')


app.route("/accounts", accounts)


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