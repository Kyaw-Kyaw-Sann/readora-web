"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import { createCategorySchema, updateCategorySchema } from "@/lib/validations/category";
import type { Category } from "@/types/category";

type CreateFormValues = z.infer<typeof createCategorySchema>;
type UpdateFormValues = z.infer<typeof updateCategorySchema>;

interface CategoryFormDialogProps {
  category?: Category | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function CategoryFormDialog({ category, onOpenChange, open }: CategoryFormDialogProps) {
  const isEditing = Boolean(category);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const form = useForm<CreateFormValues | UpdateFormValues>({
    resolver: zodResolver(isEditing ? updateCategorySchema : createCategorySchema),
    defaultValues: getDefaultValues(category),
  });

  useEffect(() => {
    form.reset(getDefaultValues(category));
  }, [category, form]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: CreateFormValues | UpdateFormValues) {
    try {
      if (category) {
        await updateMutation.mutateAsync({
          id: category.id,
          data: { ...values, active: "active" in values ? values.active : category.active },
        });
        toast.success("Category updated successfully.");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Category created successfully.");
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save the category.");
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-lg" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit category" : "Add category"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category details and its availability in the library."
              : "Create a category to organize the Readora library."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="category-name">
              Name
            </label>
            <Input
              aria-invalid={Boolean(form.formState.errors.name)}
              disabled={isPending}
              id="category-name"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="category-description">
              Description
            </label>
            <Textarea
              aria-invalid={Boolean(form.formState.errors.description)}
              disabled={isPending}
              id="category-description"
              rows={4}
              {...form.register("description")}
            />
            {form.formState.errors.description ? (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
            ) : null}
          </div>
          {isEditing ? <ActiveField form={form} isPending={isPending} /> : null}
          <DialogFooter>
            <Button disabled={isPending} onClick={() => onOpenChange(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? "Saving…" : isEditing ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ActiveField({
  form,
  isPending,
}: {
  form: ReturnType<typeof useForm<CreateFormValues | UpdateFormValues>>;
  isPending: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5">
      <span>
        <span className="block text-sm font-medium">Active category</span>
        <span className="block text-xs text-muted-foreground">Available for assigning to books.</span>
      </span>
      <input
        checked={Boolean(form.watch("active"))}
        className="size-4 accent-primary"
        disabled={isPending}
        onChange={(event) => form.setValue("active", event.target.checked, { shouldDirty: true })}
        type="checkbox"
      />
    </label>
  );
}

function getDefaultValues(category?: Category | null): CreateFormValues | UpdateFormValues {
  if (category) {
    return { name: category.name, description: category.description, active: category.active };
  }

  return { name: "", description: "" };
}
