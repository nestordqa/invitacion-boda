"use client";

import { Check, ChevronLeft, ChevronRight, Copy, Pencil, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { formatGuestName, MAX_CONFIRMED_GUESTS } from "@/utils/wedding";
import { DashboardNav } from "./DashboardNav";

type Guest = {
  id: number;
  family: boolean;
  name: string;
  groom_family: boolean;
  bride_family: boolean;
  friend: boolean;
  confirmation: "pending" | "confirmed" | "declined";
  passes_number: number;
  used_passes_confirmed: number;
  guest_observation: string | null;
  internal_observation: string | null;
  invitation_url: string | null;
  invitation_sent: boolean;
};

type GuestSummary = {
  totalPasses: number;
  groomFamilyPasses: number;
  brideFamilyPasses: number;
  friendPasses: number;
  confirmedPasses: number;
  pendingPasses: number;
  declinedPasses: number;
};

type GuestsResponse = { guests: Guest[]; page: number; pageSize: number; total: number; summary: GuestSummary; error?: string };

type GuestFilters = {
  relationships: Array<"groom_family" | "bride_family" | "friend">;
  status: "" | Guest["confirmation"];
  sent: "" | "true" | "false";
  search: string;
};

type GuestForm = {
  name: string;
  passes_number: number;
  used_passes_confirmed: number;
  confirmation: Guest["confirmation"];
  invitation_sent: boolean;
  family: boolean;
  groom_family: boolean;
  bride_family: boolean;
  friend: boolean;
  internal_observation: string;
};

const initialForm: GuestForm = {
  name: "",
  passes_number: 1,
  used_passes_confirmed: 0,
  confirmation: "pending",
  invitation_sent: false,
  family: false,
  groom_family: false,
  bride_family: false,
  friend: false,
  internal_observation: "",
};

const statusLabels = { pending: "Pendiente", confirmed: "Confirmado", declined: "Declinó" };
const initialFilters: GuestFilters = { relationships: [], status: "", sent: "", search: "" };

export function GuestsDashboard() {
  const [data, setData] = useState<GuestsResponse>({ guests: [], page: 1, pageSize: 10, total: 0, summary: { totalPasses: 0, groomFamilyPasses: 0, brideFamilyPasses: 0, friendPasses: 0, confirmedPasses: 0, pendingPasses: 0, declinedPasses: 0 } });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [guestDetails, setGuestDetails] = useState<Guest | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [updatingInvitationId, setUpdatingInvitationId] = useState<number | null>(null);
  const [filters, setFilters] = useState<GuestFilters>(initialFilters);
  const [pageSize, setPageSize] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? 5 : 20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  async function loadGuests(page: number, appliedFilters = filters, appliedPageSize = pageSize) {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(appliedPageSize) });
      appliedFilters.relationships.forEach((relationship) => params.append("relationship", relationship));
      if (appliedFilters.status) params.set("status", appliedFilters.status);
      if (appliedFilters.sent) params.set("sent", appliedFilters.sent);
      if (appliedFilters.search.trim()) params.set("search", appliedFilters.search.trim());
      const response = await fetch(`/api/dashboard/guests?${params}`);
      const result: GuestsResponse = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudieron cargar los invitados.");
      setData(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los invitados.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/dashboard/guests?page=1&pageSize=${pageSize}`, { signal: controller.signal })
      .then(async (response) => {
        const result: GuestsResponse = await response.json();
        if (!response.ok) throw new Error(result.error || "No se pudieron cargar los invitados.");
        setData(result);
      })
      .catch((loadError: unknown) => {
        if (loadError instanceof Error && loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [pageSize]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setFormError("");
    const formattedForm = { ...form, name: formatGuestName(form.name) };
    setForm(formattedForm);
    try {
      const response = await fetch(editingGuest ? `/api/dashboard/guests/${editingGuest.id}` : "/api/dashboard/guests", {
        method: editingGuest ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedForm),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo guardar el invitado.");
      setIsModalOpen(false);
      setEditingGuest(null);
      setForm(initialForm);
      await loadGuests(1);
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : "No se pudo guardar el invitado.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyUrl(url: string | null) {
    if (!url) return;
    await navigator.clipboard.writeText(url);
  }

  function openCreateModal() {
    setEditingGuest(null);
    setForm(initialForm);
    setFormError("");
    setIsModalOpen(true);
  }

  function openEditModal(guest: Guest) {
    setEditingGuest(guest);
    setFormError("");
    setForm({
      name: guest.name,
      passes_number: guest.passes_number,
      used_passes_confirmed: guest.used_passes_confirmed,
      confirmation: guest.confirmation,
      invitation_sent: guest.invitation_sent,
      family: guest.family,
      groom_family: guest.groom_family,
      bride_family: guest.bride_family,
      friend: guest.friend,
      internal_observation: guest.internal_observation || "",
    });
    setIsModalOpen(true);
  }

  async function deleteGuest() {
    if (!guestToDelete) return;
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch(`/api/dashboard/guests/${guestToDelete.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "No se pudo eliminar el invitado.");
      }
      setGuestToDelete(null);
      await loadGuests(data.guests.length === 1 && data.page > 1 ? data.page - 1 : data.page);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar el invitado.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateInvitationSent(guest: Guest, invitationSent: boolean) {
    setUpdatingInvitationId(guest.id);
    setError("");
    setData((current) => ({
      ...current,
      guests: current.guests.map((currentGuest) => currentGuest.id === guest.id ? { ...currentGuest, invitation_sent: invitationSent } : currentGuest),
    }));
    try {
      const response = await fetch(`/api/dashboard/guests/${guest.id}/invitation-sent`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitation_sent: invitationSent }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "No se pudo actualizar el envío.");
      }
    } catch (updateError) {
      setData((current) => ({
        ...current,
        guests: current.guests.map((currentGuest) => currentGuest.id === guest.id ? { ...currentGuest, invitation_sent: guest.invitation_sent } : currentGuest),
      }));
      setError(updateError instanceof Error ? updateError.message : "No se pudo actualizar el envío.");
    } finally {
      setUpdatingInvitationId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const hasGuestChanges = !editingGuest ||
    form.name !== editingGuest.name ||
    form.passes_number !== editingGuest.passes_number ||
    form.used_passes_confirmed !== editingGuest.used_passes_confirmed ||
    form.confirmation !== editingGuest.confirmation ||
    form.invitation_sent !== editingGuest.invitation_sent ||
    form.family !== editingGuest.family ||
    form.groom_family !== editingGuest.groom_family ||
    form.bride_family !== editingGuest.bride_family ||
    form.friend !== editingGuest.friend ||
    form.internal_observation !== (editingGuest.internal_observation || "");

  return (
    <main className="min-h-screen bg-[#f6f3ec] px-4 py-8 text-[#24332e] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-375">
        <DashboardNav active="guests" />
        <header className="flex flex-col gap-5 border-b border-[#24332e]/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-sm uppercase tracking-[0.2em] text-[#a04d34]">Néstor & Valentina</p>
            <h1 className="mt-1 font-serif text-4xl font-medium">Invitados</h1>
            <p className="mt-2 text-sm text-[#24332e]/65">{data.summary.totalPasses} invitados registrados en {data.total} invitaciones</p>
          </div>
          <button onClick={openCreateModal} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#24332e] px-4 text-sm font-medium text-[#f6f3ec] transition-colors hover:bg-[#a04d34]">
            <Plus className="size-4" /> Agregar invitado
          </button>
        </header>

        {error && !isModalOpen && <p className="mt-5 border border-[#a04d34]/35 bg-[#fce9df] px-4 py-3 text-sm text-[#822f20]">{error}</p>}

        <section className="mt-6 border border-[#24332e]/15 bg-white p-4 sm:p-5">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[minmax(14rem,1fr)_minmax(22rem,1fr)_auto_auto_auto] xl:items-end">
            <label className="sm:col-span-2 xl:col-span-1 text-sm font-medium">Buscar invitado<input type="search" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} onKeyDown={(event) => { if (event.key === "Enter") void loadGuests(1); }} placeholder="Nombre del invitado" className="mt-2 block min-h-10 w-full border border-[#24332e]/25 bg-white px-3 outline-none focus:border-[#a04d34]" /></label>
            <fieldset className="sm:col-span-2 xl:col-span-1">
              <legend className="text-xs font-semibold uppercase tracking-[0.08em] text-[#24332e]/65">Vínculo</legend>
              <div className="mt-2 flex flex-wrap gap-3">{([ ["groom_family", "Familia novio"], ["bride_family", "Familia novia"], ["friend", "Amigo"] ] as const).map(([value, label]) => <label key={value} className="flex min-h-9 items-center gap-2 text-sm"><input type="checkbox" checked={filters.relationships.includes(value)} onChange={(event) => setFilters({ ...filters, relationships: event.target.checked ? [...filters.relationships, value] : filters.relationships.filter((relationship) => relationship !== value) })} className="size-4 accent-[#a04d34]" />{label}</label>)}</div>
            </fieldset>
            <label className="text-sm font-medium">Estado<select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value as GuestFilters["status"] })} className="mt-2 block min-h-10 w-full border border-[#24332e]/25 bg-white px-2 outline-none focus:border-[#a04d34] xl:w-36"><option value="">Todos</option><option value="pending">Pendiente</option><option value="confirmed">Confirmado</option><option value="declined">Declinó</option></select></label>
            <label className="text-sm font-medium">Enviada<select value={filters.sent} onChange={(event) => setFilters({ ...filters, sent: event.target.value as GuestFilters["sent"] })} className="mt-2 block min-h-10 w-full border border-[#24332e]/25 bg-white px-2 outline-none focus:border-[#a04d34] xl:w-28"><option value="">Todas</option><option value="true">Sí</option><option value="false">No</option></select></label>
            <div className="flex gap-2 sm:col-span-2 xl:col-span-1"><button onClick={() => { setFilters(initialFilters); void loadGuests(1, initialFilters); }} className="min-h-10 px-3 text-sm">Limpiar</button><button onClick={() => void loadGuests(1)} className="min-h-10 flex-1 bg-[#24332e] px-4 text-sm font-medium text-white xl:flex-none">Aplicar filtros</button></div>
          </div>
        </section>

        <section className="mt-7 overflow-hidden border border-[#24332e]/15 bg-white">
          <div className="divide-y divide-[#24332e]/10 md:hidden">
            {isLoading ? <p className="px-4 py-12 text-center text-sm text-[#24332e]/60">Cargando invitados...</p> : data.guests.length === 0 ? <p className="px-4 py-12 text-center text-sm text-[#24332e]/60">Aún no hay invitados registrados.</p> : data.guests.map((guest) => <article key={guest.id} className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-xl font-medium">{guest.name}</h2><p className="mt-1 text-xs text-[#24332e]/60">{guest.used_passes_confirmed} de {guest.passes_number} pases confirmados</p></div><span className={`shrink-0 px-2 py-1 text-xs ${guest.confirmation === "confirmed" ? "bg-[#dfece0] text-[#27613b]" : guest.confirmation === "declined" ? "bg-[#f6dfd8] text-[#8d3024]" : "bg-[#f3e8ca] text-[#765913]"}`}>{statusLabels[guest.confirmation]}</span></div><dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><div><dt className="text-xs uppercase tracking-[0.08em] text-[#24332e]/55">Vínculo</dt><dd className="mt-1">{guest.groom_family ? "Familia novio" : guest.bride_family ? "Familia novia" : guest.friend ? "Amigo/a" : "Sin definir"}</dd></div><div><dt className="text-xs uppercase tracking-[0.08em] text-[#24332e]/55">Es una familia</dt><dd className="mt-1">{guest.family ? "Sí" : "No"}</dd></div>{guest.guest_observation && <div className="col-span-2"><dt className="text-xs uppercase tracking-[0.08em] text-[#24332e]/55">Observación</dt><dd className="mt-1 text-[#24332e]/75">{guest.guest_observation}</dd></div>}</dl><div className="mt-4 flex items-center justify-between gap-3 border-t border-[#24332e]/10 pt-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={guest.invitation_sent} disabled={updatingInvitationId === guest.id} onChange={(event) => void updateInvitationSent(guest, event.target.checked)} className="size-4 accent-[#27613b]" />Enviada</label><div className="flex gap-2"><button onClick={() => void copyUrl(guest.invitation_url)} title="Copiar URL de invitación" className="inline-flex size-9 items-center justify-center border border-[#24332e]/20"><Copy className="size-4" /></button><button onClick={() => openEditModal(guest)} title="Editar invitado" className="inline-flex size-9 items-center justify-center border border-[#24332e]/20"><Pencil className="size-4" /></button><button onClick={() => setGuestToDelete(guest)} title="Eliminar invitado" className="inline-flex size-9 items-center justify-center border border-[#a04d34]/35 text-[#a04d34]"><Trash2 className="size-4" /></button></div></div></article>)}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-280 border-collapse text-left text-sm">
              <thead className="bg-[#e8eee8] text-xs uppercase tracking-[0.08em] text-[#24332e]/70">
                <tr>{["Invitado", "¿Es una familia?", "Estado", "Pases", "URL", "Enviada", "Acciones"].map((label) => <th key={label} className="whitespace-nowrap px-4 py-4 font-semibold">{label}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-[#24332e]/10">
                {isLoading ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-[#24332e]/60">Cargando invitados...</td></tr>
                ) : data.guests.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-[#24332e]/60">Aún no hay invitados registrados.</td></tr>
                ) : data.guests.map((guest) => (
                  <tr key={guest.id} className="align-top hover:bg-[#f6f3ec]/70">
                    <td className="min-w-64 px-4 py-4 font-medium">{guest.name}</td>
                    <td className="px-4 py-4">{guest.family ? <Check className="size-4 text-[#27613b]" /> : <span className="text-[#24332e]/45">-</span>}</td>
                    <td className="px-4 py-4"><span className={`inline-block px-2 py-1 text-xs ${guest.confirmation === "confirmed" ? "bg-[#dfece0] text-[#27613b]" : guest.confirmation === "declined" ? "bg-[#f6dfd8] text-[#8d3024]" : "bg-[#f3e8ca] text-[#765913]"}`}>{statusLabels[guest.confirmation]}</span></td>
                    <td className="px-4 py-4 whitespace-nowrap">{guest.used_passes_confirmed} / {guest.passes_number}</td>
                    <td className="max-w-96 px-4 py-4"><div className="flex items-center gap-2"><a href={guest.invitation_url || undefined} target="_blank" rel="noreferrer" className="truncate text-[#a04d34] underline underline-offset-2">{guest.invitation_url || "-"}</a><button onClick={() => void copyUrl(guest.invitation_url)} disabled={!guest.invitation_url} title="Copiar URL de invitación" className="inline-flex size-8 shrink-0 items-center justify-center border border-[#24332e]/20 hover:bg-[#e8eee8] disabled:opacity-35"><Copy className="size-3.5" /></button></div></td>
                    <td className="px-4 py-4"><input type="checkbox" checked={guest.invitation_sent} disabled={updatingInvitationId === guest.id} onChange={(event) => void updateInvitationSent(guest, event.target.checked)} aria-label={`Invitación enviada a ${guest.name}`} className="size-4 cursor-pointer accent-[#27613b] disabled:cursor-wait" /></td>
                    <td className="px-4 py-4"><div className="flex gap-2">{(guest.guest_observation || guest.internal_observation) && <button onClick={() => setGuestDetails(guest)} className="min-h-8 border border-[#24332e]/20 px-3 text-xs hover:bg-[#e8eee8]">Ver más</button>}<button onClick={() => openEditModal(guest)} title="Editar invitado" className="inline-flex size-8 items-center justify-center border border-[#24332e]/20 hover:bg-[#e8eee8]"><Pencil className="size-3.5" /></button><button onClick={() => setGuestToDelete(guest)} title="Eliminar invitado" className="inline-flex size-8 items-center justify-center border border-[#a04d34]/35 text-[#a04d34] hover:bg-[#fce9df]"><Trash2 className="size-3.5" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#24332e]/15 px-4 py-3 text-sm">
            <label className="flex items-center gap-2">Mostrar<select value={pageSize} onChange={(event) => { const nextPageSize = Number(event.target.value); setPageSize(nextPageSize); void loadGuests(1, filters, nextPageSize); }} className="min-h-9 border border-[#24332e]/25 bg-white px-2 outline-none"><option value="5">5</option><option value="10">10</option><option value="20">20</option><option value="50">50</option></select><span>por página</span></label>
            <span>Página {data.page} de {totalPages}</span>
            <div className="flex gap-2">
              <button aria-label="Página anterior" disabled={isLoading || data.page === 1} onClick={() => void loadGuests(data.page - 1)} className="inline-flex size-9 items-center justify-center border border-[#24332e]/20 disabled:opacity-35"><ChevronLeft className="size-4" /></button>
              <button aria-label="Página siguiente" disabled={isLoading || data.page === totalPages} onClick={() => void loadGuests(data.page + 1)} className="inline-flex size-9 items-center justify-center border border-[#24332e]/20 disabled:opacity-35"><ChevronRight className="size-4" /></button>
            </div>
          </footer>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="border border-[#24332e]/15 bg-white p-5">
            <h2 className="font-serif text-2xl">Pases por vínculo</h2>
            <div className="mt-4 grid grid-cols-3 divide-x divide-[#24332e]/15">
              {[ ["Familia del novio", data.summary.groomFamilyPasses], ["Familia de la novia", data.summary.brideFamilyPasses], ["Amigos", data.summary.friendPasses] ].map(([label, value]) => <div key={label as string} className="px-3 first:pl-0 last:pr-0"><p className="text-2xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs leading-tight text-[#24332e]/60">{label}</p></div>)}
            </div>
          </div>
          <div className="border border-[#24332e]/15 bg-white p-5">
            <h2 className="font-serif text-2xl">Estado de confirmación</h2>
            <div className="mt-4 grid grid-cols-2 divide-x divide-y divide-[#24332e]/15 sm:grid-cols-4 sm:divide-y-0">
              {[ ["Invitaciones", data.total], ["Confirmados", data.summary.confirmedPasses], ["Pendientes", data.summary.pendingPasses], ["Declinados", data.summary.declinedPasses] ].map(([label, value]) => <div key={label as string} className="px-3 py-2 first:pl-0 sm:py-0 last:pr-0"><p className="text-2xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs leading-tight text-[#24332e]/60">{label}</p></div>)}
            </div>
            <div className="mt-5 border-t border-[#24332e]/15 pt-4"><div className="flex items-baseline justify-between gap-3"><p className="text-sm font-medium">Cupo confirmado</p><p className="text-sm tabular-nums">{data.summary.confirmedPasses} / {MAX_CONFIRMED_GUESTS}</p></div><div className="mt-2 h-2 overflow-hidden bg-[#e8eee8]"><div className={`h-full ${data.summary.confirmedPasses > MAX_CONFIRMED_GUESTS ? "bg-[#a04d34]" : "bg-[#27613b]"}`} style={{ width: `${Math.min((data.summary.confirmedPasses / MAX_CONFIRMED_GUESTS) * 100, 100)}%` }} /></div><p className={`mt-2 text-xs ${data.summary.confirmedPasses > MAX_CONFIRMED_GUESTS ? "text-[#a04d34]" : "text-[#24332e]/60"}`}>{data.summary.confirmedPasses > MAX_CONFIRMED_GUESTS ? `Se excedió el cupo por ${data.summary.confirmedPasses - MAX_CONFIRMED_GUESTS} invitados.` : `Quedan ${MAX_CONFIRMED_GUESTS - data.summary.confirmedPasses} cupos disponibles.`}</p></div>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="guest-modal-title" className="fixed inset-0 z-50 grid place-items-center bg-[#18231f]/55 p-4">
          <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[#fdfcf8] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#24332e]/15 pb-5">
              <div><p className="text-xs uppercase tracking-[0.14em] text-[#a04d34]">{editingGuest ? "Actualizar registro" : "Nuevo registro"}</p><h2 id="guest-modal-title" className="mt-1 font-serif text-3xl">{editingGuest ? "Editar invitado" : "Agregar invitado"}</h2></div>
              <button type="button" onClick={() => { setIsModalOpen(false); setEditingGuest(null); }} aria-label="Cerrar modal" className="inline-flex size-9 items-center justify-center border border-[#24332e]/20"><X className="size-4" /></button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-medium">Nombre completo<input required value={form.name} onChange={(event) => { setForm({ ...form, name: formatGuestName(event.target.value) }); setFormError(""); }} className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none focus:border-[#a04d34]" />{formError && <span role="alert" className="mt-2 block text-sm font-normal text-[#822f20]">{formError}</span>}</label>
              <label className="text-sm font-medium">Cantidad de pases<input required min="1" step="1" type="number" value={form.passes_number} onChange={(event) => setForm({ ...form, passes_number: Number(event.target.value) })} className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none focus:border-[#a04d34]" /></label>
              {editingGuest ? <><label className="text-sm font-medium">Estado<select value={form.confirmation} onChange={(event) => setForm({ ...form, confirmation: event.target.value as Guest["confirmation"] })} className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none focus:border-[#a04d34]"><option value="pending">Pendiente</option><option value="confirmed">Confirmado</option><option value="declined">Declinó</option></select></label><label className="text-sm font-medium">Pases confirmados<input required min="0" max={form.passes_number} step="1" type="number" value={form.used_passes_confirmed} onChange={(event) => setForm({ ...form, used_passes_confirmed: Number(event.target.value) })} className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none focus:border-[#a04d34]" /></label></> : <p className="self-end pb-3 text-sm text-[#24332e]/60">Estado inicial: <strong>Pendiente</strong></p>}
              <label className="flex min-h-11 items-center gap-3 border border-[#24332e]/15 px-3 text-sm"><input type="checkbox" checked={form.family} onChange={(event) => setForm({ ...form, family: event.target.checked })} className="size-4 accent-[#a04d34]" />¿Es una familia?</label>
              <fieldset className="sm:col-span-2"><legend className="text-sm font-medium">Vínculo</legend><div className="mt-2 grid gap-2 sm:grid-cols-4"><label className="flex min-h-11 items-center gap-2 border border-[#24332e]/15 px-3 text-sm"><input type="radio" name="relationship" checked={!form.groom_family && !form.bride_family && !form.friend} onChange={() => setForm({ ...form, groom_family: false, bride_family: false, friend: false })} className="size-4 accent-[#a04d34]" />Sin definir</label><label className="flex min-h-11 items-center gap-2 border border-[#24332e]/15 px-3 text-sm"><input type="radio" name="relationship" checked={form.groom_family} onChange={() => setForm({ ...form, groom_family: true, bride_family: false, friend: false })} className="size-4 accent-[#a04d34]" />Familia del novio</label><label className="flex min-h-11 items-center gap-2 border border-[#24332e]/15 px-3 text-sm"><input type="radio" name="relationship" checked={form.bride_family} onChange={() => setForm({ ...form, groom_family: false, bride_family: true, friend: false })} className="size-4 accent-[#a04d34]" />Familia de la novia</label><label className="flex min-h-11 items-center gap-2 border border-[#24332e]/15 px-3 text-sm"><input type="radio" name="relationship" checked={form.friend} onChange={() => setForm({ ...form, groom_family: false, bride_family: false, friend: true })} className="size-4 accent-[#a04d34]" />Amigo/a</label></div></fieldset>
              <label className="sm:col-span-2 text-sm font-medium">Observación interna<textarea value={form.internal_observation} onChange={(event) => setForm({ ...form, internal_observation: event.target.value })} rows={3} className="mt-2 w-full border border-[#24332e]/25 bg-white p-3 outline-none focus:border-[#a04d34]" /></label>
              {editingGuest && <label className="sm:col-span-2 flex min-h-11 items-center gap-3 border border-[#24332e]/15 px-3 text-sm"><input type="checkbox" checked={form.invitation_sent} onChange={(event) => setForm({ ...form, invitation_sent: event.target.checked })} className="size-4 accent-[#a04d34]" />Invitación enviada</label>}
            </div>
            <div className="mt-7 flex justify-end gap-3 border-t border-[#24332e]/15 pt-5"><button type="button" onClick={() => { setIsModalOpen(false); setEditingGuest(null); }} className="min-h-11 px-4 text-sm">Cancelar</button><button disabled={isSubmitting || !hasGuestChanges} className="min-h-11 bg-[#24332e] px-5 text-sm font-medium text-white disabled:opacity-50">{isSubmitting ? "Guardando..." : editingGuest ? "Guardar cambios" : "Crear invitado"}</button></div>
          </form>
        </div>
      )}
      {guestToDelete && <div role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" className="fixed inset-0 z-50 grid place-items-center bg-[#18231f]/55 p-4"><div className="w-full max-w-md bg-[#fdfcf8] p-6 shadow-2xl"><p className="text-xs uppercase tracking-[0.14em] text-[#a04d34]">Acción irreversible</p><h2 id="delete-modal-title" className="mt-1 font-serif text-3xl">¿Eliminar invitado?</h2><p className="mt-4 text-sm text-[#24332e]/70">Se eliminará permanentemente a <strong>{guestToDelete.name}</strong> y su URL de invitación dejará de funcionar.</p><div className="mt-7 flex justify-end gap-3"><button onClick={() => setGuestToDelete(null)} disabled={isSubmitting} className="min-h-11 px-4 text-sm">Cancelar</button><button onClick={() => void deleteGuest()} disabled={isSubmitting} className="min-h-11 bg-[#a04d34] px-5 text-sm font-medium text-white disabled:opacity-50">{isSubmitting ? "Eliminando..." : "Sí, eliminar"}</button></div></div></div>}
    </main>
  );
}