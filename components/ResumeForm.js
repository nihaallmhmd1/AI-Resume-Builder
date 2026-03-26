"use client";

import { useState } from 'react';
import { Loader2, Sparkles, User, Mail, Phone, Briefcase, GraduationCap, Code2, Layers, Layout, FileText, Zap, Award, Code, Globe, PenTool, Rocket, Heart, LineChart, Github, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeForm({ formData, setFormData, onGenerate, isGenerating }) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, subField, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      if (subField === null) {
        newArray[index] = value;
      } else {
        newArray[index] = { ...newArray[index], [subField]: value };
      }
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field, defaultObj) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultObj]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-6 md:p-8 border border-gray-100 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-500"
    >
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
           <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">
          Resume Details
        </h2>
      </div>

      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit} 
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="space-y-3">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" /> Choose Style Template
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 place-items-stretch max-h-[300px] overflow-y-auto p-2 border border-gray-100 rounded-xl bg-gray-50/50 hide-scrollbar">
            {[
              { id: 'professional', label: 'Professional', icon: Briefcase },
              { id: 'fresher', label: 'Fresher', icon: Award },
              { id: 'data-scientist', label: 'Data Scientist', icon: Code },
              { id: 'creative', label: 'Creative', icon: PenTool },
              { id: 'executive', label: 'Executive', icon: Briefcase },
              { id: 'technical', label: 'Technical', icon: Code2 },
              { id: 'academic', label: 'Academic', icon: GraduationCap },
              { id: 'minimalist', label: 'Minimalist', icon: Layout },
              { id: 'modern', label: 'Modern', icon: Zap },
              { id: 'startup', label: 'Startup', icon: Rocket },
              { id: 'healthcare', label: 'Healthcare', icon: Heart },
              { id: 'finance', label: 'Finance', icon: LineChart }
            ].map(tmpl => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setFormData({ ...formData, template: tmpl.id })}
                className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border-2 transition-all ${
                  formData.template === tmpl.id
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <tmpl.icon 
                  className="w-5 h-5 mb-1" 
                  style={{ color: formData.template === tmpl.id ? '#2563eb' : '#94a3b8' }} 
                />
                <span className={`text-[10px] md:text-xs font-bold text-center leading-tight ${formData.template === tmpl.id ? 'text-blue-700' : 'text-gray-500'}`}>{tmpl.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div variants={itemVariants} className="space-y-1.5 group">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-300 placeholder-gray-300 text-gray-900 group-hover:border-blue-200"
              placeholder="e.g. John Doe"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-1.5 group">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" /> Phone
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-300 placeholder-gray-300 text-gray-900 group-hover:border-blue-200"
              placeholder="+1 234 567 890"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-1.5 group md:col-span-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" /> Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-300 placeholder-gray-300 text-gray-900 group-hover:border-blue-200"
              placeholder="e.g. john@example.com"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-1.5 group">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Github className="w-4 h-4 text-blue-600" /> GitHub (Optional)
            </label>
            <input
              type="url"
              name="github"
              value={formData.github || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-300 placeholder-gray-300 text-gray-900 group-hover:border-blue-200"
              placeholder="e.g. github.com/johndoe"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-1.5 group">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn (Optional)
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-300 placeholder-gray-300 text-gray-900 group-hover:border-blue-200"
              placeholder="e.g. linkedin.com/in/johndoe"
            />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="space-y-1.5 group">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Professional Summary
            </label>
            <button
              type="button"
              onClick={async () => {
                const hasSkills = formData.skills.some(s => s.trim().length > 0);
                const hasExp = formData.experience.some(e => e.company.length > 0);
                const hasEdu = formData.education.some(e => e.college.length > 0);

                if (!hasSkills && !hasExp && !hasEdu) {
                  alert("Please fill in some skills, experience, or education first so the AI has context to write your summary!");
                  return;
                }
                setIsGeneratingSummary(true);
                try {
                  const educationText = formData.education
                    .map(edu => `${edu.college} | ${edu.degree} | ${edu.year}`)
                    .filter(text => text.length > 6)
                    .join('\n');
                  const skillsText = formData.skills.filter(s => s.trim()).join(', ');
                  const experienceText = formData.experience.map(e => `${e.department} at ${e.company} (${e.year}): ${e.description}`).join('\n');
                  const projectsText = formData.projects.map(p => `${p.title}: ${p.description}`).join('\n');
                  
                  const response = await fetch('/api/generate-summary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      fullName: formData.fullName,
                      skills: skillsText,
                      experience: experienceText,
                      education: educationText,
                      projects: projectsText
                    }),
                  });
                  const data = await response.json();
                  if (data.success) {
                    setFormData(prev => ({ ...prev, summary: data.summary }));
                  } else {
                    alert(data.error || "Failed to generate summary");
                  }
                } catch (err) {
                  console.error(err);
                  alert("An error occurred while generating the summary");
                } finally {
                  setIsGeneratingSummary(false);
                }
              }}
              disabled={isGeneratingSummary || isGenerating}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-100 transition-all disabled:opacity-50 font-bold"
            >
              {isGeneratingSummary ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  Auto-Write with AI
                </>
              )}
            </button>
          </div>
          <textarea
            name="summary"
            required
            rows={3}
            value={formData.summary || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-300 placeholder-gray-300 text-gray-900 resize-none group-hover:border-blue-200"
            placeholder="Brief overview of your career and goals..."
          />
        </motion.div>

        {/* SKILLS */}
        <motion.div variants={itemVariants} className="space-y-3 group">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
               <Code2 className="w-4 h-4 text-blue-600" /> Skills
            </label>
            <button
              type="button"
              onClick={() => addArrayItem('skills', '')}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center font-bold transition-colors"
            >
              + Add Skill
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {formData.skills.map((skill, index) => (
              <div key={index} className="relative group/tag flex items-center bg-gray-50 border border-gray-100 rounded-lg py-1 px-3 transition-all hover:border-blue-200 focus-within:ring-2 focus-within:ring-blue-50 focus-within:border-blue-300">
                <input 
                  type="text" 
                  value={skill} 
                  onChange={(e) => handleArrayChange('skills', index, null, e.target.value)} 
                  className="w-32 md:w-40 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-300 font-medium" 
                  placeholder="e.g. React.js" 
                />
                {formData.skills.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('skills', index)} className="text-gray-400 hover:text-red-500 transition-all ml-1 font-bold">
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* EDUCATION */}
        <motion.div variants={itemVariants} className="space-y-3 group">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Education
            </label>
            <button
              type="button"
              onClick={() => addArrayItem('education', { college: '', degree: '', year: '' })}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center font-bold transition-colors"
            >
              + Add Education
            </button>
          </div>
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="relative p-4 rounded-xl border border-gray-100 bg-gray-50/30 group-hover:border-blue-100 transition-all">
                {formData.education.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('education', index)} className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 border border-gray-100 w-6 h-6 flex justify-center items-center rounded-full text-xs transition-colors shadow-sm">×</button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1 md:col-span-2">
                    <input type="text" value={edu.college} onChange={(e) => handleArrayChange('education', index, 'college', e.target.value)} className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder-gray-300 text-gray-700" placeholder="College / University Name" />
                  </div>
                  <div className="space-y-1">
                    <input type="text" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder-gray-300 text-gray-700" placeholder="Degree / Course (e.g. B.S. CS)" />
                  </div>
                  <div className="space-y-1">
                    <input type="text" value={edu.year} onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)} className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder-gray-300 text-gray-700" placeholder="Year (e.g. 2020-2024)" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* EXPERIENCE */}
        <motion.div variants={itemVariants} className="space-y-3 group">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Work Experience
            </label>
            <button
              type="button"
              onClick={() => addArrayItem('experience', { department: '', company: '', year: '', description: '' })}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center font-bold transition-colors"
            >
              + Add Experience
            </button>
          </div>
          <div className="space-y-4">
            {formData.experience.map((exp, index) => (
              <div key={index} className="relative p-4 rounded-xl border border-gray-100 bg-gray-50/30 group-hover:border-blue-100 transition-all">
                {formData.experience.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('experience', index)} className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 border border-gray-100 w-6 h-6 flex justify-center items-center rounded-full text-xs transition-colors shadow-sm">×</button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <input type="text" value={exp.department} onChange={(e) => handleArrayChange('experience', index, 'department', e.target.value)} className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder-gray-300 text-gray-700" placeholder="Department / Role (e.g. Frontend Dev)" />
                  </div>
                  <div className="space-y-1">
                    <input type="text" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder-gray-300 text-gray-700" placeholder="Company / Institute" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <input type="text" value={exp.year} onChange={(e) => handleArrayChange('experience', index, 'year', e.target.value)} className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder-gray-300 text-gray-700" placeholder="Year / Duration (e.g. 2021-Present)" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <textarea rows={3} value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder-gray-300 text-gray-700 resize-y" placeholder="Describe achievements..."></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* PROJECTS */}
        <motion.div variants={itemVariants} className="space-y-3 group">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Projects
            </label>
            <button
              type="button"
              onClick={() => addArrayItem('projects', { title: '', description: '' })}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center font-bold transition-colors"
            >
              + Add Project
            </button>
          </div>
          <div className="space-y-4">
            {formData.projects.map((proj, index) => (
              <div key={index} className="relative p-4 rounded-xl border border-gray-100 bg-gray-50/30 group-hover:border-blue-100 transition-all">
                {formData.projects.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('projects', index)} className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 border border-gray-100 w-6 h-6 flex justify-center items-center rounded-full text-xs transition-colors shadow-sm">×</button>
                )}
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <input type="text" value={proj.title} onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)} className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder-gray-300 text-gray-700" placeholder="Project Title" />
                  </div>
                  <div className="space-y-1">
                    <textarea rows={2} value={proj.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder-gray-300 text-gray-700 resize-y" placeholder="Technologies used and project description..."></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* LANGUAGES */}
        <motion.div variants={itemVariants} className="space-y-3 group">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" /> Languages Known
            </label>
            <button
              type="button"
              onClick={() => addArrayItem('languages', '')}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center font-bold transition-colors"
            >
              + Add Language
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {formData.languages.map((lang, index) => (
              <div key={index} className="relative group/tag flex items-center bg-gray-50 border border-gray-100 rounded-lg py-1 px-3 transition-all hover:border-blue-200 focus-within:ring-2 focus-within:ring-blue-50 focus-within:border-blue-300">
                <input 
                  type="text" 
                  value={lang} 
                  onChange={(e) => handleArrayChange('languages', index, null, e.target.value)} 
                  className="w-32 md:w-40 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-300 font-medium" 
                  placeholder="e.g. Spanish" 
                />
                {formData.languages.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('languages', index)} className="text-gray-400 hover:text-red-500 transition-all ml-1 font-bold">
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: isGenerating ? 1 : 1.02 }}
          whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-100 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group overflow-hidden relative"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <AnimatePresence mode="popLayout">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="flex items-center space-x-2"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Weaving AI Magic...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="flex items-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Finalize Resume</span>
                </motion.div>
              )}
            </AnimatePresence>
          </span>
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
