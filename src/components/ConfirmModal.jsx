import { triggerHaptic } from '../utils/hardware';
import { useDialog } from '../hooks/useDialog';
import './ConfirmModal.css';

export default function ConfirmModal({
	isOpen,
	title = '¿Confirmar?',
	message = 'No se puede deshacer.',
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	isDanger = false,
	returnFocusRef = undefined,
	onConfirm,
	onCancel
}) {
	const { dialogRef, handleBackdropClick } = useDialog(isOpen, onCancel, returnFocusRef);

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
		<dialog
			ref={dialogRef}
			class="modalBackdrop"
			onClick={handleBackdropClick}
			aria-modal="true"
			aria-label={title}
		>
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
		</dialog>
	);
}
