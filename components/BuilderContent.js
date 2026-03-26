"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Sparkles, FileText, Upload, Loader2 } from 'lucide-react';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import TemplatesView from '@/components/TemplatesView';
import DashboardView from '@/components/DashboardView';
import AIFeaturesView from '@/components/AIFeaturesView';
import SettingsView from '@/components/SettingsView';
import AtsCheckerView from '@/components/AtsCheckerView';
import HowItWorksView from '@/components/HowItWorksView';

export default function BuilderContent({ user }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('builder');
  const [resumeHtml, setResumeHtml] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    summary: '',
    skills: [''],
    education: [{ college: '', degree: '', year: '' }],
    experience: [{ department: '', company: '', year: '', description: '' }],
    projects: [{ title: '', description: '' }],
    languages: [''],
    template: 'professional',
  });
  const [isFinalized, setIsFinalized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [atsData, setAtsData] = useState(null);
  const [isScoring, setIsScoring] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsParsing(true);
      setError('');
      
      const reader = new FileReader();
      const fileData = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileBase64: fileData, 
          fileName: file.name, 
          fileType: file.type 
        }),
      });

      const result = await response.json();
      if (result.success) {
        const d = result.data || {};
        setFormData(prev => ({
          ...prev,
          fullName: d.fullName || prev.fullName || '',
          email: d.email || prev.email || '',
          phone: d.phone || prev.phone || '',
          summary: d.summary || prev.summary || '',
          github: d.github || '',
          linkedin: d.linkedin || '',
          skills: Array.isArray(d.skills) ? d.skills : prev.skills,
          education: Array.isArray(d.education) ? d.education : prev.education,
          experience: Array.isArray(d.experience) ? d.experience : prev.experience,
          projects: Array.isArray(d.projects) ? d.projects : prev.projects,
          languages: Array.isArray(d.languages) ? d.languages : prev.languages,
          template: d.template || prev.template
        }));
        setError('');
      } else {
        setError(result.error || 'Failed to parse resume');
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError('An error occurred while uploading the file.');
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const previewRef = useRef(null);

  // Debounced Auto-Generation
  useEffect(() => {
    const hasCoreInfo = formData.fullName || (formData.skills && formData.skills.some(s => s));
    if (!hasCoreInfo) return;

    const timer = setTimeout(async () => {
      setIsGenerating(true);
      setError('');
      try {
        const response = await fetch('/api/generate-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json();

        if (response.ok && result.success) {
          setResumeHtml(result.resume);
          setIsScoring(true);
          
          try {
            const atsResponse = await fetch('/api/ats-score', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                originalFormData: formData,
                generatedHtml: result.resume
              }),
            });
            const atsResult = await atsResponse.json();
            if (atsResponse.ok && atsResult.success) {
              setAtsData(atsResult.atsData);
            }
          } catch (atsErr) {
            console.error('Graceful failure on ATS scoring:', atsErr);
          } finally {
            setIsScoring(false);
          }
        } else {
          setError(result.error || 'Failed to generate preview.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred during live preview generation.');
      } finally {
        setIsGenerating(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleGenerateResume = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setResumeHtml(result.resume);
        setIsScoring(true);
        
        // Secondary pass: Calculate ATS Score in background
        try {
          const atsResponse = await fetch('/api/ats-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              originalFormData: formData,
              generatedHtml: result.resume
            }),
          });
          const atsResult = await atsResponse.json();
          if (atsResponse.ok && atsResult.success) {
            setAtsData(atsResult.atsData);
          }
        } catch (atsErr) {
          console.error('Graceful failure on ATS scoring:', atsErr);
        } finally {
          setIsScoring(false);
        }

      } else {
        setError(result.error || 'Failed to generate resume.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
      } finally {
        setIsGenerating(false);
      }
  };

  const handleFinalize = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsFinalized(true);
    await handleGenerateResume();
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToBuilder = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    document.getElementById('builder-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] relative overflow-hidden font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Bar */}
      <nav className="fixed w-full z-[100] top-0 transition-all duration-300 backdrop-blur-md bg-white/70 border-b border-gray-100 no-print">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <Link href="/builder" className="flex items-center space-x-2 text-xl font-bold">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 font-extrabold tracking-tight">ResumeBuilder<span className="text-blue-600">.ai</span></span>
          </Link>
          <div className="flex items-center space-x-4">
            {!user && (
              <Link href="/" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Integration */}
      <div className="no-print">
        <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={handleSignOut} />
      </div>

      <main className="relative z-10 pt-24 pb-12 xl:pl-64">
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-2xl">
          <AnimatePresence mode="wait">
            {activeTab === 'ats' && (
              <motion.div
                key="ats-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AtsCheckerView user={user} />
              </motion.div>
            )}

            {activeTab === 'builder' && (
              <motion.div
                key="builder-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-700 shadow-sm relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                      <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
                      <p className="font-bold flex-1">{error}</p>
                      <button 
                        className="p-1.5 rounded-lg hover:bg-red-100 transition-colors text-red-500"
                        onClick={() => setError('')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Form Section */}
                  {!isFinalized && (
                    <div className="xl:col-span-4 w-full sticky top-24 no-print">
                      <ResumeForm 
                        formData={formData} 
                        setFormData={setFormData}
                        onGenerate={handleFinalize} 
                        isGenerating={isGenerating} 
                      />
                    </div>
                  )}

                      {/* Consolidated Preview Section */}
                      <div ref={previewRef} className={`w-full h-full min-h-[600px] transition-all duration-500 ease-in-out ${isFinalized ? 'xl:col-span-12' : 'xl:col-span-8'}`}>
                        {/* Redundant header removed - now integrated into ResumePreview */}

                      {isFinalized && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50"
                      >
                         <div className="flex items-center gap-4">
                           <div className="p-3 bg-blue-50 rounded-2xl">
                             <Sparkles className="text-blue-600 w-6 h-6"/>
                           </div>
                           <div>
                             <h3 className="text-xl font-extrabold text-gray-900">Resume Finalized</h3>
                             <p className="text-gray-500 text-sm font-medium">Review your ATS-optimized resume. You can download it as a PDF.</p>
                           </div>
                         </div>
                         <button 
                           onClick={() => setIsFinalized(false)} 
                           className="mt-4 sm:mt-0 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl border border-gray-200 transition-all active:scale-95 whitespace-nowrap"
                         >
                           ← Back to Edit
                         </button>
                      </motion.div>
                    )}
                    
                    <ResumePreview 
                      resumeHtml={resumeHtml} 
                      formData={formData} 
                      atsData={atsData}
                      isScoring={isScoring}
                      onUpload={() => fileInputRef.current?.click()}
                      isParsing={isParsing}
                    />
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'templates' && (
              <motion.div
                key="templates-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TemplatesView 
                  currentTemplate={formData.template} 
                  onSelect={(id) => {
                    setFormData(prev => ({ ...prev, template: id }));
                    setActiveTab('builder');
                  }} 
                />
              </motion.div>
            )}

            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardView user={user} onEdit={() => setActiveTab('builder')} />
              </motion.div>
            )}

            {activeTab === 'features' && (
              <motion.div
                key="features-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AIFeaturesView />
              </motion.div>
            )}

            {activeTab === 'how-it-works' && (
              <motion.div
                key="how-it-works-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <HowItWorksView />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SettingsView user={user} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
