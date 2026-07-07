import React, { useState } from "react";
import {
  X,
  BookOpen,
  ChevronRight,
  Plus,
  Bookmark,
  Users,
  NotebookPen,
  UserPlus,
  LogOut,
  MessageSquare,
  Send
} from "lucide-react";
import { useReaderTheme } from "../context/ReaderThemeContext";
import BookmarksManager from "./bookmarks/BookmarksManager";

export default function ChapterSidebar({
  open,
  chapters,
  pageIndex,
  onClose,
  onSelectChapter,
  bookId,
  activeRoom,
  setActiveRoom,
  roomData,
  setRoomData,
  rooms,
  bookRooms,
  createRoom,
  joinRoom,
  inviteToken,
  inviteTokenInput,
  setInviteTokenInput,
  deleteRoom,
  acceptInvite,
  noteBody,
  setNoteBody,
  addNote,
  bookmarkLabel,
  setBookmarkLabel,
  addBookmark,
  totalPages,
  client,
  bookmarks,
  onBookmarksChanged,
  highlights = [],
  onDeleteHighlight,
  onSelectBlock,
  participants = [],
}) {
  const [activeTab, setActiveTab] = useState("chapters");
  const { theme, warmth } = useReaderTheme();
  
  const currentUser = JSON.parse(localStorage.getItem("libraryUser") || "{}");

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-zinc-950/20 dark:bg-zinc-950/50 transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 w-80 h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-out will-change-transform overflow-hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Warmth overlay shade */}
        <div
          className="warmth-overlay absolute inset-0 pointer-events-none z-50 transition-opacity duration-200"
          style={{ opacity: warmth / 100 }}
        />
        
        {/* Header Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 items-center justify-between relative z-10 bg-white dark:bg-zinc-900">
          <button
            onClick={() => setActiveTab("chapters")}
            className={`flex-1 py-4 text-center text-[10px] font-bold uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "chapters"
                ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-955 dark:text-white border-b border-zinc-200 dark:border-zinc-800 font-bold"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            Chapters
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-4 text-center text-[10px] font-bold uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "saved"
                ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-955 dark:text-white border-b border-zinc-200 dark:border-zinc-800 font-bold"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            Saved
          </button>

          <button
            onClick={() => setActiveTab("community")}
            className={`flex-1 py-4 text-center text-[10px] font-bold uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "community"
                ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-955 dark:text-white border-b border-zinc-200 dark:border-zinc-800 font-bold"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            Rooms
          </button>

          <button
            onClick={() => setActiveTab("discussion")}
            className={`flex-1 py-4 text-center text-[10px] font-bold uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "discussion"
                ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-955 dark:text-white border-b border-zinc-200 dark:border-zinc-800 font-bold"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            Chat
          </button>

          <button
            onClick={onClose}
            className="p-4 border-l border-zinc-200 dark:border-zinc-800 bg-transparent cursor-pointer text-zinc-500 hover:text-zinc-950 dark:hover:text-white focus:outline-none flex items-center justify-center h-full"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto relative z-10">
          {/* TAB 1: CHAPTERS */}
          {activeTab === "chapters" && (
            <>
              {chapters.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No chapters found
                </div>
              ) : (
                chapters.map((chapter, index) => {
                  const active = chapter.pageIndex === pageIndex;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        onSelectChapter(chapter.pageIndex);
                        onClose();
                      }}
                      className={`w-full text-left px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-transparent cursor-pointer transition-colors duration-150 rounded-none font-serif ${
                        active
                          ? "bg-zinc-100 text-zinc-955 dark:bg-zinc-900 dark:text-white font-bold"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-zinc-950 dark:text-zinc-300"
                      }`}
                    >
                      <div className="text-left">
                        <div className={`text-sm font-bold uppercase tracking-wider ${active ? "text-zinc-955 dark:text-white" : ""}`}>
                          {chapter.title}
                        </div>
                        <div className={`text-xs mt-1 font-sans ${active ? "text-zinc-650 dark:text-zinc-400" : "text-zinc-450 dark:text-zinc-500"}`}>
                          Page {chapter.pageIndex + 1}
                        </div>
                      </div>
                      <ChevronRight size={16} className={active ? "text-zinc-955 dark:text-white" : "text-zinc-400 dark:text-zinc-600"} />
                    </button>
                  );
                })
              )}
            </>
          )}

          {/* TAB 2: SAVED BOOKMARKS AND HIGHLIGHTS */}
          {activeTab === "saved" && (
            <div className="flex flex-col h-full divide-y divide-zinc-200 dark:divide-zinc-800">
              {/* Bookmarks Section */}
              <div className="flex flex-col p-4 gap-3 bg-zinc-50/50 dark:bg-zinc-900/10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-500 flex items-center gap-1.5">
                  <Bookmark size={12} /> Bookmarks
                </span>
                
                <BookmarksManager
                  bookId={bookId}
                  activeRoom={activeRoom}
                  pageIndex={pageIndex}
                  totalPages={totalPages}
                  client={client}
                  onGoToPage={(page) => {
                    onSelectChapter(page);
                    onClose();
                  }}
                  bookmarks={bookmarks}
                  onBookmarksChanged={onBookmarksChanged}
                />
              </div>

              {/* Highlights Section */}
              <div className="flex flex-col p-4 gap-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-500 flex items-center gap-1.5">
                  <Plus size={12} className="rotate-45" /> Highlights
                </span>

                {highlights.length === 0 ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-450 italic py-3 text-center">
                    No highlights created yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {highlights.map((hl) => {
                      const isOwner = hl.user_id === currentUser.id;
                      return (
                        <div
                          key={hl.id}
                          className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-850 flex flex-col gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-150"
                        >
                          <div className="flex items-center justify-between gap-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full border border-zinc-300 dark:border-zinc-700" style={{
                                backgroundColor: hl.color === "yellow" ? "#fef08a" : hl.color === "green" ? "#bbf7d0" : hl.color === "pink" ? "#fbcfe8" : hl.color === "blue" ? "#bfdbfe" : "transparent"
                              }} />
                              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                                {isOwner ? "My Highlight" : hl.user_name || "Friend's"}
                              </span>
                            </div>
                            
                            {isOwner && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteHighlight(hl.id);
                                }}
                                className="text-[10px] text-red-500 hover:text-red-400 font-bold border-none bg-transparent cursor-pointer hover:underline focus:outline-none"
                              >
                                Erase
                              </button>
                            )}
                          </div>
                          
                          <button
                            onClick={() => {
                              onSelectBlock(hl.block_index);
                              onClose();
                            }}
                            className="text-left font-serif text-xs italic text-zinc-800 dark:text-zinc-200 border-none bg-transparent cursor-pointer p-0 hover:text-zinc-955 dark:hover:text-white line-clamp-3 focus:outline-none leading-relaxed"
                            title="Go to highlight location"
                          >
                            "{hl.text}"
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY & ROOMS */}
          {activeTab === "community" && (
            <div className="flex flex-col gap-4 p-4 text-zinc-900 dark:text-zinc-100">
              {activeRoom ? (
                // Active Room
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-950 dark:text-white font-serif">
                        {roomData?.room?.name || "Reading Room"}
                      </h4>
                      <span className="text-[9px] text-zinc-550 font-semibold tracking-wider uppercase">
                        Collaborating Room
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setActiveRoom(null);
                          setRoomData(null);
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded bg-transparent cursor-pointer transition-all"
                        title="Leave Collaborative Room"
                      >
                        Leave
                      </button>
                      {roomData?.room?.created_by === currentUser.id && (
                        <button
                          onClick={() => deleteRoom(activeRoom)}
                          className="px-2.5 py-1 text-[10px] font-bold text-red-500 hover:text-red-450 border border-red-500/20 hover:border-red-500/40 rounded bg-transparent cursor-pointer transition-all"
                          title="Delete Collaborative Room"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Room Secret Code */}
                  <div className="flex flex-col gap-2.5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <UserPlus size={12} /> Room Secret Code
                    </label>
                    <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed">
                      Share this secret code with another reader to invite them to this room.
                    </p>
                    {inviteToken ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          readOnly
                          value={inviteToken}
                          className="flex-1 px-3 py-1.5 text-xs font-mono border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 rounded-lg text-zinc-950 dark:text-white select-all text-center tracking-wider font-bold"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(inviteToken);
                            alert("Room secret code copied to clipboard!");
                          }}
                          className="px-3 py-1.5 text-xs font-semibold bg-zinc-955 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-955 rounded-lg cursor-pointer border-none"
                        >
                          Copy
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400 italic">Generating secret...</span>
                    )}
                  </div>
                </div>
              ) : (
                // Inactive Room selection list
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
                      Reading Rooms
                    </h4>
                    
                    {bookRooms.length === 0 ? (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 italic py-2">
                        No active reading rooms for this book.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {bookRooms.map((room) => (
                          <div
                            key={room.id}
                            className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-850 flex items-center justify-between"
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-955 dark:text-white font-serif">
                                {room.name}
                              </span>
                              <span className="text-[9px] text-zinc-500">
                                {room.member_count} {room.member_count === 1 ? "member" : "members"}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => joinRoom(room.id)}
                                className="px-2.5 py-1 text-[10px] font-bold border border-zinc-950 hover:bg-zinc-950 hover:text-white dark:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-950 rounded transition-colors bg-transparent cursor-pointer text-zinc-955 dark:text-zinc-100"
                              >
                                Join
                              </button>
                              {room.created_by === currentUser.id && (
                                <button
                                  onClick={() => deleteRoom(room.id)}
                                  className="px-2.5 py-1 text-[10px] font-bold text-red-500 hover:text-red-450 border border-red-500/20 hover:border-red-500/40 rounded bg-transparent cursor-pointer transition-all"
                                  title="Delete Collaborative Room"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Create collaborative Room Form */}
                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col gap-3">
                    <h5 className="font-bold text-[10px] uppercase tracking-wider text-zinc-550">
                      Create collaborative room
                    </h5>
                    <button
                      onClick={createRoom}
                      className="w-full py-2 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 border-none"
                    >
                      <Plus size={14} /> Start Reading Room
                    </button>
                  </div>

                  {/* Join Room by Token */}
                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col gap-2.5">
                    <h5 className="font-bold text-[10px] uppercase tracking-wider text-zinc-550">
                      Join room via code
                    </h5>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste invitation code"
                        value={inviteTokenInput}
                        onChange={(e) => setInviteTokenInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs border border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg text-zinc-955 dark:text-white focus:outline-none"
                      />
                      <button
                        onClick={acceptInvite}
                        className="px-3 py-1.5 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-850 dark:bg-zinc-100 dark:text-zinc-955 dark:hover:bg-white rounded-lg cursor-pointer border-none"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DISCUSSION & NOTES */}
          {activeTab === "discussion" && (
            <div className="flex flex-col gap-4 p-4 text-zinc-900 dark:text-zinc-100">
              {activeRoom ? (
                <div className="flex flex-col gap-4 h-full">
                  {/* Add note/comment Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addNote(e);
                    }}
                    className="flex flex-col gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-800"
                  >
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">
                      Add comment on Page {pageIndex + 1}
                    </span>
                    <div className="flex gap-2 items-center">
                      <textarea
                        rows={2}
                        placeholder="Write note/comment..."
                        value={noteBody}
                        onChange={(e) => setNoteBody(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 rounded-lg text-zinc-950 dark:text-white resize-none"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-lg cursor-pointer flex items-center justify-center border-none h-8 w-8"
                        title="Post Comment"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </form>

                  {/* Comments Log */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare size={12} /> Discussion Board
                    </span>

                    {(!roomData?.notes || roomData.notes.length === 0) ? (
                      <p className="text-xs text-zinc-500 italic text-center py-5 dark:text-zinc-400">
                        No notes/comments posted yet.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3 animate-fade-in">
                        {roomData.notes.map((note) => {
                          const isCurrentPage = note.location === `Page ${pageIndex + 1}`;
                          return (
                            <div
                              key={note.id}
                              className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all duration-250 ${
                                isCurrentPage
                                  ? "bg-zinc-100/70 border-zinc-950/20 dark:bg-zinc-800/80 dark:border-zinc-700 border-l-4 border-l-zinc-950 dark:border-l-zinc-100"
                                  : "bg-white border-zinc-200 dark:bg-zinc-850 dark:border-zinc-800"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold text-zinc-955 dark:text-white">
                                  {note.user_name}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                  isCurrentPage
                                    ? "bg-zinc-955 dark:bg-zinc-100 text-white dark:text-zinc-955 font-bold"
                                    : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                                }`}>
                                  {note.location}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-750 dark:text-zinc-300 leading-relaxed font-sans select-text whitespace-pre-wrap">
                                {note.body}
                              </p>
                              <span className="text-[8px] text-zinc-400 font-semibold tracking-wider text-right uppercase">
                                {new Date(note.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic py-6 text-center">
                  Please join a Collaborative Reading Room to discuss and share comments.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Summary Info */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-150 bg-zinc-50 dark:bg-zinc-900/40 relative z-10 flex items-center justify-between">
          {activeTab === "chapters" && <span>{chapters.length} Chapters</span>}
          {activeTab === "saved" && <span>{bookmarks.length} Bookmarks • {highlights.length} Highlights</span>}
          {activeTab === "community" && <span>{activeRoom ? `${participants.length} Active Readers` : `${bookRooms.length} Rooms Available`}</span>}
          {activeTab === "discussion" && <span>{roomData?.notes?.length || 0} Shared Notes</span>}
          <span className="font-serif italic font-bold">Page {pageIndex + 1}</span>
        </div>
      </aside>
    </>
  );
}
