import AuthLayout from '@/components/AuthLayout';
import RightContent from '@/components/RightContent';
import Sidebar from '@/components/sidebar';
import React from 'react';

export default function HomeLayout({ children }) {
  return (
    <AuthLayout>
      {/* Left Column — Fixed */}
      <Sidebar />

      {/* Middle Column — Fluid */}
      <main className="w-[550px]">{children}</main>

      {/* Right Column — Sticky */}
      <RightContent />
    </AuthLayout>
  );
}
