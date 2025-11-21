import { createSlice } from '@reduxjs/toolkit';
import { UICORE_ID } from '../../../core/constants';
import { LAYOUT_DOMAINS } from '../../layoutSlice';

/**
 * Header slice for managing header configuration
 * Note: Header currently has no state - purely presentational
 */

const DOMAIN_ID = LAYOUT_DOMAINS.HEADER;
const SLICE_KEY = `${UICORE_ID}/${DOMAIN_ID}` as const;

export interface HeaderState {}

const initialState: HeaderState = {};

const headerSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {},
});

// No actions currently exported

export default headerSlice.reducer;
