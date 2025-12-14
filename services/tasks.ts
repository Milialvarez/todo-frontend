const API_URL = process.env.NEXT_PUBLIC_API_URL

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
