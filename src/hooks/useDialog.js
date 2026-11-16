import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';

/**
 * Syncs a native <dialog> element with an open flag and handles Escape / backdrop close.
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {import('preact').RefObject<HTMLElement | null>} [returnFocusRef]
 */
export function useDialog(isOpen, onClose, returnFocusRef) {
	/** @type {import('preact').RefObject<HTMLDialogElement>} */
	const dialogRef = useRef(null);
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useLayoutEffect(() => {
		const dialog = dialogRef.current;
		if (!isOpen || !dialog) return;

		const trigger = returnFocusRef?.current ?? document.activeElement;
		if (typeof dialog.showModal === 'function') {
			dialog.showModal();
		} else {
			dialog.setAttribute('open', '');
		}

		return () => {
			if (typeof dialog.close === 'function') {
				dialog.close();
			} else {
				dialog.removeAttribute('open');
			}
			if (trigger instanceof HTMLElement && trigger.isConnected) {
				trigger.focus({ preventScroll: true });
			}
		};
	}, [isOpen, returnFocusRef]);

	useEffect(() => {
		if (!isOpen || typeof document === 'undefined') return undefined;
		const dialog = dialogRef.current;

		/** @param {Event} e */
		const handleCancel = (e) => {
			e.preventDefault();
			onCloseRef.current();
		};
		/** @param {KeyboardEvent} e */
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				onCloseRef.current();
			}
		};

		dialog?.addEventListener('cancel', handleCancel);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			dialog?.removeEventListener('cancel', handleCancel);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen]);

	/** @param {MouseEvent} e */
	const handleBackdropClick = (e) => {
		if (e.target === dialogRef.current) {
			onCloseRef.current();
		}
	};

	return { dialogRef, handleBackdropClick };
}
