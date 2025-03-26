'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, Mail, BookmarkIcon, User, Settings, MoreHorizontal, Twitter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useAuthStore from '@/store/useAuthStore';
import Skeleton from 'react-loading-skeleton';

export default function RightContent() {

  return (
    <aside className="w-[350px] sticky top-0 hidden lg:block h-screen pl-7 pt-1">
      <div className="bg-gray-50 p-4 rounded-xl">
        <h2 className="font-bold text-lg mb-4">Subscribe to Premium</h2>
        <p className="text-sm">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
      </div>
    </aside>
  );
}
