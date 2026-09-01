"use client";

import { Ellipsis, FolderPlus, Pencil, RefreshCw, Tags, Trash2 } from "lucide-react";
import { useState } from "react";

import { CategoryDeleteDialog } from "@/components/admin/category-delete-dialog";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/use-categories";
import type { Category } from "@/types/category";

export function CategoryManagement() {
  const categoriesQuery = useCategories();
  const [formCategory, setFormCategory] = useState<Category | null | undefined>(undefined);
  const [categoryToDeactivate, setCategoryToDeactivate] = useState<Category | null>(null);

  const closeForm = (open: boolean) => {
    if (!open) {
      setFormCategory(undefined);
    }
  };

  return (
    <div className="space-y-readora-lg">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Organize titles across your Readora library.</p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground">
            Categories
          </h1>
        </div>
        <Button onClick={() => setFormCategory(null)} type="button">
          <FolderPlus aria-hidden="true" />
          Add category
        </Button>
      </div>

      {categoriesQuery.isLoading ? <CategoryTableSkeleton /> : null}
      {categoriesQuery.isError ? (
        <EmptyState
          title="Couldn’t load categories"
          description="Please check the connection and try again."
          action={
            <Button onClick={() => void categoriesQuery.refetch()} type="button">
              <RefreshCw aria-hidden="true" />
              Retry
            </Button>
          }
        />
      ) : null}
      {!categoriesQuery.isLoading && !categoriesQuery.isError && !categoriesQuery.data?.length ? (
        <EmptyState
          title="No categories yet"
          description="Create the first category to begin organizing your library."
          icon={<Tags aria-hidden="true" className="size-6" />}
          action={
            <Button onClick={() => setFormCategory(null)} type="button">
              <FolderPlus aria-hidden="true" />
              Add category
            </Button>
          }
        />
      ) : null}
      {!categoriesQuery.isLoading && !categoriesQuery.isError && categoriesQuery.data?.length ? (
        <CategoryTable
          categories={categoriesQuery.data}
          onDeactivate={setCategoryToDeactivate}
          onEdit={setFormCategory}
        />
      ) : null}

      <CategoryFormDialog
        category={formCategory ?? null}
        onOpenChange={closeForm}
        open={formCategory !== undefined}
      />
      <CategoryDeleteDialog
        category={categoryToDeactivate}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryToDeactivate(null);
          }
        }}
        open={Boolean(categoryToDeactivate)}
      />
    </div>
  );
}

function CategoryTable({
  categories,
  onDeactivate,
  onEdit,
}: {
  categories: Category[];
  onDeactivate: (category: Category) => void;
  onEdit: (category: Category) => void;
}) {
  return (
    <Card className="border border-border py-0 shadow-card">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="px-4 font-medium text-foreground">{category.name}</TableCell>
                <TableCell className="max-w-90 whitespace-normal text-muted-foreground">
                  {category.description}
                </TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>
                  <Badge
                    className={category.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}
                    variant="secondary"
                  >
                    {category.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Actions for ${category.name}`}
                      render={<Button size="icon-sm" type="button" variant="ghost" />}
                    >
                      <Ellipsis aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(category)}>
                        <Pencil aria-hidden="true" />
                        Edit
                      </DropdownMenuItem>
                      {category.active ? (
                        <DropdownMenuItem
                          onClick={() => onDeactivate(category)}
                          variant="destructive"
                        >
                          <Trash2 aria-hidden="true" />
                          Deactivate
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CategoryTableSkeleton() {
  return (
    <Card className="border border-border py-0 shadow-card">
      <CardContent className="space-y-4 p-readora-md">
        {[0, 1, 2, 3, 4].map((item) => (
          <div className="grid grid-cols-[1fr_2fr_1fr_5rem_2rem] items-center gap-4" key={item}>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="size-7 justify-self-end rounded-lg" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
