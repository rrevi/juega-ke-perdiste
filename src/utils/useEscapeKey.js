import { useEffect, useRef } from 'preact/hooks';

/**
 * Invoke onClose when the Escape key is pressed while a dialog is open.
 */
export function useEscapeKey(isOpen, onClose) {
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
		if (!isOpen || typeof document === 'undefined') return undefined;
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				onCloseRef.current();
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen]);
}
