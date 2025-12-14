"use client";

import { useState } from "react";
import { X, CheckCircle2, Clock, Loader2, Pencil } from "lucide-react";
import { updateTask } from "@/services/tasks";

type Status = "pending" | "in_progress" | "completed";

interface Props {
  task: {
    id: number;
    title: string;
    description?: string;
    status: Status;
  };
  onUpdated: () => void;
}

export default function EditTaskModal({ task, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<Status>(task.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    setError("");

    try {
      await updateTask(task.id, {
        title,
        description,
        status,
      });

      onUpdated();
      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-500 hover:text-blue-700"
      >
        <Pencil size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Editar tarea
            </h2>

            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("pending")}
                  className={`px-3 py-2 rounded-xl border ${
                    status === "pending"
                      ? "bg-orange-100 text-orange-600 border-orange-400"
                      : "text-gray-500"
                  }`}
                >
                  <Clock size={16} /> Pendiente
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("in_progress")}
                  className={`px-3 py-2 rounded-xl border ${
                    status === "in_progress"
                      ? "bg-yellow-100 text-yellow-600 border-yellow-400"
                      : "text-gray-500"
                  }`}
                >
                  <Loader2 size={16} /> En progreso
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("completed")}
                  className={`px-3 py-2 rounded-xl border ${
                    status === "completed"
                      ? "bg-green-100 text-green-600 border-green-400"
                      : "text-gray-500"
                  }`}
                >
                  <CheckCircle2 size={16} /> Completada
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
