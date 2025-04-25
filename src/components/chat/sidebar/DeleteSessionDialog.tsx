
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
import { useState } from "react";

interface DeleteSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteSessionDialog({ isOpen, onClose, onConfirm }: DeleteSessionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (isDeleting) return; // Prevenir múltiplos cliques
    
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error("Erro ao excluir sessão:", error);
    } finally {
      setIsDeleting(false);
      onClose(); // Garantir que o diálogo seja fechado mesmo se houver erro
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isDeleting) { // Só fecha se não estiver excluindo
        onClose();
      }
    }}>
      <AlertDialogContent className="bg-offwhite">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir conversa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className="bg-red-500 hover:bg-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
