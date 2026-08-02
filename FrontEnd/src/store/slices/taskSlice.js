import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  viewMode: 'list',
  selectedIds: [],
  filters: { status: 'all', priority: 'all', search: '', projectId: '', assigneeId: '', teamId: '' },
  sort: { field: 'dueDate', direction: 'asc' },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setViewMode: (state, action) => { state.viewMode = action.payload; },
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    resetFilters: (state) => { state.filters = initialState.filters; },
    setSort: (state, action) => { state.sort = action.payload; },
    toggleSelect: (state, action) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) state.selectedIds = state.selectedIds.filter(i => i !== id);
      else state.selectedIds.push(id);
    },
    selectAll: (state, action) => { state.selectedIds = action.payload; },
    clearSelection: (state) => { state.selectedIds = []; },
  },
});

export const { setViewMode, setFilters, resetFilters, setSort, toggleSelect, selectAll, clearSelection } = taskSlice.actions;
export default taskSlice.reducer;
