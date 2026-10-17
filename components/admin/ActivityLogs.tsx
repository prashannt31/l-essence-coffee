"use client";

import { useEffect, useState } from "react";
import { addNotification } from "./Notifications";

export type ActivityLog = {
  id: number;
  admin: string;
  role: string;
  action: string;
  target: string;
  time: string;
};

const ACTIVITY_LOG_KEY = "l-essence-activity-logs";

export function addActivityLog(action: string, target: string) {
  const users = JSON.parse(
  localStorage.getItem("l-essence-admin-users") || "[]"
  
);
addNotification(action, target);

const activeId = Number(
  localStorage.getItem("l-essence-active-admin")
);

const currentUser =
  users.find((u: any) => u.id === activeId) || {};

  const existingLogs: ActivityLog[] = JSON.parse(
    localStorage.getItem(ACTIVITY_LOG_KEY) || "[]"
  );

  const newLog: ActivityLog = {
    id: Date.now(),
    admin: currentUser?.name || "Unknown Admin",
    role: currentUser?.role || "Admin",
    action,
    target,
    time: new Date().toLocaleString(),
  };

  localStorage.setItem(
    ACTIVITY_LOG_KEY,
    JSON.stringify([newLog, ...existingLogs])
  );

  window.dispatchEvent(new Event("activity-log-updated"));
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const loadLogs = () => {
    const savedLogs = JSON.parse(
      localStorage.getItem(ACTIVITY_LOG_KEY) || "[]"
    );

    setLogs(savedLogs);
  };

  useEffect(() => {
    loadLogs();

    window.addEventListener("activity-log-updated", loadLogs);

    return () => {
      window.removeEventListener("activity-log-updated", loadLogs);
    };
  }, []);

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Activity Logs</h2>

      {logs.length === 0 ? (
        <p className="text-zinc-500 text-sm">No activity recorded yet.</p>
      ) : (
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 admin-scrollbar">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-4"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {log.admin}{" "}
                    <span className="text-xs text-[#D4AF37]">
                      {log.role}
                    </span>
                  </p>

                  <p className="text-sm text-zinc-400 mt-1">
                    {log.action}
                  </p>

                  <p className="text-sm text-zinc-500 mt-1">
                    {log.target}
                  </p>
                </div>

                <p className="text-xs text-zinc-600 whitespace-nowrap">
                  {log.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}