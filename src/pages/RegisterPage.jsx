import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register(
        form.name.trim(),
        form.email.trim(),
        form.password,
        form.confirmPassword
      );
      if (data.success) {
        addToast(
          `Welcome to House of RCR, ${data.user.name.split(' ')[0]}!`,
          'success'
        );
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: 'Full Name',
      name: 'name',
      type: 'text',
      placeholder: 'Your full name',
      icon: User,
      autoComplete: 'name',
      show: null,
      setShow: null,
    },
    {
      label: 'Email Address',
      name: 'email',
      type: 'email',
      placeholder: 'you@example.com',
      icon: Mail,
      autoComplete: 'email',
      show: null,
      setShow: null,
    },
    {
      label: 'Password',
      name: 'password',
      type: 'password',
      placeholder: 'Min. 6 characters',
      icon: Lock,
      autoComplete: 'new-password',
      show: showPassword,
      setShow: setShowPassword,
    },
    {
      label: 'Confirm Password',
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Repeat your password',
      icon: Lock,
      autoComplete: 'new-password',
      show: showConfirm,
      setShow: setShowConfirm,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-9 h-9 rounded-xl bg-brand-dark text-amber-400 font-serif font-bold text-lg flex items-center justify-center shadow">
              R
            </span>
            <span className="font-serif text-xl font-bold tracking-wider text-brand-dark uppercase">
              House of RCR
            </span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-slate-900 mb-1">
            Create Account
          </h1>
          <p className="text-sm text-slate-500">
            Join House of RCR and explore premium Indian fashion
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((f) => {
              const Icon = f.icon;
              const isPasswordField = f.show !== null;
              const resolvedType = isPasswordField
                ? f.show
                  ? 'text'
                  : 'password'
                : f.type;

              return (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    {f.label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={resolvedType}
                      name={f.name}
                      required
                      autoComplete={f.autoComplete}
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                    {isPasswordField && (
                      <button
                        type="button"
                        onClick={() => f.setShow(!f.show)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                      >
                        {f.show ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-dark hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-amber-700 hover:text-amber-900 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
