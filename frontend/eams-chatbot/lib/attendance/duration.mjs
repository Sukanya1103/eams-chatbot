export function workedSeconds(record, now = Date.now()) {
  if (typeof record.totalWorkedSeconds === "number" && Number.isFinite(record.totalWorkedSeconds)) return Math.max(0, record.totalWorkedSeconds);
  const sessions = record.sessions?.length ? record.sessions : record.checkIn ? [{ checkIn: record.checkIn, checkOut: record.checkOut }] : [];
  return sessions.reduce((total, session) => {
    const start = Date.parse(session.checkIn);
    const end = session.checkOut ? Date.parse(session.checkOut) : record.state === "CHECKED_IN" ? now : NaN;
    return total + (Number.isFinite(start) && Number.isFinite(end) && end > start ? Math.floor((end - start) / 1000) : 0);
  }, 0);
}

export function attendanceBarPercentage(seconds) {
  return Math.min(Math.max(seconds, 0) / 28800, 1) * 100;
}

export function formatWorkedDuration(seconds) {
  const value = Math.floor(seconds);
  return `${Math.floor(value / 3600)}h ${String(Math.floor((value % 3600) / 60)).padStart(2, "0")}m${value % 60 ? ` ${value % 60}s` : ""}`;
}
