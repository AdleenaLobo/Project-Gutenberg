import React, { useState } from "react";
import {
  Users,
  NotebookPen,
  Bookmark,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";

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
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Vertical Dock */}
      <div
        style={{
          width: "58px",
          height: "100vh",
          borderLeft: "1px solid #ddd",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
          flexShrink: 0,
        }}
      >
        <button onClick={() => setOpen(!open)} style={dockButton}>
          {open ? (
            <PanelRightClose size={22} color="black" />
          ) : (
            <PanelRightOpen size={22} color="black" />
          )}
        </button>

        <button
          onClick={() => {
            setShowPanel("room");
            setOpen(true);
          }}
          style={dockButton}
        >
          <Users size={20} color="black" />
        </button>

        <button
          onClick={() => {
            setShowPanel("notes");
            setOpen(true);
          }}
          style={dockButton}
        >
          <NotebookPen size={20} color="black" />
        </button>

        <button
          onClick={() => {
            setShowPanel("bookmarks");
            setOpen(true);
          }}
          style={dockButton}
        >
          <Bookmark size={20} color="black" />
        </button>
      </div>

      {/* Sliding Panel */}
      {open && (
        <aside
          style={{
            width: "320px",
            background: "#fff",
            borderLeft: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #eee",
            }}
          >
            <Tab
              active={showPanel === "room"}
              icon={<Users size={16} />}
              text="Rooms"
              onClick={() => setShowPanel("room")}
            />

            <Tab
              active={showPanel === "notes"}
              icon={<NotebookPen size={16} />}
              text="Notes"
              onClick={() => setShowPanel("notes")}
            />

            <Tab
              active={showPanel === "bookmarks"}
              icon={<Bookmark size={16} />}
              text="Bookmarks"
              onClick={() => setShowPanel("bookmarks")}
            />
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 20,
              color: "black",
            }}
          >
            {/* Existing room / notes / bookmark JSX */}
          </div>
        </aside>
      )}
    </>
  );
}
const dockButton = {
  width: 42,
  height: 42,
  border: "none",
  background: "transparent",
  color: "black",
  cursor: "pointer",
  borderRadius: 8,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

function Tab({ active, icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        border: "none",
        background: active ? "#f5f5f5" : "#fff",
        borderBottom: active ? "2px solid black" : "2px solid transparent",
        padding: "14px 8px",
        cursor: "pointer",
        color: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}