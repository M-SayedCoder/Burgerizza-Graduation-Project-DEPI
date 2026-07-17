import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK } from '../../services/config';
import { mockUsers } from '../../services/mockData';
import { login } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);

    try {
      if (MOCK.auth) {
        // Mock login — find user by email, any password works
        await new Promise((r) => setTimeout(r, 600));
        const user = mockUsers.find((u) => u.email === email);

        if (!user) throw new Error('User not found. Try: manager@burgerizza.com');
        if (user.role !== 'manager' && user.role !== 'admin') {
          throw new Error('Access denied. Manager account required.');
        }

        const mockToken = 'mock_token_' + Date.now();
        loginUser(mockToken, user);
        toast.success(`Welcome, ${user.name}! (Mock Mode)`);
        navigate('/');
      } else {
        const res = await login({ email, password });
        const raw = res.data.data;
        // Backend returns 'id' — normalize to '_id' for consistency
        const user = { ...raw.user, _id: raw.user._id ?? (raw.user as any).id };
        const token = raw.token;

        if (!token) throw new Error('No token received from server');
        if (user.role !== 'manager' && user.role !== 'admin') {
          toast.error('Access denied. Manager account required.');
          return;
        }

        loginUser(token, user);
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Login failed. Check your credentials.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white">
            Burger<span className="text-orange-500">izza</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">Manager Dashboard</p>
          {MOCK.auth && (
            <div className="mt-3 inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs px-3 py-1.5 rounded-full border border-orange-500/30">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              Mock Mode — No Backend Required
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Sign In</h2>

          {MOCK.auth && (
            <div className="mb-5 p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-700 space-y-1">
              <p className="font-semibold">Demo Credentials:</p>
              <p>📧 manager@burgerizza.com</p>
              <p>🔑 any password</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@burgerizza.com"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-3 font-semibold transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          {MOCK.auth ? 'Running in Mock Mode · No backend required' : 'Restricted to Manager & Admin accounts only'}
        </p>
      </div>
    </div>
  );
};

export default Login;
