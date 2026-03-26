"use client";

import { useState, useEffect } from 'react';
import { Download, Save, Check, AlertCircle, Loader2, FileText, Sparkles, Printer, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function ResumePreview({ resumeHtml, formData, atsData, isScoring, onUpload, isParsing }) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    setErrorMessage('');

    if (!user) {
      setSaveStatus('error');
      setErrorMessage('You must be logged in to save your resume.');
      setIsSaving(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([
          {
            user_id: user.id,
            full_name: formData.fullName || 'Untitled',
            email: formData.email,
            phone: formData.phone,
            template: formData.template || 'modern-professional',
            generated_html: resumeHtml,
          },
        ]);

      if (error) throw error;
      
      setSaveStatus('success');
    } catch (error) {
      console.error('Failed to save directly to Supabase:', error);
      setSaveStatus('error');
      setErrorMessage(error.message || 'Database permissions error.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full space-y-6"
    >
      {/* Action Header - Always Visible */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 no-print"
      >
        <div className="flex items-center space-x-3">
           <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
             <FileText className="w-5 h-5" />
           </div>
           <h3 className="text-xl font-extrabold text-gray-900">Result Overview</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          {resumeHtml && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveToDatabase}
                disabled={isSaving || saveStatus === 'success'}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-600 hover:text-blue-600 rounded-xl transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saveStatus === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saveStatus === 'success' ? 'Saved' : 'Save'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrint}
                className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-100 font-bold text-sm border border-blue-500"
              >
                <Printer className="w-4 h-4" />
                <span>Save PDF</span>
              </motion.button>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpload}
            disabled={isParsing}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gray-50 border border-gray-100 hover:border-blue-200 hover:text-blue-600 rounded-xl transition-all font-bold text-sm disabled:opacity-50 shadow-sm"
          >
            {isParsing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span className="hidden lg:inline">Upload PDF</span>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {saveStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center space-x-3 text-sm shadow-sm"
          >
            <div className="bg-emerald-100 p-1.5 rounded-full inline-flex">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-bold">Resume successfully saved to your vault!</span>
          </motion.div>
        )}

        {saveStatus === 'error' && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-center space-x-3 text-sm shadow-sm"
          >
            <div className="bg-red-100 p-1.5 rounded-full inline-flex">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-bold">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!resumeHtml ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-xl shadow-gray-100/50 relative overflow-hidden group"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-24 h-24 mb-6 rounded-3xl bg-blue-50 border border-blue-100 shadow-lg shadow-blue-50 flex items-center justify-center text-blue-600 relative z-10"
          >
            <FileText className="w-12 h-12 stroke-[1.5]" />
            <Sparkles className="w-5 h-5 absolute -top-2 -right-2 text-blue-500 animate-pulse" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">Your Canvas Awaits</h3>
          <p className="text-gray-500 max-w-sm mb-8 leading-relaxed relative z-10">
            Import an existing PDF or fill out the details on the left to start crafting your resume.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUpload}
            disabled={isParsing}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 flex items-center gap-3 relative z-10"
          >
            {isParsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            Import Existing Resume (PDF)
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* ATS Score Panel */}
          {isScoring && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 shadow-xl shadow-gray-100/50 items-center no-print"
            >
              <div className="w-28 h-28 rounded-full border-4 border-gray-50 flex items-center justify-center shrink-0">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <div className="flex-1 flex flex-col justify-center w-full">
                <h4 className="text-gray-900 font-extrabold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  Analyzing resume for actionable ATS suggestions...
                </h4>
                <div className="space-y-3 w-full">
                  <div className="h-4 bg-gray-50 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-50 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-50 rounded w-4/6 animate-pulse" />
                </div>
              </div>
            </motion.div>
          )}

          {!isScoring && atsData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 shadow-xl shadow-gray-100/50 no-print"
            >
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-50 stroke-current"
                      strokeWidth="8"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <circle
                      className={`${
                        atsData.score >= 80 ? 'text-emerald-500' : atsData.score >= 60 ? 'text-amber-500' : 'text-blue-500'
                      } stroke-current transition-all duration-1000 ease-out`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - atsData.score / 100)}`}
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-gray-900">
                    <span className="text-3xl font-black tracking-tight">{atsData.score}</span>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">ATS Score</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="text-gray-900 font-extrabold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  AI Resume Analysis
                </h4>
                <ul className="space-y-2">
                  {atsData.suggestions.map((sug, i) => (
                    <li key={i} className="text-sm text-gray-600 font-medium flex items-start gap-2 leading-relaxed">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden relative group p-8 lg:p-12 overflow-y-auto min-h-[600px] flex flex-col"
          >
            <div className="absolute top-0 w-full left-0 bg-blue-50 border-b border-blue-100 py-2 text-center select-none no-print">
              <p className="text-xs font-bold text-blue-800 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> 
                Real-Time Editing Enabled: Click anywhere on your resume below to edit the text directly before downloading!
              </p>
            </div>

            <div id="resume-pdf-container" className="prose prose-sm md:prose-base max-w-none prose-h1:mb-2 prose-h2:mt-6 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2 prose-p:leading-relaxed prose-li:my-1 prose-ul:my-4 mt-8 flex-1">
              <div 
                contentEditable={true} 
                suppressContentEditableWarning={true}
                spellCheck={false}
                className="outline-none min-h-full rounded-lg transition-all focus:bg-gray-50/50"
                dangerouslySetInnerHTML={{ __html: resumeHtml }} 
              />
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
