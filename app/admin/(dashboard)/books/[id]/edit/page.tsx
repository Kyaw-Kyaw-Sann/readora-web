import { BookEditor } from "@/components/admin/book-editor";
import { notFound } from "next/navigation";
export default async function EditBookPage({ params }: PageProps<"/admin/books/[id]/edit">) { const { id } = await params; const bookId = Number(id); if (!Number.isInteger(bookId) || bookId < 1) notFound(); return <BookEditor id={bookId} />; }
