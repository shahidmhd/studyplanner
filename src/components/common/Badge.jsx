const difficultyColors = {
  Easy: 'badge-easy',
  Medium: 'badge-medium',
  Hard: 'badge-hard',
};

export default function Badge({ label, variant = 'default' }) {
  const cls = difficultyColors[label] || 'badge-default';
  return <span className={`badge ${cls}`}>{label}</span>;
}
