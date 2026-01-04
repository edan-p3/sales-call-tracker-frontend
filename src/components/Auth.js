import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('sales_rep');
  const [organizationId, setOrganizationId] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Load organizations for joining (only shown for sales_rep)
  useEffect(() => {
    if (!isLogin) {
      loadOrganizations();
    }
  }, [isLogin]);

  const loadOrganizations = async () => {
    try {
      const response = await api.get('/team/organizations');
      setOrganizations(response.data.data || []);
    } catch (error) {
      // If it fails, user can still create a new org - just set empty array
      console.error('Failed to load organizations:', error);
      setOrganizations([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        if (!firstName || !lastName) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        // Validate organization selection
        if (role === 'manager' && !organizationName) {
          setError('Please enter your organization name');
          setLoading(false);
          return;
        }

        if (role === 'sales_rep' && !organizationId && !organizationName) {
          setError('Please select or create an organization');
          setLoading(false);
          return;
        }

        result = await register(
          email, 
          password, 
          firstName, 
          lastName, 
          role,
          organizationName || undefined,
          organizationId || undefined
        );
      }

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            {isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Sales Activity Tracker
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-md" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required={!isLogin}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required={!isLogin}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
                    I am a
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      required={!isLogin}
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        setOrganizationId('');
                        setOrganizationName('');
                      }}
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
                    >
                      <option value="sales_rep">Sales Rep</option>
                      <option value="manager">Manager</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Organization Selection */}
                {role === 'manager' ? (
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-slate-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      required={!isLogin && role === 'manager'}
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Acme Corp"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      You'll create a new organization
                    </p>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-slate-700 mb-1">
                      Organization
                    </label>
                    {organizations.length > 0 ? (
                      <>
                        <div className="relative">
                          <select
                            id="organization"
                            name="organization"
                            value={organizationId}
                            onChange={(e) => {
                              setOrganizationId(e.target.value);
                              if (e.target.value) {
                                setOrganizationName('');
                              }
                            }}
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
                          >
                            <option value="">Select existing or create new</option>
                            {organizations.map(org => (
                              <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                            </svg>
                          </div>
                        </div>
                        {!organizationId && (
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Or create new organization"
                              value={organizationName}
                              onChange={(e) => setOrganizationName(e.target.value)}
                              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <input
                        id="organizationName"
                        type="text"
                        required={!isLogin && role === 'sales_rep'}
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="Your organization name"
                        className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      Join your team's organization
                    </p>
                  </div>
                )}
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                {isLogin && (
                  <a 
                    href="#forgot-password" 
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset feature coming soon! Please contact your administrator for assistance.');
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {!isLogin && (
                <p className="mt-1 text-xs text-slate-500">
                  Min 8 characters, 1 uppercase, 1 number
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign in' : 'Create Account')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;

