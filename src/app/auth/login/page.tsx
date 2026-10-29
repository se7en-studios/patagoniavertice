"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          email: useEmail ? email : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.error || "Clave o credenciales incorrectas");
      }
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "#050811" }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] opacity-15 blur-[140px] pointer-events-none rounded-full"
        style={{ background: "#C9A84C" }}
      />
      <div className="absolute inset-0 grain-overlay opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-md bg-[#090E1C] border border-[#C9A84C]/40 p-8 md:p-10 shadow-2xl backdrop-blur-2xl relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img
              src="/logoo.png"
              alt="ALTUM SCI"
              className="h-14 mx-auto w-auto object-contain"
              style={{ mixBlendMode: "screen", filter: "brightness(1.1)" }}
            />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-dorado" />
            <span className="font-body text-dorado text-[10px] tracking-[0.25em] uppercase font-semibold">
              Panel de Administración
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-dorado" />
          </div>
          <h1 className="font-display text-2xl text-crema font-medium">
            Acceso Propietaria &amp; Gestión
          </h1>
          <p className="font-body text-crema/45 text-xs mt-1.5">
            Ingreso exclusivo para administración de catálogo y contenidos.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-crema/10 mb-6 pb-2 text-xs">
          <button
            type="button"
            onClick={() => setUseEmail(false)}
            className={`flex-1 py-1.5 font-body tracking-wider uppercase transition-colors text-[10px] font-semibold ${
              !useEmail ? "text-dorado border-b-2 border-dorado" : "text-crema/40 hover:text-crema"
            }`}
          >
            Clave Maestra
          </button>
          <button
            type="button"
            onClick={() => setUseEmail(true)}
            className={`flex-1 py-1.5 font-body tracking-wider uppercase transition-colors text-[10px] font-semibold ${
              useEmail ? "text-dorado border-b-2 border-dorado" : "text-crema/40 hover:text-crema"
            }`}
          >
            Correo &amp; Contraseña
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-body rounded-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {useEmail && (
            <div>
              <label className="block font-body text-[10px] tracking-[0.18em] uppercase text-dorado mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="estela@altumsci.com.ar"
                className="w-full bg-navy-900/90 border border-crema/20 px-4 py-3 text-crema font-body text-sm placeholder:text-crema/25 focus:outline-none focus:border-dorado transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block font-body text-[10px] tracking-[0.18em] uppercase text-dorado mb-1.5">
              {useEmail ? "Contraseña" : "Clave de Acceso (PIN)"}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-navy-900/90 border border-crema/20 px-4 py-3 text-crema font-body text-sm placeholder:text-crema/25 focus:outline-none focus:border-dorado transition-colors"
            />
            {!useEmail && (
              <p className="font-body text-[10px] text-crema/35 mt-1">
                Clave por defecto: <code className="text-dorado/80">altum2026</code>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-dorado text-tierra font-body text-xs font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span>Verificando...</span>
            ) : (
              <>
                <span>Ingresar al Panel</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-crema/10 flex items-center justify-between text-xs font-body text-crema/40">
          <Link href="/" className="hover:text-dorado transition-colors">
            ← Volver a la Landing
          </Link>
          <span>Estela Mari Rojas · Mat. 35 RP</span>
        </div>
      </div>
    </div>
  );
}
