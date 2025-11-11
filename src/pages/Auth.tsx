import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const stored = window.localStorage.getItem('demostoke-remember-me');
      return stored ? stored === 'true' : true;
    } catch {
      return true;
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const { signIn, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('demostoke-remember-me', rememberMe ? 'true' : 'false');
    } catch {
      // Ignore write failures (private mode, etc.)
    }
  }, [rememberMe]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setErrors({ password: 'Password must be at least 8 characters long' });
      setLoading(false);
      return;
    }

    if (!captchaToken) {
      setErrors({ general: 'Please complete the captcha verification' });
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password, captchaToken);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setErrors({ general: 'Invalid email or password' });
      } else {
        setErrors({ general: error.message });
      }
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ocean-light dark:bg-mountain-dark">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link to="/" className="flex items-center justify-center">
          <img
            src="/img/demostoke-logo-ds-transparent-cropped.webp"
            alt="DemoStoke Logo"
            className="h-8 w-auto"
          />
          <span
            className="ml-2 text-xl font-bold font-primary"
            style={{ color: "hsl(186 100% 48%)" }}
          >
            DemoStoke
          </span>
        </Link>
        <div className="ml-auto">
          <Button
            variant="ghost"
            asChild
            className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
          >
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <form onSubmit={handleSignIn}>
            <Card className="w-full max-w-md mx-auto border border-border/80 shadow-lg dark:border-muted">
            <CardHeader className="text-center">
              <div className="mb-2 flex items-center justify-center text-primary">
                <MapPin className="h-6 w-6" />
                <h3 className="ml-2 text-2xl font-semibold tracking-tight text-foreground">Sign In to DemoStoke</h3>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="signin-password">Password</Label>
                  <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember-me" className="text-sm font-normal text-muted-foreground">
                  Remember me
                </Label>
              </div>

              <div className="pt-2">
                <HCaptcha
                  ref={captchaRef}
                  sitekey="8d0c1c8a-89b0-44a2-ab1c-b8f809a6dd00"
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  onError={() => setCaptchaToken(null)}
                />
              </div>

              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading || !captchaToken}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
