"use client";

import { Check, Info, Briefcase, GraduationCap, Code, PenTool, Layout, Zap, Rocket, Heart, BarChart3, Award, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const templates = [
  { id: 'professional', name: 'Professional', icon: Briefcase, color: 'bg-slate-800', layout: 'center' },
  { id: 'fresher', name: 'Fresher', icon: Award, color: 'bg-green-600', layout: 'left' },
  { id: 'data-scientist', name: 'Data Scientist', icon: Code, color: 'bg-purple-600', layout: 'tech' },
  { id: 'creative', name: 'Creative', icon: PenTool, color: 'bg-pink-500', layout: 'spread' },
  { id: 'executive', name: 'Executive', icon: UserCircle, color: 'bg-indigo-900', layout: 'classic' },
  { id: 'technical', name: 'Technical', icon: Code, color: 'bg-amber-500', layout: 'blocks' },
  { id: 'academic', name: 'Academic', icon: GraduationCap, color: 'bg-black', layout: 'clean' },
  { id: 'minimalist', name: 'Minimalist', icon: Layout, color: 'bg-gray-400', layout: 'minimal' },
  { id: 'modern', name: 'Modern', icon: Zap, color: 'bg-red-600', layout: 'bold' },
  { id: 'startup', name: 'Startup', icon: Rocket, color: 'bg-orange-500', layout: 'dynamic' },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'bg-sky-500', layout: 'safe' },
  { id: 'finance', name: 'Finance', icon: BarChart3, color: 'bg-emerald-700', layout: 'formal' },
];

const TemplatePreview = ({ template }) => {
  const { color, layout } = template;
  
  return (
    <div className={`h-full w-full bg-white p-3 flex flex-col gap-1.5 overflow-hidden transition-all group-hover:scale-105`}>
      {/* Header Demo */}
      <div className={`flex flex-col ${layout === 'center' ? 'items-center text-center' : 'items-start'} mb-2`}>
        <div className={`h-2.5 w-24 ${color} rounded-full mb-1 opacity-80`}></div>
        <div className="flex gap-1">
          <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* Body Demo */}
      <div className="space-y-2">
        <div className={`h-1.5 w-full bg-gray-100 rounded-full ${layout === 'bold' ? 'border-l-2 border-red-600 pl-1' : ''}`}></div>
        <div className="flex justify-between items-center">
          <div className="h-1.5 w-1/3 bg-gray-200 rounded-full"></div>
          <div className="h-1 w-1/4 bg-gray-100 rounded-full"></div>
        </div>
        <div className="space-y-1 pl-2">
          <div className="h-1 w-full bg-gray-50 rounded-full"></div>
          <div className="h-1 w-full bg-gray-50 rounded-full"></div>
          <div className="h-1 w-3/4 bg-gray-50 rounded-full"></div>
        </div>
        
        {layout === 'tech' && (
          <div className="grid grid-cols-3 gap-1 mt-2">
            <div className="h-3 bg-purple-50 rounded border border-purple-100"></div>
            <div className="h-3 bg-purple-50 rounded border border-purple-100"></div>
            <div className="h-3 bg-purple-50 rounded border border-purple-100"></div>
          </div>
        )}

        {layout === 'blocks' && (
          <div className="space-y-1.5 mt-2">
            <div className="h-4 bg-amber-50 border-l-2 border-amber-500 rounded-r"></div>
            <div className="h-4 bg-amber-50 border-l-2 border-amber-500 rounded-r"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function TemplatesView({ currentTemplate, onSelect }) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Choose Style Template</h2>
          <p className="text-gray-500 font-medium tracking-tight">Select a template to instantly transform your resume's look and feel.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest">
           <Layout className="w-4 h-4" />
           {templates.length} Templates Available
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative group rounded-[32px] overflow-hidden border-2 transition-all p-3 cursor-pointer bg-white ${
              currentTemplate === template.id 
                ? 'border-blue-600 shadow-2xl shadow-blue-100 bg-blue-50/30' 
                : 'border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-100'
            }`}
            onClick={() => onSelect(template.id)}
          >
            {/* Template Preview Demo */}
            <div className="h-44 rounded-[24px] overflow-hidden border border-gray-100 bg-gray-50 mb-4 shadow-inner relative">
              <TemplatePreview template={template} />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
            </div>

            <div className="px-1 pb-1">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  currentTemplate === template.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                }`}>
                  <template.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-black text-sm truncate uppercase tracking-tight ${
                    currentTemplate === template.id ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {template.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    {template.id === 'minimalist' ? 'Best for Clean Look' : 'Premium Style'}
                  </p>
                </div>
                {currentTemplate === template.id && (
                  <div className="bg-blue-600 rounded-full p-1 shadow-lg shadow-blue-200">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
