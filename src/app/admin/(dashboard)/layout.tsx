'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard,
  ClipboardList,
  Receipt,
  CreditCard,
  Wallet,
  Building2,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  HelpCircle,
  MessageSquare,
  FileSpreadsheet,
  RotateCcw,
  Banknote,
  FolderOpen,
  UserCog,
  Zap,
  BarChart3,
  MapPin,
  Euro,
  Wrench,
  Package
} from 'lucide-react';
import DateRangePicker from '@/components/ui/DateRangePicker';

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  badge?: number;
  children?: { label: string; href: string; icon: React.ElementType }[];
}

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: 'OPÉRATIONS',
    items: [
      { label: 'Calendrier', href: '/admin/calendrier', icon: Calendar },
      { label: 'Tâches', href: '/admin/taches', icon: ClipboardList },
      { label: 'Chantiers', href: '/admin/chantiers', icon: Wrench },
      { label: 'Maintenances', href: '/admin/maintenances', icon: Settings },
      { label: 'Demandes', href: '/admin/demandes', icon: ClipboardList, badge: 3 },
    ],
  },
  {
    title: 'FINANCES',
    items: [
      {
        label: 'Ventes',
        icon: Euro,
        children: [
          { label: 'Devis', href: '/admin/devis', icon: FileText },
          { label: 'Factures', href: '/admin/factures', icon: Receipt },
          { label: 'Avoirs', href: '/admin/avoirs', icon: RotateCcw },
          { label: 'Paiements', href: '/admin/paiements', icon: CreditCard },
        ],
      },
      { label: 'Dépenses', href: '/admin/depenses', icon: Wallet },
      { label: 'Banque', href: '/admin/banque', icon: Banknote },
    ],
  },
  {
    title: 'OUTILS',
    items: [
      {
        label: 'CRM',
        icon: Users,
        children: [
          { label: 'Clients', href: '/admin/crm/clients', icon: Users },
          { label: 'Prospects', href: '/admin/crm/prospects', icon: User },
          { label: 'Fournisseurs', href: '/admin/crm/fournisseurs', icon: Package },
          { label: 'Équipements', href: '/admin/crm/equipements', icon: Wrench },
        ],
      },
      { label: 'Bibliothèque', href: '/admin/bibliotheque', icon: FolderOpen },
      { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: UserCog },
      {
        label: 'Automatisations',
        icon: Zap,
        children: [
          { label: 'Automatisations', href: '/admin/automatisations', icon: Zap },
          { label: 'Exécutions', href: '/admin/executions', icon: BarChart3 },
        ],
      },
      { label: 'Tableaux de bord', href: '/admin/tableaux-de-bord', icon: BarChart3 },
      { label: 'Mon entreprise', href: '/admin/entreprise', icon: Building2 },
    ],
  },
  {
    title: 'PARAMÈTRES',
    items: [
      { label: 'Paramètres', href: '/admin/parametres', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Ventes']);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // État pour le DateRangePicker du tableau de bord (année courante)
  const currentYear = new Date().getFullYear();
  const [dashboardDateRange, setDashboardDateRange] = useState<{start: Date | null; end: Date | null}>({
    start: new Date(currentYear, 0, 1),
    end: new Date(currentYear, 11, 31)
  });

  // Fermer le menu profil au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const isChildActive = (children?: { href: string }[]) => {
    if (!children) return false;
    return children.some(child => pathname.startsWith(child.href));
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.label);
    const active = isActive(item.href) || isChildActive(item.children);

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              active ? 'bg-primary-50 text-primary-700' : 'text-secondary-600 hover:bg-secondary-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </div>
            {sidebarOpen && (
              isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {sidebarOpen && isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l border-secondary-200 pl-3">
              {item.children!.map(child => {
                const ChildIcon = child.icon;
                const childActive = isActive(child.href);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      childActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-secondary-600 hover:bg-secondary-50'
                    }`}
                  >
                    <ChildIcon className="w-4 h-4" />
                    <span>{child.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href || '#'}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
          active ? 'bg-primary-50 text-primary-700 font-medium' : 'text-secondary-600 hover:bg-secondary-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          {sidebarOpen && <span>{item.label}</span>}
        </div>
        {sidebarOpen && item.badge && (
          <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-secondary-200 z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-secondary-200">
            {sidebarOpen ? (
              <Link href="/admin/calendrier" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DC</span>
                </div>
                <span className="font-semibold text-secondary-900">DCS Ramonage</span>
              </Link>
            ) : (
              <Link href="/admin/calendrier" className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">DC</span>
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {menuSections.map(section => (
              <div key={section.title}>
                {sidebarOpen && (
                  <h3 className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2 px-3">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map(item => renderMenuItem(item))}
                </div>
              </div>
            ))}
          </nav>

          {/* User profile at bottom */}
          <div ref={userMenuRef} className="relative border-t border-secondary-200 p-3">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-50"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold text-sm">DR</span>
              </div>
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-secondary-900">DCS RAMONAGE</p>
                  <p className="text-xs text-secondary-500">dcsramonage@gmail.com</p>
                </div>
              )}
            </button>
            
            {showUserMenu && sidebarOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-secondary-200 rounded-lg shadow-lg py-1">
                <Link href="/admin/profil" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-50">
                  <User className="w-4 h-4" />
                  Mon profil
                </Link>
                <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-50">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4">🌙</span>
                    Mode sombre
                  </span>
                  <div className="w-8 h-4 bg-secondary-200 rounded-full relative">
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow"></div>
                  </div>
                </button>
                <Link href="/admin/notifications" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-50">
                  <Bell className="w-4 h-4" />
                  Notifications
                </Link>
                <hr className="my-1" />
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-secondary-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Toggle sidebar - Desktop */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 hover:bg-secondary-100 rounded-lg">
              <Menu className="w-5 h-5 text-secondary-500" />
            </button>
            {/* Toggle sidebar - Mobile */}
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-2 text-sm">
              {pathname === '/admin' && (
                <span className="text-secondary-500">Redirection...</span>
              )}
              {pathname === '/admin/calendrier' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Opérations</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Calendrier</span>
                </>
              )}
              {pathname === '/admin/demandes' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Opérations</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Demandes</span>
                </>
              )}
              {pathname === '/admin/maintenances' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Opérations</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Maintenances</span>
                </>
              )}
              {pathname === '/admin/taches' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Opérations</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Tâches</span>
                </>
              )}
              {pathname === '/admin/chantiers' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Opérations</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Chantiers</span>
                </>
              )}
              {pathname === '/admin/tableaux-de-bord' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Outils</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Tableaux de bord</span>
                </>
              )}
              {pathname === '/admin/crm/clients' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Outils</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-500">CRM</span>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Clients</span>
                </>
              )}
              {pathname === '/admin/devis' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Finances</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-500">Ventes</span>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Devis</span>
                </>
              )}
              {pathname === '/admin/factures' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Finances</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-500">Ventes</span>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Factures</span>
                </>
              )}
              {pathname === '/admin/avoirs' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Finances</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-500">Ventes</span>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Avoirs</span>
                </>
              )}
              {pathname === '/admin/paiements' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Finances</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-500">Ventes</span>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Paiements</span>
                </>
              )}
              {pathname === '/admin/depenses' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Finances</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Dépenses</span>
                </>
              )}
              {pathname === '/admin/banque' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Finances</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Banque</span>
                </>
              )}
              {pathname === '/admin/entreprise' && (
                <>
                  <Link href="/admin/calendrier" className="text-secondary-500 hover:text-primary-600">Outils</Link>
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-900 font-medium">Mon entreprise</span>
                </>
              )}
              {pathname === '/admin/parametres' && (
                <>
                  <span className="text-secondary-900 font-medium">Paramètres</span>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* DateRangePicker fonctionnel - uniquement sur tableau de bord */}
            {pathname === '/admin/tableaux-de-bord' && (
              <div className="hidden md:block">
                <DateRangePicker
                  value={dashboardDateRange}
                  onChange={setDashboardDateRange}
                />
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
