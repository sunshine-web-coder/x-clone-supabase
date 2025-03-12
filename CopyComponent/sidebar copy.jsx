"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Bell, Mail, BookmarkIcon, User, Settings, MoreHorizontal, Twitter, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sidebarItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Explore",
    href: "/explore",
    icon: Search,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: Mail,
  },
  {
    name: "Bookmarks",
    href: "/bookmarks",
    icon: BookmarkIcon,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen border flex-col justify-between p-4 min-w-[275px] border-r">
      <div className="space-y-2">
        <Link href="/" className="mb-6 flex items-center text-xl font-bold hover:text-blue-500">
          <Twitter className="h-8 w-8" />
        </Link>

        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 rounded-full px-4 py-2 text-lg transition-colors hover:bg-gray-100 ${
                  isActive ? "font-bold" : "font-normal"
                }`}
              >
                <Icon className="h-7 w-7" />
                <span>{item.name}</span>
              </Link>
            )
          })}

          <Button className="w-full rounded-full bg-blue-500 px-4 py-6 text-lg font-bold text-white hover:bg-blue-600">
            Tweet
          </Button>
        </nav>
      </div>

      <div className="flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-full p-3 text-left transition-colors hover:bg-gray-100">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="font-bold">John Doe</div>
                <div className="text-sm text-gray-500 truncate">@johndoe</div>
              </div>
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px]">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookmarkIcon className="mr-2 h-4 w-4" />
              <span>Bookmarks</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Lists</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

