"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateTaskModal from "@/components/CreateTaskModal";
import TaskCard from "@/components/TaskCard";
import { LogOut, Filter } from "lucide-react";
import { getMyTasks, getMyTasksByStatus } from "@/services/tasks";
import { logoutUser } from "@/services/auth";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
}

interface Reminder {
  id: number;
  date: string;
  description: string;
}

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | Task["status"]>("all");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"tasks" | "reminders">("tasks");

  const mockReminders: Reminder[] = [
    { id: 1, date: "2025-12-24", description: "Comprar regalos 🎁" },
    { id: 2, date: "2025-12-31", description: "Planear Año Nuevo ✨" },
  ];

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

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("access_token");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className={`text-3xl font-bold transition-colors
      ${view === "tasks"
                ? "text-blue-700"
                : "text-orange-500"
              }`}
          >
            {view === "tasks" ? "Mis tareas" : "Mis recordatorios"}
          </h1>

          <button
            onClick={logout}
            className={`flex items-center gap-2 text-sm transition-colors
      ${view === "tasks"
                ? "text-blue-600 hover:text-red-500"
                : "text-orange-500 hover:text-red-500"
              }`}
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>

        {/* TOGGLE */}
        <div className="bg-white rounded-2xl shadow-md p-2 mb-6 flex">
          <button
            onClick={() => setView("tasks")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition
              ${view === "tasks"
                ? "bg-blue-600 text-white"
                : "text-blue-600 hover:bg-blue-50"
              }`}
          >
            Mis tareas
          </button>

          <button
            onClick={() => setView("reminders")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition
              ${view === "reminders"
                ? "bg-orange-400 text-white"
                : "text-orange-500 hover:bg-orange-50"
              }`}
          >
            Recordatorios
          </button>
        </div>

        {/* FILTROS + NUEVA TAREA */}
        {view === "tasks" && (
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
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

            {/* NUEVA TAREA */}
            <CreateTaskModal onCreate={loadTasks} />
          </div>
        )}

        {/* LISTADO TAREAS */}
        {view === "tasks" && (
          <>
            {loading ? (
              <p className="text-center text-gray-600">
                Cargando tareas...
              </p>
            ) : tasks.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay tareas para mostrar
              </p>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdated={loadTasks}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* LISTADO RECORDATORIOS */}
        {view === "reminders" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-orange-500">
                Recordatorios
              </h2>

              <button className="px-4 py-1.5 rounded-full bg-orange-400 text-white text-sm hover:bg-orange-500 transition">
                + Nuevo
              </button>
            </div>

            <div className="grid gap-4">
              {mockReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="rounded-2xl border border-orange-100 bg-orange-50 p-4 hover:shadow-md transition"
                >
                  <p className="text-xs text-orange-400 mb-1">
                    {reminder.date}
                  </p>

                  <p className="text-sm font-medium text-orange-900">
                    {reminder.description}
                  </p>

                  <div className="flex gap-4 mt-3 text-xs">
                    <button className="text-orange-600 hover:underline">
                      Editar
                    </button>
                    <button className="text-red-500 hover:underline">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
