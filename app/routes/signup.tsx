import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from "@vercel/remix";
import { json, redirect } from "@vercel/remix";
import { Form, Link, useActionData } from "@remix-run/react";
import { useRef, useEffect } from "react";

import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import signupStyleSheet from "~/styles/signup.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: signupStyleSheet }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {

  const formData = await request.formData()
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")

  if (typeof name !== "string") {
    return json(
      { errors: { name: "Name is required", email: null, password: null } },
      { status: 400 }
    )
  }

  if (typeof email !== "string" || email.length < 3 || !email.includes("@")) {
    return json(
      { errors: { name: null, email: "Email is invalid", password: null } },
      { status: 400 }
    )
  }
  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { name: null, email: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { name: null, email: null, password: "Password is too short" } },
      { status: 400 },
    );
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return json(
      {
        errors: {
          name: null,
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 },
    );
  }

  const user = await createUser(name, email, password)

  return createUserSession({
    redirectTo: '/',
    remember: true,
    request,
    userId: user.id
  })
}



export default function Signup() {
  const actionData = useActionData<typeof action>()
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {

    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef?.current?.focus()
    }
  }, [actionData]);

  return (
    <div className="page">
      <Form method="post">
        <h1>Create an account</h1>
        <div>
          <input
            autoFocus
            ref={nameRef}
            placeholder="Name"
            name="name"
            type="text"
            aria-invalid={actionData?.errors?.name ? true : undefined}
          />
          {actionData?.errors?.name && (
            <div id="name-error">
              {actionData.errors.name}
            </div>
          )}
        </div>
        <div>
          <input
            placeholder="Email address"
            ref={emailRef}
            name="email"
            type="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
          />
          {actionData?.errors?.email && (
            <div id="email-error">
              {actionData.errors.email}
            </div>
          )}
        </div>
        <div>
          <input
            placeholder="Password"
            ref={passwordRef}
            name="password"
            type="password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
          />
          {actionData?.errors?.password && (
            <div id="password-error">
              {actionData.errors.password}
            </div>
          )}
        </div>
        <input
          type="submit"
          value="Signup"
        />
        <Link className="back ml-10" to="/">
          or Cancel
        </Link>
      </Form>
    </div>
  )
}
