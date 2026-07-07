import React, { useState, useEffect } from "react";
import {
  Users,
  NotebookPen,
  Bookmark,
  PanelRightOpen,
  PanelRightClose,
  Plus,
  Send,
  UserPlus,
  LogOut,
  MapPin,
  MessageSquare
} from "lucide-react";
import { useReaderTheme } from "../context/ReaderThemeContext";

export default function ReaderSidePanel({
  showPanel,
  setShowPanel,
  msg,
  activeRoom,
  roomData,
  rooms,
  bookRooms,
  createRoom,
  joinRoom,
  inviteEmail,
  setInviteEmail,
  inviteToken,
  createInvite,
  inviteTokenInput,
  setInviteTokenInput,
  acceptInvite,
  noteBody,
  setNoteBody,
  addNote,
  bookmarkLabel,
  setBookmarkLabel,
  addBookmark,
  pageIndex,
  setActiveRoom,
  setRoomData,
  participants = [],
}) {
  const [open, setOpen] = useState(false);
  const { theme, warmth } = useReaderTheme();
  
  const currentUser = JSON.parse(localStorage.getItem("libraryUser") || "{}");

  const handleCopyToken = () => {
    if (inviteToken) {
      navigator.clipboard.writeText(inviteToken);
      alert("Invitation token copied to clipboard!");
    }
  };

  return (
    <>
      {/* Vertical Dock */}
      <div
        className={`w-14 h-screen border-l flex flex-col items-center py-6 gap-5 flex-shrink-0 z-20 transition-colors duration-200 ${
          theme === "dark"
            ? "bg-zinc-900 border-zinc-800 text-zinc-100"
            : "bg-zinc-50 border-zinc-200 text-zinc-800"
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800 border-none bg-transparent"
          title={open ? "Close Panel" : "Open Panel"}
        >
          {open ? (
            <PanelRightClose size={20} className="text-zinc-700 dark:text-zinc-300" />
          ) : (
            <PanelRightOpen size={20} className="text-zinc-700 dark:text-zinc-300" />
          )}
        </button>

        <button
          onClick={() => {
            setShowPanel("room");
            setOpen(true);
          }}
          className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all border-none ${
            open && showPanel === "room"
              ? "bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-955 scale-105"
              : "bg-transparent text-zinc-650 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          }`}
          title="Rooms & Friends"
        >
          <Users size={19} />
        </button>

        <button
          onClick={() => {
            setShowPanel("notes");
            setOpen(true);
          }}
          className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all border-none ${
            open && showPanel === "notes"
              ? "bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-955 scale-105"
              : "bg-transparent text-zinc-650 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          }`}
          title="Shared Notes & Comments"
        >
          <NotebookPen size={19} />
        </button>

        <button
          onClick={() => {
            setShowPanel("bookmarks");
            setOpen(true);
          }}
          className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all border-none ${
            open && showPanel === "bookmarks"
              ? "bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-955 scale-105"
              : "bg-transparent text-zinc-650 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          }`}
          title="Room Bookmarks"
        >
          <Bookmark size={19} />
        </button>
      </div>

      {/* Sliding Panel */}
      {open && (
        <aside
          className={`w-80 border-l flex flex-col h-full overflow-hidden transition-all duration-300 relative z-20 ${
            theme === "dark"
              ? "bg-zinc-900 border-zinc-800 text-zinc-100"
              : "bg-white border-zinc-200 text-zinc-900"
          }`}
        >
          {/* Warmth overlay shade */}
          <div
            className="warmth-overlay absolute inset-0 pointer-events-none z-10 transition-opacity duration-200"
            style={{ opacity: warmth / 100 }}
          />

          {/* Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 relative z-20">
            <Tab
              active={showPanel === "room"}
              icon={<Users size={15} />}
              text="Rooms"
              onClick={() => setShowPanel("room")}
            />
            <Tab
              active={showPanel === "notes"}
              icon={<NotebookPen size={15} />}
              text="Notes"
              onClick={() => setShowPanel("notes")}
            />
            <Tab
              active={showPanel === "bookmarks"}
              icon={<Bookmark size={15} />}
              text="Bookmarks"
              onClick={() => setShowPanel("bookmarks")}
            />
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 relative z-20 flex flex-col gap-5">
            {msg && (
              <div className="p-3 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-750">
                {msg}
              </div>
            )}

            {/* TAB 1: ROOMS */}
            {showPanel === "room" && (
              <div className="flex flex-col gap-5">
                {activeRoom ? (
                  // Room details and active collaboration
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-850">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-950 dark:text-white">
                          {roomData?.room?.name || "Reading Room"}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
                          Active Room
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveRoom(null);
                          setRoomData(null);
                        }}
                        className="p-2 text-red-500 hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg border-none bg-transparent cursor-pointer"
                        title="Leave Room"
                      >
                        <LogOut size={16} />
                      </button>
                    </div>

                    {/* Invite Friend form */}
                    <div className="flex flex-col gap-2.5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <UserPlus size={12} /> Invite Friend
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Friend's email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg text-zinc-950 dark:text-white"
                        />
                        <button
                          onClick={createInvite}
                          className="px-3 py-1.5 text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-955 rounded-lg cursor-pointer border-none"
                        >
                          Invite
                        </button>
                      </div>
                      {inviteToken && (
                        <div className="mt-2 flex flex-col gap-1">
                          <span className="text-[10px] text-zinc-500 font-semibold uppercase">
                            Invite Code:
                          </span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={inviteToken}
                              className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 rounded text-zinc-500 select-all"
                            />
                            <button
                              onClick={handleCopyToken}
                              className="px-2 py-1 text-[10px] font-bold border border-zinc-300 dark:border-zinc-700 rounded bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Presence list */}
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <MapPin size={12} /> Friends Online
                      </label>

                      {participants.length <= 1 ? (
                        <p className="text-xs text-zinc-500 italic dark:text-zinc-400 py-3 text-center">
                          Waiting for friends to join...
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {participants
                            .filter((p) => p.id !== currentUser.id)
                            .map((p) => {
                              const isSamePage = p.page_index === pageIndex;
                              return (
                                <div
                                  key={p.id}
                                  className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                                    isSamePage
                                      ? "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
                                      : "bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-750"
                                  }`}
                                >
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                                      {p.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-medium">
                                      {p.email}
                                    </span>
                                  </div>
                                  <div className="text-right flex flex-col items-end gap-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                      isSamePage
                                        ? "bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                                        : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                                    }`}>
                                      Page {p.page_index + 1}
                                    </span>
                                    {isSamePage && (
                                      <span className="text-[8px] uppercase tracking-wider text-green-700 dark:text-green-400 font-black">
                                        reading this page
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Room selection and joining
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Reading Rooms
                      </h4>
                      
                      {bookRooms.length === 0 ? (
                        <p className="text-xs text-zinc-550 dark:text-zinc-400 italic py-2">
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
                                <span className="text-xs font-bold text-zinc-955 dark:text-white">
                                  {room.name}
                                </span>
                                <span className="text-[9px] text-zinc-500">
                                  {room.member_count} {room.member_count === 1 ? "member" : "members"}
                                </span>
                              </div>
                              <button
                                onClick={() => joinRoom(room.id)}
                                className="px-2.5 py-1 text-[10px] font-bold border border-zinc-950 hover:bg-zinc-950 hover:text-white dark:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-950 rounded transition-colors bg-transparent cursor-pointer text-zinc-955 dark:text-zinc-100"
                              >
                                Join
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Create Room Form */}
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col gap-3">
                      <h5 className="font-bold text-[10px] uppercase tracking-wider text-zinc-500">
                        Create collaborative room
                      </h5>
                      <button
                        onClick={createRoom}
                        className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 border-none"
                      >
                        <Plus size={14} /> Start Reading Room
                      </button>
                    </div>

                    {/* Accept invite code */}
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col gap-2.5">
                      <h5 className="font-bold text-[10px] uppercase tracking-wider text-zinc-500">
                        Join room via code
                      </h5>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste invitation code"
                          value={inviteTokenInput}
                          onChange={(e) => setInviteTokenInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border border-zinc-350 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg text-zinc-950 dark:text-white"
                        />
                        <button
                          onClick={acceptInvite}
                          className="px-3 py-1.5 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white rounded-lg cursor-pointer border-none"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: NOTES & COMMENTS */}
            {showPanel === "notes" && (
              <div className="flex flex-col gap-4">
                {activeRoom ? (
                  <div className="flex flex-col gap-4 h-full">
                    {/* Add note/comment Form */}
                    <form onSubmit={addNote} className="flex flex-col gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-850">
                      <span className="text-[10px] text-zinc-550 font-bold uppercase">
                        Add comment on Page {pageIndex + 1}
                      </span>
                      <div className="flex gap-2 items-end">
                        <textarea
                          rows={2}
                          placeholder="Write something..."
                          value={noteBody}
                          onChange={(e) => setNoteBody(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg text-zinc-950 dark:text-white resize-none"
                        />
                        <button
                          type="submit"
                          className="p-2.5 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-lg cursor-pointer flex items-center justify-center border-none"
                          title="Post Comment"
                        >
                          <Send size={15} />
                        </button>
                      </div>
                    </form>

                    {/* Shared Comments Log */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare size={12} /> Discussion Board
                      </span>

                      {(!roomData?.notes || roomData.notes.length === 0) ? (
                        <p className="text-xs text-zinc-555 italic text-center py-5 dark:text-zinc-400">
                          No notes on this book yet. Start the conversation!
                        </p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {roomData.notes.map((note) => {
                            const isCurrentPage = note.location === `Page ${pageIndex + 1}`;
                            return (
                              <div
                                key={note.id}
                                className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all duration-200 ${
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
                                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans select-text whitespace-pre-wrap">
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
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 italic py-6 text-center">
                    Please join a Collaborative Reading Room to discuss and share comments with friends.
                  </p>
                )}
              </div>
            )}

            {/* TAB 3: BOOKMARKS */}
            {showPanel === "bookmarks" && (
              <div className="flex flex-col gap-4">
                {activeRoom ? (
                  <div className="flex flex-col gap-4">
                    {/* Add Room Bookmark form */}
                    <form onSubmit={addBookmark} className="flex flex-col gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                      <span className="text-[10px] text-zinc-550 font-bold uppercase">
                        Create Bookmark for Page {pageIndex + 1}
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Label (e.g. Chapter 2 Summary)"
                          value={bookmarkLabel}
                          onChange={(e) => setBookmarkLabel(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg text-zinc-955 dark:text-white"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white rounded-lg cursor-pointer border-none"
                        >
                          Add
                        </button>
                      </div>
                    </form>

                    {/* Shared bookmarks list */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                        Shared Bookmarks
                      </span>

                      {(!roomData?.bookmarks || roomData.bookmarks.length === 0) ? (
                        <p className="text-xs text-zinc-550 italic text-center py-5 dark:text-zinc-450">
                          No room bookmarks created.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {roomData.bookmarks.map((bm) => (
                            <div
                              key={bm.id}
                              className="p-3 border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-850 rounded-xl flex items-center justify-between"
                            >
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-zinc-955 dark:text-white">
                                  {bm.label}
                                </span>
                                <span className="text-[9px] text-zinc-500">
                                  {bm.location} by {bm.user_name}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 italic py-6 text-center">
                    Please join a Collaborative Reading Room to view and manage shared bookmarks.
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}

function Tab({ active, icon, text, onClick }) {
  const { theme } = useReaderTheme();
  return (
    <button
      onClick={onClick}
      className={`flex-1 border-none py-3.5 cursor-pointer flex flex-col items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 focus:outline-none ${
        active
          ? theme === "dark"
            ? "bg-zinc-800/40 text-white border-b-2 border-white"
            : "bg-zinc-50 text-zinc-955 border-b-2 border-zinc-950"
          : "bg-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}