'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, Users, Calendar, Heart, Newspaper } from 'lucide-react';

export function AlumniDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('auth_user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-[#1a1a1a] text-white h-14 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-0.5">
            <span className="text-[#F59E0B] font-bold text-base tracking-tight">CAMPUS</span>
            <span className="text-white font-light text-base tracking-tight">Alumni</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
            <h1 className="text-lg font-bold text-gray-900 mb-1">Alumni Portal</h1>
            <p className="text-sm text-gray-600">{user?.user_metadata?.full_name || user?.email}</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link href="/alumni/dashboard" className="bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors">
              <Users className="w-8 h-8 text-[#F59E0B] mb-2" />
              <p className="text-sm font-semibold text-gray-900">Dashboard</p>
            </Link>
            <button className="bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors text-left">
              <Calendar className="w-8 h-8 text-[#F59E0B] mb-2" />
              <p className="text-sm font-semibold text-gray-900">Events</p>
            </button>
            <button className="bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors text-left">
              <Newspaper className="w-8 h-8 text-[#F59E0B] mb-2" />
              <p className="text-sm font-semibold text-gray-900">News</p>
            </button>
            <button className="bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors text-left">
              <Heart className="w-8 h-8 text-[#F59E0B] mb-2" />
              <p className="text-sm font-semibold text-gray-900">Donate</p>
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-green-900 mb-2">Alumni Module</h3>
            <p className="text-xs text-green-700 leading-relaxed">
              Stay connected with your alma mater. Access alumni events, networking, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
