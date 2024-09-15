"use client"
import { UserButton ,ClerkLoaded,ClerkLoading } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
// components/NavBar.tsx
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
interface NavItem  {
    name : string,
    path : string
}

const NavItem: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();


  const navItems : NavItem[] = [
    { name: 'Home', path: '/' },
  
    { name: 'Accounts', path: '/accounts' },
    { name: 'Categories', path: '/categories' },
    { name: 'Transactions', path: '/transactions' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">FinManage</div>
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
              pathname === item.path ? 'bg-gray-900' : ''
            }`}
          >
            {item.name}
          </button>
          ))}
          <ClerkLoaded>
      
          <UserButton/>
          
          </ClerkLoaded>
          <ClerkLoading>
            <div className="w-full flex justify-center">
            <Loader2 className="animate-spin text-muted-foreground text-center"/>
            </div>
        </ClerkLoading>
        </div>
      </div>
    </nav>
  );
};

export default NavItem;
