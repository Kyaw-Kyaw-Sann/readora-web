"use client";

import { format } from "date-fns";
import { ArrowLeft, CalendarDays, Crown, Mail, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";

import { UserAvatar } from "@/components/admin/user-management";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-users";
import type { AdminUserDetail } from "@/types/user";

export function UserDetail({ id }: { id: number }) {
  const userQuery = useUser(id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return <InvalidUserState />;
  }

  if (userQuery.isLoading) return <UserDetailSkeleton />;

  if (userQuery.isError || !userQuery.data) {
    return (
      <EmptyState
        title="Couldn’t load this user"
        description="The user may no longer exist, or the connection needs to be retried."
        action={<Button onClick={() => void userQuery.refetch()} type="button"><RefreshCw aria-hidden="true" />Retry</Button>}
      />
    );
  }

  const user = userQuery.data;

  return (
    <div className="space-y-readora-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button nativeButton={false} render={<Link href="/admin/users" />} size="sm" variant="ghost"><ArrowLeft aria-hidden="true" />Back to users</Button>
          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground">User details</h1>
          <p className="mt-1 text-sm text-muted-foreground">A read-only view of this reader’s Readora account.</p>
        </div>
        <Badge variant="outline">ID #{user.id}</Badge>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <ProfileCard user={user} />
        <AccountCard user={user} />
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <InterestsCard interests={user.interests} />
        <SubscriptionCard user={user} />
      </section>
    </div>
  );
}

function ProfileCard({ user }: { user: AdminUserDetail }) {
  return (
    <Card className="border border-border shadow-card">
      <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <UserAvatar imageUrl={user.profileImageUrl} name={user.name} />
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold">{user.name}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Mail aria-hidden="true" className="size-4" />{user.email}</p>
          </div>
        </div>
        <Separator className="my-6" />
        <dl className="grid gap-5 sm:grid-cols-2">
          <DetailItem icon={ShieldCheck} label="Role" value={user.role} />
          <DetailItem label="Provider" value={user.provider === "GOOGLE" ? "Google" : "Email and password"} />
          <DetailItem label="Email verification" value={user.emailVerified ? "Verified" : "Unverified"} />
          <DetailItem icon={CalendarDays} label="Joined" value={formatDateTime(user.createdAt)} />
        </dl>
      </CardContent>
    </Card>
  );
}

function AccountCard({ user }: { user: AdminUserDetail }) {
  return (
    <Card className="border border-border shadow-card">
      <CardHeader><CardTitle>Access</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/45 p-4">
          <div><p className="font-medium">Premium access</p><p className="mt-1 text-sm text-muted-foreground">Current library access status.</p></div>
          <Badge className={user.premiumActive ? "bg-premium text-primary-foreground" : "bg-muted text-muted-foreground"} variant="secondary">
            {user.premiumActive ? "Active" : "Normal"}
          </Badge>
        </div>
        <div className="rounded-lg border border-border bg-muted/45 p-4">
          <p className="text-sm font-medium">Account status</p>
          <p className="mt-1 text-sm text-muted-foreground">{user.emailVerified ? "Email is verified and the account can access its available library." : "Email has not yet been verified."}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InterestsCard({ interests }: { interests: string[] }) {
  return (
    <Card className="border border-border shadow-card">
      <CardHeader><CardTitle>Reading interests</CardTitle></CardHeader>
      <CardContent>
        {interests.length ? <div className="flex flex-wrap gap-2">{interests.map((interest) => <Badge key={interest} variant="outline">{interest}</Badge>)}</div> : <p className="text-sm text-muted-foreground">No reading interests have been selected yet.</p>}
      </CardContent>
    </Card>
  );
}

function SubscriptionCard({ user }: { user: AdminUserDetail }) {
  const subscription = user.subscription;

  return (
    <Card className="border border-border shadow-card">
      <CardHeader><CardTitle>Subscription</CardTitle></CardHeader>
      <CardContent>
        {!subscription ? <p className="text-sm text-muted-foreground">This reader does not have a subscription record.</p> : (
          <dl className="grid gap-5 sm:grid-cols-2">
            <DetailItem icon={Crown} label="Plan" value={subscription.plan === "YEARLY" ? "Yearly" : "Monthly"} />
            <DetailItem label="Status" value={subscription.status} />
            <DetailItem label="Started" value={formatDateTime(subscription.startedAt)} />
            <DetailItem label="Expires" value={formatDateTime(subscription.expiresAt)} />
            {subscription.cancelledAt ? <DetailItem label="Cancelled" value={formatDateTime(subscription.cancelledAt)} /> : null}
          </dl>
        )}
      </CardContent>
    </Card>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon?: typeof UserRound; label: string; value: string }) {
  return <div><dt className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">{Icon ? <Icon aria-hidden="true" className="size-3.5 text-primary" /> : null}{label}</dt><dd className="mt-1.5 font-medium text-foreground">{value}</dd></div>;
}

function InvalidUserState() {
  return <EmptyState title="Invalid user" description="Return to the user list and choose a valid reader." action={<Button nativeButton={false} render={<Link href="/admin/users" />}>Back to users</Button>} />;
}

function UserDetailSkeleton() {
  return <div className="space-y-readora-lg"><Skeleton className="h-24 w-full" /><div className="grid gap-4 xl:grid-cols-2"><Skeleton className="h-72 w-full" /><Skeleton className="h-72 w-full" /></div><div className="grid gap-4 xl:grid-cols-2"><Skeleton className="h-44 w-full" /><Skeleton className="h-44 w-full" /></div></div>;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : format(date, "MMM d, yyyy · h:mm a");
}
