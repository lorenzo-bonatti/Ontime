import { createSlice } from '@reduxjs/toolkit';

export interface FeedbackState {
	data: FeedbackDataState | null
}

export interface FeedbackDataState {
	title: string
	content?: string
	type?: 'success' | 'warning' | 'error' | 'info'
	timeout?: number
}

const slice = createSlice({
	name: 'feedback',
	initialState: {
		data: null
	} as FeedbackState,
	reducers: {
		showFeedback: (state: FeedbackState, action?) => {
			state.data = action?.payload;
		}
	}
});

export default slice.reducer;
export const { showFeedback } = slice.actions;