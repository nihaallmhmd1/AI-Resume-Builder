"use client";

import { Sparkles, Zap, ShieldCheck, Target, PencilLine, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { 
    icon: Zap, 
    title: 'Instant Professional Summary', 
    description: 'Our AI analyzes your experience to craft a compelling summary that grabs attention.',
    status: 'Active'
  },
  { 
    icon: Target, 
    title: 'ATS Keywords Optimization', 
    description: 'Automatically identifies and integrates relevant keywords for your target role.',
    status: 'Active'
  },
  { 
    icon: BarChart, 
    title: 'Real-time Content Analysis', 
    description: 'Get immediate feedback on your resume structure and impact as you type.',
    status: 'Active'
  },
  { 
    icon: ShieldCheck, 
    title: 'ATS Compatibility Check', 
    description: 'Verifies that your resume can be read by all major Applicant Tracking Systems.',
    status: 'Coming Soon'
  },
  { 
    icon: PencilLine, 
    title: 'Smart Bullet Points', 
    description: 'Transform tasks into achievement-oriented bullet points using action verbs.',
    status: 'Coming Soon'
  }
];

export default function AIFeaturesView() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black mb-4 uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          Powered by Advanced AI
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-3">AI Resume Enhancement</h2>
        <p className="text-gray-500 font-medium max-w-xl mx-auto">Boost your job application success with our suite of intelligent tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${
              feature.status === 'Active' ? 'bg-blue-50 text-blue-600 group-hover:scale-110' : 'bg-gray-50 text-gray-400'
            }`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">{feature.title}</h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                feature.status === 'Active' ? 'bg-green-50 text-green-600 uppercase' : 'bg-gray-100 text-gray-500'
              }`}>
                {feature.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
