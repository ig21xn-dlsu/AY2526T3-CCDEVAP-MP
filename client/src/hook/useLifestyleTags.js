import { useCallback, useState } from 'react';

export function useLifestyleTags(initialSelectedIds = []) {
  const [selectedIds, setSelectedIds] = useState(() => new Set(initialSelectedIds));

  const toggleTag = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isSelected = useCallback((id) => selectedIds.has(id), [selectedIds]);

  return {
    selectedIds: Array.from(selectedIds),
    toggleTag,
    isSelected,
  };
}
