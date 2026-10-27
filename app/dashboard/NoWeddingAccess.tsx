import { LogoutButton } from "./LogoutButton";

export function NoWeddingAccess() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f3ec] px-4 text-[#24332e]">
      <div className="max-w-md border border-[#24332e]/15 bg-white p-8 text-center">
        <h1 className="font-serif text-3xl font-medium">Sin boda asignada</h1>
        <p className="mt-3 text-sm text-[#24332e]/70">Tu cuenta inició sesión correctamente, pero todavía no está asociada a ninguna boda. Pide a los administradores que agreguen tu correo.</p>
        <div className="mt-6 flex justify-center"><LogoutButton /></div>
      </div>
    </main>
  );
}
