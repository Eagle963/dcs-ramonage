'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  Lock
} from 'lucide-react';

// Protection simple par mot de passe (à remplacer par une vraie auth)
const ADMIN_PASSWORD = 'dcs2024'; // À changer !

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Vérifier si déjà authentifié (session storage)
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  const navigation = [
    { name: 'Planning', href: '/admin/planning', icon: Calendar },
    { name: 'Demandes RDV', href: '/admin/demandes', icon: ClipboardList },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
  ];

  // Page de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-soft p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-500" />
            </div>
            <h1 className="text-xl font-bold text-secondary-900">Administration</h1>
            <p className="text-secondary-500 text-sm">DCS Ramonage</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Connexion
            </button>
          </form>

          <Link 
            href="/" 
            className="block text-center text-sm text-secondary-500 hover:text-primary-500 mt-4"
          >
            ← Retour au site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-100">
      {/* Sidebar mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-lg">DCS Admin</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${pathname === item.href 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-secondary-200">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-secondary-100">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">DCS</span>
            </div>
            <div>
              <p className="font-bold text-secondary-900">DCS Ramonage</p>
              <p className="text-xs text-secondary-500">Administration</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${pathname === item.href 
                    ? 'bg-primary-50 text-primary-600 font-medium' 
                    : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer sidebar */}
          <div className="p-4 border-t border-secondary-100 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              Voir le site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar mobile */}
        <div className="sticky top-0 z-40 flex items-center gap-4 bg-white border-b border-secondary-200 px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold">DCS Admin</span>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
