import AuthLayout from '@/components/AuthLayout';
import RightContent from '@/components/RightContent';
import Sidebar from '@/components/sidebar';
import UserProfile from '@/components/UserComponents/UserProfile';
import React from 'react';

export default function UserPageLayout({ children }) {
  return (
    <AuthLayout>
      {/* Left Column — Fixed */}
      <Sidebar />

      {/* Middle Column — Fluid */}
      <main className="w-[550px]">
        <UserProfile />
        {children}
      </main>

      {/* Right Column — Sticky */}
      <RightContent />
    </AuthLayout>
  );
}
