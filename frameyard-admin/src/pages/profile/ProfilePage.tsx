import React from 'react';
import useAuth from '../../hooks/useAuth';
import { User, Mail, Shield, Save, Upload } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col gap-6 w-full h-full animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">My Profile</h1>
        <p className="text-sm text-on-surface-variant mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-outline-variant flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-surface">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-on-primary rounded-full shadow-md hover:bg-primary/90 transition-transform hover:scale-105">
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-on-surface">{user?.name || 'Admin User'}</h2>
            <p className="text-sm text-on-surface-variant flex items-center justify-center md:justify-start gap-2 mt-1">
              <Shield className="w-4 h-4" /> {user?.role || 'Administrator'}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                placeholder="Tell us a little bit about yourself"
                className="w-full p-3 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-outline-variant">
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-semibold shadow-sm hover:bg-primary/95 transition-all hover:scale-[1.02]"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
