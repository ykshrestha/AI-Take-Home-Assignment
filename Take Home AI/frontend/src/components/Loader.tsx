import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
        <div className="particle particle-7"></div>
        <div className="particle particle-8"></div>

        <div className="floating-cube cube-1"></div>
        <div className="floating-cube cube-2"></div>
        <div className="floating-cube cube-3"></div>
      </div>

      <div className="relative z-10">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 animate-ping-slow opacity-20">
            <div className="w-full h-full border-4 border-cyan-400 rounded-full"></div>
          </div>

          <div className="absolute inset-8 animate-ping-slower opacity-30">
            <div className="w-full h-full border-4 border-blue-400 rounded-full"></div>
          </div>

          <div className="absolute inset-0">
            <div className="w-full h-full border-t-4 border-r-4 border-transparent border-t-cyan-400 border-r-cyan-500 rounded-full animate-spin-fast"></div>
          </div>

          <div className="absolute inset-8">
            <div className="w-full h-full border-b-4 border-l-4 border-transparent border-b-blue-400 border-l-blue-500 rounded-full animate-spin-reverse"></div>
          </div>

          <div className="absolute inset-16">
            <div className="w-full h-full border-4 border-transparent border-t-cyan-300 rounded-full animate-spin-slow"></div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl animate-morph shadow-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-blue-500 to-cyan-300 rounded-2xl animate-morph-reverse opacity-70"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/30 rounded-lg animate-pulse-scale"></div>
              </div>
            </div>
          </div>

          <div className="absolute -inset-4">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
            <div className="dot dot-4"></div>
            <div className="dot dot-5"></div>
            <div className="dot dot-6"></div>
            <div className="dot dot-7"></div>
            <div className="dot dot-8"></div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="flex items-center justify-center space-x-2">
            <span className="loading-dot"></span>
            <span className="loading-dot" style={{ animationDelay: '0.2s' }}></span>
            <span className="loading-dot" style={{ animationDelay: '0.4s' }}></span>
          </div>
          <p className="text-cyan-400 text-2xl font-bold tracking-wider mt-4 animate-pulse-text">
            AI CAMPUS
          </p>
          <p className="text-blue-300 text-sm tracking-widest mt-2 animate-fade">
            Initializing System...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0; }
        }

        @keyframes ping-slower {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0; }
        }

        @keyframes morph {
          0%, 100% {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            transform: rotate(0deg) scale(1);
          }
          25% {
            border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
            transform: rotate(90deg) scale(1.1);
          }
          50% {
            border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
            transform: rotate(180deg) scale(0.9);
          }
          75% {
            border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
            transform: rotate(270deg) scale(1.05);
          }
        }

        @keyframes morph-reverse {
          0%, 100% {
            border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
            transform: rotate(360deg) scale(1);
          }
          50% {
            border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
            transform: rotate(180deg) scale(1.1);
          }
        }

        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          33% {
            transform: translate(30px, -30px) scale(1.5);
            opacity: 0.3;
          }
          66% {
            transform: translate(-20px, 20px) scale(0.8);
            opacity: 0.8;
          }
        }

        @keyframes float-cube {
          0%, 100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-100px) rotateX(180deg) rotateY(180deg);
          }
        }

        @keyframes pulse-text {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes fade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes loading-bounce {
          0%, 100% {
            transform: translateY(0);
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
          }
          50% {
            transform: translateY(-20px);
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
          }
        }

        .animate-spin-fast {
          animation: spin-fast 1.5s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-ping-slower {
          animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }

        .animate-morph-reverse {
          animation: morph-reverse 6s ease-in-out infinite;
        }

        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        .animate-pulse-text {
          animation: pulse-text 2s ease-in-out infinite;
        }

        .animate-fade {
          animation: fade 3s ease-in-out infinite;
        }

        .dot {
          position: absolute;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.8);
        }

        .dot-1 { animation: orbit 4s linear infinite; animation-delay: 0s; }
        .dot-2 { animation: orbit 4s linear infinite; animation-delay: 0.5s; }
        .dot-3 { animation: orbit 4s linear infinite; animation-delay: 1s; }
        .dot-4 { animation: orbit 4s linear infinite; animation-delay: 1.5s; }
        .dot-5 { animation: orbit 4s linear infinite; animation-delay: 2s; }
        .dot-6 { animation: orbit 4s linear infinite; animation-delay: 2.5s; }
        .dot-7 { animation: orbit 4s linear infinite; animation-delay: 3s; }
        .dot-8 { animation: orbit 4s linear infinite; animation-delay: 3.5s; }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #06b6d4, transparent);
          border-radius: 50%;
          animation: float-particle 6s ease-in-out infinite;
        }

        .particle-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 20%; right: 15%; animation-delay: 0.5s; }
        .particle-3 { top: 60%; left: 20%; animation-delay: 1s; }
        .particle-4 { bottom: 20%; right: 25%; animation-delay: 1.5s; }
        .particle-5 { top: 40%; left: 5%; animation-delay: 2s; }
        .particle-6 { bottom: 30%; left: 30%; animation-delay: 2.5s; }
        .particle-7 { top: 70%; right: 10%; animation-delay: 3s; }
        .particle-8 { bottom: 10%; left: 15%; animation-delay: 3.5s; }

        .floating-cube {
          position: absolute;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
          border: 2px solid rgba(6, 182, 212, 0.3);
          animation: float-cube 8s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .cube-1 {
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }

        .cube-2 {
          top: 60%;
          right: 15%;
          animation-delay: 2s;
          width: 30px;
          height: 30px;
        }

        .cube-3 {
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
          width: 50px;
          height: 50px;
        }

        .loading-dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: loading-bounce 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
