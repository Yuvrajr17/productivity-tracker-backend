import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
  const { token } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
  }, [page]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`/api/users/leaderboard/page?page=${page}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaderboard(response.data.leaderboard);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const getRankMedal = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '•';
    }
  };

  return (
    <div className="leaderboard-page">
      <div className="container">
        <h1>🏆 Global Leaderboard</h1>

        {loading ? (
          <div className="loading">Loading leaderboard...</div>
        ) : (
          <>
            <div className="leaderboard-table">
              <div className="table-header">
                <div className="col-rank">Rank</div>
                <div className="col-user">User</div>
                <div className="col-xp">Total XP</div>
                <div className="col-level">Level</div>
                <div className="col-streak">Streak</div>
                <div className="col-tasks">Tasks</div>
                <div className="col-badges">Badges</div>
              </div>

              <div className="table-body">
                {leaderboard.map((user) => (
                  <div key={user._id} className={`table-row ${user.rank <= 3 ? 'top-rank' : ''}`}>
                    <div className="col-rank">
                      <span className="rank-medal">{getRankMedal(user.rank)}</span>
                      <span className="rank-number">#{user.rank}</span>
                    </div>
                    <div className="col-user">
                      <div className="user-avatar">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.username} />
                        ) : (
                          <span className="avatar-placeholder">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="username">{user.username}</span>
                    </div>
                    <div className="col-xp">
                      <span className="xp-value">⭐ {user.totalXP}</span>
                    </div>
                    <div className="col-level">
                      <span className="level-badge">📈 {user.level}</span>
                    </div>
                    <div className="col-streak">
                      <span className="streak-badge">🔥 {user.currentStreak}</span>
                    </div>
                    <div className="col-tasks">
                      <span className="tasks-value">{user.totalTasksCompleted}</span>
                    </div>
                    <div className="col-badges">
                      <span className="badges-value">{user.badges ? user.badges.length : 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
