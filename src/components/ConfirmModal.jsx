import { h } from 'preact';
import { triggerHaptic } from '../utils/hardware';
import './ConfirmModal.css';

export default function ConfirmModal({
	isOpen,
	title = '¿Confirmar acción?',
	message = 'Esta acción no se puede deshacer.',
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	isDanger = false,
	onConfirm,
	onCancel
}) {
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
		<div class="modalBackdrop" onClick={handleCancel} role="dialog" aria-modal="true">
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
