import { h } from 'preact';
import { triggerHaptic } from '../utils/hardware';
import { useEscapeKey } from '../utils/useEscapeKey';
import './ConfirmModal.css';

export default function ConfirmModal({
	isOpen,
	title = '¿Confirmar?',
	message = 'No se puede deshacer.',
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	isDanger = false,
	onConfirm,
	onCancel
}) {
	useEscapeKey(isOpen, onCancel);

	if (!isOpen) return null;

	const handleConfirm = () => {
		triggerHaptic('tap');
		onConfirm();
	};

	const handleCancel = () => {
		triggerHaptic('tap');
		onCancel();
	};

	return (
		<div class="modalBackdrop" onClick={handleCancel} role="dialog" aria-modal="true" aria-label={title}>
			<div class="modalContainer" onClick={(e) => e.stopPropagation()}>
				<h3 class="modalTitle">{title}</h3>
				<p class="modalMessage">{message}</p>
				<div class="modalActions">
					<button type="button" class="modalBtn modalCancelBtn" onClick={handleCancel}>
						{cancelText}
					</button>
					<button
						type="button"
						class={`modalBtn modalConfirmBtn ${isDanger ? 'isDanger' : ''}`}
						onClick={handleConfirm}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
