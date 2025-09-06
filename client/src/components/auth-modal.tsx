import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "firebase/auth";
import { signUpWithEmail, signInWithEmail } from "../lib/firebase";
import { AlertCircle, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: () => void;
  user: User | null;
  t: (key: string) => string;
}

export default function AuthModal({ isOpen, onClose, onGoogleSignIn, user, t }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      // Modal will close automatically via onAuthStateChanged
      setEmail("");
      setPassword("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="auth-modal">
        <DialogHeader>
          <DialogTitle data-testid="auth-modal-title">
            {isSignUp ? "S'inscrire" : t('nav.login')}
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" data-testid="auth-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="auth-form">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="email-input"
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="password-input"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading} data-testid="auth-submit-button">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Inscription..." : "Connexion..."}
              </>
            ) : (
              isSignUp ? "S'inscrire" : "Se connecter"
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">ou</p>
          <Button 
            onClick={onGoogleSignIn} 
            variant="outline" 
            className="w-full"
            data-testid="google-signin-button"
          >
            Continuer avec Google
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Déjà un compte ?" : "Pas de compte ?"}{" "}
            <button 
              type="button"
              onClick={handleToggleMode}
              className="text-primary hover:underline"
              data-testid="toggle-auth-mode"
            >
              {isSignUp ? "Se connecter" : "S'inscrire"}
            </button>
          </p>
        </div>
        
        <div className="text-center text-xs text-muted-foreground" data-testid="firebase-info">
          Authentification sécurisée via Firebase
        </div>
      </DialogContent>
    </Dialog>
  );
}
