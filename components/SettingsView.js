"use client";

import { Settings, User, Bell, Shield, Palette, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsView({ user }) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-500 font-medium">Manage your account and app preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
             <User className="w-5 h-5 text-gray-400" />
             <h3 className="font-bold text-gray-900">Account</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">Email Address</p>
                <p className="text-xs text-gray-500 font-medium">{user?.email || 'Not signed in'}</p>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 px-4 py-2 bg-blue-50 rounded-xl transition-all">Change</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">Subscription Plan</p>
                <p className="text-xs text-gray-500 font-medium">Free Tier - Unlimited Basic Resumes</p>
              </div>
              <button className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-lg shadow-blue-100 transition-all">Upgrade</button>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:bg-gray-50 transition-all cursor-pointer">
             <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Palette className="w-5 h-5" />
             </div>
             <div>
                <p className="text-sm font-bold text-gray-900">Appearance</p>
                <p className="text-xs text-gray-500 font-medium">Customize your workspace</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:bg-gray-50 transition-all cursor-pointer">
             <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Bell className="w-5 h-5" />
             </div>
             <div>
                <p className="text-sm font-bold text-gray-900">Notifications</p>
                <p className="text-xs text-gray-500 font-medium">Manage email alerts</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:bg-gray-50 transition-all cursor-pointer">
             <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                <Shield className="w-5 h-5" />
             </div>
             <div>
                <p className="text-sm font-bold text-gray-900">Privacy & Security</p>
                <p className="text-xs text-gray-500 font-medium">Data protection settings</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:bg-gray-50 transition-all cursor-pointer">
             <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <HelpCircle className="w-5 h-5" />
             </div>
             <div>
                <p className="text-sm font-bold text-gray-900">Support</p>
                <p className="text-xs text-gray-500 font-medium">Get help and resources</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
