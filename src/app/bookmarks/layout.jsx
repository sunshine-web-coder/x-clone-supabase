import InnerMainLayout from '@/components/Layouts/InnerMainLayout';
import MainLayout from '@/components/Layouts/MainLayout';
import AuthLayout from '@/components/Layouts/MainLayout';
import MainLayoutTwo from '@/components/Layouts/MainLayoutTwo';
import RightContent from '@/components/RightContent';
import Sidebar from '@/components/sidebar';
import React from 'react';

export default function BookmarksPageLayout({ children }) {
  return (
    <MainLayout>
      {/* Left Column — Fixed */}
      <Sidebar />
      <MainLayoutTwo>
        <InnerMainLayout>{children}</InnerMainLayout>
        <RightContent />
      </MainLayoutTwo>
    </MainLayout>
  );
}
