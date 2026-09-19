import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, KeyRound, Mail, AtSign, Lock } from "lucide-react";
import { Field, inputCls } from "./ProfileSection";

export function AccountSection() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [resetEmail, setResetEmail] = useState(user?.email ?? "");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const sendReset = async () => {
    if (!resetEmail) return toast.error("Enter an email");
    setBusy("reset");
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/login`,
    });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Password reset email sent");
  };

  const changeEmail = async () => {
    if (!newEmail) return toast.error("Enter a new email");
    setBusy("email");
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Confirmation email sent to both old and new addresses");
    setNewEmail("");
  };

  const changePassword = async () => {
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setBusy("pw");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-foreground/10 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Signed in as</p>
        <p className="mt-1 text-sm font-medium flex items-center gap-2">
          <Mail size={14} className="text-muted-foreground" />
          {user?.email ?? "—"}
        </p>
      </div>

      <Field label="Change email" hint="A confirmation link will be sent to both addresses.">
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            type="email"
            placeholder="new@example.com"
          />
          <button
            onClick={changeEmail}
            disabled={busy === "email"}
            className="btn-anim shrink-0 flex items-center gap-1 rounded-xl bg-primary text-primary-foreground px-3 text-xs font-medium disabled:opacity-60"
          >
            <AtSign size={14} /> Update
          </button>
        </div>
      </Field>

      <Field label="Change password" hint="Minimum 6 characters.">
        <div className="space-y-2">
          <input
            className={inputCls}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="New password"
            autoComplete="new-password"
          />
          <input
            className={inputCls}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
          <button
            onClick={changePassword}
            disabled={busy === "pw"}
            className="btn-anim flex items-center gap-1 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-medium disabled:opacity-60"
          >
            <Lock size={14} /> Update password
          </button>
        </div>
      </Field>

      <Field label="Forgot password?" hint="We'll email a reset link to this address.">
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
          />
          <button
            onClick={sendReset}
            disabled={busy === "reset"}
            className="btn-anim shrink-0 flex items-center gap-1 rounded-xl bg-secondary px-3 text-xs font-medium disabled:opacity-60"
          >
            <KeyRound size={14} /> Send
          </button>
        </div>
      </Field>

      <button
        onClick={() => signOut().then(() => navigate({ to: "/login" }))}
        className="btn-anim flex items-center gap-2 rounded-xl bg-destructive text-destructive-foreground px-5 py-2.5 text-sm font-semibold"
      >
        <LogOut size={14} /> Sign out
      </button>
    </div>
  );
}
