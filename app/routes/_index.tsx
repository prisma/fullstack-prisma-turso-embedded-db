import { json } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import Post from '~/components/Post'
import { getFeed } from '~/models/post.server';

export async function loader() {
  const feed = await getFeed()

  return json({ feed })
}

export default function Index() {
  const { feed } = useLoaderData<typeof loader>()
  return (
    <div className="page">
      <h1>Public Feed</h1>
      <main>
        {feed.map((post) => (
          <div key={post.id} className="post">
            <Post post={post} />
          </div>
        ))}
      </main>
    </div>
  );
}
