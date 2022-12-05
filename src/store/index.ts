import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import feedback from './feedback';

export const store = configureStore({
	reducer: {
		feedback
	},
	// Check Vite environment
	devTools: import.meta.env.DEV
});

// Get store state types
export type StoreState = ReturnType<typeof store.getState>;

// Create store hooks for selectors and dispatch
export const useStoreSelector: TypedUseSelectorHook<StoreState> = useSelector;
export const useStoreDispatch = () => useDispatch<typeof store.dispatch>();