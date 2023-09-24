import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from "@vercel/remix";
import { json, redirect } from "@vercel/remix";
import { Form, Link, useActionData } from "@remix-run/react";
import { useRef, useEffect } from "react";

import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import signupStyleSheet from "~/styles/signup.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: signupStyleSheet }];
};

export async function action({ request }: ActionFunctionArgs) {

  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")

  if (typeof email !== "string" || email.length < 3 || !email.includes("@")) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    )
  }
  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 },
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo: '/',
    remember: true,
    request,
    userId: user.id,
  });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export default function Login() {
  const actionData = useActionData<typeof action>()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef?.current?.focus()
    }
  }, [actionData]);


  return (
    <div className="page">
      <Form method="post">
        <h1>Login</h1>
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
          value="Login"
        />
        <Link className="back ml-10" to="/">
          or Cancel
        </Link>
      </Form>
    </div>
  )
}