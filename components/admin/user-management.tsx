"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight, RefreshCw, Search, UsersRound, X } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUsers } from "@/hooks/use-users";
import type { AdminUserFilters, AdminUserListItem } from "@/types/user";

const pageSize = 10;

export function UserManagement() {
  const [filters, setFilters] = useState<AdminUserFilters>({ page: 0, size: pageSize });
  const deferredSearch = useDeferredValue(filters.search);
  const usersQuery = useUsers({ ...filters, search: deferredSearch });
  const users = usersQuery.data;

  const updateFilters = (changes: Partial<AdminUserFilters>) => {
    setFilters((current) => ({
      ...current,
      ...changes,
      page: changes.page ?? 0,
    }));
  };

  return (
    <div className="space-y-readora-lg">
      <div>
        <p className="text-sm text-muted-foreground">Browse the readers who make up your Readora library.</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground">Users</h1>
      </div>

      <UserFilters filters={filters} onChange={updateFilters} />

      {usersQuery.isLoading ? <UserTableSkeleton /> : null}
      {usersQuery.isError ? (
        <EmptyState
          title="Couldn’t load users"
          description="Please check the connection and try again."
          action={<Button onClick={() => void usersQuery.refetch()} type="button"><RefreshCw aria-hidden="true" />Retry</Button>}
        />
      ) : null}
      {!usersQuery.isLoading && !usersQuery.isError && users?.content.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try changing the search or filters to find a reader."
          icon={<UsersRound aria-hidden="true" className="size-6" />}
        />
      ) : null}
      {users?.content.length ? (
        <>
          <UserTable users={users.content} />
          <UserPagination
            currentPage={users.page}
            isLastPage={users.last}
            onPageChange={(page) => updateFilters({ page })}
            totalElements={users.totalElements}
            totalPages={users.totalPages}
          />
        </>
      ) : null}
    </div>
  );
}

function UserFilters({ filters, onChange }: { filters: AdminUserFilters; onChange: (changes: Partial<AdminUserFilters>) => void }) {
  const hasFilters = filters.search !== undefined || filters.verified !== undefined || filters.premium !== undefined;
  const selectClassName = "h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
      <div aria-label="User filters" className="grid gap-3 md:grid-cols-[minmax(0,1fr)_11rem_11rem_auto]">
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
          <Input
            className="h-10 bg-card pl-9"
            onChange={(event) => onChange({ search: event.target.value || undefined })}
            placeholder="Search name or email…"
            type="search"
            value={filters.search ?? ""}
          />
        </div>
        <label className="sr-only" htmlFor="verification-filter">Filter verification status</label>
        <select
          className={selectClassName}
          id="verification-filter"
          onChange={(event) => onChange({ verified: toBooleanFilter(event.target.value) })}
          value={toFilterValue(filters.verified)}
        >
          <option value="">All verification</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
        <label className="sr-only" htmlFor="premium-filter">Filter premium status</label>
        <select
          className={selectClassName}
          id="premium-filter"
          onChange={(event) => onChange({ premium: toBooleanFilter(event.target.value) })}
          value={toFilterValue(filters.premium)}
        >
          <option value="">All access</option>
          <option value="true">Premium</option>
          <option value="false">Normal</option>
        </select>
        {hasFilters ? <Button className="h-10 justify-self-start px-3 md:justify-self-auto" onClick={() => onChange({ search: undefined, verified: undefined, premium: undefined })} type="button" variant="ghost"><X aria-hidden="true" />Clear</Button> : null}
      </div>
  );
}

function UserTable({ users }: { users: AdminUserListItem[] }) {
  return (
    <Card className="border border-border py-0 shadow-card">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">User</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="px-4 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-4">
                  <div className="flex min-w-52 items-center gap-3">
                    <UserAvatar imageUrl={user.profileImageUrl} name={user.name} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{formatProvider(user.provider)}</Badge></TableCell>
                <TableCell>
                  <Badge className={user.emailVerified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"} variant="secondary">
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </TableCell>
                <TableCell><SubscriptionBadge user={user} /></TableCell>
                <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                <TableCell className="px-4 text-right">
                  <Button nativeButton={false} render={<Link href={`/admin/users/${user.id}`} />} size="sm" variant="outline">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function UserPagination({ currentPage, isLastPage, onPageChange, totalElements, totalPages }: { currentPage: number; isLastPage: boolean; onPageChange: (page: number) => void; totalElements: number; totalPages: number }) {
  return (
    <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>{totalElements} {totalElements === 1 ? "user" : "users"} found</span>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)} size="sm" type="button" variant="outline"><ChevronLeft aria-hidden="true" />Previous</Button>
        <span className="whitespace-nowrap">Page {currentPage + 1} of {Math.max(totalPages, 1)}</span>
        <Button disabled={isLastPage} onClick={() => onPageChange(currentPage + 1)} size="sm" type="button" variant="outline">Next<ChevronRight aria-hidden="true" /></Button>
      </div>
    </div>
  );
}

export function UserAvatar({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "R";

  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/12 text-xs font-semibold text-primary">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- profile image hosts are backend-configured.
        <img alt={`${name}'s profile`} className="size-full object-cover" src={imageUrl} />
      ) : initials}
    </span>
  );
}

function SubscriptionBadge({ user }: { user: AdminUserListItem }) {
  if (!user.premiumActive) return <Badge className="bg-muted text-muted-foreground" variant="secondary">Normal</Badge>;

  return <Badge className="bg-premium text-primary-foreground" variant="secondary">{user.subscriptionPlan === "YEARLY" ? "Yearly premium" : "Monthly premium"}</Badge>;
}

function UserTableSkeleton() {
  return (
    <Card className="border border-border py-0 shadow-card">
      <CardContent className="space-y-4 p-readora-md">
        {[0, 1, 2, 3, 4].map((item) => <Skeleton className="h-12 w-full" key={item} />)}
      </CardContent>
    </Card>
  );
}

function toBooleanFilter(value: string) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function toFilterValue(value: boolean | undefined) {
  return value === undefined ? "" : String(value);
}

function formatProvider(provider: AdminUserListItem["provider"]) {
  return provider === "GOOGLE" ? "Google" : "Email";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : format(date, "MMM d, yyyy");
}
