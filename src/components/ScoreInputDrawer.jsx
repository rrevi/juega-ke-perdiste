import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { triggerHaptic } from '../utils/hardware';
import './ScoreInputDrawer.css';

const QUICK_PRESETS = [5, 10, 15, 20, 25, 30, 40, 50];

export default function ScoreInputDrawer({
	isOpen,
	team,
	teamName = 'Equipo',
	teamEmoji = '',
	maxScore = 168,
	onClose,
	onSubmit
}) {
	const [value, setValue] = useState('');
	const [error, setError] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setValue('');
			setError(false);
		}
	}, [isOpen]);

	if (!isOpen) return null;

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
		<div class="drawerBackdrop" onClick={onClose} role="dialog" aria-modal="true">
			<div class="drawerContainer" onClick={(e) => e.stopPropagation()}>
				<div class="drawerHeader">
					<div class="drawerTitle">
						<span class="drawerEmoji">{teamEmoji}</span>
						<span>Sumar a <strong>{teamName}</strong></span>
					</div>
					<button type="button" class="drawerCloseBtn" onClick={onClose} aria-label="Cerrar">
						✕
					</button>
				</div>

				<div class="drawerScoreDisplay">
					<div class={`displayNumber ${error ? 'isInvalid' : ''}`}>
						{value || '0'}
					</div>
					<span class="displayUnit">pts</span>
				</div>
				{error && <div class="drawerErrorMsg">Máximo permitido: {maxScore} pts</div>}

				{/* Quick Add Presets */}
				<div class="quickPresetsSection">
					<span class="quickPresetsLabel">Atajos rápidos:</span>
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

				{/* Numeric Keypad */}
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

				{/* Save Button */}
				<button
					type="button"
					class="drawerSaveBtn"
					disabled={numValue <= 0 || numValue > maxScore}
					onClick={handleSave}
				>
					Guardar +{numValue || 0} pts
				</button>
			</div>
		</div>
	);
}
