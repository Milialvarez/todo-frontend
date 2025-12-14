const API_URL = process.env.NEXT_PUBLIC_API_URL

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyTasks() {
  const res = await fetch(`${API_URL}/tasks/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    throw new Error("Error al obtener tareas");
  }

  return res.json();
}

export async function getMyTasksByStatus(
  status: "pending" | "in_progress" | "completed"
) {
  const res = await fetch(`${API_URL}/tasks/status/${status}`, {
    headers: getAuthHeaders(),
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Error al filtrar tareas");

  return res.json();
}

export async function createTask(data: {
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
}) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error al crear la tarea");
  }

  return res.json();
}

export async function updateTask(
  taskId: number,
  data: {
    title?: string;
    description?: string;
    status?: "pending" | "in_progress" | "completed";
  }
) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/tasks`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      task_id: taskId,
      ...data,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error al actualizar tarea");
  }

  return res.json();
}

export async function deleteTask(taskId: number) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error al eliminar la tarea");
  }
}


