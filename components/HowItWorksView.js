"use client";

import { motion } from 'framer-motion';
import { Sparkles, PenTool, Layout, ShieldCheck, Zap, ArrowRight, MousePointer2, FileText, Target } from 'lucide-react';

const steps = [
  {
    icon: PenTool,
    title: 'Resume Builder',
    description: 'Enter your details into our minimalist form. Our live preview updates in real-time as you type, showing you exactly how your resume looks.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: Sparkles,
    title: 'AI Enhancements',
    description: 'Use the "Auto Generate" feature to craft professional summaries and bullet points. Our AI uses job-market benchmarks to highlight your best achievements.',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    icon: Layout,
    title: 'Premium Templates',
    description: 'Switch between 12 designer-crafted templates. Each style is optimized for specific industries, from technical roles to creative arts.',
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    icon: ShieldCheck,
    title: 'ATS Checker',
    description: 'Scan your existing resume or the one you just built. Our system replicates major ATS algorithms to ensure you beat the automated screening bots.',
    color: 'bg-orange-50 text-orange-600'
  }
];

export default function HowItWorksView() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black mb-4 uppercase tracking-widest">
           <Zap className="w-4 h-4" />
           The Modern Resume Workflow
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">How It Works</h2>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">Learn how to leverage our powerful suite of tools to land your dream job faster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${step.color}`}>
               <step.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">{step.title}</h3>
            <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">{step.description}</p>
            <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest">
               Learn More <ArrowRight className="w-3 h-3" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-[48px] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 filter blur-[80px] rounded-full -mr-10 -mt-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
           <div className="flex-1">
             <h3 className="text-2xl font-black mb-4 uppercase">The Goal: ATS Dominance</h3>
             <p className="text-gray-400 font-medium mb-8 leading-relaxed">
               90% of large companies use Applicant Tracking Systems (ATS) to filter resumes. Our platform is built specifically to generate clean HTML structures that these systems love, while maintaining a stunning visual design for human recruiters.
             </p>
             <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-black mb-1">98%</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ATS Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-black mb-1">Live</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Preview Editing</div>
                </div>
             </div>
           </div>
           <div className="w-full md:w-1/3 aspect-video bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
              <MousePointer2 className="w-12 h-12 text-blue-500 animate-pulse" />
           </div>
        </div>
      </div>
    </div>
  );
}
