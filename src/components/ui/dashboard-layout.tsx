'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Users,
  BarChart,
  Home,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from './button';
import { Card } from './card';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      description: 'Overview of your child\'s progress'
    },
    {
      name: 'WonderChat',
      href: '/dashboard/chat',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Talk with our AI assistant'
    },
    {
      name: 'Profiles',
      href: '/dashboard/profiles',
      icon: <Users className="h-5 w-5" />,
      description: 'Manage your child profiles'
    },
    {
      name: 'Progress',
      href: '/dashboard/progress',
      icon: <BarChart className="h-5 w-5" />,
      description: 'Track skill development'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar - visible on all screen sizes */}
      <header className="bg-white border-b shadow-sm z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="font-bold text-2xl text-primary">Wonder<span className="text-indigo-600">Chat</span></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* User menu - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-20 pt-16">
            <nav className="p-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    pathname === item.href || pathname?.startsWith(`${item.href}/`)
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              ))}

              <Button
                variant="destructive"
                className="mt-4"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </nav>
          </div>
        )}

        {/* Sidebar navigation - Desktop */}
        <div className="hidden md:block w-64 p-4 border-r bg-white">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  pathname === item.href || pathname?.startsWith(`${item.href}/`)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 w-56">
            <Card className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm mb-2">Want to learn more about how WonderChat can help your child?</p>
              <Button variant="secondary" size="sm" className="w-full">
                Get Support
              </Button>
            </Card>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
