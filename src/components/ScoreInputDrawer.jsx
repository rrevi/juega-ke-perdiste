import { h } from 'preact';
import { useState, useEffect, useLayoutEffect, useRef } from 'preact/hooks';
import { triggerHaptic } from '../utils/hardware';
import { useEscapeKey } from '../utils/useEscapeKey';
import './ScoreInputDrawer.css';

const QUICK_PRESETS = [5, 10, 15, 20, 25, 30, 40, 50];

export default function ScoreInputDrawer({
	isOpen,
	teamName = 'Equipo',
	teamEmoji = '',
	maxScore = 168,
	returnFocusRef,
	onClose,
	onSubmit
}) {
	const [value, setValue] = useState('');
	const [error, setError] = useState(false);
	const [dragY, setDragY] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const touchStartY = useRef(0);
	const currentDragY = useRef(0);
	const closeButtonRef = useRef(null);

	useEscapeKey(isOpen, onClose);

	useLayoutEffect(() => {
		if (!isOpen) return;
		const trigger = returnFocusRef?.current ?? document.activeElement;
		closeButtonRef.current.focus({ preventScroll: true });
		return () => {
			if (trigger?.isConnected) trigger.focus({ preventScroll: true });
		};
	}, [isOpen, returnFocusRef]);

	useEffect(() => {
		if (isOpen) {
			setValue('');
			setError(false);
			setDragY(0);
			currentDragY.current = 0;
			setIsDragging(false);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleKeyDown = (event) => {
		if (event.key !== 'Tab') return;

		const buttons = [...event.currentTarget.querySelectorAll('button:enabled')];
		const first = buttons[0];
		const last = buttons[buttons.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};

	const handleTouchStart = (e) => {
		const clientY = (e.touches && e.touches[0] && e.touches[0].clientY) || (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY) || e.clientY || 0;
		touchStartY.current = clientY;
		currentDragY.current = 0;
		setIsDragging(true);
	};

	const handleTouchMove = (e) => {
		const clientY = (e.touches && e.touches[0] && e.touches[0].clientY) || (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY) || e.clientY || 0;
		const delta = clientY - (touchStartY.current || 0);
		const finalDelta = delta > 0 ? delta : delta * 0.2;
		currentDragY.current = finalDelta;
		setDragY(finalDelta);
	};

	const handleTouchEnd = () => {
		if (currentDragY.current > 80) {
			triggerHaptic('tap');
			onClose();
		}
		currentDragY.current = 0;
		setDragY(0);
		setIsDragging(false);
		touchStartY.current = null;
	};

	const handleDigit = (digit) => {
		triggerHaptic('tap');
		if (value.length >= 3) return;
		const next = value === '0' ? String(digit) : `${value}${digit}`;
		const num = parseInt(next, 10);
		if (num > maxScore) {
			triggerHaptic('error');
			setError(true);
		} else {
			setError(false);
		}
		setValue(next);
	};

	const handlePreset = (preset) => {
		triggerHaptic('tap');
		const num = parseInt(value || '0', 10) + preset;
		if (num > maxScore) {
			triggerHaptic('error');
			setError(true);
			setValue(String(maxScore));
		} else {
			setError(false);
			setValue(String(num));
		}
	};

	const handleBackspace = () => {
		triggerHaptic('tap');
		const next = value.slice(0, -1);
		setValue(next);
		setError(false);
	};

	const handleClear = () => {
		triggerHaptic('tap');
		setValue('');
		setError(false);
	};

	const handleSave = () => {
		const num = parseInt(value, 10) || 0;
		if (num <= 0) {
			triggerHaptic('error');
			return;
		}
		if (num > maxScore) {
			triggerHaptic('error');
			setError(true);
			return;
		}
		triggerHaptic('success');
		onSubmit(num);
		onClose();
	};

	const numValue = parseInt(value, 10) || 0;

	return (
		<div class="drawerBackdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Sumar puntos a ${teamName}`}>
			<div
				class="drawerContainer"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={handleKeyDown}
				style={{
					transform: dragY ? `translateY(${Math.max(0, dragY)}px)` : undefined,
					transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
				}}
			>
				<div
					class="drawerDragHandleArea"
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				>
					<div class="drawerDragHandle" aria-hidden="true" />
				</div>
				<div
					class="drawerHeader"
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				>
					<div class="drawerTitle">
						<span class="drawerEmoji">{teamEmoji}</span>
						<span>Sumar a <strong>{teamName}</strong></span>
					</div>
					<button type="button" class="drawerCloseBtn" ref={closeButtonRef} onClick={onClose} aria-label="Cerrar">
						✕
					</button>
				</div>

				<div class="drawerBody">
					<div class="drawerEntry">
						<div class="drawerScoreDisplay">
							<div class={`displayNumber ${error ? 'isInvalid' : ''}`}>
								{value || '0'}
							</div>
							<span class="displayUnit">pts</span>
						</div>
						{error && <div class="drawerErrorMsg">Máximo: {maxScore} pts</div>}

						<div class="quickPresetsSection">
							<span class="quickPresetsLabel">Atajos:</span>
							<div class="quickPresetsGrid">
								{QUICK_PRESETS.map((pts) => (
									<button
										key={pts}
										type="button"
										class="presetChip"
										onClick={() => handlePreset(pts)}
									>
										+{pts}
									</button>
								))}
							</div>
						</div>
					</div>

					<div class="keypadGrid">
						{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
							<button
								key={n}
								type="button"
								class="keypadBtn"
								onClick={() => handleDigit(n)}
							>
								{n}
							</button>
						))}
						<button type="button" class="keypadBtn keypadActionBtn" onClick={handleClear}>
							C
						</button>
						<button type="button" class="keypadBtn" onClick={() => handleDigit(0)}>
							0
						</button>
						<button type="button" class="keypadBtn keypadActionBtn" onClick={handleBackspace} aria-label="Borrar">
							⌫
						</button>
					</div>
				</div>

				{/* Save Button */}
				<button
					type="button"
					class="drawerSaveBtn"
					disabled={numValue <= 0 || numValue > maxScore}
					onClick={handleSave}
				>
					Anotar +{numValue || 0} pts
				</button>
			</div>
		</div>
	);
}
