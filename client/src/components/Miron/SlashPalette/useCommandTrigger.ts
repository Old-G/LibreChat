import { useEffect } from 'react';

const isMac = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return /Mac|iPhone|iPod|iPad/i.test(navigator.platform);
};

const matchesShortcut = (event: KeyboardEvent): boolean => {
  if (event.key !== '/') {
    return false;
  }
  if (event.repeat) {
    return false;
  }
  return isMac() ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
};

export default function useCommandTrigger(open: boolean, setOpen: (value: boolean) => void): void {
  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (!matchesShortcut(event)) {
        return;
      }
      event.preventDefault();
      setOpen(!open);
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [open, setOpen]);
}
