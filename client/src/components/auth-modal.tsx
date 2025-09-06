import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "firebase/auth";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just use Google Sign In
    onGoogleSignIn();
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="auth-modal">
        <DialogHeader>
          <DialogTitle data-testid="auth-modal-title">
            {isSignUp ? "S'inscrire" : t('nav.login')}
          </DialogTitle>
        </DialogHeader>
        
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
          <Button type="submit" className="w-full" data-testid="auth-submit-button">
            {isSignUp ? "S'inscrire" : "Se connecter"}
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
