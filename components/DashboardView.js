"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, ExternalLink, Printer, Loader2, RefreshCw, Plus, Clock, FileEdit } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardView({ user, onEdit }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">My Resumes</h2>
          <p className="text-gray-500 font-medium">Manage and access all your generated resumes.</p>
        </div>
        <button 
          onClick={() => onEdit && onEdit()}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-100 font-bold transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>New Resume</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-400 font-bold">Fetching your resumes...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center max-w-md mx-auto">
          <p className="text-red-700 font-bold mb-4">{error}</p>
          <button 
            onClick={fetchResumes}
            className="flex items-center space-x-2 mx-auto px-5 py-2.5 bg-white border border-red-200 text-red-700 rounded-xl hover:bg-red-50 transition-colors font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      ) : resumes.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[40px] p-16 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
            <FileText className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Resumes Yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
            Start by creating your first resume using our AI-powered builder.
          </p>
          <button 
            onClick={() => onEdit && onEdit()}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            Start Building
          </button>
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
                className="bg-white border border-gray-100 p-6 rounded-3xl transition-all group flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, resume.id)}
                    disabled={isDeleting}
                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{resume.full_name || 'Untitled Resume'}</h3>
                
                <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-lg">{resume.template.replace('-', ' ')}</span>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-[11px] font-black text-gray-400">
                  <div className="flex items-center space-x-1.5 uppercase tracking-tighter">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(resume.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-blue-600 group-hover:translate-x-1 transition-transform cursor-pointer">
                    <span className="uppercase">Open</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
