import type { ActionFunctionArgs, LinksFunction } from "@vercel/remix";
import { redirect } from "@vercel/remix";
import { Form, Link, useActionData } from "@remix-run/react";
import { useRef, useEffect } from "react";
import { json } from "react-router";

import { createPost } from "~/models/post.server";
import { requireUserId } from "~/session.server";
import signupStyleSheet from "~/styles/signup.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: signupStyleSheet }];
};

export async function action({ request }: ActionFunctionArgs) {
  const authorId = await requireUserId(request);

  const formData = await request.formData()
  const title = formData.get("title")
  const content = formData.get("content")

  if (typeof title !== "string") {
    return json(
      { errors: { natitleme: "Title is required", content: null } },
      { status: 400 }
    )
  }
  if (typeof content !== "string") {
    return json(
      { errors: { title: "Conent is required", content: null } },
      { status: 400 }
    )
  }

  const draft = await createPost({ content, title, authorId })

  return redirect(`/p/${draft.id}`);
}

export default function Signup() {
  const actionData = useActionData<typeof action>()
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.emailRef) {
      contentRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="page">
      <Form method="post">
        <h1>Create a draft </h1>
        <div>
          <input
            autoFocus
            ref={titleRef}
            placeholder="Title"
            name="title"
            type="text"
            aria-invalid={actionData?.errors?.title ? true : undefined}
          />
          {actionData?.errors?.title && (
            <div id="title-error">
              {actionData.errors.title}
            </div>
          )}
        </div>
        <div>
          <div>
            <textarea
              placeholder="Create your first draft"
              ref={contentRef}
              name="content"
            />
          </div>
        </div>
        <input
          type="submit"
          value="Create"
        />
        <Link className="back ml-10" to="/">
          or Cancel
        </Link>
      </Form>
    </div>
  )
}