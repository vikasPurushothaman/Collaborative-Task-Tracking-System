import { createSlice } from '@reduxjs/toolkit';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('theme');

const initialState = {
  theme: storedTheme || (prefersDark ? 'dark' : 'light'),
  sidebarOpen: true,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  shortcutsModalOpen: false,
  searchQuery: '',
  activeModal: null,
  notifications: { panelOpen: false },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      document.documentElement.classList.toggle('dark', action.payload === 'dark');
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen: (state, action) => { state.sidebarOpen = action.payload; },
    toggleSidebarCollapse: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed; },
    openCommandPalette: (state) => { state.commandPaletteOpen = true; },
    closeCommandPalette: (state) => { state.commandPaletteOpen = false; },
    openShortcutsModal: (state) => { state.shortcutsModalOpen = true; },
    closeShortcutsModal: (state) => { state.shortcutsModalOpen = false; },
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    openModal: (state, action) => { state.activeModal = action.payload; },
    closeModal: (state) => { state.activeModal = null; },
    toggleNotificationsPanel: (state) => { state.notifications.panelOpen = !state.notifications.panelOpen; },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarOpen, toggleSidebarCollapse, openCommandPalette, closeCommandPalette, openShortcutsModal, closeShortcutsModal, setSearchQuery, openModal, closeModal, toggleNotificationsPanel } = uiSlice.actions;
export default uiSlice.reducer;
