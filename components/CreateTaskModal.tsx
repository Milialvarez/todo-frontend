"use client";

import { useState } from "react";
import { Plus, X, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { createTask } from "@/services/tasks";


export default function CreateTaskModal({ onCreate }: { onCreate: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed">("pending");
  const [error, setError] = useState("");


  const handleCreate = async () => {
    setError("");
    setLoading(true);

    try {
      await createTask({
        title,
        description,
        status,
      });

      onCreate();
      setOpen(false);

      setTitle("");
      setDescription("");
      setStatus("pending");
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
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow transition"
      >
        <Plus size={18} />
        Nueva tarea
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

            <h2 className="text-2xl font-bold text-blue-600 mb-4">Crear nueva tarea</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ej: Terminar login"
                  className="w-full px-4 py-2 border rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles de la tarea..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("pending")}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm border ${status === "pending" ? "bg-orange-100 border-orange-400 text-orange-600" : "text-gray-500"}`}
                  >
                    <Clock size={16} /> Pendiente
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("in_progress")}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm border ${status === "in_progress" ? "bg-yellow-100 border-yellow-400 text-yellow-600" : "text-gray-500"}`}
                  >
                    <Loader2 size={16} /> En progreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("completed")}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm border ${status === "completed" ? "bg-green-100 border-green-400 text-green-600" : "text-gray-500"}`}
                  >
                    <CheckCircle2 size={16} /> Completada
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-xl"
              >
                {loading ? "Creando..." : "Crear tarea"}
              </button>

            </form>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">
                {error}
              </p>
            )}


          </div>
        </div>
      )}
    </>
  );
}
