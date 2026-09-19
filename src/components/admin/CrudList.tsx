import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, Pencil, X, Check } from "lucide-react";
import { Row, inputCls } from "./ProfileEditor";

type FieldDef<T> = {
  key: keyof T;
  label: string;
  type?: "text" | "url" | "textarea" | "select";
  options?: string[];
};

type CrudConfig<T> = {
  table: "gallery_images" | "works" | "contact_entries" | "social_links";
  blank: () => Omit<T, "id" | "created_at">;
  fields: FieldDef<T>[];
  display: (row: Record<string, unknown>) => string;
};

function FieldInput<T>({
  f,
  value,
  onChange,
}: {
  f: FieldDef<T>;
  value: unknown;
  onChange: (v: string) => void;
}) {
  const v = String(value ?? "");
  if (f.type === "textarea") {
    return <textarea rows={2} className={inputCls} value={v} onChange={(e) => onChange(e.target.value)} />;
  }
  if (f.type === "select") {
    return (
      <select className={inputCls} value={v} onChange={(e) => onChange(e.target.value)}>
        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  return <input type={f.type ?? "text"} className={inputCls} value={v} onChange={(e) => onChange(e.target.value)} />;
}

export function CrudList<T extends { id: string; sort_order: number }>({
  config,
  title,
}: { config: CrudConfig<T>; title: string }) {
  const [rows, setRows] = useState<T[]>([]);
  const [draft, setDraft] = useState<Record<string, unknown>>(config.blank() as Record<string, unknown>);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, unknown>>({});

  const load = () => {
    supabase
      .from(config.table)
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as unknown as T[]) ?? []));
  };
  useEffect(load, [config.table]);

  const add = async () => {
    setBusy(true);
    const payload = { ...config.blank(), ...draft };
    const { error } = await supabase.from(config.table).insert(payload as never);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${title} added`);
    setDraft(config.blank() as Record<string, unknown>);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(config.table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const startEdit = (r: T) => {
    setEditingId(r.id);
    setEditDraft({ ...(r as unknown as Record<string, unknown>) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const patch: Record<string, unknown> = {};
    for (const f of config.fields) {
      patch[f.key as string] = editDraft[f.key as string];
    }
    const { error } = await supabase
      .from(config.table)
      .update(patch as never)
      .eq("id", editingId);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    cancelEdit();
    load();
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Plus size={14} /> Add {title}
        </h3>
        {config.fields.map((f) => (
          <Row key={String(f.key)} label={f.label}>
            <FieldInput
              f={f}
              value={draft[f.key as string]}
              onChange={(v) => setDraft({ ...draft, [f.key]: v })}
            />
          </Row>
        ))}
        <button
          onClick={add}
          disabled={busy}
          className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm hover-lift disabled:opacity-60"
        >
          Add
        </button>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-3">All {title.toLowerCase()}s ({rows.length})</h3>
        <ul className="space-y-2">
          {rows.map((r) => {
            const isEditing = editingId === r.id;
            return (
              <li key={r.id} className="glass rounded-xl p-3">
                {isEditing ? (
                  <div className="space-y-3">
                    {config.fields.map((f) => (
                      <Row key={String(f.key)} label={f.label}>
                        <FieldInput
                          f={f}
                          value={editDraft[f.key as string]}
                          onChange={(v) => setEditDraft({ ...editDraft, [f.key]: v })}
                        />
                      </Row>
                    ))}
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs flex items-center gap-1"
                      >
                        <Check size={12} /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg glass px-3 py-1.5 text-xs flex items-center gap-1"
                      >
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm truncate">
                      {config.display(r as unknown as Record<string, unknown>)}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(r)}
                        className="text-foreground/70 p-1.5 hover:bg-foreground/10 rounded"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => remove(r.id)}
                        className="text-destructive p-1.5 hover:bg-destructive/10 rounded"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          {rows.length === 0 && <li className="text-xs text-muted-foreground">Nothing yet.</li>}
        </ul>
      </section>
    </div>
  );
}
