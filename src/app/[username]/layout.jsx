import InnerMainLayout from '@/components/Layouts/InnerMainLayout';
import MainLayout from '@/components/Layouts/MainLayout';
import AuthLayout from '@/components/Layouts/MainLayout';
import MainLayoutTwo from '@/components/Layouts/MainLayoutTwo';
import RightContent from '@/components/RightContent';
import Sidebar from '@/components/sidebar';
import UserProfile from '@/components/UserComponents/UserProfile';
import React from 'react';

export default function UserPageLayout({ children }) {
  return (
    <MainLayout>
      <Sidebar />
      <MainLayoutTwo>
        <InnerMainLayout>
          <UserProfile />
          {children}
        </InnerMainLayout>
        <RightContent />
      </MainLayoutTwo>
    </MainLayout>
  );
}
