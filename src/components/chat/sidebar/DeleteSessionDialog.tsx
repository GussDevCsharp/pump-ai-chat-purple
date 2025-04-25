
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
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface DeleteSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteSessionDialog({ isOpen, onClose, onConfirm }: DeleteSessionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset deleting state when dialog is closed
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error("Erro ao excluir sessão:", error);
    } finally {
      setIsDeleting(false);
      onClose(); // Close the dialog after operation completes
    }
  };

  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          setIsDeleting(false);
          onClose();
        }
      }}
    >
      <AlertDialogContent className="bg-offwhite">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir conversa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            type="button"
            className="mt-2 sm:mt-0"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="bg-red-500 hover:bg-red-600"
            disabled={isDeleting}
            type="button"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
