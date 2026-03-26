"use client";

import { LayoutDashboard, PenTool, Sparkles, Settings, LogOut, Layout, ShieldCheck, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const sidebarItems = [
  { id: 'ats', icon: ShieldCheck, label: 'ATS Checker' },
  { id: 'builder', icon: PenTool, label: 'Resume Builder' },
  { id: 'templates', icon: Layout, label: 'Templates' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'My Resumes' },
  { id: 'features', icon: Sparkles, label: 'AI Features' },
  { id: 'how-it-works', icon: Info, label: 'How It Works' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ user, activeTab, setActiveTab, onSignOut }) {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-transparent pt-8 hidden xl:block select-none border-r border-gray-100/50 z-[90]">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-1 pr-4">
          {sidebarItems.map((item) => {
            const active = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-item w-full group ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {active && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 rounded-full bg-blue-600" 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* User Section at Bottom */}
        {user && (
          <div className="mt-auto mb-8 pr-4">
            <div className="mx-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-left">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 truncate">{user.email.split('@')[0]}</p>
                  <p className="text-[10px] text-gray-400 truncate">Free Plan</p>
                </div>
              </div>
              <button 
                onClick={onSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all border border-gray-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
