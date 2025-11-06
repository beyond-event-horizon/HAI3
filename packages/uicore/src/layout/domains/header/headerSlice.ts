import { createSlice } from '@reduxjs/toolkit';
import { LayoutDomains } from '../../layoutSlice';

/**
 * Header slice for managing header configuration
 * Note: Header currently has no state - purely presentational
 */

export interface HeaderState {}

const initialState: HeaderState = {};

const headerSlice = createSlice({
  name: LayoutDomains.Header,
  initialState,
  reducers: {},
});

// No actions currently exported
export default headerSlice.reducer;
