import React from "react";
import { LogOut, Users, BookOpen, Award, TrendingUp } from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl mr-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">TAKE HOME</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to Take Home Assignment
          </h2>
          <p className="text-cyan-300">Student Management System Dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-white">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">
                  Active Students
                </p>
                <p className="text-2xl font-bold text-white">1,089</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Courses</p>
                <p className="text-2xl font-bold text-white">45</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Avg GPA</p>
                <p className="text-2xl font-bold text-white">3.7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">
            🎉 Login Successful!
          </h3>
          <p className="text-gray-300 mb-4">
            You have successfully logged in to the AI Campus Student Management
            System. The login is now connected to the PostgreSQL database and
            ready for use.
          </p>
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg">
            <p className="font-medium">✅ Database Connection: Active</p>
            <p className="text-sm mt-1">
              Backend API is running and connected to PostgreSQL
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
