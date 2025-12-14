"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, ListTodo, LogOut, Filter } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | Task["status"]>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8000/tasks/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return [];
        }
        return res.json();
      })
      .then((data) => setTasks(data))
      .finally(() => setLoading(false));
  }, [router]);

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const logout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Mis tareas</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-red-500 transition"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <Filter size={18} /> Filtrar por estado
          </div>

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            Todas
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === "pending"
                ? "bg-orange-500 text-white"
                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
            }`}
          >
            Pendientes
          </button>

          <button
            onClick={() => setFilter("in_progress")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === "in_progress"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            }`}
          >
            En progreso
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === "completed"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Completadas
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Cargando tareas...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500">No hay tareas para mostrar</p>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl shadow p-5 flex items-start justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {task.title}
                  </h2>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm font-medium">
                  {task.status === "pending" && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <Clock size={16} /> Pendiente
                    </span>
                  )}
                  {task.status === "in_progress" && (
                    <span className="flex items-center gap-1 text-blue-600">
                      <ListTodo size={16} /> En progreso
                    </span>
                  )}
                  {task.status === "completed" && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 size={16} /> Completada
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}