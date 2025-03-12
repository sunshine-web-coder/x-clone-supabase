"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, Repeat2, Heart, Share } from "lucide-react"

export function Tweet({ user, content, timestamp, likes: initialLikes, replies, retweets }) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
      setIsLiked(false)
    } else {
      setLikes(likes + 1)
      setIsLiked(true)
    }
  }

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex space-x-3">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <p className="font-bold text-sm">{user.name}</p>
            <span className="text-gray-500 text-sm">@{user.username}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{timestamp}</span>
          </div>
          <p className="mt-1 text-gray-800">{content}</p>
          <div className="mt-3 flex justify-between max-w-md">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
              <MessageCircle className="h-4 w-4 mr-2" />
              {replies}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
              <Repeat2 className="h-4 w-4 mr-2" />
              {retweets}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${isLiked ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
              onClick={handleLike}
            >
              <Heart className="h-4 w-4 mr-2" fill={isLiked ? "currentColor" : "none"} />
              {likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

