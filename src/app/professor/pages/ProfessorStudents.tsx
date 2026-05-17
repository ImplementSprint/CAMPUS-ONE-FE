'use client'
import { useState, useEffect } from 'react';
import { Search, BookOpen, ArrowRight, Users, ChevronDown, Mail, Hash } from 'lucide-react';
import { getCurrentUser } from '@/services/auth.service';
import {
  getProfessorClasses,
  getClassStudents,
  type ClassAssignment,
  type Enrollment,
} from '../services/professor.service';

export function ProfessorStudents() {
  const user = getCurrentUser();
  const [classes, setClasses] = useState<ClassAssignment[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassAssignment | null>(null);
  const [students, setStudents] = useState<Enrollment[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    getProfessorClasses(user.id).then(r => {
      if (r.data) { setClasses(r.data); setSelectedClass(r.data[0] ?? null); }
      setLoadingClasses(false);
    });
  }, [user?.id]);

  useEffect(() => {
    if (!selectedClass) return;
    setLoadingStudents(true);
    getClassStudents(selectedClass.id).then(r => {
      setStudents(r.data ?? []);
      setLoadingStudents(false);
    });
  }, [selectedClass]);

  const filtered = students.filter(e =>
    e.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.student.student_number.includes(searchQuery) ||
    e.student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingClasses) return <div className="flex items-center justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B]" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="text-sm text-gray-500 mt-1">View students enrolled in your classes</p>
      </div>

      {/* Class Selector + Search */}
      <div className="flex items-center gap-4">
        {/* Class Dropdown */}
        <div className="relative w-96">
          <button onClick={() => setShowDropdown(!showDropdown)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <p className="text-xs text-gray-500">Class</p>
              <p className="text-sm font-semibold text-gray-900">
                {selectedClass ? `${selectedClass.subject.code} — Section ${selectedClass.section}` : 'Select a class'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {classes.map(c => (
                <button key={c.id} onClick={() => { setSelectedClass(c); setShowDropdown(false); }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${selectedClass?.id === c.id ? 'text-[#F59E0B] font-semibold' : 'text-gray-700'}`}>
                  {c.subject.code} — {c.subject.name} (Section {c.section})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 h-[52px]">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Search by name, ID, or email..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent" />
        </div>
      </div>

      {/* Stats bar */}
      {selectedClass && !loadingStudents && (
        <div className="flex items-center gap-6 bg-white rounded-2xl border border-gray-200 px-6 py-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Enrolled Students</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{selectedClass.max_students}</p>
            <p className="text-xs text-gray-500 mt-0.5">Max Capacity</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div>
            <p className="text-2xl font-bold text-[#F59E0B]">{selectedClass.max_students - students.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Available Slots</p>
          </div>
        </div>
      )}

      {/* Student List */}
      {loadingStudents ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <Users className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-900 mb-2">{searchQuery ? 'No Students Found' : 'No Students Enrolled'}</p>
          <p className="text-sm text-gray-500">{searchQuery ? 'Try a different search term.' : 'This class has no enrolled students yet.'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-6 py-3.5 bg-gray-50 border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide w-8">#</span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Student ID</span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Enrolled</span>
          </div>

          {filtered.map((e, i) => (
            <div key={e.id} className={`grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center ${i < filtered.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
              <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#F59E0B]">{i + 1}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{e.student.name}</p>
              <p className="text-sm text-gray-600 font-mono">{e.student.student_number}</p>
              <p className="text-sm text-gray-600 truncate">{e.student.email}</p>
              <p className="text-xs text-gray-400 whitespace-nowrap">{new Date(e.enrolled_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
