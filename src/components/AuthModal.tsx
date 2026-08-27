import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User as UserIcon, AtSign } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuthStore();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier || !password) return;

    setIsSubmitting(true);
    try {
      await login({ identifier, password });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে। ইউজারনেম বা পাসওয়ার্ড যাচাই করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !username || !email || !password) return;

    setIsSubmitting(true);
    try {
      await register({ name, username, email, password, bio });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। অন্য ইউজারনেম বা ইমেইল চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-theme-card border border-theme-main rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Tabs */}
        <div className="p-4 border-b border-theme-main bg-theme-main/50 flex items-center justify-between">
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-gray-500/10 font-bnUI text-xs">
            <button
              onClick={() => {
                setTab('login');
                setErrorMsg('');
              }}
              className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                tab === 'login'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              লগইন (Login)
            </button>
            <button
              onClick={() => {
                setTab('register');
                setErrorMsg('');
              }}
              className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                tab === 'register'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              রেজিস্টার (Register)
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-500/20 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bnUI">
              {errorMsg}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-bnUI">
                  ইমেইল বা ইউজারনেম
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="username or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-theme-main bg-theme-main text-sm font-enUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-bnUI">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-theme-main bg-theme-main text-sm font-enUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium text-xs shadow-md hover:bg-emerald-600 disabled:opacity-50 transition-all font-bnUI flex items-center justify-center space-x-1.5 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSubmitting ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-bnUI">
                  আপনার সম্পূর্ণ নাম
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Kazi Nazrul Islam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-main bg-theme-main text-sm font-bnUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-bnUI">
                  ইউজারনেম (@username)
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="nazrul"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-main bg-theme-main text-sm font-enUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-bnUI">
                  ইমেইল এড্রেস
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="poet@kavyakatha.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-main bg-theme-main text-sm font-enUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-bnUI">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-main bg-theme-main text-sm font-enUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-bnUI">
                  সংক্ষিপ্ত বায়ো (Bio)
                </label>
                <input
                  type="text"
                  placeholder="বিদ্রোহী কবি ও কবি সাহিত্যিক..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-main bg-theme-main text-xs font-bnUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium text-xs shadow-md hover:bg-emerald-600 disabled:opacity-50 transition-all font-bnUI flex items-center justify-center space-x-1.5 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
