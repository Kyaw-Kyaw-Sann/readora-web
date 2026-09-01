"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCategory } from "@/hooks/use-categories";
import type { Category } from "@/types/category";

interface CategoryDeleteDialogProps {
  category: Category | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function CategoryDeleteDialog({
  category,
  onOpenChange,
  open,
}: CategoryDeleteDialogProps) {
  const deleteMutation = useDeleteCategory();

  async function handleDelete() {
    if (!category) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(category.id);
      toast.success("Category deactivated successfully.");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to deactivate the category.");
    }
  }

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Deactivate category?</AlertDialogTitle>
          <AlertDialogDescription>
            {category
              ? `“${category.name}” will no longer be available for new books. Existing book assignments are preserved.`
              : "This category will no longer be available for new books."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteMutation.isPending || !category}
            onClick={() => void handleDelete()}
            variant="destructive"
          >
            {deleteMutation.isPending ? "Deactivating…" : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
