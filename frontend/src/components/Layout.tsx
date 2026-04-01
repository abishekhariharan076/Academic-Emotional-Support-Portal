import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    HeartHandshake, 
    MessageSquare, 
    Inbox, 
    LogOut, 
    Menu, 
    Shield, 
    BookOpen,
    LucideIcon
} from 'lucide-react';

interface NavLink {
    label: string;
    path: string;
    icon: LucideIcon;
}

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Navigation Config
    const studentLinks: NavLink[] = [
        { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
        { label: 'Check-In', path: '/checkin', icon: HeartHandshake },
        { label: 'Support Requests', path: '/support', icon: MessageSquare },
        { label: 'Reference', path: '/reference', icon: BookOpen },
    ];

    const counselorLinks: NavLink[] = [
        { label: 'Dashboard', path: '/counselor', icon: LayoutDashboard },
        { label: 'Support Requests', path: '/support', icon: Inbox },
        { label: 'Reference', path: '/reference', icon: BookOpen },
    ];

    const adminLinks: NavLink[] = [
        { label: 'Dashboard', path: '/admin', icon: Shield },
        { label: 'Reference', path: '/reference', icon: BookOpen },
    ];

    let links: NavLink[] = [];
    if (user?.role === 'student') links = studentLinks;
    else if (user?.role === 'counselor') links = counselorLinks;
    else if (user?.role === 'admin') links = adminLinks;

    return (
        <div className="flex h-screen bg-canvas overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-surface border-r border-border
          transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-4 border-b border-border">
                    <Logo type="horizontal" />
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`
                  flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-text-body hover:bg-canvas hover:text-text-main'
                                    }
                `}
                            >
                                <link.icon className="w-5 h-5 mr-3" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-main truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-text-muted truncate capitalize">{user?.role || 'Guest'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-status-error bg-status-error/5 hover:bg-status-error/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-surface border-b border-border flex items-center justify-between px-4 z-10">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-text-body hover:text-primary rounded-lg active:bg-canvas"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-semibold text-text-main">AESP</span>
                    <div className="w-8" /> {/* Spacer for balance */}
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
