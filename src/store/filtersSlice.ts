import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '../types';

const initialState: FilterState = {
  search: '',
  minMpg: null,
  maxMpg: null,
  cylinders: null,
  origin: null,
  minYear: null,
  maxYear: null,
  sortBy: 'mpg',
  sortOrder: 'desc',
  page: 1,
  limit: 20,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setMpgRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.minMpg = action.payload.min;
      state.maxMpg = action.payload.max;
      state.page = 1;
    },
    setCylinders: (state, action: PayloadAction<number | null>) => {
      state.cylinders = action.payload;
      state.page = 1;
    },
    setOrigin: (state, action: PayloadAction<number | null>) => {
      state.origin = action.payload;
      state.page = 1;
    },
    setYearRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.minYear = action.payload.min;
      state.maxYear = action.payload.max;
      state.page = 1;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      return { ...initialState, page: 1 };
    },
  },
});

export const {
  setSearch,
  setMpgRange,
  setCylinders,
  setOrigin,
  setYearRange,
  setSorting,
  setPage,
  setLimit,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
