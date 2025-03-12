import React from 'react';
import { Button } from './ui/button';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function Logout({ userData }) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(); // Call the logout function from the store
    router.push('/auth/login'); // Redirect to the login page after logout
  };

  return (
    <Button onClick={handleLogout} className="bg-transparent hover:bg-[#141414] items-start justify-start font-normal text-[var(--white)] rounded-none p-2">
      Log out {userData?.username && `@${userData?.username}`}
    </Button>
  );
}
