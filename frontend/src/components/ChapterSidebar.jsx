import React, { useState, useEffect, useRef } from "react";
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
  initialTab = "chapters",
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { theme, warmth } = useReaderTheme();

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  const currentUser = JSON.parse(localStorage.getItem("libraryUser") || "{}");
  const chatInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatScrollRef = useRef(null);
  const prevRoomIdRef = useRef(null);
  const prevTabRef = useRef(null);
  const prevNotesLengthRef = useRef(0);

  useEffect(() => {
    if (activeTab === "community" && activeRoom && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [activeTab, activeRoom, roomData]);

  useEffect(() => {
    if (activeTab === "community" && activeRoom && chatEndRef.current) {
      const currentNotesLength = roomData?.notes?.length || 0;
      const roomChanged = prevRoomIdRef.current !== activeRoom;
      const tabChanged = prevTabRef.current !== activeTab;
      const noteAdded = currentNotesLength > prevNotesLengthRef.current;
      
      const lastNote = roomData?.notes?.[currentNotesLength - 1];
      const sentByMe = lastNote && lastNote.user_id == currentUser.id;
      
      let isNearBottom = false;
      const scrollContainer = chatScrollRef.current;
      if (scrollContainer) {
        const threshold = 120; // px threshold
        isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < threshold;
      }
      
      if (roomChanged || tabChanged || (noteAdded && (sentByMe || isNearBottom))) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
      
      prevRoomIdRef.current = activeRoom;
      prevTabRef.current = activeTab;
      prevNotesLengthRef.current = currentNotesLength;
    }
  }, [roomData?.notes, activeTab, activeRoom, currentUser.id]);

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
        className={`fixed top-0 right-0 w-80 h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col z-50 transition-all duration-300 ease-out will-change-transform overflow-hidden ${
          open ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none"
        }`}
      >
        {/* Warmth overlay shade */}
        <div
          className="warmth-overlay absolute inset-0 pointer-events-none z-50 transition-opacity duration-200"
          style={{ opacity: warmth / 100 }}
        />
        
        {/* Header Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 items-center justify-between relative z-10 bg-white dark:bg-zinc-900 font-sans">
          <button
            onClick={() => setActiveTab("chapters")}
            className={`flex-1 py-4 text-center text-[10px] font-normal uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "chapters"
                ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-955 dark:text-white border-b border-zinc-200 dark:border-zinc-800 font-normal"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-955 dark:hover:text-white"
            }`}
          >
            Chapters
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-4 text-center text-[10px] font-normal uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "saved"
                ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-955 dark:text-white border-b border-zinc-200 dark:border-zinc-800 font-normal"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-955 dark:hover:text-white"
            }`}
          >
            Saved
          </button>

          <button
            onClick={() => setActiveTab("community")}
            className={`flex-1 py-4 text-center text-[10px] font-normal uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "community"
                ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-955 dark:text-white border-b border-zinc-200 dark:border-zinc-800 font-normal"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-955 dark:hover:text-white"
            }`}
          >
            Rooms
          </button>

          <button
            onClick={onClose}
            className="p-4 bg-transparent cursor-pointer text-zinc-500 hover:text-zinc-955 dark:hover:text-white focus:outline-none flex items-center justify-center h-full"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 flex flex-col min-h-0 relative z-10">
          {/* TAB 1: CHAPTERS */}
          {activeTab === "chapters" && (
            <div className="flex-1 overflow-y-auto min-h-0">
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
                      className={`w-full text-left px-5 py-4 flex flex-col bg-transparent cursor-pointer transition-colors duration-150 rounded-none font-serif ${
                        active
                          ? "bg-zinc-100 text-zinc-955 dark:bg-zinc-900 dark:text-white font-normal"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-zinc-955 dark:text-zinc-300"
                      }`}
                    >
                      <div className="text-left">
                        <div className={`text-sm font-normal uppercase tracking-wider ${active ? "text-zinc-955 dark:text-white" : ""}`}>
                          {chapter.title}
                        </div>
                        <div className={`text-xs mt-1 font-sans ${active ? "text-zinc-650 dark:text-zinc-400" : "text-zinc-450 dark:text-zinc-500"}`}>
                          Page {chapter.pageIndex + 1}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: SAVED BOOKMARKS AND HIGHLIGHTS */}
          {activeTab === "saved" && (
            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-6">
              {/* Bookmarks Section */}
               <div className="flex flex-col p-4 gap-3 bg-zinc-50/50 dark:bg-zinc-900/10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">
                  Bookmarks
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
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">
                  Highlights
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
                              <span className="text-[11px] font-normal font-sans lining-nums uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
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
                            className="text-left font-serif text-sm italic text-zinc-800 dark:text-zinc-200 border-none bg-transparent cursor-pointer p-0 hover:text-zinc-955 dark:hover:text-white line-clamp-3 focus:outline-none leading-relaxed"
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
            <div className="flex-1 flex flex-col min-h-0 p-4 text-zinc-900 dark:text-zinc-100">
              {activeRoom ? (
                // Active Room
                <div className="flex-1 flex flex-col min-h-0 gap-4">
                  <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-850 flex flex-col gap-2 transition-colors duration-150">
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-normal font-sans lining-nums uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                          Active Room
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setActiveRoom(null);
                            setRoomData(null);
                          }}
                          className="text-[10px] font-sans font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full px-2.5 py-0.5 cursor-pointer transition-colors duration-150 focus:outline-none"
                        >
                          Leave
                        </button>
                        {roomData?.room?.created_by == currentUser.id && (
                          <button
                            onClick={() => deleteRoom(activeRoom)}
                            className="text-[10px] font-sans font-medium text-red-500 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full px-2.5 py-0.5 cursor-pointer transition-colors duration-150 focus:outline-none"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-left font-serif text-xs italic text-zinc-805 dark:text-zinc-200 leading-relaxed">
                      {roomData?.room?.name || "Reading Room"}
                    </p>
                  </div>

                  {/* Discussion Board Title (Steady) */}
                  <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider flex items-center gap-1.5 px-0.5">
                    <MessageSquare size={12} /> Discussion Board
                  </span>

                  {/* Comments Log */}
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto min-h-0 pr-1 flex flex-col gap-2">

                    {(!roomData?.notes || roomData.notes.length === 0) ? (
                      <p className="text-xs text-zinc-500 italic text-center py-5 dark:text-zinc-400">
                        No notes/comments posted yet.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2 animate-fade-in">
                        {roomData.notes.map((note) => {
                          return (
                            <div
                              key={note.id}
                              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-800/80 flex flex-col gap-1 transition-all duration-250"
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-[11px] font-sans font-normal text-zinc-900 dark:text-zinc-305">
                                  {note.user_name}
                                </span>
                                <span className="text-[10.5px] font-sans font-normal px-1.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-650 dark:text-zinc-400">
                                  {note.location}
                                </span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-zinc-750 dark:text-zinc-300 leading-relaxed font-sans select-text whitespace-pre-wrap">
                                  {note.body}
                                </p>
                                <span className="text-[9.5px] font-mono text-zinc-400 dark:text-zinc-500 text-right uppercase tracking-tight">
                                  {new Date(note.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={chatEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Add note/comment Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addNote(e);
                    }}
                    className="flex flex-col gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto"
                  >
                    <div className="flex gap-2 items-center">
                      <textarea
                        ref={chatInputRef}
                        rows={2}
                        placeholder="Write note/comment..."
                        value={noteBody}
                        onChange={(e) => setNoteBody(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            addNote(e);
                          }
                        }}
                        className="flex-1 p-2 text-xs border border-zinc-355 dark:border-zinc-750 bg-white dark:bg-zinc-800 rounded-lg text-zinc-955 dark:text-white resize-none focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-955 rounded-lg cursor-pointer flex items-center justify-center border-none h-8 w-8 focus:outline-none"
                        title="Post Comment"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Inactive Room selection list
                <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-10">
                  {/* Create collaborative Room Form */}
                  <div className="flex flex-col gap-3">
                    <h5 className="font-bold text-[10px] uppercase tracking-wider text-zinc-550">
                      Create collaborative room
                    </h5>
                    <button
                      onClick={createRoom}
                      className="w-full py-2 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-950 dark:text-zinc-200 text-xs font-normal border border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
                    >
                      <Plus size={14} /> Start Reading Room
                    </button>
                  </div>

                  {/* Reading Rooms list */}
                  <div className="flex flex-col gap-6">
                    {/* Your Rooms */}
                    <div className="flex flex-col gap-2">
                      <h4 className="font-bold text-[10px] uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
                        Your Rooms
                      </h4>
                      {bookRooms.filter((room) => room.created_by == currentUser.id).length === 0 ? (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic py-2">
                          You haven't created any rooms for this book.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2.5">
                          {bookRooms.filter((room) => room.created_by == currentUser.id).map((room) => (
                            <div
                              key={room.id}
                              className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-850 flex flex-col gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-150"
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-normal font-sans lining-nums uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                                    {room.member_count} {room.member_count === 1 ? "member" : "members"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => joinRoom(room.id)}
                                    className="text-[10px] font-sans font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full px-2.5 py-0.5 cursor-pointer transition-colors duration-150 focus:outline-none"
                                  >
                                    Join
                                  </button>
                                  <button
                                    onClick={() => deleteRoom(room.id)}
                                    className="text-[10px] font-sans font-medium text-red-500 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full px-2.5 py-0.5 cursor-pointer transition-colors duration-150 focus:outline-none"
                                    title="Delete room"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>

                              <button
                                onClick={() => joinRoom(room.id)}
                                className="text-left font-serif text-xs italic text-zinc-800 dark:text-zinc-200 border-none bg-transparent cursor-pointer p-0 hover:text-zinc-955 dark:hover:text-white focus:outline-none leading-relaxed"
                                title="Join reading room"
                              >
                                {room.name}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Public Rooms */}
                    <div className="flex flex-col gap-2">
                      <h4 className="font-bold text-[10px] uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
                        Public Rooms
                      </h4>
                      {bookRooms.filter((room) => room.created_by != currentUser.id).length === 0 ? (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic py-2">
                          No other public rooms available.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2.5">
                          {bookRooms.filter((room) => room.created_by != currentUser.id).map((room) => (
                            <div
                              key={room.id}
                              className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-850 flex flex-col gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-150"
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-normal font-sans lining-nums uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                                    {room.member_count} {room.member_count === 1 ? "member" : "members"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => joinRoom(room.id)}
                                    className="text-[10px] font-sans font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full px-2.5 py-0.5 cursor-pointer transition-colors duration-150 focus:outline-none"
                                  >
                                    Join
                                  </button>
                                </div>
                              </div>

                              <button
                                onClick={() => joinRoom(room.id)}
                                className="text-left font-serif text-xs italic text-zinc-800 dark:text-zinc-200 border-none bg-transparent cursor-pointer p-0 hover:text-zinc-955 dark:hover:text-white focus:outline-none leading-relaxed"
                                title="Join reading room"
                              >
                                {room.name}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 text-[10px] font-normal font-sans lining-nums uppercase tracking-wider text-zinc-550 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40 relative z-10 flex items-center justify-between">
          {activeTab === "chapters" && <span>{chapters.length} Chapters</span>}
          {activeTab === "saved" && <span>{bookmarks.length} Bookmarks • {highlights.length} Highlights</span>}
          {activeTab === "community" && <span>{activeRoom ? `${participants.length} Active Readers` : `${bookRooms.length} Rooms Available`}</span>}
          {activeTab === "community" && activeRoom && <span>{roomData?.notes?.length || 0} Shared Notes</span>}
          <span className="font-sans italic">Page {pageIndex + 1}</span>
        </div>
      </aside>
    </>
  );
}
