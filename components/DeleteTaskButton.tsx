"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { deleteTask } from "@/services/tasks";

export default function DeleteTaskButton({
  taskId,
  onDeleted,
}: {
  taskId: number;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTask(taskId);
      onDeleted();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN ELIMINAR */}
      <button
        onClick={() => setOpen(true)}
        className="text-red-500 hover:text-red-600 transition"
        title="Eliminar tarea"
      >
        <Trash2 size={18} />
      </button>

      {/* MODAL CONFIRMACIÓN */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ¿Eliminar tarea?
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              Esta acción no se puede deshacer. ¿Seguro que querés continuar?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 transition"
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
