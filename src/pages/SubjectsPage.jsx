import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubject, updateSubject, deleteSubject, addTopic, updateTopic, deleteTopic } from '../store/subjectsSlice';
import { DIFFICULTY } from '../constants';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

function TopicRow({ topic, subjectId, onEdit, onDelete }) {
  return (
    <div className="topic-row">
      <div className="topic-info">
        <span className="topic-name">{topic.name}</span>
        <Badge label={topic.difficulty} />
      </div>
      <div className="topic-actions">
        <button className="icon-btn" onClick={() => onEdit(topic)}>✏️</button>
        <button className="icon-btn danger" onClick={() => onDelete(subjectId, topic.id)}>🗑️</button>
      </div>
    </div>
  );
}

function TopicModal({ subjectId, topic, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: topic?.name || '', difficulty: topic?.difficulty || 'Medium' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic) {
      dispatch(updateTopic({ subjectId, topicId: topic.id, ...form }));
    } else {
      dispatch(addTopic({ subjectId, ...form }));
    }
    onClose();
  };

  return (
    <Modal title={topic ? 'Edit Topic' : 'Add Topic'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Topic Name</label>
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label>Difficulty</label>
          <select value={form.difficulty} onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}>
            {Object.values(DIFFICULTY).map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-actions">
          <Button type="submit" variant="primary">{topic ? 'Save' : 'Add Topic'}</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

function SubjectCard({ subject }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(subject.name);
  const [topicModal, setTopicModal] = useState(null);

  const handleSaveName = () => {
    dispatch(updateSubject({ id: subject.id, name: editName }));
    setEditing(false);
  };

  return (
    <div className="subject-card">
      <div className="subject-header" style={{ borderLeftColor: subject.color }}>
        <div className="subject-title-row">
          {editing ? (
            <div className="inline-edit">
              <input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
              <button className="icon-btn" onClick={handleSaveName}>✓</button>
              <button className="icon-btn" onClick={() => setEditing(false)}>✕</button>
            </div>
          ) : (
            <h3 className="subject-name" style={{ color: subject.color }}>{subject.name}</h3>
          )}
          <div className="subject-actions">
            <span className="topic-count">{subject.topics.length} topics</span>
            <button className="icon-btn" onClick={() => setEditing(true)}>✏️</button>
            <button className="icon-btn danger" onClick={() => dispatch(deleteSubject(subject.id))}>🗑️</button>
            <button className="icon-btn" onClick={() => setExpanded((v) => !v)}>{expanded ? '▲' : '▼'}</button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="subject-body">
          {subject.topics.length === 0 && (
            <p className="empty-hint">No topics yet. Add your first topic!</p>
          )}
          {subject.topics.map((t) => (
            <TopicRow
              key={t.id}
              topic={t}
              subjectId={subject.id}
              onEdit={(topic) => setTopicModal(topic)}
              onDelete={(sid, tid) => dispatch(deleteTopic({ subjectId: sid, topicId: tid }))}
            />
          ))}
          <Button variant="outline" size="sm" onClick={() => setTopicModal('new')}>+ Add Topic</Button>
        </div>
      )}

      {topicModal && (
        <TopicModal
          subjectId={subject.id}
          topic={topicModal === 'new' ? null : topicModal}
          onClose={() => setTopicModal(null)}
        />
      )}
    </div>
  );
}

export default function SubjectsPage() {
  const dispatch = useDispatch();
  const subjects = useSelector((s) => s.subjects.subjects);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      dispatch(addSubject({ name: newSubjectName.trim() }));
      setNewSubjectName('');
      setShowAddSubject(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Subjects & Topics</h1>
          <p className="page-subtitle">Organize your study material</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddSubject(true)}>+ Add Subject</Button>
      </div>

      <div className="subjects-grid">
        {subjects.map((s) => <SubjectCard key={s.id} subject={s} />)}
        {subjects.length === 0 && (
          <div className="empty-state">
            <p>📚 No subjects yet.</p>
            <p>Add a subject to get started!</p>
          </div>
        )}
      </div>

      {showAddSubject && (
        <Modal title="Add Subject" onClose={() => setShowAddSubject(false)}>
          <form onSubmit={handleAddSubject} className="form">
            <div className="form-group">
              <label>Subject Name</label>
              <input
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g. Mathematics"
                autoFocus
                required
              />
            </div>
            <div className="form-actions">
              <Button type="submit" variant="primary">Add Subject</Button>
              <Button variant="ghost" onClick={() => setShowAddSubject(false)}>Cancel</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
