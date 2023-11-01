"use client"

import React from 'react'
import { Icons } from '../icons'
import { MoreHorizontal, Plus } from 'lucide-react'
import { SingleThreadCardProps } from '@/types'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import CreateThread from './create-thread'
import Link from 'next/link'
import TestParent from '@/app/test/page'
import ThreadCard from './thread-card'
import ParentThreadCard from './parent-thread-card'

const ReplyThreadCard: React.FC<SingleThreadCardProps> = ({ text, likes, user, id, replyCount, parentThread }) => {

    // console.log('all pass props', text, likes, user, id)
    const { user: loginUser } = useUser()

    const likedByMe = likes.some((like: any) => like.user.id === loginUser?.id);

    const likeUpdate = React.useRef({
        likedByMe,
        likeCount: likes.length
    });


    const { mutate: toggleLike } = api.post.toggleLike.useMutation({
        onMutate: async ({ id }) => {
            // Save the current values for potential rollback
            const previousLikedByMe = likeUpdate.current.likedByMe;
            const previousLikeCount = likeUpdate.current.likeCount;

            likeUpdate.current.likedByMe = !likeUpdate.current.likedByMe;
            likeUpdate.current.likeCount = likeUpdate.current.likedByMe ? likeUpdate.current.likeCount + 1 : likeUpdate.current.likeCount - 1;


            return { previousLikedByMe, previousLikeCount };
        },
        onError: (error, variables, context) => {
            // Rollback to previous values
            likeUpdate.current.likedByMe = context?.previousLikedByMe!;
            likeUpdate.current.likeCount = context?.previousLikeCount!;

            toast.error("LikeCallBack: Something went wrong!")
        }
    });
    return (
        <>
            <div className='flex flex-col w-full pt-4'>
                {parentThread && (
                    <>
                        {console.log("this is parent I'm passing", parentThread)}
                        <ParentThreadCard {...parentThread} />
                    </>
                )}
                <div className="flex items-center gap-3 z-50 w-full pr-2 ">
                    <button className='relative'>
                        <div className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full'>
                            <img
                                src={user.image}
                                alt="user Avatar"
                                className="rounded-full w-full h-full "
                            />
                        </div>
                        <div className='bg-foreground absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-background'>
                            <Plus className='h-4 w-4 p-0.5' />
                        </div>
                    </button>

                    <div className="flex w-full justify-between gap-5 pl-1">
                        <span className="flex items-center justify-center gap-1.5 cursor-pointer">
                            <h1 className="text-white text-[15px] font-semibold leading-[0px]">
                                {user.username}
                            </h1>
                            <Icons.verified className='w-3 h-3' />
                        </span>
                        <div className="justify-between items-center self-stretch flex gap-2.5">
                            <div className="text-right text-[15px] leading-none self-stretch  text-[#777777]"> 45m</div>
                            <MoreHorizontal className='aspect-square object-cover object-center h-4 w-4 overflow-hidden flex-1' />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <div className="justify-center items-start self-stretch flex flex-col max-md:max-w-full  ">
                        <div className="justify-center items-start flex w-full flex-col  pt-1.5 self-start">
                            <div className="text-white  leading-5 mt-1 max-md:max-w-full text-[15px]">
                                {text}
                            </div>
                            <div className="flex  font-bold -ml-2 mt-2 w-full z-50">
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit'>
                                    <Icons.heart
                                        onClick={() => {
                                            toggleLike({ id })
                                        }}
                                        fill={likeUpdate.current.likedByMe ? '#ff3040' : 'none'}
                                        className={cn('w-5 h-5 ', {
                                            "text-[#ff3040]": likeUpdate.current.likedByMe
                                        }
                                        )} />
                                </div>
                                <CreateThread showIcon={true} replyThreadInfo={{
                                    id,
                                    text,
                                    author: user
                                }} />
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit'>
                                    <Icons.repost className='w-5 h-5 ' />
                                </div>
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 '>
                                    <Icons.share className='w-5 h-5 ' />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* {likeUpdate.current.likeCount > 0 &&
                    <div className="flex items-start gap-2 text-[#777777] text-[15px] text-center mt-0.5 pb-4 z-50">
                        <p>0 replies</p>
                        <p>{likeUpdate.current.likeCount} likes</p>
                    </div>
                } */}
                    <Link href={`/@${user.username}/post/${id}`} className={cn('flex items-center gap-2 text-[#777777] text-[15px] text-center z-50 ', {
                        'mb-4': replyCount > 0 || likeUpdate.current.likeCount > 0
                    })}>
                        {replyCount > 0 && <p className='hover:underline mt-0.5'>{replyCount} replies</p>}
                        {replyCount > 0 && likeUpdate.current.likeCount > 0 && <p> · </p>}
                        {likeUpdate.current.likeCount > 0 &&
                            <p className='hover:underline mt-0.5' >{likeUpdate.current.likeCount} likes</p>
                        }
                    </Link>
                </div>
            </div >
        </>
    )
}

export default ReplyThreadCard

