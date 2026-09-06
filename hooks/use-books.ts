"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createBook, getAdminBooks, getBook, updateBook, type BookFiles } from "@/lib/api/books";
import { queryKeys } from "@/lib/query/query-keys";
import type { AdminBookFilters, CreateBookRequest } from "@/types/book";

export function useBooks(filters: AdminBookFilters) {
  return useQuery({ queryKey: queryKeys.books(filters), queryFn: () => getAdminBooks(filters) });
}
export function useBook(id: number) { return useQuery({ queryKey: queryKeys.book(id), queryFn: () => getBook(id), enabled: Number.isFinite(id) && id > 0 }); }
export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ data, files }: { data: CreateBookRequest; files: BookFiles }) => createBook(data, files), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }) });
}
export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, data, files }: { id: number; data: CreateBookRequest; files: BookFiles }) => updateBook(id, data, files), onSuccess: (_, variables) => Promise.all([queryClient.invalidateQueries({ queryKey: ["books"] }), queryClient.invalidateQueries({ queryKey: queryKeys.book(variables.id) })]) });
}
