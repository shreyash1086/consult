import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-near-black text-white selection:bg-brand-red/30 selection:text-white">
      <Sidebar />
      <main className="flex-1 p-10 max-w-[1600px] mx-auto w-full relative">
        {/* Subtle background glow */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48"></div>
        <div className="fixed bottom-0 left-72 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -ml-40 -mb-40"></div>
        
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
