import { AuthButton } from '@/components/AuthButton'
import { Sparkles, FileText, Layout, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Left Side: Branding & Features */}
        <div className="space-y-8">
          <div className="flex flex-col items-start gap-4 text-left">
            <div className="bg-purple-600 p-3 rounded-2xl shadow-lg shadow-purple-200">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              ResumeBuilder.ai <br /> 
              <span className="text-purple-600">Career Amplified.</span>
            </h1>
            <p className="text-gray-500 text-xl max-w-sm">
              The intelligent workspace where AI helps you craft, optimize, and perfect your professional resume.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 group-hover:bg-purple-50 transition-colors">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-gray-700 font-medium tracking-wide">Intelligent Content Generation</p>
            </div>
            <div className="flex items-center gap-4 group cursor-default">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 group-hover:bg-purple-50 transition-colors">
                <Layout className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-gray-700 font-medium tracking-wide">Professional Templates</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col gap-8 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 opacity-50" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
            <p className="text-gray-500 text-sm">Experience the future of resume building today.</p>
          </div>

          <div className="space-y-4">
            <AuthButton 
              label="Continue with Google" 
              className="w-full justify-center text-lg py-4 border-2 hover:border-purple-200" 
            />
            
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-300 text-xs font-bold uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  New here? <span className="text-purple-600 font-semibold cursor-pointer hover:underline">Create an account</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase italic">
              Trusted by 5,000+ professionals
            </p>
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <footer className="mt-20 text-gray-400 text-sm flex gap-8 font-medium">
        <a href="#" className="hover:text-purple-600 transition-colors">Privacy</a>
        <a href="#" className="hover:text-purple-600 transition-colors">Terms</a>
        <a href="#" className="hover:text-purple-600 transition-colors">Contact</a>
      </footer>
    </div>
  )
}
