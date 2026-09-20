"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight, CreditCard, RefreshCw, Search, X } from "lucide-react";
import { useDeferredValue, useState } from "react";

import { UserAvatar } from "@/components/admin/user-management";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import type { AdminSubscription, AdminSubscriptionFilters, SubscriptionPlan, SubscriptionStatus } from "@/types/subscription";

const pageSize = 10;

export function SubscriptionManagement() {
  const [filters, setFilters] = useState<AdminSubscriptionFilters>({ page: 0, size: pageSize });
  const deferredSearch = useDeferredValue(filters.search);
  const subscriptionsQuery = useSubscriptions({ ...filters, search: deferredSearch });
  const subscriptions = subscriptionsQuery.data;

  const updateFilters = (changes: Partial<AdminSubscriptionFilters>) => {
    setFilters((current) => ({ ...current, ...changes, page: changes.page ?? 0 }));
  };

  return (
    <div className="space-y-readora-lg">
      <div>
        <p className="text-sm text-muted-foreground">Review premium plans and their current lifecycle status.</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground">Subscriptions</h1>
      </div>

      <SubscriptionFilters filters={filters} onChange={updateFilters} />

      {subscriptionsQuery.isLoading ? <SubscriptionTableSkeleton /> : null}
      {subscriptionsQuery.isError ? <EmptyState title="Couldn’t load subscriptions" description="Please check the connection and try again." action={<Button onClick={() => void subscriptionsQuery.refetch()} type="button"><RefreshCw aria-hidden="true" />Retry</Button>} /> : null}
      {!subscriptionsQuery.isLoading && !subscriptionsQuery.isError && subscriptions?.content.length === 0 ? <EmptyState title="No subscriptions found" description="Try changing the search or filters." icon={<CreditCard aria-hidden="true" className="size-6" />} /> : null}
      {subscriptions?.content.length ? <><SubscriptionTable subscriptions={subscriptions.content} /><SubscriptionPagination currentPage={subscriptions.page} isLastPage={subscriptions.last} onPageChange={(page) => updateFilters({ page })} totalElements={subscriptions.totalElements} totalPages={subscriptions.totalPages} /></> : null}
    </div>
  );
}

function SubscriptionFilters({ filters, onChange }: { filters: AdminSubscriptionFilters; onChange: (changes: Partial<AdminSubscriptionFilters>) => void }) {
  const hasFilters = filters.search !== undefined || filters.status !== undefined || filters.plan !== undefined;
  const selectClassName = "h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
      <div aria-label="Subscription filters" className="grid gap-3 md:grid-cols-[minmax(0,1fr)_11rem_11rem_auto]">
        <div className="relative"><Search aria-hidden="true" className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" /><Input className="h-10 bg-card pl-9" onChange={(event) => onChange({ search: event.target.value || undefined })} placeholder="Search user name or email…" type="search" value={filters.search ?? ""} /></div>
        <label className="sr-only" htmlFor="subscription-status-filter">Filter by subscription status</label>
        <select className={selectClassName} id="subscription-status-filter" onChange={(event) => onChange({ status: (event.target.value || undefined) as SubscriptionStatus | undefined })} value={filters.status ?? ""}><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="EXPIRED">Expired</option><option value="CANCELLED">Cancelled</option></select>
        <label className="sr-only" htmlFor="subscription-plan-filter">Filter by subscription plan</label>
        <select className={selectClassName} id="subscription-plan-filter" onChange={(event) => onChange({ plan: (event.target.value || undefined) as SubscriptionPlan | undefined })} value={filters.plan ?? ""}><option value="">All plans</option><option value="MONTHLY">Monthly</option><option value="YEARLY">Yearly</option></select>
        {hasFilters ? <Button className="h-10 justify-self-start px-3 md:justify-self-auto" onClick={() => onChange({ search: undefined, status: undefined, plan: undefined })} type="button" variant="ghost"><X aria-hidden="true" />Clear</Button> : null}
      </div>
  );
}

function SubscriptionTable({ subscriptions }: { subscriptions: AdminSubscription[] }) {
  return (
    <Card className="border border-border py-0 shadow-card">
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent"><TableHead className="px-4">User</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead><TableHead>Started</TableHead><TableHead>Expires</TableHead><TableHead className="px-4">Cancelled</TableHead></TableRow></TableHeader>
          <TableBody>{subscriptions.map((subscription) => <TableRow key={subscription.id}><TableCell className="px-4"><div className="flex min-w-52 items-center gap-3"><UserAvatar imageUrl={subscription.user.profileImageUrl} name={subscription.user.name} /><div className="min-w-0"><p className="truncate font-medium">{subscription.user.name}</p><p className="truncate text-xs text-muted-foreground">{subscription.user.email}</p></div></div></TableCell><TableCell><Badge className="bg-premium text-primary-foreground" variant="secondary">{formatPlan(subscription.plan)}</Badge></TableCell><TableCell><StatusBadge status={subscription.status} /></TableCell><TableCell className="text-muted-foreground">{formatDate(subscription.startedAt)}</TableCell><TableCell className="text-muted-foreground">{formatDate(subscription.expiresAt)}</TableCell><TableCell className="px-4 text-muted-foreground">{subscription.cancelledAt ? formatDate(subscription.cancelledAt) : "—"}</TableCell></TableRow>)}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const className = status === "ACTIVE" ? "bg-success/10 text-success" : status === "EXPIRED" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground";
  return <Badge className={className} variant="secondary">{status[0]}{status.slice(1).toLowerCase()}</Badge>;
}

function SubscriptionPagination({ currentPage, isLastPage, onPageChange, totalElements, totalPages }: { currentPage: number; isLastPage: boolean; onPageChange: (page: number) => void; totalElements: number; totalPages: number }) {
  return <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>{totalElements} {totalElements === 1 ? "subscription" : "subscriptions"} found</span><div className="flex items-center gap-2 self-end sm:self-auto"><Button disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)} size="sm" type="button" variant="outline"><ChevronLeft aria-hidden="true" />Previous</Button><span className="whitespace-nowrap">Page {currentPage + 1} of {Math.max(totalPages, 1)}</span><Button disabled={isLastPage} onClick={() => onPageChange(currentPage + 1)} size="sm" type="button" variant="outline">Next<ChevronRight aria-hidden="true" /></Button></div></div>;
}

function SubscriptionTableSkeleton() {
  return <Card className="border border-border py-0 shadow-card"><CardContent className="space-y-4 p-readora-md">{[0, 1, 2, 3, 4].map((item) => <Skeleton className="h-12 w-full" key={item} />)}</CardContent></Card>;
}

function formatPlan(plan: SubscriptionPlan) {
  return plan === "YEARLY" ? "Yearly" : "Monthly";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : format(date, "MMM d, yyyy");
}
