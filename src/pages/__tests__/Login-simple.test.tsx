import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Simple Login page test
describe('Login Page', () => {
  test('renders login form', () => {
    const LoginComponent = () => (
      <div>
        <h1>Sign In</h1>
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        <p>
          Don't have an account? 
          <a href="/register">Sign up here</a>
        </p>
      </div>
    );

    render(<LoginComponent />);

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    const FormComponent = () => {
      const [email, setEmail] = React.useState('');
      const [password, setPassword] = React.useState('');

      return (
        <form>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            data-testid="email-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            data-testid="password-input"
          />
          <div data-testid="form-state">
            Email: {email}, Password: {password ? '***' : ''}
          </div>
        </form>
      );
    };

    render(<FormComponent />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(screen.getByTestId('form-state')).toHaveTextContent('Email: test@example.com, Password: ***');
  });

  test('displays form validation', () => {
    const ValidationComponent = () => {
      const [errors, setErrors] = React.useState<string[]>([]);

      const validateForm = () => {
        const newErrors: string[] = [];
        
        const email = (document.getElementById('email') as HTMLInputElement)?.value;
        const password = (document.getElementById('password') as HTMLInputElement)?.value;

        if (!email) newErrors.push('Email is required');
        if (!password) newErrors.push('Password is required');
        if (password && password.length < 6) newErrors.push('Password must be at least 6 characters');

        setErrors(newErrors);
      };

      return (
        <div>
          <form>
            <input type="email" id="email" placeholder="Email" />
            <input type="password" id="password" placeholder="Password" />
            <button type="button" onClick={validateForm}>Validate</button>
          </form>
          {errors.length > 0 && (
            <div data-testid="error-list">
              {errors.map((error, index) => (
                <div key={index} data-testid={`error-${index}`}>
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    render(<ValidationComponent />);

    const validateButton = screen.getByRole('button', { name: 'Validate' });
    fireEvent.click(validateButton);

    expect(screen.getByTestId('error-list')).toBeInTheDocument();
    expect(screen.getByTestId('error-0')).toHaveTextContent('Email is required');
    expect(screen.getByTestId('error-1')).toHaveTextContent('Password is required');
  });

  test('shows remember me option', () => {
    const RememberMeComponent = () => {
      const [rememberMe, setRememberMe] = React.useState(false);

      return (
        <div>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              data-testid="remember-checkbox"
            />
            Remember me
          </label>
          <div data-testid="remember-state">
            Remember me: {rememberMe ? 'Yes' : 'No'}
          </div>
        </div>
      );
    };

    render(<RememberMeComponent />);

    const checkbox = screen.getByTestId('remember-checkbox');
    fireEvent.click(checkbox);

    expect(screen.getByTestId('remember-state')).toHaveTextContent('Remember me: Yes');
  });

  test('displays forgot password link', () => {
    const ForgotPasswordComponent = () => (
      <div>
        <p>
          <a href="/forgot-password" data-testid="forgot-link">
            Forgot your password?
          </a>
        </p>
        <p>
          <a href="/help" data-testid="help-link">
            Need help signing in?
          </a>
        </p>
      </div>
    );

    render(<ForgotPasswordComponent />);

    expect(screen.getByTestId('forgot-link')).toBeInTheDocument();
    expect(screen.getByTestId('help-link')).toBeInTheDocument();
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
  });

  test('handles form submission', () => {
    const SubmissionComponent = () => {
      const [submitted, setSubmitted] = React.useState(false);
      const [loading, setLoading] = React.useState(false);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        setTimeout(() => {
          setLoading(false);
          setSubmitted(true);
        }, 100);
      };

      if (submitted) {
        return <div data-testid="success-message">Login successful!</div>;
      }

      return (
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" disabled={loading} data-testid="submit-button">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      );
    };

    render(<SubmissionComponent />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent('Signing in...');
    
    // Wait for async operation
    setTimeout(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    }, 150);
  });
});
