import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';
import type { UserRole, AgentRegistrationRequest } from '../types';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('agent');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isRegLoading, setIsRegLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setLoginError('');
    setIsLoginLoading(true);

    try {
      const response = await authApi.login({ email: loginEmail, password: loginPassword });
      await login(response.access_token, response.user_role as UserRole);

      if (response.user_role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/agent/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setLoginError(message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegistration = async (e: Event) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long');
      return;
    }

    setIsRegLoading(true);

    try {
      const regData: AgentRegistrationRequest = {
        name: regName,
        email: regEmail,
        password: regPassword,
      };

      await authApi.registerAgent(regData);
      setRegSuccess('Registration successful! Your account is pending approval from an administrator.');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setRegError(message);
    } finally {
      setIsRegLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Left Side - Image */}
      <div style={leftPanelStyle}>
        <div style={imageOverlayStyle}>
          <div style={contentStyle}>
            <h1 style={titleStyle}>Smart Agricultural Monitoring</h1>
            <p style={subtitleStyle}>
              Join our community of farmers and agricultural professionals using cutting-edge technology
              to optimize crop management and increase productivity.
            </p>
            <div style={featuresStyle}>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}></span>
                <span>Real-time field monitoring</span>
              </div>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}></span>
                <span>Data-driven insights</span>
              </div>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}></span>
                <span>Collaborative platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={rightPanelStyle}>
        <div style={formContainerStyle}>
              {/* Role Selection */}
          {isLogin && (
            <div style={roleSelectorStyle}>
              <button
                onClick={() => setSelectedRole('admin')}
                style={{
                  ...roleButtonStyle,
                  ...(selectedRole === 'admin' ? roleButtonActiveStyle : {}),
                }}
              >
                Admin Login
              </button>
              <button
                onClick={() => setSelectedRole('agent')}
                style={{
                  ...roleButtonStyle,
                  ...(selectedRole === 'agent' ? roleButtonActiveStyle : {}),
                }}
              >
                Agent Access
              </button>
            </div>
          )}

          {/* Form Toggle */}
          <div style={formToggleStyle}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                ...toggleButtonStyle,
                ...(isLogin ? toggleButtonActiveStyle : {}),
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                ...toggleButtonStyle,
                ...(!isLogin ? toggleButtonActiveStyle : {}),
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={(e) => handleLogin(e as any)} style={formStyle}>
              <div style={formHeaderStyle}>
                <h2 style={formTitleStyle}>Welcome Back</h2>
                <p style={formSubtitleStyle}>
                  Sign in to your {selectedRole} account
                </p>
                {selectedRole === 'admin' && (
                  <p style={{ marginTop: '0.5rem', color: '#f8f1e5', opacity: 0.85, fontSize: '0.9rem' }}>
                    Use admin@smartseason.com / Admin123! to access the administrator account. Public signup creates agent accounts only.
                  </p>
                )}
              </div>

              {loginError && (
                <div style={errorStyle}>{loginError}</div>
              )}

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={isLoginLoading}
                style={{
                  ...submitButtonStyle,
                  ...(isLoginLoading ? submitButtonDisabledStyle : {}),
                }}
              >
                {isLoginLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={(e) => handleRegistration(e as any)} style={formStyle}>
              <div style={formHeaderStyle}>
                <h2 style={formTitleStyle}>Join SmartSeason</h2>
                <p style={formSubtitleStyle}>
                  Create your agent account
                </p>
              </div>

              {regError && (
                <div style={errorStyle}>{regError}</div>
              )}

              {regSuccess && (
                <div style={successStyle}>{regSuccess}</div>
              )}

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a password (min. 6 characters)"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={isRegLoading}
                style={{
                  ...submitButtonStyle,
                  ...(isRegLoading ? submitButtonDisabledStyle : {}),
                }}
              >
                {isRegLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p style={approvalNoteStyle}>
                <small>
                  Note: New agent accounts require approval from an administrator before you can access the system.
                </small>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* Styles */
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  backgroundColor: 'var(--color-bg)',
};

const leftPanelStyle = {
  flex: 1,
  backgroundImage: "url('/Right.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative' as const,
} as React.CSSProperties;

const imageOverlayStyle = {
  position: 'absolute' as const,
  inset: 0,
  backgroundColor: 'rgba(45, 80, 22, 0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--spacing-xl)',
};

const contentStyle = {
  color: 'white',
  textAlign: 'center' as const,
  maxWidth: '500px',
};

const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: 'var(--spacing-md)',
  lineHeight: 1.2,
};

const subtitleStyle = {
  fontSize: '1.1rem',
  marginBottom: 'var(--spacing-xl)',
  opacity: 0.9,
  lineHeight: 1.6,
};

const featuresStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 'var(--spacing-md)',
  alignItems: 'center',
};

const featureItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-sm)',
  fontSize: '1rem',
};

const featureIconStyle = {
  fontSize: '1.5rem',
};

const rightPanelStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--spacing-xl)',
  minWidth: '400px',
  backgroundColor: '#5c3816',
} as React.CSSProperties;

const formContainerStyle = {
  width: '100%',
  maxWidth: '400px',
  backgroundColor: '#7b4e28',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--spacing-xl)',
  boxShadow: 'var(--shadow-lg)',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  color: '#f8f1e5',
};

const roleSelectorStyle = {
  display: 'flex',
  marginBottom: 'var(--spacing-lg)',
  backgroundColor: 'var(--color-bg)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--spacing-xs)',
};

const roleButtonStyle = {
  flex: 1,
  padding: 'var(--spacing-sm) var(--spacing-md)',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--color-text-muted)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'all 0.2s',
};

const roleButtonActiveStyle = {
  backgroundColor: 'var(--color-primary)',
  color: 'white',
};

const formToggleStyle = {
  display: 'flex',
  marginBottom: 'var(--spacing-xl)',
  borderBottom: '1px solid var(--color-border)',
};

const toggleButtonStyle = {
  flex: 1,
  padding: 'var(--spacing-md)',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 500,
  borderBottom: '2px solid transparent',
  transition: 'all 0.2s',
};

const toggleButtonActiveStyle = {
  color: 'var(--color-primary)',
  borderBottom: '2px solid var(--color-primary)',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
};

const formHeaderStyle = {
  textAlign: 'center' as const,
  marginBottom: 'var(--spacing-lg)',
};

const formTitleStyle = {
  fontSize: '1.75rem',
  fontWeight: 600,
  marginBottom: 'var(--spacing-xs)',
  color: 'var(--color-text)',
};

const formSubtitleStyle = {
  color: 'var(--color-text-muted)',
  margin: 0,
};

const errorStyle = {
  padding: 'var(--spacing-sm) var(--spacing-md)',
  marginBottom: 'var(--spacing-md)',
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  borderRadius: 'var(--radius-md)',
  fontSize: '0.875rem',
  textAlign: 'center' as const,
};

const successStyle = {
  padding: 'var(--spacing-sm) var(--spacing-md)',
  marginBottom: 'var(--spacing-md)',
  backgroundColor: '#d1fae5',
  color: '#065f46',
  borderRadius: 'var(--radius-md)',
  fontSize: '0.875rem',
  textAlign: 'center' as const,
};

const inputGroupStyle = {
  marginBottom: 'var(--spacing-md)',
};

const labelStyle = {
  display: 'block',
  marginBottom: 'var(--spacing-xs)',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#f8f1e5',
};

const inputStyle = {
  width: '100%',
  padding: 'var(--spacing-sm) var(--spacing-md)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: '1rem',
  backgroundColor: 'var(--color-bg)',
  color: 'var(--color-text)',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
};

const submitButtonStyle = {
  width: '100%',
  padding: 'var(--spacing-md)',
  backgroundColor: 'var(--color-primary)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  marginTop: 'var(--spacing-md)',
};

const submitButtonDisabledStyle = {
  opacity: 0.6,
  cursor: 'not-allowed',
};

const approvalNoteStyle = {
  marginTop: 'var(--spacing-md)',
  textAlign: 'center' as const,
  color: 'var(--color-text-muted)',
  fontSize: '0.8rem',
  lineHeight: 1.4,
};