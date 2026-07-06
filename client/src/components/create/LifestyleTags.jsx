export default function LifestyleTags({ options, isSelected, onToggle }) {
  if (!options.length) {
    return <p className="form-hint">No lifestyle tags available yet.</p>;
  }

  return (
    <div className="tag-group" id="lifestyle-tags">
      {options.map((tag) => (
        <button
          key={tag.id}
          type="button"
          className={`tag${isSelected(tag.id) ? ' tag--active' : ''}`}
          data-tag={tag.id}
          onClick={() => onToggle(tag.id)}
          aria-pressed={isSelected(tag.id)}
        >
          {tag.icon ? `${tag.icon} ` : ''}
          {tag.label}
        </button>
      ))}
    </div>
  );
}
