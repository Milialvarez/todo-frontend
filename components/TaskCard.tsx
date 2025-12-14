"use client";

import { CheckCircle2, Clock, ListTodo } from "lucide-react";
import EditTaskModal from "@/components/EditTaskModal";
import DeleteTaskButton from "@/components/DeleteTaskButton";

interface Task {
    id: number;
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "completed";
}

export default function TaskCard({
    task,
    onUpdated,
}: {
    task: Task;
    onUpdated: () => void;
}) {
    return (
        <div className="bg-white rounded-2xl shadow p-5 flex items-start justify-between">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">
                    {task.title}
                </h2>

                {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                )}
            </div>

            <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                    {task.status === "pending" && (
                        <span className="flex items-center gap-1 text-orange-600">
                            <Clock size={16} /> Pendiente
                        </span>
                    )}
                    {task.status === "in_progress" && (
                        <span className="flex items-center gap-1 text-yellow-600">
                            <ListTodo size={16} /> En progreso
                        </span>
                    )}
                    {task.status === "completed" && (
                        <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 size={16} /> Completada
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <EditTaskModal task={task} onUpdated={onUpdated} />
                    <DeleteTaskButton
                        taskId={task.id}
                        onDeleted={onUpdated}
                    />
                </div>
            </div>

        </div>
    );
}
