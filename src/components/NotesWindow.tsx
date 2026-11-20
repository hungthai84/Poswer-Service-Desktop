import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Pin, Plus, Search, StickyNote, Trash2, ArrowLeft } from 'lucide-react';
import { WindowFrame } from './WindowFrame';
import { FluentSystemIcon } from './FluentIcons';
import { LanguageId, UI_TEXT, WindowId } from '../data/desktopData';
import { TaskbarPositionId, TaskbarStyleId } from '../data/customization';

type NoteColorId = 'amber' | 'sky' | 'emerald' | 'violet' | 'rose';

interface NoteItem {
  id: string;
  title: string;
  content: string;
  color: NoteColorId;
  pinned: boolean;
  updatedAt: number;
}

interface NotesWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  language: LanguageId;
  taskbarPosition: TaskbarPositionId;
  taskbarStyle: TaskbarStyleId;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
}

const NOTES_STORAGE_KEY = 'win12-notes-app-items';

const NOTE_COLORS: { id: NoteColorId; dot: string; tint: string }[] = [
  { id: 'amber', dot: 'bg-amber-400', tint: 'border-l-amber-400 bg-amber-500/8' },
  { id: 'sky', dot: 'bg-sky-400', tint: 'border-l-sky-400 bg-sky-500/8' },
  { id: 'emerald', dot: 'bg-emerald-400', tint: 'border-l-emerald-400 bg-emerald-500/8' },
  { id: 'violet', dot: 'bg-violet-400', tint: 'border-l-violet-400 bg-violet-500/8' },
  { id: 'rose', dot: 'bg-rose-400', tint: 'border-l-rose-400 bg-rose-500/8' },
];

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Ghi chú nhanh Windows 12',
    content:
      '- Kiểm tra cài đặt thanh Taskbar mới\n- Thử ứng dụng Máy tính & Vẽ Paint\n- Lưu ý: Mọi ghi chú được lưu tự động trên trình duyệt.',
    color: 'amber',
    pinned: true,
    updatedAt: Date.now() - 1000 * 60 * 15,
  },
  {
    id: 'note-2',
    title: 'Ý tưởng giao diện Fluent',
    content:
      'Ưu tiên khoảng trắng thoáng, kính mờ Acrylic và phông chữ Play rõ nét trên cả nền Sáng và Tối.',
    color: 'sky',
    pinned: false,
    updatedAt: Date.now() - 1000 * 60 * 90,
  },
];

export const NotesWindow: React.FC<NotesWindowProps> = ({
  isOpen,
  isMinimized,
  zIndex,
  language,
  taskbarPosition,
  taskbarStyle,
  onFocus,
  onMinimize,
  onClose,
}) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const raw = localStorage.getItem(NOTES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as NoteItem[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return INITIAL_NOTES;
  });

  const [selectedId, setSelectedId] = useState<string>(() => notes[0]?.id ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [mobileShowEditor, setMobileShowEditor] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Ignore storage write error
    }
  }, [notes]);

  const sortedAndFiltered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...notes]
      .filter(
        (n) =>
          !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.updatedAt - a.updatedAt;
      });
  }, [notes, searchQuery]);

  const activeNote = notes.find((n) => n.id === selectedId) ?? sortedAndFiltered[0] ?? null;

  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: language === 'vi' ? 'Ghi chú mới' : 'Untitled note',
      content: '',
      color: 'amber',
      pinned: false,
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setMobileShowEditor(true);
  };

  const updateActiveNote = (patch: Partial<NoteItem>) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((item) =>
        item.id === activeNote.id ? { ...item, ...patch, updatedAt: Date.now() } : item
      )
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (selectedId === id) {
        setSelectedId(next[0]?.id ?? '');
      }
      return next;
    });
    setMobileShowEditor(false);
  };

  const handleCopyContent = async () => {
    if (!activeNote) return;
    const text = `${activeNote.title}\n\n${activeNote.content}`.trim();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  const formatTimestamp = (ts: number) =>
    new Date(ts).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });

  const activeColorMeta =
    NOTE_COLORS.find((c) => c.id === activeNote?.color) ?? NOTE_COLORS[0];
  const wordCount = activeNote?.content.trim()
    ? activeNote.content.trim().split(/\s+/).length
    : 0;
  const charCount = activeNote?.content.length ?? 0;

  return (
    <WindowFrame
      id="notes"
      title={UI_TEXT[language].apps.notesTitle}
      icon={<FluentSystemIcon type="notes" size={18} />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      zIndex={zIndex}
      width={760}
      height={540}
      initialOffset={{ x: -32, y: -10 }}
      taskbarPosition={taskbarPosition}
      taskbarStyle={taskbarStyle}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
    >
      <div className="flex h-full overflow-hidden">
        {/* Notes List Sidebar */}
        <aside
          className={`flex h-full w-full shrink-0 flex-col border-r border-[var(--win-border-subtle)] bg-black/3 sm:w-[255px] dark:bg-white/3 ${
            mobileShowEditor ? 'hidden sm:flex' : 'flex'
          }`}
        >
          <div className="space-y-2.5 border-b border-[var(--win-border-subtle)] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--win-text-secondary)] tabular-nums">
                {language === 'vi'
                  ? `${notes.length} ghi chú`
                  : `${notes.length} notes`}
              </span>
              <button
                type="button"
                onClick={handleCreateNote}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--win-accent-bright)] px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90"
              >
                <Plus size={14} />
                <span>{language === 'vi' ? 'Tạo mới' : 'New'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[var(--win-border-subtle)] bg-white/70 px-2.5 py-1.5 dark:bg-black/25">
              <Search size={13} className="shrink-0 text-[var(--win-text-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'vi' ? 'Tìm ghi chú...' : 'Search notes...'}
                className="w-full bg-transparent text-xs text-[var(--win-text-primary)] placeholder:text-[var(--win-text-secondary)] focus:outline-none"
              />
            </div>
          </div>

          <div className="win-scrollbar flex-1 space-y-1.5 overflow-y-auto p-2.5">
            {sortedAndFiltered.length === 0 ? (
              <div className="py-10 text-center text-xs text-[var(--win-text-secondary)]">
                {language === 'vi' ? 'Chưa có ghi chú phù hợp' : 'No matching notes'}
              </div>
            ) : (
              sortedAndFiltered.map((note) => {
                const isSelected = activeNote?.id === note.id;
                const colorMeta = NOTE_COLORS.find((c) => c.id === note.color) ?? NOTE_COLORS[0];
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(note.id);
                      setMobileShowEditor(true);
                    }}
                    className={`w-full rounded-xl border-l-[3px] p-2.5 text-left transition-all ${colorMeta.tint} ${
                      isSelected
                        ? 'ring-1 ring-[var(--win-accent)] shadow-xs'
                        : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-bold text-[var(--win-text-primary)]">
                        {note.title || (language === 'vi' ? 'Không tiêu đề' : 'Untitled')}
                      </span>
                      {note.pinned && (
                        <Pin size={11} className="shrink-0 text-[var(--win-accent)]" />
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[var(--win-text-secondary)]">
                      {note.content || (language === 'vi' ? 'Ghi chú trống...' : 'Empty note...')}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Note Editor Area */}
        <div
          className={`flex flex-1 flex-col overflow-hidden ${
            mobileShowEditor ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {activeNote ? (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--win-border-subtle)] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileShowEditor(false)}
                    aria-label="Back"
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-black/6 sm:hidden dark:hover:bg-white/10"
                  >
                    <ArrowLeft size={15} />
                  </button>

                  {/* Color tags */}
                  <div className="flex items-center gap-1.5">
                    {NOTE_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => updateActiveNote({ color: c.id })}
                        aria-label={`Color ${c.id}`}
                        className={`h-4 w-4 rounded-full ${c.dot} transition-transform ${
                          activeNote.color === c.id
                            ? 'scale-115 ring-2 ring-[var(--win-accent)] ring-offset-1'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateActiveNote({ pinned: !activeNote.pinned })}
                    title={language === 'vi' ? 'Ghim ghi chú' : 'Pin note'}
                    className={`flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium transition-colors ${
                      activeNote.pinned
                        ? 'bg-[var(--win-accent)]/15 text-[var(--win-accent)]'
                        : 'text-[var(--win-text-secondary)] hover:bg-black/6 dark:hover:bg-white/10'
                    }`}
                  >
                    <Pin size={13} />
                    <span className="hidden md:inline">
                      {activeNote.pinned
                        ? language === 'vi'
                          ? 'Đã ghim'
                          : 'Pinned'
                        : language === 'vi'
                        ? 'Ghim'
                        : 'Pin'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyContent}
                    title={language === 'vi' ? 'Sao chép' : 'Copy'}
                    className="flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium text-[var(--win-text-secondary)] hover:bg-black/6 hover:text-[var(--win-text-primary)] dark:hover:bg-white/10"
                  >
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    <span className="hidden md:inline">
                      {copied
                        ? language === 'vi'
                          ? 'Đã chép'
                          : 'Copied'
                        : language === 'vi'
                        ? 'Chép'
                        : 'Copy'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteNote(activeNote.id)}
                    title={language === 'vi' ? 'Xóa ghi chú' : 'Delete note'}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-500/12"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Accent stripe + Editable Title & Body */}
              <div className={`flex flex-1 flex-col overflow-hidden border-t-[3px] p-5 ${activeColorMeta.tint.split(' ')[0]}`}>
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateActiveNote({ title: e.target.value })}
                  placeholder={language === 'vi' ? 'Tiêu đề ghi chú...' : 'Note title...'}
                  className="w-full bg-transparent text-lg font-bold text-[var(--win-text-primary)] placeholder:text-[var(--win-text-secondary)] focus:outline-none"
                />

                <div className="mt-1 mb-3 text-[11px] text-[var(--win-text-secondary)] tabular-nums">
                  {language === 'vi' ? 'Cập nhật lúc' : 'Updated'} {formatTimestamp(activeNote.updatedAt)}
                </div>

                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateActiveNote({ content: e.target.value })}
                  placeholder={
                    language === 'vi'
                      ? 'Nhập nội dung ghi chú của bạn tại đây...'
                      : 'Start typing your note here...'
                  }
                  className="win-scrollbar w-full flex-1 resize-none bg-transparent text-sm leading-relaxed text-[var(--win-text-primary)] placeholder:text-[var(--win-text-secondary)] focus:outline-none"
                />
              </div>

              {/* Footer stats */}
              <div className="flex items-center justify-between border-t border-[var(--win-border-subtle)] px-4 py-2 text-[11px] text-[var(--win-text-secondary)] tabular-nums">
                <span>
                  {wordCount} {language === 'vi' ? 'từ' : 'words'} · {charCount}{' '}
                  {language === 'vi' ? 'ký tự' : 'chars'}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {language === 'vi' ? 'Đã lưu tự động' : 'Auto-saved'}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <StickyNote size={36} className="mb-3 text-[var(--win-accent)] opacity-60" />
              <p className="text-sm font-semibold text-[var(--win-text-primary)]">
                {language === 'vi' ? 'Chưa có ghi chú nào' : 'No notes yet'}
              </p>
              <button
                type="button"
                onClick={handleCreateNote}
                className="mt-3 rounded-xl bg-[var(--win-accent-bright)] px-4 py-2 text-xs font-semibold text-white"
              >
                {language === 'vi' ? 'Tạo ghi chú đầu tiên' : 'Create your first note'}
              </button>
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  );
};
