import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign, verify} from 'hono/jwt'
import { signinInput, signupInput} from '@shauray03/common';
// Create the main Hono app
export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();

userRouter.post('/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const {success} = signupInput.safeParse(body)
	try {
		if (!success) {
			c.status(400);
			return c.json({ error: "invalid input" });
		}
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password,
				name: body.name
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
		return c.json({ error: "wrong credentials or user already exist" });
	}
})

userRouter.post('/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const {success} = signinInput.safeParse(body); 
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
	const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})


userRouter.post("/", async (c) => { 
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const user = await prisma.user.findUnique({
        where: {
            id: body.id
        }
    });
    return c.json({
        user
    });
});


// const posts = await prisma.post.findMany({
// 	select: {
// 		content: true,
// 		title:true,
// 		id:true,
// 		author: {
// 			select: { 
// 				name: true
// 			}
// 		}

// 	}
// })
// return c.json({
// 	posts
// })
