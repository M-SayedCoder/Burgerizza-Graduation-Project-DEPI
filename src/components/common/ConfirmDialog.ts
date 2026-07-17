import Swal from 'sweetalert2';

interface Props {
  title?: string;
  text?: string;
  confirmText?: string;
  onConfirm: () => void | Promise<void>;
}

export const showConfirmDialog = async ({ title = 'Are you sure?', text = 'This action cannot be undone.', confirmText = 'Yes, proceed', onConfirm }: Props) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f97316',
    cancelButtonColor: '#64748b',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
  });
  if (result.isConfirmed) await onConfirm();
};

export const showDeleteDialog = (onConfirm: () => void | Promise<void>) =>
  showConfirmDialog({
    title: 'Delete?',
    text: 'This will permanently delete the item.',
    confirmText: 'Yes, Delete',
    onConfirm,
  });
