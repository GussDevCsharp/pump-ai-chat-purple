
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
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Small timeout to ensure React finishes any pending updates
      const timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 100);
      return () => clearTimeout(timeout);
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
      // Use a short timeout to ensure React has time to process state updates
      setTimeout(() => {
        setIsDeleting(false);
        onClose(); // Close the dialog explicitly
      }, 10);
    }
  };

  const handleCancel = () => {
    setIsDeleting(false);
    onClose();
  };

  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          // When dialog is closed, ensure we reset states properly
          setTimeout(() => {
            setIsDeleting(false);
            onClose();
          }, 10);
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
            onClick={handleCancel}
            disabled={isDeleting}
            type="button"
            className="mt-2 sm:mt-0"
          >
            Cancelar
          </Button>
          <Button 
            ref={confirmButtonRef}
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
