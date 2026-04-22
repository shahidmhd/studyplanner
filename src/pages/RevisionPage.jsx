import { useDispatch, useSelector } from 'react-redux';
import { updateReview, removeFromQueue } from '../store/revisionSlice';
import { today, formatDate } from '../utils';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function RevisionPage() {
  const dispatch = useDispatch();
  const { queue } = useSelector((s) => s.revision);

  const dueToday = queue.filter((item) => item.nextReview <= today());
  const upcoming = queue.filter((item) => item.nextReview > today()).sort((a, b) => a.nextReview.localeCompare(b.nextReview));

  const handleReview = (id, difficulty) => {
    dispatch(updateReview({ id, difficulty }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Revision Queue</h1>
          <p className="page-subtitle">Spaced repetition keeps knowledge fresh</p>
        </div>
        <div className="revision-stats">
          <span className="stat-chip due">{dueToday.length} due today</span>
          <span className="stat-chip upcoming">{upcoming.length} upcoming</span>
        </div>
      </div>

      {dueToday.length > 0 && (
        <section>
          <h2 className="section-title">📌 Due Today</h2>
          <div className="revision-list">
            {dueToday.map((item) => (
              <div key={item.id} className="revision-card due">
                <div className="revision-info">
                  <p className="revision-topic">{item.topicName}</p>
                  <p className="revision-subject">{item.subjectName}</p>
                  <Badge label={item.difficulty} />
                  <span className="review-count">Reviewed {item.reviewCount}×</span>
                </div>
                <div className="revision-actions">
                  <p className="revision-prompt">How well did you recall?</p>
                  <div className="recall-btns">
                    <button className="recall-btn easy" onClick={() => handleReview(item.id, 'Easy')}>Easy (+7d)</button>
                    <button className="recall-btn medium" onClick={() => handleReview(item.id, 'Medium')}>Medium (+3d)</button>
                    <button className="recall-btn hard" onClick={() => handleReview(item.id, 'Hard')}>Hard (+1d)</button>
                  </div>
                  <button className="remove-btn" onClick={() => dispatch(removeFromQueue(item.id))}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="section-title">📅 Upcoming Reviews</h2>
          <div className="revision-list">
            {upcoming.map((item) => (
              <div key={item.id} className="revision-card">
                <div className="revision-info">
                  <p className="revision-topic">{item.topicName}</p>
                  <p className="revision-subject">{item.subjectName}</p>
                  <Badge label={item.difficulty} />
                </div>
                <div className="revision-meta">
                  <p className="next-review">📅 {formatDate(item.nextReview)}</p>
                  <span className="review-count">Reviewed {item.reviewCount}×</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {queue.length === 0 && (
        <div className="empty-state">
          <p>🔁 No revision items yet.</p>
          <p>Complete tasks in the planner to add topics to your revision queue.</p>
        </div>
      )}
    </div>
  );
}
