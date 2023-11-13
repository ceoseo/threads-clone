import { PostCardProps } from '@/types'
import React from 'react'

interface UserFollowersProps extends Pick<PostCardProps['author'], 'followers'> {
    showImage: boolean
}

const UserFollowers: React.FC<UserFollowersProps> = ({ followers, showImage }) => {
    return (
        <div className='flex items-center'>
            {showImage &&
                <div className="z-0 flex items-center -space-x-2">
                    {followers.slice(0, 2).map((authorData, index) => (
                        <div
                            key={index}
                            className="relative z-0 flex h-4 w-4 shrink-0 select-none items-center justify-center rounded-full ring-1 ring-border"
                        >
                            <img
                                className="h-full w-full rounded-full object-cover object-center"
                                src={authorData.image ?? ''}
                                alt="Follower"
                            />
                        </div>
                    ))}
                </div>
            }
            {followers.length > 0 &&
                <>
                    <div className='pl-2 text-[#777777] text-[15px]'>{followers.length} {followers.length === 1 ? 'follower' : 'followers'}</div>
                </>
            }
        </div>
    )
}

export default UserFollowers