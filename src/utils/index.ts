let timeout: NodeJS.Timeout | null = null;
export const delayCallback = (callback: () => void | any, time?: number): void => {
	if (timeout) clearTimeout(timeout);
	// Set new timeout
	timeout = setTimeout(callback, time || 400);
};