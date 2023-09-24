import { type LoaderFunctionArgs, json } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import Post from '~/components/Post'
import { getDraftPosts } from '~/models/post.server';
import { getUserId } from '~/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const authorId = await getUserId(request);
  const drafts = await getDraftPosts({ authorId: Number(authorId) })

  return json({ drafts })
}

export default function Index() {
  const { drafts } = useLoaderData<typeof loader>()
  return (
    <div className="page">
      <h1>My Drafts</h1>
      <main>
        {drafts.map((post) => (
          <div key={post.id} className="post">
            <Post post={post} />
          </div>
        ))}
      </main>
    </div>
  );
}
