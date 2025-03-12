'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, Mail, BookmarkIcon, User, MoreHorizontal, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Logout from './Logout';
import useAuthStore from '@/store/useAuthStore';
import Skeleton from 'react-loading-skeleton';
import { useCurrentUser } from '@/routes/userService'; // Import the new hook

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
    <aside className="w-56 sticky top-0 hidden md:block h-screen border-r border-zinc-600">
      <div className="sticky top-0 left-0 bottom-0 flex flex-col justify-between h-screen p-2">
        <div className="space-y-2">
          <Link href="/" className="mb-6 max-w-max block text-xl pl-4 font-bold text-[var(--white)]">
            <Twitter className="h-8 w-8" />
          </Link>
          <nav className="space-y-1">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.name === 'Profile' && pathname.includes(`/${userData?.username}`));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-base transition-colors text-[var(--white)] hover:bg-[#161616] ${isActive ? 'font-bold' : 'font-normal'}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Button className="max-w-full rounded-full bg-[var(--white)] hover:bg-gray-100 p-4 text-base font-bold text-[var(--black)]">Post</Button>
          </nav>
        </div>

        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-full p-3 py-2 outline-none text-left transition-colors hover:bg-[#141414]">
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
                <div className="flex-1 overflow-hidden">
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
                <MoreHorizontal className="h-5 w-5 text-[var(--white)]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] shadow-sm border-[#141414] text-[var(--white)] p-0 bg-[var(--background)]">
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
