import test from "node:test";
import assert from "node:assert/strict";
import { attendanceBarPercentage, workedSeconds } from "../lib/attendance/duration.mjs";

test("attendance bar uses actual seconds and caps at a standard shift", () => {
  const cases = [[0, 0], [17, (17 / 28800) * 100], [3600, 12.5], [7200, 25], [14400, 50], [21600, 75], [28800, 100], [32400, 100]];
  for (const [seconds, expected] of cases) assert.ok(Math.abs(attendanceBarPercentage(seconds) - expected) < 1e-9);
});

test("missing attendance has zero duration", () => {
  assert.equal(workedSeconds({ attendanceId: "a", employeeId: "e", employeeName: "E", date: "2026-10-26", status: "PRESENT" }), 0);
});

test("active duration is elapsed seconds and multiple sessions sum once", () => {
  const now = Date.parse("2026-10-26T11:00:17Z");
  const active = { sessions: [{ sessionId: "a", checkIn: "2026-10-26T11:00:00Z" }], state: "CHECKED_IN" };
  assert.equal(workedSeconds(active, now), 17);
  const twoSessions = { sessions: [
    { sessionId: "a", checkIn: "2026-10-26T08:00:00Z", checkOut: "2026-10-26T10:00:00Z" },
    { sessionId: "b", checkIn: "2026-10-26T12:00:00Z", checkOut: "2026-10-26T15:00:00Z" },
  ], state: "CHECKED_OUT" };
  assert.equal(workedSeconds(twoSessions, now), 5 * 3600);
});
