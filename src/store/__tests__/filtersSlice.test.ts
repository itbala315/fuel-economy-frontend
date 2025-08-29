import filtersReducer, {
  setSearch,
  setMpgRange,
  setCylinders,
  setOrigin,
  setYearRange,
  setSorting,
  setPage,
  setLimit,
  resetFilters
} from '../filtersSlice';
import { FilterState } from '../../types';

describe('filtersSlice', () => {
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
    limit: 20
  };

  test('should return the initial state', () => {
    expect(filtersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle setSearch', () => {
    const actual = filtersReducer(initialState, setSearch('toyota'));
    expect(actual.search).toBe('toyota');
    expect(actual.page).toBe(1);
  });

  test('should handle setMpgRange', () => {
    const newRange = { min: 15, max: 30 };
    const actual = filtersReducer(initialState, setMpgRange(newRange));
    expect(actual.minMpg).toBe(15);
    expect(actual.maxMpg).toBe(30);
    expect(actual.page).toBe(1);
  });

  test('should handle setCylinders', () => {
    const actual = filtersReducer(initialState, setCylinders(4));
    expect(actual.cylinders).toBe(4);
    expect(actual.page).toBe(1);
  });

  test('should handle setOrigin', () => {
    const actual = filtersReducer(initialState, setOrigin(1));
    expect(actual.origin).toBe(1);
    expect(actual.page).toBe(1);
  });

  test('should handle setYearRange', () => {
    const yearRange = { min: 1970, max: 1980 };
    const actual = filtersReducer(initialState, setYearRange(yearRange));
    expect(actual.minYear).toBe(1970);
    expect(actual.maxYear).toBe(1980);
    expect(actual.page).toBe(1);
  });

  test('should handle setSorting', () => {
    const sorting = { sortBy: 'carName', sortOrder: 'asc' as const };
    const actual = filtersReducer(initialState, setSorting(sorting));
    expect(actual.sortBy).toBe('carName');
    expect(actual.sortOrder).toBe('asc');
    expect(actual.page).toBe(1);
  });

  test('should handle setPage', () => {
    const actual = filtersReducer(initialState, setPage(5));
    expect(actual.page).toBe(5);
  });

  test('should handle setLimit', () => {
    const actual = filtersReducer(initialState, setLimit(50));
    expect(actual.limit).toBe(50);
    expect(actual.page).toBe(1); // Should reset page when limit changes
  });

  test('should handle resetFilters', () => {
    const modifiedState: FilterState = {
      search: 'toyota',
      minMpg: 20,
      maxMpg: 30,
      cylinders: 4,
      origin: 1,
      minYear: 1970,
      maxYear: 1980,
      sortBy: 'carName',
      sortOrder: 'asc',
      page: 3,
      limit: 10
    };

    const actual = filtersReducer(modifiedState, resetFilters());
    expect(actual).toEqual({ ...initialState, page: 1 });
  });

  test('should handle multiple filter changes', () => {
    let state = filtersReducer(initialState, setOrigin(2));
    state = filtersReducer(state, setYearRange({ min: 1975, max: 1980 }));
    state = filtersReducer(state, setSorting({ sortBy: 'carName', sortOrder: 'asc' }));
    state = filtersReducer(state, setSearch('ford'));

    expect(state).toEqual({
      ...initialState,
      origin: 2,
      minYear: 1975,
      maxYear: 1980,
      sortBy: 'carName',
      sortOrder: 'asc',
      search: 'ford',
      page: 1
    });
  });

  test('should reset page to 1 when filters change', () => {
    const stateWithPage = { ...initialState, page: 5 };
    
    const afterSearch = filtersReducer(stateWithPage, setSearch('honda'));
    expect(afterSearch.page).toBe(1);
    
    const afterMpg = filtersReducer(stateWithPage, setMpgRange({ min: 20, max: 30 }));
    expect(afterMpg.page).toBe(1);
    
    const afterOrigin = filtersReducer(stateWithPage, setOrigin(2));
    expect(afterOrigin.page).toBe(1);
  });
});
