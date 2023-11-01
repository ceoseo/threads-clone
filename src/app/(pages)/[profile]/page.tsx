"use client"

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { api } from '@/trpc/react'
import UserProfile from '@/components/user-profile'
import Loading from '../loading'
import ThreadCard from '@/components/threads/thread-card'

export default function page() {
  const path = usePathname()
  const router = useRouter()
  const username = path.substring(2);

  if (!path.startsWith('/@')) {
    const newPath = '/@' + path.replace(/^\//, '')
    router.push(newPath);
    return null;
  }

  const { data, isLoading } = api.post.getUserProfileInfo.useQuery({ username })
  if (isLoading) return <Loading />
  if (!data) return <p>error user not found</p>
  return (
    <div>
      <UserProfile {...data} />
      {data.threads.map((threads) => {
        console.log(threads)
        return (
          <ThreadCard
            key={threads.id}
            id={threads.id}
            text={threads.text}
            createdAt={threads.createdAt}
            likeCount={threads._count.likes}
            replyCount={threads._count.replies}
            user={{
              id: threads.author.id,
              username: threads.author.username,
              image: threads.author.image,
            }}
            parentThreadId="skdll"
            likes={threads.likes}
            replies={threads.replies}
          />
        )
      })}
    </div>
  )
}





