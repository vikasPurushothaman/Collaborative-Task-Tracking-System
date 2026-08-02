import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { openCommandPalette, openShortcutsModal, toggleTheme } from '../store/slices/uiSlice';
import { openModal } from '../store/slices/uiSlice';

export function useKeyboardShortcuts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === 'k') { e.preventDefault(); dispatch(openCommandPalette()); }
      if (ctrl && e.key === '/') { e.preventDefault(); dispatch(openCommandPalette()); }
      if (ctrl && e.shiftKey && e.key === 'L') { e.preventDefault(); dispatch(toggleTheme()); }
      if (ctrl && e.key === 'n') { e.preventDefault(); dispatch(openModal('createTask')); }
      if (e.key === '?' && !e.ctrlKey) { dispatch(openShortcutsModal()); }

      // G + key navigation (sequential)
      if (e.key === 'g' && !ctrl) {
        window._gPressed = true;
        setTimeout(() => { window._gPressed = false; }, 1000);
        return;
      }
      if (window._gPressed) {
        switch (e.key) {
          case 'd': navigate('/dashboard'); break;
          case 't': navigate('/tasks'); break;
          case 'p': navigate('/projects'); break;
          case 'a': navigate('/analytics'); break;
          case 'c': navigate('/calendar'); break;
        }
        window._gPressed = false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, navigate]);
}
