import React from 'react';

export default function InnerMainLayout({ children }) {
  return <div className="w-full sm:w-[500px] border-x border-zinc-700">{children}</div>;
}
