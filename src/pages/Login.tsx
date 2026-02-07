import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { Lock, Mail, ArrowRight, ShieldCheck, Github, Chrome } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await insforge.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
            } else if (data) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('An unexpected system error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: 'google' | 'github') => {
        try {
            await insforge.auth.signInWithOAuth({
                provider,
                redirectTo: window.location.origin + '/dashboard',
            });
        } catch (err) {
            setError(`Failed to initialize ${provider} authentication.`);
        }
    };

    return (
        <div className="min-h-screen bg-onyx text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Branding */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-2xl relative group">
                        <div className="absolute inset-0 bg-gold-accent/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                        <ShieldCheck className="w-8 h-8 text-gold-accent" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-[4px] uppercase mb-2">
                        ONYX <span className="text-gold-accent">&</span> CODE
                    </h1>
                    <p className="text-gray-500 font-mono text-[10px] tracking-[4px] uppercase">Operational Protocol 01</p>
                </div>

                {/* Login Card */}
                <div className="bg-onyx-light/40 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Top subtle shine */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-[3px] uppercase text-gray-400 pl-1">Email Identifier</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-accent transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vault@onyxandcode.com"
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm outline-none focus:border-gold-accent/50 focus:bg-black/60 transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-[3px] uppercase text-gray-400 pl-1">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-accent transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm outline-none focus:border-gold-accent/50 focus:bg-black/60 transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-400 text-center font-medium animate-pulse">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group relative overflow-hidden rounded-xl h-14 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-gold-accent transition-transform group-hover:scale-105"></div>
                            <div className="relative h-full flex items-center justify-center gap-2 text-black font-extrabold text-xs tracking-[3px] uppercase">
                                {loading ? 'Authenticating...' : 'Access Command Center'}
                                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </div>
                        </button>
                    </form>

                    <div className="mt-10 mb-8 flex items-center gap-4">
                        <div className="flex-1 h-[1px] bg-white/5"></div>
                        <span className="text-[10px] font-bold text-gray-600 tracking-[2px] uppercase">Third-Party Verification</span>
                        <div className="flex-1 h-[1px] bg-white/5"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleOAuth('github')}
                            className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-3 hover:bg-white/10 transition-all active:scale-95 group"
                        >
                            <Github className="w-4 h-4 text-white group-hover:text-gold-accent transition-colors" />
                            <span className="text-[10px] font-bold tracking-[1px] uppercase">Github</span>
                        </button>
                        <button
                            onClick={() => handleOAuth('google')}
                            className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-3 hover:bg-white/10 transition-all active:scale-95 group"
                        >
                            <Chrome className="w-4 h-4 text-white group-hover:text-gold-accent transition-colors" />
                            <span className="text-[10px] font-bold tracking-[1px] uppercase">Google</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold text-gray-600 tracking-[2px] uppercase">
                        Not authorized? <a href="/#contact" className="text-gold-accent hover:underline">Apply for Project Access</a>
                    </p>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[9px] text-gray-700 tracking-[5px] uppercase whitespace-nowrap">
                End-to-End Encryption Controlled by Onyx-v2
            </div>
        </div>
    );
}
