"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, CheckCircle2, Loader2, Upload, Target, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export default function AtsCheckerView({ user }) {
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">ATS Checker</h2>
          <p className="text-gray-500 font-medium">Scan your resume against any job description to beat the bots.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest">
           <ShieldCheck className="w-4 h-4" />
           Universal Evaluation
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form */}
        <div className="lg:col-span-7 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
           <form onSubmit={handleAnalyze} className="space-y-6">
              <div>
                <label className="text-sm font-black text-gray-900 flex items-center gap-2 mb-3 uppercase tracking-wider">
                   <Upload className="w-4 h-4 text-blue-600" /> Upload Resume
                </label>
                
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`w-full h-48 px-4 py-8 bg-gray-50 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
                    resumeFile ? 'border-blue-600 bg-blue-50/20' : 'border-gray-200 group-hover:border-blue-300'
                  }`}>
                    {resumeFile ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                          <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-gray-900 font-bold text-lg">{resumeFile.name}</p>
                        <p className="text-blue-600 text-xs font-black mt-1 uppercase tracking-widest">File Loaded</p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                          <FileText className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-gray-900 font-bold">Click to browse or drag & drop</p>
                        <p className="text-gray-400 text-xs mt-2 uppercase font-black tracking-widest">PDF or Word Only</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-gray-900 flex items-center gap-2 mb-3 uppercase tracking-wider">
                   <Target className="w-4 h-4 text-blue-600" /> Job Description (Optional)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements here for a more accurate comparison..."
                  className="w-full h-40 px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-600 transition-all text-gray-900 text-sm font-medium resize-none shadow-inner"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-2">
                   <AlertCircle className="w-4 h-4" />
                   {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-5 px-6 bg-blue-600 text-white hover:bg-blue-700 font-black rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /><span>Scanning...</span></>
                ) : (
                  <><Sparkles className="w-5 h-5" /><span>Analyze Resume</span></>
                )}
              </button>
           </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 h-full min-h-[500px]">
          <AnimatePresence mode="wait">
            {!isAnalyzing && !atsResult ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center bg-white rounded-[32px] border-2 border-dashed border-gray-100 p-8 text-center shadow-sm"
              >
                 <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                    <Info className="w-8 h-8 text-gray-200" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Awaiting Analysis</h3>
                 <p className="text-sm text-gray-400 font-medium max-w-[240px]">Upload your resume to see how it performs against ATS algorithms.</p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center bg-white rounded-[32px] border border-gray-100 p-8 text-center shadow-lg"
              >
                 <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border-4 border-gray-50 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <CheckCircle2 className="w-8 h-8 text-gray-100" />
                    </div>
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 mb-2 animate-pulse uppercase tracking-tight">Beating the Bots</h3>
                 <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Calculating score...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl overflow-y-auto hidden-scrollbar max-h-[700px]"
              >
                 <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Scan Report</h2>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      atsResult.ats_score >= 80 ? 'bg-green-50 border-green-500 text-green-600' : 'bg-orange-50 border-orange-500 text-orange-600'
                    }`}>
                      {atsResult.final_recommendation || "Optimization Required"}
                    </div>
                 </div>

                 <div className="flex flex-col items-center mb-10">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-gray-50 stroke-current" strokeWidth="6" cx="50" cy="50" r="45" fill="transparent" />
                        <motion.circle
                          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - (atsResult.ats_score || 0) / 100) }}
                          transition={{ duration: 1.5 }}
                          className={`${atsResult.ats_score >= 80 ? 'text-green-500' : 'text-blue-600'} stroke-current`}
                          strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="45" fill="transparent"
                          strokeDasharray={2 * Math.PI * 45}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-6xl font-black text-gray-900">{atsResult.ats_score}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ATS Score</span>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    {/* Structure Section */}
                    <div>
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-600" /> Content Structure
                      </h4>
                      <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                        {atsResult.resume_sections?.present?.map((sec, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {sec}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Key Insights
                      </h4>
                      <div className="space-y-3">
                        {atsResult.improvement_suggestions?.slice(0, 3).map((tip, i) => (
                          <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs font-medium text-gray-600 leading-relaxed">
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
