import { useCallback, useState } from 'react';
import { useDebouncedCallback } from './useDebouncedCallback';

export function useScrollToBottom(threshold = 100) {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const checkScroll = useCallback((el: HTMLDivElement) => {
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setShowScrollToBottom(!isNearBottom);
  }, [threshold]);

  const debouncedCheckScroll = useDebouncedCallback(checkScroll, 100);

  const onScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    debouncedCheckScroll(e.currentTarget);
  };

  return {
    showScrollToBottom,
    onScroll,
  };
}
