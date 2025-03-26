import React from 'react';

export default function MainLayout({ children }) {
  return <div className="mx-auto max-w-[700px] lg:max-w-[1050px] sm:px-4 flex items-start justify-center min-h-screen">{children}</div>;
}
