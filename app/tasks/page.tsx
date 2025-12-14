"use client";

import { useEffect, useState } from "react";

export default function TasksPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    setToken(t);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
            Login exitoso
        </h1>

        <p className="text-gray-600 mb-4">
          Ya estás dentro del sistema de tareas
        </p>

        <p className="text-sm text-gray-500 break-all">
          <strong>Token:</strong><br />
          {token || "No token"}
        </p>
      </div>
    </div>
  );
}
