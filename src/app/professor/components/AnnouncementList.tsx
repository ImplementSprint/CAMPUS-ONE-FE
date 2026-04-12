'use client'
import { useState, useEffect } from "react";
import { Bell, Plus, Edit2, Trash2, Pin, PinOff, Save, X } from "lucide-react";
import {
  getClassAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement,
} from "../services/professor.service";

interface AnnouncementListProps {
  classId: string;
  professorId: string;
}

export function AnnouncementList({ classId, professorId }: AnnouncementListProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    announcement_type: "general",
    is_pinned: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, [classId]);

  const loadAnnouncements = async () => {
    setLoading(true);
    const result = await getClassAnnouncements(classId);
    if (result.data) {
      setAnnouncements(result.data);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setShowForm(true);
    setEditingId(null);
    setForm({
      title: "",
      content: "",
      announcement_type: "general",
      is_pinned: false,
    });
  };

  const handleEdit = (announcement: Announcement) => {
    setShowForm(true);
    setEditingId(announcement.id);
    setForm({
      title: announcement.title,
      content: announcement.content,
      announcement_type: announcement.announcement_type,
      is_pinned: announcement.is_pinned,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      title: "",
      content: "",
      announcement_type: "general",
      is_pinned: false,
    });
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;

    setSaving(true);
    if (editingId) {
      await updateAnnouncement(editingId, form);
    } else {
      await createAnnouncement(classId, professorId, form);
    }
    await loadAnnouncements();
    handleCancel();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await deleteAnnouncement(id);
    await loadAnnouncements();
  };

  const handleTogglePin = async (announcement: Announcement) => {
    await updateAnnouncement(announcement.id, {
      is_pinned: !announcement.is_pinned,
    });
    await loadAnnouncements();
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="text-sm text-gray-600 mt-3">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">
          Announcements ({announcements.length})
        </h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#F59E0B] text-white rounded-lg text-xs font-medium hover:bg-[#F59E0B]/90"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {editingId ? "Edit Announcement" : "New Announcement"}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                placeholder="Announcement title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                placeholder="Announcement content"
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pin"
                checked={form.is_pinned}
                onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                className="w-4 h-4 text-[#F59E0B] rounded focus:ring-[#F59E0B]"
              />
              <label htmlFor="pin" className="text-xs text-gray-700">
                Pin this announcement
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim() || !form.content.trim()}
                className="flex-1 bg-[#F59E0B] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#F59E0B]/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900 mb-1">No Announcements</p>
          <p className="text-xs text-gray-600">Create your first announcement for this class.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white rounded-xl p-4 border ${
                announcement.is_pinned ? "border-[#F59E0B]" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {announcement.is_pinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded text-xs font-bold mb-2">
                      <Pin className="w-3 h-3" />
                      Pinned
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-gray-900">{announcement.title}</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleTogglePin(announcement)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {announcement.is_pinned ? (
                      <PinOff className="w-4 h-4" />
                    ) : (
                      <Pin className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-1.5 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-700 mb-2 whitespace-pre-wrap">
                {announcement.content}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(announcement.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
