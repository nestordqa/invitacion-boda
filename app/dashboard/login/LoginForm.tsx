"use client";

import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthField, AuthMessage, AuthShell, AuthSubmit } from "../AuthShell";

type Mode = "login" | "first-time" | "forgot";

const modeTexts: Record<Mode, { title: string; description: string }> = {
  login: { title: "Bienvenidos", description: "Inicia sesión para gestionar invitados, mesas y compras." },
  "first-time": { title: "Primer ingreso", description: "Te enviaremos un enlace a tu correo para que crees tu contraseña." },
  forgot: { title: "Recuperar contraseña", description: "Te enviaremos un enlace a tu correo para que elijas una contraseña nueva." },
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(searchParams.get("error") === "link" ? "El enlace no es válido o ya expiró. Solicita uno nuevo." : "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setError("");
    setMessage("");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    const { error: signInError } = await createClient().auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (signInError) {
      setError("Correo o contraseña incorrectos.");
      setIsSubmitting(false);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  async function handleSendLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/auth/password-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setMessage(result.message);
    } catch (sendError) {
      setError(sendError instanceof Error && sendError.message ? sendError.message : "No se pudo enviar el enlace.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const emailField = <AuthField label="Correo electrónico" icon={Mail} type="email" required autoComplete="email" placeholder="tu@correo.com" value={email} onChange={(event) => setEmail(event.target.value)} />;
  const linkButton = "font-medium text-[#a04d34] underline-offset-4 hover:underline";

  return (
    <AuthShell title={modeTexts[mode].title} description={modeTexts[mode].description}>
      {mode === "login" ? (
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          {emailField}
          <AuthField label="Contraseña" icon={Lock} type="password" required autoComplete="current-password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} />
          <div className="flex justify-end">
            <button type="button" onClick={() => changeMode("forgot")} className={`text-xs ${linkButton}`}>¿Olvidaste tu contraseña?</button>
          </div>
          {error && <AuthMessage tone="error">{error}</AuthMessage>}
          <AuthSubmit isSubmitting={isSubmitting} label="Entrar" loadingLabel="Entrando..." />
          <div className="mt-7 border-t border-[#24332e]/10 pt-5 text-center text-sm text-[#24332e]/65">
            ¿Es tu primera vez?{" "}
            <button type="button" onClick={() => changeMode("first-time")} className={linkButton}>Crea tu contraseña</button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSendLink} className="mt-8">
          {emailField}
          {error && <AuthMessage tone="error">{error}</AuthMessage>}
          {message && <AuthMessage tone="success">{message}</AuthMessage>}
          <AuthSubmit isSubmitting={isSubmitting} label="Enviar enlace" loadingLabel="Enviando..." />
          <button type="button" onClick={() => changeMode("login")} className="mx-auto mt-6 flex items-center gap-1.5 text-sm text-[#24332e]/65 hover:text-[#24332e]">
            <ArrowLeft className="size-4" />Volver a iniciar sesión
          </button>
        </form>
      )}
    </AuthShell>
  );
}
