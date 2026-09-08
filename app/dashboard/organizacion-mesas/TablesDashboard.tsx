"use client";

import { Pencil, Plus, Trash2, Users, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { DashboardNav } from "../DashboardNav";

type Invitation = {
  id: number;
  name: string;
  passes_number: number;
  used_passes_confirmed: number;
  confirmation: "pending" | "confirmed" | "declined";
  groom_family: boolean;
  bride_family: boolean;
  friend: boolean;
  unlikely_to_attend: boolean;
  registeredMembers: number;
};

type Member = {
  id: number;
  guest_id: number;
  name: string;
  table_id: number | null;
  guest: Invitation | null;
};

type Table = { id: number; name: string; created_at: string; members: Member[] };

const CAPACITY = 10;

function isPrimaryMember(member: Member) {
  return Boolean(member.guest && member.name.trim().toLocaleLowerCase() === member.guest.name.trim().toLocaleLowerCase());
}

function memberSeats(member: Member, allMembers: Member[]) {
  if (!member.guest || !isPrimaryMember(member)) return 1;
  const individualMembers = allMembers.filter((candidate) => candidate.guest_id === member.guest_id && !isPrimaryMember(candidate)).length;
  const availablePasses = member.guest.confirmation === "confirmed"
    ? member.guest.used_passes_confirmed
    : member.guest.passes_number;
  return Math.max(availablePasses - individualMembers, 0);
}

function tableStats(table: Table, allMembers: Member[]) {
  return table.members.reduce((stats, member) => ({
    seats: stats.seats + memberSeats(member, allMembers),
    groom: stats.groom + (member.guest?.groom_family ? memberSeats(member, allMembers) : 0),
    bride: stats.bride + (member.guest?.bride_family ? memberSeats(member, allMembers) : 0),
    friends: stats.friends + (member.guest?.friend ? memberSeats(member, allMembers) : 0),
  }), { seats: 0, groom: 0, bride: 0, friends: 0 });
}

export function TablesDashboard() {
  const [tables, setTables] = useState<Table[]>([]);
  const [unassigned, setUnassigned] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [capacityError, setCapacityError] = useState(false);
  const [tableName, setTableName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [selectedInvitationId, setSelectedInvitationId] = useState("");
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [search, setSearch] = useState("");

  async function loadTables() {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/tables");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudieron cargar las mesas.");
      setTables(result.tables);
      setUnassigned(result.unassigned);
      setInvitations(result.invitations);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las mesas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { queueMicrotask(() => void loadTables()); }, []);

  async function saveTable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch(editingTable ? `/api/dashboard/tables/${editingTable.id}` : "/api/dashboard/tables", {
        method: editingTable ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tableName }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo guardar la mesa.");
      await loadTables();
      setEditingTable(null);
      setTableName("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar la mesa.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/tables/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_id: Number(selectedInvitationId), name: memberName }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo registrar la persona.");
      await loadTables();
      setMemberName("");
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "No se pudo registrar la persona.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteTable(table: Table) {
    if (table.members.length && !window.confirm("Las personas quedarÃ¡n sin mesa. Â¿Eliminar esta mesa?")) return;
    setError("");
    const response = await fetch(`/api/dashboard/tables/${table.id}`, { method: "DELETE" });
    if (!response.ok) { const result = await response.json(); setError(result.error || "No se pudo eliminar la mesa."); return; }
    await loadTables();
  }

  async function moveMember(member: Member, tableId: number | null) {
    setError("");
    if (tableId !== null && tableId !== member.table_id) {
      const targetTable = tables.find((table) => table.id === tableId);
      const allMembers = [...tables.flatMap((table) => table.members), ...unassigned];
      if (targetTable && tableStats(targetTable, allMembers).seats + memberSeats(member, allMembers) > CAPACITY) {
        setCapacityError(true);
        return;
      }
    }
    const response = await fetch(`/api/dashboard/tables/members/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_id: tableId }),
    });
    const result = await response.json();
    if (!response.ok) {
      if (result.error === "No hay suficientes puestos en esta mesa") setCapacityError(true);
      else setError(result.error || "No se pudo mover a la persona.");
      return;
    }
    await loadTables();
  }

  async function removeMember(member: Member) {
    if (!window.confirm(`Â¿Eliminar a ${member.name} de la organizaciÃ³n?`)) return;
    const response = await fetch(`/api/dashboard/tables/members/${member.id}`, { method: "DELETE" });
    if (!response.ok) { const result = await response.json(); setError(result.error || "No se pudo eliminar la persona."); return; }
    await loadTables();
  }

  const visibleUnassigned = unassigned.filter((member) => member.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const allMembers = [...tables.flatMap((table) => table.members), ...unassigned];
  const registeredSeats = tables.reduce((total, table) => total + tableStats(table, allMembers).seats, 0) + unassigned.reduce((total, member) => total + memberSeats(member, allMembers), 0);

  return <main className="min-h-screen bg-[#f6f3ec] px-4 py-8 text-[#24332e] sm:px-8 lg:px-12"><div className="mx-auto max-w-375"><DashboardNav active="tables" /><header className="flex flex-col gap-5 border-b border-[#24332e]/15 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-serif text-sm uppercase tracking-[0.2em] text-[#a04d34]">Néstor & Valentina</p><h1 className="mt-1 font-serif text-4xl font-medium">Organización de mesas</h1><p className="mt-2 text-sm text-[#24332e]/65">Registra a cada persona de una invitación y así­gnala a una mesa distinta.</p></div><form onSubmit={saveTable} className="flex gap-2"><input required value={tableName} onChange={(event) => setTableName(event.target.value)} placeholder={editingTable ? "Nombre de la mesa" : "Nueva mesa"} className="min-h-11 w-40 border border-[#24332e]/25 bg-white px-3 text-sm outline-none focus:border-[#a04d34] sm:w-52" /><button disabled={isSubmitting} className="inline-flex min-h-11 items-center gap-2 bg-[#24332e] px-4 text-sm font-medium text-white disabled:opacity-50">{editingTable ? <Pencil className="size-4" /> : <Plus className="size-4" />}{editingTable ? "Guardar" : "Crear mesa"}</button>{editingTable && <button type="button" onClick={() => { setEditingTable(null); setTableName(""); }} aria-label="Cancelar ediciÃ³n" className="inline-flex size-11 items-center justify-center border border-[#24332e]/20"><X className="size-4" /></button>}</form></header>
    {error && <p className="mt-5 border border-[#a04d34]/35 bg-[#fce9df] px-4 py-3 text-sm text-[#822f20]" role="alert">{error}</p>}
    {capacityError && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24332e]/45 px-4" role="dialog" aria-modal="true" aria-labelledby="capacity-error-title"><div className="w-full max-w-md border border-[#24332e]/15 bg-[#f6f3ec] p-6 shadow-xl"><h2 id="capacity-error-title" className="font-serif text-2xl">Mesa llena</h2><p className="mt-2 text-sm text-[#24332e]/75">No hay suficientes puestos en esta mesa.</p><button type="button" onClick={() => setCapacityError(false)} className="mt-5 min-h-11 bg-[#24332e] px-4 text-sm font-medium text-white">Entendido</button></div></div>}
    <section className="mt-6 border border-[#24332e]/15 bg-white p-5"><div className="flex items-start gap-3"><Users className="mt-1 size-5 text-[#a04d34]" /><div><h2 className="font-serif text-2xl">Registrar persona</h2><p className="mt-1 text-sm text-[#24332e]/65">Una invitación con varios pases puede distribuirse entre distintas mesas.</p></div></div><form onSubmit={addMember} className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"><select required value={selectedInvitationId} onChange={(event) => setSelectedInvitationId(event.target.value)} className="min-h-11 border border-[#24332e]/25 bg-white px-3 text-sm outline-none focus:border-[#a04d34]"><option value="">Seleccionar invitación</option>{invitations.filter((invitation) => invitation.registeredMembers < invitation.passes_number).map((invitation) => <option key={invitation.id} value={invitation.id}>{invitation.name} ({invitation.passes_number - invitation.registeredMembers} por registrar)</option>)}</select><input required value={memberName} onChange={(event) => setMemberName(event.target.value)} placeholder="Nombre de la persona" className="min-h-11 border border-[#24332e]/25 bg-white px-3 text-sm outline-none focus:border-[#a04d34]" /><button disabled={isSubmitting} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#a04d34] px-4 text-sm font-medium text-white disabled:opacity-50"><Plus className="size-4" />Agregar persona</button></form></section>
    <section className="mt-6 grid gap-3 sm:grid-cols-3"><div className="border border-[#24332e]/15 bg-white p-4"><p className="text-2xl font-semibold tabular-nums">{tables.length}</p><p className="mt-1 text-xs text-[#24332e]/60">Mesas creadas</p></div><div className="border border-[#24332e]/15 bg-white p-4"><p className="text-2xl font-semibold tabular-nums">{registeredSeats}</p><p className="mt-1 text-xs text-[#24332e]/60">Personas registradas</p></div><div className="border border-[#24332e]/15 bg-white p-4"><p className="text-2xl font-semibold tabular-nums">{unassigned.length}</p><p className="mt-1 text-xs text-[#24332e]/60">Personas sin mesa</p></div></section>
    <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]"><div><h2 className="font-serif text-2xl">Mesas</h2>{isLoading ? <p className="mt-4 border border-[#24332e]/15 bg-white p-8 text-center text-sm text-[#24332e]/60">Cargando mesas...</p> : tables.length === 0 ? <p className="mt-4 border border-[#24332e]/15 bg-white p-8 text-center text-sm text-[#24332e]/60">Crea la primera mesa para comenzar a organizar.</p> : <div className="mt-4 grid gap-4 md:grid-cols-2">{tables.map((table) => { const stats = tableStats(table, allMembers); const remaining = CAPACITY - stats.seats; return <article key={table.id} className="border border-[#24332e]/15 bg-white p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-serif text-2xl">{table.name}</h3><p className={`mt-1 text-sm font-medium ${remaining === 0 ? "text-[#a04d34]" : "text-[#27613b]"}`}>{remaining ? `${remaining} puestos disponibles` : "Mesa llena"}</p></div><div className="flex gap-1"><button onClick={() => { setEditingTable(table); setTableName(table.name); }} title="Editar mesa" className="inline-flex size-8 items-center justify-center border border-[#24332e]/20 hover:bg-[#e8eee8]"><Pencil className="size-3.5" /></button><button onClick={() => void deleteTable(table)} title="Eliminar mesa" className="inline-flex size-8 items-center justify-center border border-[#a04d34]/35 text-[#a04d34] hover:bg-[#fce9df]"><Trash2 className="size-3.5" /></button></div></div><div className="mt-4 h-2 bg-[#e8eee8]"><div className={`h-full ${remaining === 0 ? "bg-[#a04d34]" : "bg-[#27613b]"}`} style={{ width: `${Math.min((stats.seats / CAPACITY) * 100, 100)}%` }} /></div><div className="mt-4 grid grid-cols-3 divide-x divide-[#24332e]/15 text-center text-xs"><div><strong className="block text-lg tabular-nums">{stats.groom}</strong>Novio</div><div><strong className="block text-lg tabular-nums">{stats.bride}</strong>Novia</div><div><strong className="block text-lg tabular-nums">{stats.friends}</strong>Amigos</div></div><div className="mt-4 space-y-2 border-t border-[#24332e]/10 pt-3">{table.members.length ? table.members.map((member) => <MemberRow key={member.id} member={member} tables={tables} allMembers={allMembers} onMove={moveMember} onDelete={removeMember} />) : <p className="text-sm text-[#24332e]/55">Aún no hay personas en esta mesa.</p>}</div></article>; })}</div>}</div>
      <aside className="h-fit border border-[#24332e]/15 bg-white p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Sin mesa</h2><p className="mt-1 text-xs text-[#24332e]/60">{unassigned.length} personas por asignar</p></div><Users className="size-5 text-[#a04d34]" /></div><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar persona" className="mt-4 min-h-10 w-full border border-[#24332e]/25 px-3 text-sm outline-none focus:border-[#a04d34]" /><div className="mt-4 space-y-2">{visibleUnassigned.length ? visibleUnassigned.map((member) => <MemberRow key={member.id} member={member} tables={tables} allMembers={allMembers} onMove={moveMember} onDelete={removeMember} />) : <p className="py-4 text-sm text-[#24332e]/55">No hay personas pendientes.</p>}</div></aside></section>
  </div></main>;
}

function MemberRow({ member, tables, allMembers, onMove, onDelete }: { member: Member; tables: Table[]; allMembers: Member[]; onMove: (member: Member, tableId: number | null) => Promise<void>; onDelete: (member: Member) => Promise<void> }) {
  const isInvitationItself = member.guest && member.name.trim().toLocaleLowerCase() === member.guest.name.trim().toLocaleLowerCase();
  const availablePasses = member.guest?.confirmation === "confirmed" ? member.guest.used_passes_confirmed : member.guest?.passes_number || 0;
  const passLabel = member.guest?.confirmation === "confirmed" ? (availablePasses === 1 ? "pase confirmado" : "pases confirmados") : (availablePasses === 1 ? "pase" : "pases");
  return <div className="border border-[#24332e]/10 bg-[#fdfcf8] p-3"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-medium">{member.name}</p>{member.guest && <p className="mt-1 text-xs text-[#24332e]/60">{isInvitationItself ? `${memberSeats(member, allMembers)} de ${availablePasses} ${passLabel}` : `Pertenece a: ${member.guest.name}`}</p>}</div><button onClick={() => void onDelete(member)} title={`Eliminar a ${member.name}`} className="inline-flex size-7 shrink-0 items-center justify-center text-[#a04d34] hover:bg-[#fce9df]"><Trash2 className="size-3.5" /></button></div><select value={member.table_id ?? ""} onChange={(event) => void onMove(member, event.target.value ? Number(event.target.value) : null)} aria-label={`Mesa de ${member.name}`} className="mt-2 min-h-8 w-full border border-[#24332e]/25 bg-white px-1 text-xs outline-none focus:border-[#a04d34]"><option value="">Sin mesa</option>{tables.map((table) => <option key={table.id} value={table.id}>{table.name}</option>)}</select></div>;
}
