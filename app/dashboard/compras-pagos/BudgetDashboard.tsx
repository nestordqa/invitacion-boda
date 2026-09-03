"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { DashboardNav } from "../DashboardNav";

type Category = { id: number; name: string; description: string | null };
type BudgetItem = {
  id: number;
  item: string;
  description: string | null;
  bought: boolean;
  quantity: number | string;
  amount_per_unit: number | string;
  total_amount: number | string;
  amount_paid: number | string;
  remaining_balance: number | string;
  paid_in_bolivars: boolean;
  supplier: string | null;
  category_id: number;
  categories: { name: string } | { name: string }[] | null;
};
type BudgetForm = {
  item: string;
  description: string;
  bought: boolean;
  quantity: number;
  amount_per_unit: number | "";
  amount_paid: number | "";
  paid_in_bolivars: boolean;
  supplier: string;
  categoryName: string;
};

const initialForm: BudgetForm = {
  item: "",
  description: "",
  bought: false,
  quantity: 1,
  amount_per_unit: "",
  amount_paid: "",
  paid_in_bolivars: false,
  supplier: "",
  categoryName: "",
};
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const categoryName = (item: BudgetItem) =>
  Array.isArray(item.categories)
    ? item.categories[0]?.name
    : item.categories?.name;

export function BudgetDashboard() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BudgetItem | null>(null);
  const [descriptionItem, setDescriptionItem] = useState<BudgetItem | null>(null);
  const [updatingBoughtId, setUpdatingBoughtId] = useState<number | null>(null);
  const [form, setForm] = useState<BudgetForm>(initialForm);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    supplier: "",
    bought: "",
    paid: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
      ? 5
      : 20,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setIsLoading(true);
    setError("");
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/dashboard/budget-items"),
        fetch("/api/dashboard/categories"),
      ]);
      const itemsResult = await itemsResponse.json();
      const categoriesResult = await categoriesResponse.json();
      if (!itemsResponse.ok)
        throw new Error(
          itemsResult.error || "No se pudieron cargar las compras.",
        );
      if (!categoriesResponse.ok)
        throw new Error(
          categoriesResult.error || "No se pudieron cargar las categorías.",
        );
      setItems(itemsResult.items);
      setCategories(categoriesResult.categories);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los datos.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function openCreateModal() {
    setEditingItem(null);
    setForm(initialForm);
    setIsItemModalOpen(true);
  }
  function openEditModal(item: BudgetItem) {
    setEditingItem(item);
    setForm({
      item: item.item,
      description: item.description || "",
      bought: item.bought,
      quantity: Number(item.quantity),
      amount_per_unit: Number(item.amount_per_unit),
      amount_paid: Number(item.amount_paid),
      paid_in_bolivars: item.paid_in_bolivars,
      supplier: item.supplier || "",
      categoryName: categoryName(item) || "",
    });
    setIsItemModalOpen(true);
  }

  async function updateBought(item: BudgetItem, bought: boolean) {
    setUpdatingBoughtId(item.id);
    setError("");
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id ? { ...currentItem, bought } : currentItem,
      ),
    );
    try {
      const response = await fetch(`/api/dashboard/budget-items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: item.item,
          description: item.description || "",
          bought,
          quantity: Number(item.quantity),
          amount_per_unit: Number(item.amount_per_unit),
          amount_paid: Number(item.amount_paid),
          paid_in_bolivars: item.paid_in_bolivars,
          supplier: item.supplier || "",
          category_id: item.category_id,
        }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "No se pudo actualizar la compra.");
      }
    } catch (updateError) {
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, bought: item.bought }
            : currentItem,
        ),
      );
      setError(
        updateError instanceof Error
          ? updateError.message
          : "No se pudo actualizar la compra.",
      );
    } finally {
      setUpdatingBoughtId(null);
    }
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const category = categories.find(
      (current) =>
        current.name.toLocaleLowerCase() ===
        form.categoryName.trim().toLocaleLowerCase(),
    );
    if (!category) {
      setError("Selecciona una categoría existente o crea una nueva.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        editingItem
          ? `/api/dashboard/budget-items/${editingItem.id}`
          : "/api/dashboard/budget-items",
        {
          method: editingItem ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            amount_paid: form.amount_paid === "" ? 0 : form.amount_paid,
            category_id: category.id,
          }),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "No se pudo guardar la compra.");
      const savedItem = {
        ...(result.item as BudgetItem),
        categories: { name: category.name },
      };
      setItems((current) => editingItem
        ? current.map((item) => item.id === savedItem.id ? savedItem : item)
        : [savedItem, ...current],
      );
      setIsItemModalOpen(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar la compra.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "No se pudo crear la categoría.");
      setCategories((current) =>
        [...current, result.category].sort((left, right) =>
          left.name.localeCompare(right.name),
        ),
      );
      setForm((current) => ({
        ...current,
        categoryName: result.category.name,
      }));
      setCategoryForm({ name: "", description: "" });
      setIsCategoryModalOpen(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo crear la categoría.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteItem() {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        `/api/dashboard/budget-items/${itemToDelete.id}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "No se pudo eliminar la compra.");
      }
      setItemToDelete(null);
      setItems((current) => current.filter((item) => item.id !== itemToDelete.id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "No se pudo eliminar la compra.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const total = form.quantity * Number(form.amount_per_unit || 0);
  const suppliers = [
    ...new Set(
      items
        .map((item) => item.supplier)
        .filter((supplier): supplier is string => Boolean(supplier)),
    ),
  ].sort();
  const matchingItems = items.filter((item) => {
    const isFullyPaid = Number(item.remaining_balance) === 0;
    return (
      (!filters.search ||
        item.item
          .toLocaleLowerCase()
          .includes(filters.search.toLocaleLowerCase())) &&
      (!filters.category || categoryName(item) === filters.category) &&
      (!filters.supplier || item.supplier === filters.supplier) &&
      (!filters.bought || item.bought === (filters.bought === "true")) &&
      (!filters.paid || isFullyPaid === (filters.paid === "true"))
    );
  });
  const totalBudget = matchingItems.reduce(
    (sum, item) => sum + Number(item.total_amount),
    0,
  );
  const totalPaid = matchingItems.reduce(
    (sum, item) => sum + Number(item.amount_paid),
    0,
  );
  const remaining = matchingItems.reduce(
    (sum, item) => sum + Number(item.remaining_balance),
    0,
  );
  const purchasedCount = matchingItems.filter((item) => item.bought).length;
  const fullyPaidCount = matchingItems.filter(
    (item) => Number(item.remaining_balance) === 0,
  ).length;
  const totalPages = Math.max(1, Math.ceil(matchingItems.length / pageSize));
  const filteredItems = matchingItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <main className="min-h-screen bg-[#f6f3ec] px-4 py-8 text-[#24332e] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-375">
        <DashboardNav active="budget" />
        <header className="flex flex-col gap-5 border-b border-[#24332e]/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-sm uppercase tracking-[0.2em] text-[#a04d34]">
              Néstor & Valentina
            </p>
            <h1 className="mt-1 font-serif text-4xl font-medium">
              Compras y pagos
            </h1>
            <p className="mt-2 text-sm text-[#24332e]/65">
              {matchingItems.length} de {items.length} gastos visibles
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="min-h-11 border border-[#24332e]/25 px-4 text-sm font-medium"
            >
              Nueva categoría
            </button>
            <button
              onClick={openCreateModal}
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#24332e] px-4 text-sm font-medium text-[#f6f3ec]"
            >
              <Plus className="size-4" />
              Agregar compra
            </button>
          </div>
        </header>
        {error && (
          <p className="mt-5 border border-[#a04d34]/35 bg-[#fce9df] px-4 py-3 text-sm text-[#822f20]">
            {error}
          </p>
        )}
        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="border border-[#24332e]/15 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[#24332e]/60">
              Presupuesto
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums">
              {currency.format(totalBudget)}
            </p>
          </div>
          <div className="border border-[#24332e]/15 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[#24332e]/60">
              Pagado
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums text-[#27613b]">
              {currency.format(totalPaid)}
            </p>
          </div>
          <div className="border border-[#24332e]/15 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[#24332e]/60">
              Pendiente
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums text-[#a04d34]">
              {currency.format(remaining)}
            </p>
          </div>
          <div className="border border-[#24332e]/15 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[#24332e]/60">
              Comprados
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums">
              {purchasedCount}{" "}
              <span className="text-sm font-normal text-[#24332e]/60">
                de {filteredItems.length}
              </span>
            </p>
          </div>
          <div className="border border-[#24332e]/15 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[#24332e]/60">
              Pagados totalmente
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums">
              {fullyPaidCount}{" "}
              <span className="text-sm font-normal text-[#24332e]/60">
                de {filteredItems.length}
              </span>
            </p>
          </div>
        </section>
        <section className="mt-6 border border-[#24332e]/15 bg-white p-4 sm:p-5">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[minmax(14rem,1fr)_auto_auto_auto_auto] xl:items-end">
            <label className="sm:col-span-2 xl:col-span-1 text-sm font-medium">
              Buscar artículo
              <input
                type="search"
                value={filters.search}
                onChange={(event) =>
                  setFilters({ ...filters, search: event.target.value })
                }
                placeholder="Nombre del artículo"
                className="mt-2 block min-h-10 w-full border border-[#24332e]/25 bg-white px-3 outline-none focus:border-[#a04d34]"
              />
            </label>
            <label className="text-sm font-medium">
              Categoría
              <select
                value={filters.category}
                onChange={(event) =>
                  setFilters({ ...filters, category: event.target.value })
                }
                className="mt-2 block min-h-10 w-full border border-[#24332e]/25 bg-white px-2 outline-none focus:border-[#a04d34] xl:w-40"
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Proveedor
              <select
                value={filters.supplier}
                onChange={(event) =>
                  setFilters({ ...filters, supplier: event.target.value })
                }
                className="mt-2 block min-h-10 w-full border border-[#24332e]/25 bg-white px-2 outline-none focus:border-[#a04d34] xl:w-40"
              >
                <option value="">Todos</option>
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Comprado
              <select
                value={filters.bought}
                onChange={(event) =>
                  setFilters({ ...filters, bought: event.target.value })
                }
                className="mt-2 block min-h-10 w-full border border-[#24332e]/25 bg-white px-2 outline-none focus:border-[#a04d34] xl:w-28"
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Pago completo
              <select
                value={filters.paid}
                onChange={(event) =>
                  setFilters({ ...filters, paid: event.target.value })
                }
                className="mt-2 block min-h-10 w-full border border-[#24332e]/25 bg-white px-2 outline-none focus:border-[#a04d34] xl:w-32"
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </label>
            <div className="flex gap-2 sm:col-span-2 xl:col-span-1">
              <button
                onClick={() => {
                  setFilters({
                    search: "",
                    category: "",
                    supplier: "",
                    bought: "",
                    paid: "",
                  });
                  setCurrentPage(1);
                }}
                className="min-h-10 px-3 text-sm"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className="min-h-10 flex-1 bg-[#24332e] px-4 text-sm font-medium text-white xl:flex-none"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </section>
        <section className="mt-6 overflow-hidden border border-[#24332e]/15 bg-white">
          <div className="divide-y divide-[#24332e]/10 md:hidden">
            {isLoading ? (
              <p className="p-10 text-center text-sm text-[#24332e]/60">
                Cargando compras...
              </p>
            ) : filteredItems.length === 0 ? (
              <p className="p-10 text-center text-sm text-[#24332e]/60">
                No hay compras que coincidan con los filtros.
              </p>
            ) : (
              filteredItems.map((item) => (
                <article key={item.id} className="p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-xl">{item.item}</h2>
                      <p className="mt-1 text-sm text-[#24332e]/65">
                        {categoryName(item) || "Sin categoría"}
                        {item.supplier ? ` · ${item.supplier}` : ""}
                      </p>
                      {item.description && <button type="button" onClick={() => setDescriptionItem(item)} className="mt-2 text-sm font-medium text-[#a04d34] underline underline-offset-2">Ver descripción</button>}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <p>
                      Total{" "}
                      <strong className="block text-base">
                        {currency.format(Number(item.total_amount))}
                      </strong>
                    </p>
                    <p>
                      Pendiente{" "}
                      <strong className="block text-base text-[#a04d34]">
                        {currency.format(Number(item.remaining_balance))}
                      </strong>
                    </p>
                    <p>
                      {Number(item.quantity)} x{" "}
                      {currency.format(Number(item.amount_per_unit))}
                    </p>
                    <p>
                      {item.paid_in_bolivars
                        ? "Pagado en Bs."
                        : "Pagado en USD"}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#24332e]/10 pt-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.bought}
                        disabled={updatingBoughtId === item.id}
                        onChange={(event) =>
                          void updateBought(item, event.target.checked)
                        }
                        className="size-4 accent-[#27613b]"
                      />
                      Comprado
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        title="Editar compra"
                        className="inline-flex size-9 items-center justify-center border border-[#24332e]/20"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        title="Eliminar compra"
                        className="inline-flex size-9 items-center justify-center border border-[#a04d34]/35 text-[#a04d34]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-300 text-left text-sm">
              <thead className="bg-[#e8eee8] text-xs uppercase tracking-[0.08em] text-[#24332e]/70">
                <tr>
                  {[
                    "Artículo",
                    "Descripción",
                    "Categoría",
                    "Proveedor",
                    "Comprado",
                    "Cantidad",
                    "Monto unit.",
                    "Total",
                    "Pagado",
                    "Moneda",
                    "Pendiente",
                    "Acciones",
                  ].map((label) => (
                    <th key={label} className="whitespace-nowrap px-4 py-4">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24332e]/10">
                {isLoading ? (
                  <tr>
                    <td colSpan={12} className="p-10 text-center">
                      Cargando compras...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="p-10 text-center">
                      No hay compras que coincidan con los filtros.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="min-w-56 px-4 py-4 font-medium">
                        {item.item}
                      </td>
                      <td className="px-4 py-4">{item.description ? <button type="button" onClick={() => setDescriptionItem(item)} className="text-[#a04d34] underline underline-offset-2">Ver descripción</button> : "-"}</td>
                      <td className="px-4 py-4">{categoryName(item) || "-"}</td>
                      <td className="px-4 py-4">{item.supplier || "-"}</td>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={item.bought}
                          disabled={updatingBoughtId === item.id}
                          onChange={(event) =>
                            void updateBought(item, event.target.checked)
                          }
                          aria-label={`Compra realizada: ${item.item}`}
                          className="size-4 cursor-pointer accent-[#27613b]"
                        />
                      </td>
                      <td className="px-4 py-4">{item.quantity}</td>
                      <td className="px-4 py-4">
                        {currency.format(Number(item.amount_per_unit))}
                      </td>
                      <td className="px-4 py-4">
                        {currency.format(Number(item.total_amount))}
                      </td>
                      <td className="px-4 py-4">
                        {currency.format(Number(item.amount_paid))}
                      </td>
                      <td className="px-4 py-4">
                        {item.paid_in_bolivars ? "Bs." : "$"}
                      </td>
                      <td className="px-4 py-4 text-[#a04d34]">
                        {currency.format(Number(item.remaining_balance))}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            title="Editar compra"
                            className="inline-flex size-8 items-center justify-center border border-[#24332e]/20"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            title="Eliminar compra"
                            className="inline-flex size-8 items-center justify-center border border-[#a04d34]/35 text-[#a04d34]"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        <footer className="mt-0 flex flex-wrap items-center justify-between gap-3 border-x border-b border-[#24332e]/15 bg-white px-4 py-3 text-sm">
          <label className="flex items-center gap-2">
            Mostrar
            <select
              value={pageSize}
              onChange={(event) => {
                const nextPageSize = Number(event.target.value);
                setPageSize(nextPageSize);
                setCurrentPage(1);
              }}
              className="min-h-9 border border-[#24332e]/25 bg-white px-2 outline-none"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span>por página</span>
          </label>
          <span>
            Página {Math.min(currentPage, totalPages)} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              aria-label="Página anterior"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="inline-flex size-9 items-center justify-center border border-[#24332e]/20 disabled:opacity-35"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Página siguiente"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="inline-flex size-9 items-center justify-center border border-[#24332e]/20 disabled:opacity-35"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </footer>
        {isItemModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-modal-title"
            className="fixed inset-0 z-50 grid place-items-center bg-[#18231f]/55 p-4"
          >
            <form
              onSubmit={saveItem}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[#fdfcf8] p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between border-b border-[#24332e]/15 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#a04d34]">
                    {editingItem ? "Actualizar registro" : "Nuevo registro"}
                  </p>
                  <h2
                    id="item-modal-title"
                    className="mt-1 font-serif text-3xl"
                  >
                    {editingItem
                      ? "Editar compra o pago"
                      : "Agregar compra o pago"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  aria-label="Cerrar modal"
                  className="inline-flex size-9 items-center justify-center border border-[#24332e]/20"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2 text-sm font-medium">
                  Artículo
                  <input
                    required
                    value={form.item}
                    onChange={(event) =>
                      setForm({ ...form, item: event.target.value })
                    }
                    className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none"
                  />
                </label>
                <label className="sm:col-span-2 text-sm font-medium">
                  Descripción
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    rows={3}
                    className="mt-2 w-full border border-[#24332e]/25 bg-white p-3 outline-none"
                  />
                </label>
                <label className="text-sm font-medium">
                  Categoría
                  <input
                    required
                    list="budget-categories"
                    value={form.categoryName}
                    onChange={(event) =>
                      setForm({ ...form, categoryName: event.target.value })
                    }
                    placeholder="Buscar categoría"
                    className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none"
                  />
                  <datalist id="budget-categories">
                    {categories.map((category) => (
                      <option key={category.id} value={category.name} />
                    ))}
                  </datalist>
                </label>
                <div className="self-end">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="min-h-11 text-sm font-medium text-[#a04d34]"
                  >
                    + Crear categoría
                  </button>
                </div>
                <label className="sm:col-span-2 text-sm font-medium">
                  Proveedor
                  <input
                    value={form.supplier}
                    onChange={(event) =>
                      setForm({ ...form, supplier: event.target.value })
                    }
                    className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none"
                  />
                </label>
                <label className="text-sm font-medium">
                  Cantidad
                  <input
                    required
                    min="1"
                    step="1"
                    type="number"
                    value={form.quantity}
                    onChange={(event) =>
                      setForm({ ...form, quantity: Number(event.target.value) })
                    }
                    className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none"
                  />
                </label>
                <label className="text-sm font-medium">
                  Monto por unidad (USD)
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.amount_per_unit}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        amount_per_unit:
                          event.target.value === ""
                            ? ""
                            : Number(event.target.value),
                      })
                    }
                    className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none"
                  />
                </label>
                <label className="text-sm font-medium">
                  Monto pagado
                  <input
                    min="0"
                    max={total}
                    step="0.01"
                    type="number"
                    value={form.amount_paid}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        amount_paid:
                          event.target.value === ""
                            ? ""
                            : Number(event.target.value),
                      })
                    }
                    className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none"
                  />
                </label>
                <p className="self-end pb-3 text-sm">
                  Total calculado: <strong>{currency.format(total)}</strong>
                </p>
                <label className="flex min-h-11 items-center gap-3 border border-[#24332e]/15 px-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.bought}
                    onChange={(event) =>
                      setForm({ ...form, bought: event.target.checked })
                    }
                    className="size-4 accent-[#27613b]"
                  />
                  Compra realizada
                </label>
                <label className="flex min-h-11 items-center gap-3 border border-[#24332e]/15 px-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.paid_in_bolivars}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        paid_in_bolivars: event.target.checked,
                      })
                    }
                    className="size-4 accent-[#a04d34]"
                  />
                  Pago realizado en Bs.
                </label>
              </div>
              <div className="mt-7 flex justify-end gap-3 border-t border-[#24332e]/15 pt-5">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="min-h-11 px-4 text-sm"
                >
                  Cancelar
                </button>
                <button
                  disabled={isSubmitting}
                  className="min-h-11 bg-[#24332e] px-5 text-sm font-medium text-white disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Guardando..."
                    : editingItem
                      ? "Guardar cambios"
                      : "Crear compra"}
                </button>
              </div>
            </form>
          </div>
        )}
        {isCategoryModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            className="fixed inset-0 z-60 grid place-items-center bg-[#18231f]/55 p-4"
          >
            <form
              onSubmit={saveCategory}
              className="w-full max-w-md bg-[#fdfcf8] p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <h2 id="category-modal-title" className="font-serif text-3xl">
                  Nueva categoría
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  aria-label="Cerrar modal"
                  className="inline-flex size-9 items-center justify-center border border-[#24332e]/20"
                >
                  <X className="size-4" />
                </button>
              </div>
              <label className="mt-5 block text-sm font-medium">
                Nombre
                <input
                  required
                  value={categoryForm.name}
                  onChange={(event) =>
                    setCategoryForm({
                      ...categoryForm,
                      name: event.target.value,
                    })
                  }
                  className="mt-2 min-h-11 w-full border border-[#24332e]/25 bg-white px-3 outline-none"
                />
              </label>
              <label className="mt-5 block text-sm font-medium">
                Descripción
                <textarea
                  value={categoryForm.description}
                  onChange={(event) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: event.target.value,
                    })
                  }
                  rows={3}
                  className="mt-2 w-full border border-[#24332e]/25 bg-white p-3 outline-none"
                />
              </label>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="min-h-11 px-4 text-sm"
                >
                  Cancelar
                </button>
                <button
                  disabled={isSubmitting}
                  className="min-h-11 bg-[#24332e] px-5 text-sm font-medium text-white"
                >
                  Crear categoría
                </button>
              </div>
            </form>
          </div>
        )}
        {descriptionItem && (
          <div role="dialog" aria-modal="true" aria-labelledby="description-modal-title" className="fixed inset-0 z-60 grid place-items-center bg-[#18231f]/55 p-4">
            <div className="w-full max-w-lg bg-[#fdfcf8] p-6 shadow-2xl sm:p-8">
              <div className="flex items-start justify-between gap-4 border-b border-[#24332e]/15 pb-5"><div><p className="text-xs uppercase tracking-[0.14em] text-[#a04d34]">Descripción</p><h2 id="description-modal-title" className="mt-1 font-serif text-3xl">{descriptionItem.item}</h2></div><button type="button" onClick={() => setDescriptionItem(null)} aria-label="Cerrar descripción" className="inline-flex size-9 shrink-0 items-center justify-center border border-[#24332e]/20"><X className="size-4" /></button></div>
              <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-[#24332e]/80">{descriptionItem.description}</p>
              <div className="mt-7 flex justify-end"><button type="button" onClick={() => setDescriptionItem(null)} className="min-h-11 bg-[#24332e] px-5 text-sm font-medium text-white">Cerrar</button></div>
            </div>
          </div>
        )}
        {itemToDelete && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-item-modal-title"
            className="fixed inset-0 z-60 grid place-items-center bg-[#18231f]/55 p-4"
          >
            <div className="w-full max-w-md bg-[#fdfcf8] p-6 shadow-2xl">
              <p className="text-xs uppercase tracking-[0.14em] text-[#a04d34]">
                Acción irreversible
              </p>
              <h2
                id="delete-item-modal-title"
                className="mt-1 font-serif text-3xl"
              >
                ¿Eliminar compra?
              </h2>
              <p className="mt-4 text-sm text-[#24332e]/70">
                Se eliminará permanentemente{" "}
                <strong>{itemToDelete.item}</strong>.
              </p>
              <div className="mt-7 flex justify-end gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="min-h-11 px-4 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => void deleteItem()}
                  disabled={isSubmitting}
                  className="min-h-11 bg-[#a04d34] px-5 text-sm font-medium text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
