'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, Mail, BookmarkIcon, User, Settings, MoreHorizontal, Twitter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Logout from './Logout';
import useAuthStore from '@/store/useAuthStore';
import Skeleton from 'react-loading-skeleton';
import AvatarComponent from './UserAvatar';

export default function RightContent() {

  return (
    <aside className="w-64 sticky top-0 hidden md:block h-screen pl-8 pt-1 border-l border-zinc-600">
      <div className="bg-gray-50 p-4 rounded-xl">
        <h2 className="font-bold text-lg mb-4">Subscribe to Premium</h2>
        <p className="text-sm">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
      </div>
    </aside>
  );
}
