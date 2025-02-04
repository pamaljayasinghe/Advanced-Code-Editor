import React from "react";
import { User } from "lucide-react";

export default function UsersPanel({ users = [], isCollapsed, onToggle }) {
  return (
    <div className={`users-drawer ${isCollapsed ? "collapsed" : ""}`}>
      <div className="users-header" onClick={onToggle}>
        <div className="users-title">
          <User size={20} />
          <span>Active Users ({users.length})</span>
        </div>
        <button className="collapse-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`collapse-icon ${isCollapsed ? "" : "rotated"}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div className="users-content">
        <div className="user-list">
          {users.map((user, index) => (
            <div key={user.id || index} className="user-item">
              <div className="user-status"></div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-status-text">Online</span>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="user-item-empty">
              <em>No other users online</em>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
