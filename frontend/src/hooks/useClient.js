import { useMemo } from "react";

const API = "http://localhost:5000/api";

export function useClient(token) {
  return useMemo(
    () => ({
      request: async (path, options = {}) => {
        const res = await fetch(API + path, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: "Bearer " + token } : {}),
            ...(options.headers || {}),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Request failed");
        return data;
      },
    }),
    [token],
  );
}
