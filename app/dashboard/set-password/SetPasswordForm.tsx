"use client";

import { createClient } from "@/utils/supabase/client";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthField, AuthMessage, AuthShell, AuthSubmit } from "../AuthShell";

const MIN_PASSWORD_LENGTH = 8;

export function SetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) return setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
    if (password !== confirmation) return setError("Las contraseñas no coinciden.");

    setIsSubmitting(true);
    setError("");
    const { error: updateError } = await createClient().auth.updateUser({ password });
    if (updateError) {
      setError("No se pudo guardar la contraseña. Solicita un nuevo enlace e inténtalo de nuevo.");
      setIsSubmitting(false);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell title="Crea tu contraseña" description={`La usarás para entrar al dashboard desde ahora. Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <AuthField label="Nueva contraseña" icon={Lock} type="password" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <AuthField label="Repite la contraseña" icon={Lock} type="password" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        {error && <AuthMessage tone="error">{error}</AuthMessage>}
        <AuthSubmit isSubmitting={isSubmitting} label="Guardar contraseña" loadingLabel="Guardando..." />
      </form>
    </AuthShell>
  );
}
