import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Car, Statistics, VisualizationData, CylinderData, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://fuel-economy-backend.onrender.com/api';

export const carsApi = createApi({
  reducerPath: 'carsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add any necessary headers
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Car', 'Statistics'],
  endpoints: (builder) => ({
    getCars: builder.query<ApiResponse<Car[]>, Record<string, any>>({
      query: (params) => ({
        url: '/cars',
        params,
      }),
      providesTags: ['Car'],
    }),
    getCarById: builder.query<Car, number>({
      query: (id) => `/cars/${id}`,
      providesTags: (result, error, id) => [{ type: 'Car', id }],
    }),
    getStatistics: builder.query<Statistics, void>({
      query: () => '/statistics',
      providesTags: ['Statistics'],
    }),
    getMpgByYear: builder.query<VisualizationData[], void>({
      query: () => '/visualizations/mpg-by-year',
    }),
    getMpgByCylinders: builder.query<CylinderData[], void>({
      query: () => '/visualizations/mpg-by-cylinders',
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useGetStatisticsQuery,
  useGetMpgByYearQuery,
  useGetMpgByCylindersQuery,
} = carsApi;
