"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateTaskModal from "@/components/CreateTaskModal";
import TaskCard from "@/components/TaskCard";
import { LogOut, Filter } from "lucide-react";
import { getMyTasks, getMyTasksByStatus } from "@/services/tasks";


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

  const loadTasks = async () => {
    try {
      const data = await getMyTasks();
      setTasks(data);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadTasks();
  }, [router]);

  const applyFilter = async (value: "all" | Task["status"]) => {
    setFilter(value);
    setLoading(true);

    try {
      const data =
        value === "all"
          ? await getMyTasks()
          : await getMyTasksByStatus(value);

      setTasks(data);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Mis tareas</h1>

          <CreateTaskModal onCreate={loadTasks} />

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
            onClick={() => applyFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
          >
            Todas
          </button>

          <button
            onClick={() => applyFilter("pending")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === "pending"
              ? "bg-orange-500 text-white"
              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
          >
            Pendientes
          </button>

          <button
            onClick={() => applyFilter("in_progress")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === "in_progress"
              ? "bg-yellow-500 text-white"
              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}
          >
            En progreso
          </button>

          <button
            onClick={() => applyFilter("completed")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === "completed"
              ? "bg-green-500 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
          >
            Completadas
          </button>
        </div>


        {loading ? (
          <p className="text-center text-gray-600">Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No hay tareas para mostrar</p>
        ) : (
          <div className="grid gap-4">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500">No hay tareas para mostrar</p>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onUpdated={loadTasks} />
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
