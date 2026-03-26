"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, CheckCircle2, User, Loader2, Upload, Target, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function AtsCheckerPage() {
  const { user } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setError("Please upload a resume file (.pdf, .doc, .docx) to begin.");
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAtsResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      const response = await fetch('/api/external-ats', {
        method: 'POST',
        // Note: Do NOT set Content-Type header when sending FormData, the browser handles it
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setAtsResult(result.atsData);
      } else {
        setError(result.error || "Failed to analyze resume.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden font-sans text-slate-200">
      {/* Background Elements */}
      <div className="absolute top-[-10%] -left-[10%] w-[50%] h-[50%] bg-[#808000]/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-[#f5f5dc]/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 pointer-events-none"></div>
      
      {/* Navigation */}
      <nav className="relative z-[100] backdrop-blur-md bg-[#020617]/50 border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f5f5dc] to-[#808000] flex items-center justify-center">
               <ShieldCheck className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-white">ResumeBuilder<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d1ebd4] to-[#808000]">.ai</span></span>
          </Link>
          <div className="flex items-center space-x-4">
             <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors mr-2 hidden sm:block">
              Builder
            </Link>
            {user && (
               <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors mr-4">
                Dashboard
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center text-sm font-medium text-[#d1ebd4]">
                  <User className="w-4 h-4 mr-2" />
                  {user.email}
                </div>
                <button 
                  onClick={() => supabase.auth.signOut()} 
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
               <Link href="/" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-slate-900 hover:bg-slate-200 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                 Login / Sign Up
               </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-semibold mb-6 text-[#d1ebd4]"
          >
             <ShieldCheck className="w-4 h-4" />
             <span>Universal ATS Evaluation</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Are you beating the bots?</h1>
          <p className="text-slate-400 text-lg">
            Paste your existing resume exactly as it is. Our AI acts as an Applicant Tracking System to identify missing keywords and formatting flaws before you apply.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-[0_8px_32px_rgb(0,0,0,0.5)]"
          >
             <form onSubmit={handleAnalyze} className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
                     <FileText className="w-4 h-4 text-[#808000]" /> Upload Your Resume
                  </label>
                  
                  <div className="relative group">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-full h-40 md:h-64 px-4 py-8 bg-slate-800/50 rounded-xl border-2 border-dashed ${resumeFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700/50 group-hover:border-cyan-500/50'} flex flex-col items-center justify-center transition-all shadow-inner text-center`}>
                      {resumeFile ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          </div>
                          <p className="text-white font-semibold text-lg">{resumeFile.name}</p>
                          <p className="text-emerald-400 text-sm mt-1">Ready to analyze</p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-[#d1ebd4]" />
                          </div>
                          <p className="text-slate-300 font-semibold md:text-lg">Click to browse or drag & drop</p>
                          <p className="text-slate-500 text-sm mt-2">Supports PDF and Word Documents (.doc, .docx)</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
                     <Target className="w-4 h-4 text-[#d1ebd4]" /> Target Job Description (Optional but Recommended)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the requirements or description of the job you want to apply for..."
                    className="w-full h-32 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50 focus:bg-slate-800 focus:ring-2 focus:ring-[#808000] focus:border-transparent outline-none transition-all placeholder-slate-600 text-white resize-none shadow-inner text-sm md:text-base"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full py-4 px-6 bg-[#f5f5dc] text-[#2c331a] hover:bg-[#e8dcc4] font-bold rounded-xl shadow-[0_0_20px_rgba(245,245,220,0.2)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border border-[#808000]/30"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> <span>Running ATS Scan...</span></>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> <span>Analyze Resume</span></>
                  )}
                </button>
             </form>
          </motion.div>

          {/* Results Panel */}
          <div className="lg:col-span-5 h-full">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                 <motion.div 
                   key="loading"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8 text-center"
                 >
                    <div className="relative w-32 h-32 mb-8">
                       <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-[#808000] rounded-full border-t-transparent animate-spin"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-slate-600" />
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 animate-pulse">Scanning Keywords...</h3>
                    <p className="text-sm text-slate-500">Evaluating your experience against ATS parameters.</p>
                 </motion.div>
              ) : atsResult ? (
                 <motion.div 
                   key="results"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="h-full bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700 shadow-2xl relative overflow-hidden flex flex-col"
                 >
                    {/* Top decoration */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${
                      atsResult.ats_score >= 80 ? 'bg-emerald-500 shadow-[0_0_15px_theme(colors.emerald.500)]' :
                      atsResult.ats_score >= 60 ? 'bg-amber-500 shadow-[0_0_15px_theme(colors.amber.500)]' :
                      'bg-rose-500 shadow-[0_0_15px_theme(colors.rose.500)]'
                    }`} />

                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-2xl font-bold text-white flex items-center">
                          <Target className="w-6 h-6 mr-3 text-[#d1ebd4]" />
                          ATS Scan Report
                       </h2>
                       <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${atsResult.ats_score >= 80 ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : atsResult.ats_score >= 60 ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'}`}>
                         {atsResult.final_recommendation || "Needs Review"}
                       </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-700/50">
                      <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
                          <circle className="text-slate-800 stroke-current" strokeWidth="6" cx="50" cy="50" r="45" fill="transparent" />
                          <motion.circle
                            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - (atsResult.ats_score || 0) / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`${
                              atsResult.ats_score >= 80 ? 'text-emerald-500' : atsResult.ats_score >= 60 ? 'text-amber-500' : 'text-rose-500'
                            } stroke-current`}
                            strokeWidth="6"
                            strokeLinecap="round"
                            cx="50"
                            cy="50"
                            r="45"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 45}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-white">{atsResult.ats_score}</span>
                          <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Score</span>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-4">
                         <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Keywords</h4>
                            <div className="flex flex-wrap gap-1.5">
                               {atsResult.keyword_match?.matched?.slice(0, 3).map((kw, i) => (
                                 <span key={i} className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">{kw}</span>
                               ))}
                               {atsResult.keyword_match?.missing?.slice(0, 2).map((kw, i) => (
                                 <span key={i} className="text-xs px-2 py-1 bg-rose-500/20 text-rose-300 rounded-md border border-rose-500/30">{kw}</span>
                               ))}
                            </div>
                         </div>
                         <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1.5">
                               {atsResult.skills_match?.matched_skills?.slice(0, 3).map((sk, i) => (
                                 <span key={i} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md border border-blue-500/30">{sk}</span>
                               ))}
                               {atsResult.skills_match?.missing_skills?.slice(0, 2).map((sk, i) => (
                                 <span key={i} className="text-xs px-2 py-1 bg-rose-500/20 text-rose-300 rounded-md border border-rose-500/30">{sk}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto hidden-scrollbar pr-2 space-y-6">
                      
                      {/* Structure & Formatting */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <h4 className="text-sm font-bold text-[#d1ebd4] mb-3 flex items-center">
                             <FileText className="w-4 h-4 mr-2" /> Structure Check
                           </h4>
                           <ul className="space-y-2 text-sm">
                             {atsResult.resume_sections?.present?.map((sec, i) => (
                               <li key={i} className="flex items-center text-emerald-300"><CheckCircle2 className="w-3.5 h-3.5 mr-2" /> {sec}</li>
                             ))}
                             {atsResult.resume_sections?.missing?.map((sec, i) => (
                               <li key={i} className="flex items-center text-rose-400"><AlertCircle className="w-3.5 h-3.5 mr-2" /> Missing: {sec}</li>
                             ))}
                           </ul>
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-[#d1ebd4] mb-3 flex items-center">
                             <Target className="w-4 h-4 mr-2" /> Formatting Warnings
                           </h4>
                           <ul className="space-y-2 text-sm">
                             {atsResult.formatting_issues?.length > 0 ? (
                               atsResult.formatting_issues.map((issue, i) => (
                                 <li key={i} className="flex items-start text-amber-300"><AlertCircle className="w-3.5 h-3.5 mr-2 mt-0.5 shrink-0" /> <span className="leading-tight">{issue}</span></li>
                               ))
                             ) : (
                               <li className="flex items-center text-emerald-300"><CheckCircle2 className="w-3.5 h-3.5 mr-2" /> No major formatting issues</li>
                             )}
                           </ul>
                        </div>
                      </div>

                      {/* Suggestions */}
                      <div>
                        <h4 className="text-sm font-bold text-[#d1ebd4] mb-4 bg-slate-900/80 backdrop-blur-sm py-2 sticky top-0">
                          Actionable Feedback & Suggestions
                        </h4>
                        <div className="space-y-3">
                          {atsResult.improvement_suggestions?.map((req, idx) => (
                             <div key={idx} className="bg-slate-800/40 border border-[#808000]/30 rounded-xl p-3 flex gap-3">
                               <div className="mt-0.5 shrink-0 text-[#808000]">
                                 <Sparkles className="w-4 h-4" />
                               </div>
                               <p className="text-slate-300 text-sm leading-relaxed">{req}</p>
                             </div>
                          ))}
                        </div>
                      </div>

                    </div>

                 </motion.div>
              ) : (
                 <motion.div 
                   key="empty"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-800/20 rounded-3xl border border-slate-800/50 border-dashed p-8 text-center"
                 >
                    <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-6 border border-slate-700/30">
                       <Upload className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Awaiting Resume</h3>
                    <p className="text-sm text-slate-500 max-w-xs">Enter your details and hit analyze to see your score.</p>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
