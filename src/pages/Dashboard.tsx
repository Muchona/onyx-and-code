import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import {
    LayoutDashboard,
    Layers,
    FileCode,
    Settings,
    LogOut,
    Activity,
    Box,
    ChevronRight,
    TrendingUp,
    Clock,
    ExternalLink,
    Plus
} from 'lucide-react';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await insforge.auth.getCurrentSession();
            if (error || !data.session) {
                navigate('/login');
            } else {
                setUser(data.session.user);
                fetchProjects();
            }
        };

        const fetchProjects = async () => {
            const { data, error } = await insforge.database
                .from('projects')
                .select('*')
                .order('updated_at', { ascending: false });

            if (!error) setProjects(data || []);
            setLoading(false);
        };

        checkSession();
    }, [navigate]);

    const handleLogout = async () => {
        await insforge.auth.signOut();
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen bg-onyx flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-onyx text-white flex">
            {/* Sidebar */}
            <aside className="w-20 md:w-64 border-r border-white/10 flex flex-col items-center md:items-stretch py-8 bg-black/20 backdrop-blur-3xl fixed h-full z-20">
                <div className="px-6 mb-12 flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gold-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        <Box className="text-black w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="hidden md:block font-black tracking-[3px] text-sm uppercase">Onyx Hub</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavItem icon={<LayoutDashboard />} label="Command" active />
                    <NavItem icon={<Layers />} label="Vault" />
                    <NavItem icon={<FileCode />} label="Blueprints" />
                    <NavItem icon={<Activity />} label="Analytics" />
                    <NavItem icon={<Settings />} label="Settings" />
                </nav>

                <div className="px-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                        <span className="hidden md:block text-[10px] font-bold tracking-[2px] uppercase">Initialize Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-20 md:ml-64 p-6 md:p-12 relative">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-accent/5 rounded-full blur-[150px] pointer-events-none"></div>

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 text-gold-accent mb-2">
                            <span className="w-2 h-2 rounded-full bg-gold-accent animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.8)]"></span>
                            <span className="text-[10px] font-mono tracking-[4px] uppercase font-bold">System Status: Optimal</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{user?.profile?.name || 'Authorized User'}</span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <button className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all group">
                            <Plus className="w-4 h-4 text-gold-accent" />
                            <span className="text-[10px] font-bold tracking-[2px] uppercase">Request Build</span>
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard label="Active Sprints" value="03" icon={<TrendingUp />} trend="+12%" />
                    <StatCard label="Total Deployments" value="24" icon={<Box />} />
                    <StatCard label="Uptime Score" value="99.9%" icon={<Activity />} color="text-green-400" />
                </div>

                {/* Project Grid */}
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold tracking-tight border-l-4 border-gold-accent pl-4">Active Projects</h2>
                        <button className="text-[10px] font-bold tracking-[2px] uppercase text-gray-500 hover:text-white transition-colors">View All Archive</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {projects.length > 0 ? projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        )) : (
                            <div className="col-span-2 py-20 bg-onyx-light/20 border border-white/5 rounded-3xl flex flex-col items-center justify-center text-center">
                                <Box className="w-12 h-12 text-gray-700 mb-4" />
                                <p className="text-gray-500 font-mono text-sm">No active deployments detected.</p>
                                <button className="mt-6 text-gold-accent text-xs font-bold tracking-widest uppercase hover:underline">Synchronize Repository</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center justify-center md:justify-start gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-gold-accent text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
            {icon}
            <span className="hidden md:block text-[11px] font-black tracking-[2px] uppercase">{label}</span>
        </div>
    );
}

function StatCard({ label, value, icon, trend, color = "text-gold-accent" }: any) {
    return (
        <div className="bg-onyx-light/40 border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-white/5 rounded-xl ${color}`}>
                    {icon}
                </div>
                {trend && <span className="text-green-500 text-[10px] font-bold bg-green-500/10 px-2 py-1 rounded">{trend}</span>}
            </div>
            <div className="text-4xl font-extrabold mb-2">{value}</div>
            <div className="text-[10px] font-bold text-gray-500 tracking-[2px] uppercase">{label}</div>
        </div>
    );
}

function ProjectCard({ project }: { project: any }) {
    const statusColors: any = {
        'Planning': 'border-blue-500/50 text-blue-400 bg-blue-500/10',
        'Execution': 'border-amber-500/50 text-amber-400 bg-amber-500/10',
        'Verification': 'border-purple-500/50 text-purple-400 bg-purple-500/10',
        'Live': 'border-green-500/50 text-green-400 bg-green-500/10',
    };

    return (
        <div className="bg-onyx-light/40 border border-white/10 p-8 rounded-3xl hover:border-gold-accent/30 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold tracking-tight group-hover:text-gold-accent transition-colors">{project.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${statusColors[project.status] || 'border-gray-500/50 text-gray-400 bg-gray-500/10'}`}>
                            {project.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                        <div className="flex items-center gap-1.5 border-r border-white/10 pr-4">
                            <Clock className="w-3 h-3" />
                            <span>Updated 2h ago</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Activity className="w-3 h-3 text-green-500" />
                            <span>Healthy</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-gold-accent hover:text-black transition-all">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                    <div className="text-[10px] font-bold text-gray-600 tracking-[2px] uppercase mb-1">Architecture</div>
                    <div className="text-xs font-bold text-gray-300">Vite + React + R3F</div>
                </div>
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                    <div className="text-[10px] font-bold text-gray-600 tracking-[2px] uppercase mb-1">Infrastructure</div>
                    <div className="text-xs font-bold text-gray-300">InsForge Global</div>
                </div>
            </div>

            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-bold text-xs tracking-[3px] uppercase">
                Open Workspace
                <ChevronRight className="w-4 h-4" />
            </button>

            {/* Background Decorative */}
            <Box className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 -rotate-12 pointer-events-none group-hover:text-gold-accent/5 transition-colors duration-700" />
        </div>
    );
}
