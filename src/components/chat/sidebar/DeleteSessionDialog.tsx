
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteSessionDialog({ isOpen, onClose, onConfirm }: DeleteSessionDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } finally {
      // Garantir que o diálogo seja fechado mesmo se houver erro
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-offwhite">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir conversa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-500 hover:bg-red-600">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
