'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, Mail, BookmarkIcon, User, MoreHorizontal } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Logout from './Logout';
import useAuthStore from '@/store/useAuthStore';
import Skeleton from 'react-loading-skeleton';
import { useCurrentUser } from '@/routes/userService'; // Import the new hook
import { cn } from '@/lib/utils';
import { FaXTwitter } from 'react-icons/fa6';

export default function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { data: userData, isLoading } = useCurrentUser(); // Use the hook

  // Dynamically determine profile link based on user data
  const sidebarItems = [
    {
      name: 'Home',
      href: '/home',
      icon: Home
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: Search
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: Mail
    },
    {
      name: 'Bookmarks',
      href: '/bookmarks',
      icon: BookmarkIcon
    },
    {
      name: 'Profile',
      href: userData ? `/${userData.username}` : '/profile',
      icon: User
    }
  ];

  return (
    <aside className="lg:w-[300px] sticky top-0 h-screen hidden sm:block">
      <div className="flex flex-col justify-between h-full p-2">
        <div className="space-y-2 pr-0 lg:pr-6">
          <Link href="/home" className="mb-4 mt-1 max-w-max block text-xl pl-4 font-bold text-[var(--white)]">
            <FaXTwitter className="h-7 w-7" />
          </Link>
          <nav className="">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.name === 'Profile' && pathname.includes(`/${userData?.username}`));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex max-w-max lg:max-w-full items-center gap-4 rounded-full px-4 py-2 text-base transition-colors text-[var(--white)] hover:bg-[#161616] ${
                    isActive ? 'font-bold' : 'font-normal'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              );
            })}
            <Link
              href="/compose/posts"
              className={cn(buttonVariants({ variant: 'ghost' }), 'max-w-full mt-2 hidden lg:flex rounded-full bg-[var(--white)] hover:bg-gray-100 p-5 text-base font-bold text-[var(--black)]')}
            >
              Post
            </Link>
          </nav>
        </div>

        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-full p-2 outline-none text-left transition-colors hover:bg-[#141414]">
                <Avatar className="h-10 w-10">
                  {isLoading ? (
                    <AvatarFallback>
                      <Skeleton circle width={40} height={40} />
                    </AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={userData?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.display_name}`} />
                      <AvatarFallback>{userData?.display_name?.slice(0, 2).toUpperCase() || '?'}</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className="flex-1 overflow-hidden hidden lg:block">
                  {isLoading ? (
                    <>
                      <Skeleton className="w-full h-4 mb-1" />
                      <Skeleton className="w-full h-3" />
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-[var(--white)]">{userData?.display_name || 'Guest'}</div>
                      {userData?.username && <div className="text-xs text-gray-500">@{userData.username}</div>}
                    </>
                  )}
                </div>
                <MoreHorizontal className="h-5 w-5 text-[var(--white)] hidden lg:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[240px] justify-start shadow-sm border-[#141414] text-[var(--white)] p-0 bg-[var(--background)]">
              <DropdownMenuItem className="p-0">
                <Button className="bg-transparent hover:bg-[#141414] items-start justify-start font-normal text-[var(--white)] rounded-none p-2 w-full">List</Button>
              </DropdownMenuItem>
              {isAuthenticated && (
                <DropdownMenuItem className="p-0">
                  <Logout userData={userData} />
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
