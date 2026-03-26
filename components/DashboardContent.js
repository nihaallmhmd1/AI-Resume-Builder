"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, FileText, Calendar, Layout, Trash2, ExternalLink, Printer, Loader2, RefreshCw, Plus } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardContent({ user }) {
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scoringData, setScoringData] = useState({}); // Keep scores locally { [resumeId]: { score, suggestions } }
  const [isScoring, setIsScoring] = useState(false);

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Failed to load your saved resumes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent opening the modal
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchAtsScore = async () => {
      if (!selectedResume) return;
      if (scoringData[selectedResume.id]) return; // Already fetched

      try {
        setIsScoring(true);
        // We have to recreate the formData structure the ATS API expects
        const mockFormData = {
          fullName: selectedResume.full_name,
          email: selectedResume.email,
          phone: selectedResume.phone,
          template: selectedResume.template
        };

        const response = await fetch('/api/ats-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originalFormData: mockFormData,
            generatedHtml: selectedResume.generated_html
          }),
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
          setScoringData(prev => ({
            ...prev,
            [selectedResume.id]: result.atsData
          }));
        }
      } catch (err) {
        console.error('Failed to fetch ATS Score for saved resume:', err);
      } finally {
        setIsScoring(false);
      }
    };

    fetchAtsScore();
  }, [selectedResume]);

  const handlePrint = () => {
    if (!selectedResume) return;
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    // Get styles from the head
    const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(el => el.outerHTML)
      .join('');

    const doc = iframe.contentWindow.document;
    
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Resume - ${selectedResume.full_name}</title>
          ${styleLinks}
          <style>
            @page { margin: 0; }
            body { 
              margin: 0; 
              padding: 20px; 
              background: white;
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important; 
            }
          </style>
        </head>
        <body>
          <div class="prose max-w-none prose-sm md:prose-base">
            ${selectedResume.generated_html}
          </div>
        </body>
      </html>
    `);
    doc.close();
    
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden font-sans text-slate-200">
      {/* Background Elements */}
      <div className="absolute top-[-10%] -left-[10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 pointer-events-none"></div>
      
      {/* Navigation */}
      <nav className="relative z-[100] backdrop-blur-md bg-[#020617]/50 border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <Link href="/builder" className="flex items-center space-x-2 text-xl font-bold">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white">ResumeBuilder<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">.ai</span></span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/builder" className="text-sm font-medium text-slate-300 hover:text-white transition-colors mr-4">
              Return to Builder
            </Link>
            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center text-sm font-medium text-slate-300">
                  <User className="w-4 h-4 mr-2" />
                  {user.email}
                </div>
                <button 
                  onClick={handleSignOut} 
                  className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-all"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Your Dashboard</h1>
            <p className="text-slate-400 text-lg">Manage and download your generated resumes.</p>
          </div>
          <Link href="/builder">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-purple-500/25 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Resume</span>
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-slate-400">Loading your resumes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchResumes}
              className="mt-4 flex items-center space-x-2 mx-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xl">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Resumes Found</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              It looks like you haven't saved any resumes yet. Head over to the builder to create your first ai-powered masterpiece.
            </p>
            <Link href="/builder">
              <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg">
                Start Building Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {resumes.map((resume, idx) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedResume(resume)}
                  className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-500/50 p-6 rounded-2xl cursor-pointer transition-all group flex flex-col h-full shadow-xl hover:shadow-cyan-500/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-cyan-900/30 text-cyan-400 rounded-xl group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      <FileText className="w-6 h-6" />
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, resume.id)}
                      disabled={isDeleting}
                      className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{resume.full_name || 'Untitled Resume'}</h3>
                  
                  <div className="flex items-center space-x-2 text-slate-400 text-sm mb-4">
                    <Layout className="w-4 h-4" />
                    <span className="capitalize">{resume.template.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(resume.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                      <span>View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* View Modal */}
      <AnimatePresence>
        {selectedResume && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setSelectedResume(null)}
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-7xl h-[95vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/50">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedResume.full_name || 'Resume Preview'}</h2>
                  <p className="text-xs text-slate-400 capitalize flex items-center space-x-2">
                    <Layout className="w-3.5 h-3.5" />
                    <span>Template: {selectedResume.template.replace('-', ' ')}</span>
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handlePrint}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-lg transition-all shadow-md font-medium text-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / PDF</span>
                  </button>
                  <button 
                    onClick={() => setSelectedResume(null)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="flex flex-1 overflow-hidden">
                {/* Scrollable Preview Area */}
                <div className="p-6 overflow-y-auto flex-1 bg-slate-800/80 hidden-scrollbar flex justify-center border-r border-slate-700/50">
                  <style dangerouslySetInnerHTML={{__html: `
                    .resume-print-area { color: #333; background-color: #ffffff; box-sizing: border-box; }
                    .resume-print-area * { box-sizing: border-box; }
                    .resume-print-area [style*="color: #06b6d4"] { color: #06b6d4 !important; }
                    .resume-print-area [style*="color: #8b5cf6"] { color: #8b5cf6 !important; }
                  `}} />
                  <div 
                    className="bg-white rounded-xl shadow-2xl overflow-hidden resume-print-area shrink-0 transform scale-90 md:scale-100 origin-top"
                    style={{ minHeight: '1123px', width: '794px', padding: '40px' }} // Standard A4 dimensions
                  >
                    <div 
                      className="prose max-w-none prose-sm md:prose-base h-full w-full"
                      dangerouslySetInnerHTML={{ __html: selectedResume.generated_html }}
                    />
                  </div>
                </div>

                {/* Score Sidebar */}
                <div className="w-80 bg-slate-900/90 overflow-y-auto hidden-scrollbar hidden lg:flex flex-col p-6 border-l border-white/5 relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-400" /> Analysis
                  </h3>

                  {isScoring && !scoringData[selectedResume.id] ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                      <p className="text-sm text-slate-400 text-center animate-pulse">Running ATS Analysis...</p>
                    </div>
                  ) : scoringData[selectedResume.id] ? (
                    <div className="space-y-6">
                      <div className="text-center bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <div className="text-4xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                          {scoringData[selectedResume.id].score}
                        </div>
                        <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">ATS Score</div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 text-cyan-300">Suggestions to improve:</h4>
                        <ul className="space-y-3">
                          {scoringData[selectedResume.id].suggestions.map((sug, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-800/30 p-3 rounded-lg border border-slate-700/30 leading-relaxed">
                              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 shadow-[0_0_5px_theme(colors.cyan.400)]" />
                              <span>{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-sm">
                      Score unavailable for this resume.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
