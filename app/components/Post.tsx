import { Link } from '@remix-run/react';
import React from 'react'

export type PostProps = {
  id: number
  title: string
  content?: string
  author: {
    id: number
    name: string | null
    email: string
  } | null
}

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : 'Unknown author';

  return (
    <div style={{
      color: 'inherit',
      margin: "2rem"
    }}>
      <Link to={`/p/${post.id}`}>
        <h2>{post.title}</h2>
        <small>By {authorName}</small>
      </Link>
    </div>
  )
}

export default Post