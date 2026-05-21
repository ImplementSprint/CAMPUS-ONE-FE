'use client'
import { useState, useEffect } from 'react';
import { Clock, MapPin, BookOpen, Users } from 'lucide-react';
import { getCurrentUser } from '@/services/auth.service';
import { getProfessorClasses, type ClassAssignment } from '../services/professor.service';

// ─── Day order for sorting ────────────────────────────────────────────────────
const DAY_ORDER: Record<string, number> = {
  monday: 0, mon: 0,
  tuesday: 1, tue: 1,
  wednesday: 2, wed: 2,
  thursday: 3, thu: 3,
  friday: 4, fri: 4,
  saturday: 5, sat: 5,
  sunday: 6, sun: 6,
};

const DAY_LABELS: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

const DAY_COLORS: Record<string, string> = {
  Monday: 'bg-blue-50 border-blue-200 text-blue-700',
  Tuesday: 'bg-purple-50 border-purple-200 text-purple-700',
  Wednesday: 'bg-green-50 border-green-200 text-green-700',
  Thursday: 'bg-orange-50 border-orange-200 text-orange-700',
  Friday: 'bg-rose-50 border-rose-200 text-rose-700',
  Saturday: 'bg-amber-50 border-amber-200 text-amber-700',
  Sunday: 'bg-gray-50 border-gray-200 text-gray-700',
};

/**
 * parseScheduleDays
 * Extracts day abbreviations from a schedule string like:
 *   "MWF 9:00 AM - 10:00 AM"  → ['Monday', 'Wednesday', 'Friday']
 *   "TTH 10:30 AM - 12:00 PM" → ['Tuesday', 'Thursday']
 *   "Monday 8:00 AM"           → ['Monday']
 */
function parseScheduleDays(schedule: string): string[] {
  if (!schedule) return ['Unscheduled'];

  const s = schedule.trim();

  // Handle shorthand like MWF, TTH, MTWTHF, etc.
  const shorthand = s.split(/\s+/)[0];
  const days: string[] = [];

  if (/^[MTWFHS]+$/i.test(shorthand)) {
    let i = 0;
    while (i < shorthand.length) {
      const ch = shorthand[i].toUpperCase();
      const next = shorthand[i + 1]?.toUpperCase();

      if (ch === 'T' && next === 'H') { days.push('Thursday'); i += 2; }
      else if (ch === 'M') { days.push('Monday'); i++; }
      else if (ch === 'T') { days.push('Tuesday'); i++; }
      else if (ch === 'W') { days.push('Wednesday'); i++; }
      else if (ch === 'F') { days.push('Friday'); i++; }
      else if (ch === 'S' && next === 'U') { days.push('Sunday'); i += 2; }
      else if (ch === 'S') { days.push('Saturday'); i++; }
      else i++;
    }
    if (days.length > 0) return days;
  }

  // Handle full day names in the string
  const lower = s.toLowerCase();
  for (const [key, label] of Object.entries(DAY_LABELS)) {
    if (lower.includes(key)) {
      if (!days.includes(label)) days.push(label);
    }
  }

  return days.length > 0 ? days : ['Unscheduled'];
}

/**
 * groupByDay
 * Takes the flat list of class assignments and returns a map of
 * day → list of classes that meet on that day, sorted by day order.
 */
function groupByDay(classes: ClassAssignment[]): Map<string, ClassAssignment[]> {
  const map = new Map<string, ClassAssignment[]>();

  for (const cls of classes) {
    const days = parseScheduleDays(cls.schedule ?? '');
    for (const day of days) {
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(cls);
    }
  }

  // Sort the map keys by day order
  return new Map(
    [...map.entries()].sort(([a], [b]) => {
      const aOrder = DAY_ORDER[a.toLowerCase()] ?? 99;
      const bOrder = DAY_ORDER[b.toLowerCase()] ?? 99;
      return aOrder - bOrder;
    })
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ProfessorSchedule() {
  const user = getCurrentUser();
  const [classes, setClasses] = useState<ClassAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * useEffect — on mount, fetch all active class assignments for this professor
   * using getProfessorClasses(professorId). Each assignment contains the subject,
   * section, schedule string, room, and enrollment counts.
   */
  useEffect(() => {
    if (!user?.id) return;
    getProfessorClasses(user.id).then(r => {
      setClasses(r.data ?? []);
      setLoading(false);
    });
  }, [user?.id]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B]" />
    </div>
  );

  // Group classes by teaching day
  const byDay = groupByDay(classes);

  // Summary stats
  const totalStudents = classes.reduce((s, c) => s + c.enrolled_count, 0);
  const totalUnits = classes.reduce((s, c) => s + c.subject.units, 0);

  return (
    <div className="space-y-8">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Teaching Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">
          Classes you are assigned to teach — {classes.length} class{classes.length !== 1 ? 'es' : ''} this semester
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-900 mb-2">No Classes Assigned</p>
          <p className="text-sm text-gray-500">You have no active teaching assignments this semester.</p>
        </div>
      ) : (
        <>
          {/* ── Summary Stats ──────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: BookOpen, label: 'Classes to Teach',  value: classes.length,  color: 'bg-amber-50 text-[#F59E0B]' },
              { icon: Users,    label: 'Total Students',    value: totalStudents,   color: 'bg-blue-50 text-blue-600' },
              { icon: Clock,    label: 'Total Units',       value: totalUnits,      color: 'bg-purple-50 text-purple-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Weekly Teaching Schedule ───────────────────────── */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Teaching Schedule</h2>

            {[...byDay.entries()].map(([day, dayClasses]) => {
              const colorClass = DAY_COLORS[day] ?? 'bg-gray-50 border-gray-200 text-gray-700';

              return (
                <div key={day}>
                  {/* Day Header */}
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border text-sm font-bold mb-3 ${colorClass}`}>
                    {day}
                    <span className="font-normal opacity-70">— {dayClasses.length} class{dayClasses.length !== 1 ? 'es' : ''}</span>
                  </div>

                  {/* Classes for this day */}
                  <div className="space-y-3 pl-2 border-l-2 border-gray-200 ml-2">
                    {dayClasses.map(cls => (
                      <div key={cls.id} className="bg-white rounded-2xl border border-gray-200 p-5 ml-4 hover:border-[#F59E0B] hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Subject badge + section */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2.5 py-1 bg-amber-50 text-[#F59E0B] text-xs font-bold rounded-lg">
                                {cls.subject.code}
                              </span>
                              <span className="text-xs text-gray-500 font-medium">Section {cls.section}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">{cls.subject.semester} {cls.subject.school_year}</span>
                            </div>

                            {/* Subject name */}
                            <h3 className="text-base font-bold text-gray-900 mb-3">{cls.subject.name}</h3>

                            {/* Schedule details */}
                            <div className="flex flex-wrap gap-4">
                              {cls.schedule && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span>{cls.schedule}</span>
                                </div>
                              )}
                              {cls.room && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>{cls.room}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>{cls.enrolled_count} / {cls.max_students} students</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <BookOpen className="w-4 h-4 text-gray-400" />
                                <span>{cls.subject.units} units</span>
                              </div>
                            </div>
                          </div>

                          {/* Enrollment fill bar */}
                          <div className="w-28 flex-shrink-0 text-right">
                            <p className="text-xs text-gray-500 mb-1.5">
                              {Math.round((cls.enrolled_count / cls.max_students) * 100)}% full
                            </p>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#F59E0B] rounded-full transition-all"
                                style={{ width: `${Math.min((cls.enrolled_count / cls.max_students) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
