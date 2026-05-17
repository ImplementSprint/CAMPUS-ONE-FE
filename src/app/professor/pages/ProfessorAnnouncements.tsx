'use client'
import { useState, useEffect } from 'react';
import { Megaphone, Plus, Pencil, Trash2, Pin, PinOff, Save, X, ChevronDown } from 'lucide-react';
import { getCurrentUser } from '@/services/auth.service';
import {
  getProfessorClasses,
  getClassAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type ClassAssignment,
  type Announcement,
} from '../services/professor.service';

export function ProfessorAnnouncements() {
  const user = getCurrentUser();
  const [classes, setClasses] = useState<ClassAssignment[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassAssignment | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingAnn, setLoadingAnn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', announcement_type: 'general', is_pinned: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    getProfessorClasses(user.id).then(r => {
      if (r.data) { setClasses(r.data); setSelectedClass(r.data[0] ?? null); }
      setLoadingClasses(false);
    });
  }, [user?.id]);

  useEffect(() => {
    if (!selectedClass) return;
    setLoadingAnn(true);
    getClassAnnouncements(selectedClass.id).then(r => {
      setAnnouncements((r.data as Announcement[]) ?? []);
      setLoadingAnn(false);
    });
  }, [selectedClass]);

  const reload = () => {
    if (!selectedClass) return;
    getClassAnnouncements(selectedClass.id).then(r => setAnnouncements((r.data as Announcement[]) ?? []));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', content: '', announcement_type: 'general', is_pinned: false });
    setShowForm(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingId(a.id);
    setForm({ title: a.title, content: a.content, announcement_type: a.announcement_type, is_pinned: a.is_pinned });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim() || !selectedClass || !user?.id) return;
    setSaving(true);
    if (editingId) await updateAnnouncement(editingId, form);
    else await createAnnouncement(selectedClass.id, user.id, form);
    reload();
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    await deleteAnnouncement(id);
    reload();
  };

  const handleTogglePin = async (a: Announcement) => {
    await updateAnnouncement(a.id, { is_pinned: !a.is_pinned });
    reload();
  };

  if (loadingClasses) return <div className="flex items-center justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B]" /></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">Post and manage class announcements</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#F59E0B] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#d97706] transition-colors">
          <Plus className="w-4 h-4" /> Create
        </button>
      </div>

      {/* Class Selector */}
      <div className="relative w-80">
        <button onClick={() => setShowDropdown(!showDropdown)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="text-left">
            <p className="text-xs text-gray-500">Class</p>
            <p className="text-sm font-semibold text-gray-900">{selectedClass ? `${selectedClass.subject.code} — Section ${selectedClass.section}` : 'Select a class'}</p>
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

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900">{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="Announcement title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="Write your announcement..." rows={4} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_pinned} onChange={e => setForm({ ...form, is_pinned: e.target.checked })}
              className="w-4 h-4 text-[#F59E0B] rounded" />
            <span className="text-sm text-gray-700">Pin this announcement</span>
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.title.trim() || !form.content.trim()}
              className="flex items-center gap-2 bg-[#F59E0B] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#d97706] disabled:opacity-50 transition-colors">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-2 border border-gray-300 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Announcements List */}
      {loadingAnn ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" /></div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <Megaphone className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-900 mb-2">No Announcements Yet</p>
          <p className="text-sm text-gray-500">Create your first announcement for this class.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(a => (
            <div key={a.id} className={`bg-white rounded-2xl border p-6 ${a.is_pinned ? 'border-[#F59E0B]' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {a.is_pinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-[#F59E0B] rounded-lg text-xs font-bold mb-2">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <h3 className="text-base font-bold text-gray-900">{a.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">{a.content}</p>
                  <p className="text-xs text-gray-400 mt-3">{new Date(a.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleTogglePin(a)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                    {a.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-amber-50 transition-colors text-[#F59E0B]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
