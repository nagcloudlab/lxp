"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  getRoleLabel,
  loadCurrentUser,
  saveCurrentUser,
  getDefaultUsers
} from "@/lib/auth";
import type { AppUser, UserRole } from "@/lib/auth";

export function RoleSwitcher() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className="role-switcher">
        <span className="role-label">
          {session.user.name} ({getRoleLabel(session.user.role)})
        </span>
        <button
          className="button secondary"
          onClick={() => signOut({ callbackUrl: "/login" })}
          type="button"
        >
          Sign out
        </button>
      </div>
    );
  }

  return <FallbackRoleSwitcher />;
}

function FallbackRoleSwitcher() {
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
  const { data: session } = useSession();

  if (session?.user) {
    return {
      id: session.user.id,
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      role: (session.user.role ?? "learner") as UserRole
    };
  }

  return loadCurrentUser();
}
