"use client";

import { useEffect, useState } from "react";
import {
  getDefaultUsers,
  getRoleLabel,
  loadCurrentUser,
  saveCurrentUser
} from "@/lib/auth";
import type { AppUser } from "@/lib/auth";

export function RoleSwitcher() {
  const [currentUser, setCurrentUser] = useState<AppUser>(loadCurrentUser);
  const users = getDefaultUsers();

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === "lxp.currentUser.v1") {
        setCurrentUser(loadCurrentUser());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  function handleSwitch(userId: string) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    saveCurrentUser(user);
    setCurrentUser(user);
    window.location.reload();
  }

  return (
    <div className="role-switcher">
      <label htmlFor="role-select" className="role-label">
        {getRoleLabel(currentUser.role)}
      </label>
      <select
        id="role-select"
        value={currentUser.id}
        onChange={(e) => handleSwitch(e.target.value)}
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({getRoleLabel(user.role)})
          </option>
        ))}
      </select>
    </div>
  );
}

export function useCurrentUser(): AppUser {
  const [user] = useState<AppUser>(loadCurrentUser);
  return user;
}
