"use client";

import { BookOpen, Crown, MessageSquareText, RefreshCw, Users } from "lucide-react";

import { DashboardBookList } from "@/components/admin/dashboard-book-list";
import { DashboardStatCard } from "@/components/admin/dashboard-stat-card";
import { DashboardSummarySection } from "@/components/admin/dashboard-summary-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDashboardStats,
  usePopularBooks,
  useRecentlyAddedBooks,
} from "@/hooks/use-dashboard";

function number(value: number) {
  return value.toLocaleString();
}

export function AdminDashboard() {
  const dashboardQuery = useDashboardStats();
  const popularBooksQuery = usePopularBooks();
  const recentBooksQuery = useRecentlyAddedBooks();

  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <EmptyState
        title="Couldn’t load the dashboard"
        description="Please check the connection and try again."
        action={
          <Button onClick={() => void dashboardQuery.refetch()} type="button">
            <RefreshCw aria-hidden="true" />
            Retry
          </Button>
        }
      />
    );
  }

  const { users, books, reviews, subscriptions } = dashboardQuery.data;

  return (
    <div className="space-y-readora-lg">
      <div>
        <p className="text-sm text-muted-foreground">Your Readora library at a glance.</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground">
          Dashboard overview
        </h1>
      </div>

      <section aria-label="Key statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          description={`${number(users.verified)} verified readers`}
          icon={Users}
          title="Total users"
          value={number(users.total)}
        />
        <DashboardStatCard
          description="Readers with an active plan"
          icon={Crown}
          title="Active premium"
          value={number(users.activePremium)}
        />
        <DashboardStatCard
          description={`${number(books.published)} published titles`}
          icon={BookOpen}
          title="Total books"
          value={number(books.total)}
        />
        <DashboardStatCard
          description={`Average rating ${reviews.averageRating.toFixed(1)} / 5`}
          icon={MessageSquareText}
          title="Total reviews"
          value={number(reviews.total)}
        />
      </section>

      <section aria-label="Library and reader summaries" className="grid gap-4 xl:grid-cols-2">
        <DashboardSummarySection
          description="Reader verification and premium access"
          items={[
            { label: "Verified", value: number(users.verified), tone: "success" },
            { label: "Unverified", value: number(users.unverified), tone: "muted" },
            { label: "Active premium", value: number(users.activePremium), tone: "premium" },
          ]}
          title="Users"
        />
        <DashboardSummarySection
          description="Publication and access breakdown"
          items={[
            { label: "Published", value: number(books.published), tone: "success" },
            { label: "Draft", value: number(books.draft), tone: "muted" },
            { label: "Archived", value: number(books.archived), tone: "muted" },
            { label: "Free", value: number(books.free), tone: "success" },
            { label: "Premium", value: number(books.premium), tone: "premium" },
            { label: "All titles", value: number(books.total) },
          ]}
          title="Books overview"
        />
        <DashboardSummarySection
          description="Feedback across the library"
          items={[
            { label: "Total reviews", value: number(reviews.total) },
            { label: "Average rating", value: `${reviews.averageRating.toFixed(1)} / 5`, tone: "premium" },
          ]}
          title="Reviews"
        />
        <DashboardSummarySection
          description="Current subscriber plan distribution"
          items={[
            { label: "All subscriptions", value: number(subscriptions.total) },
            { label: "Active", value: number(subscriptions.active), tone: "success" },
            { label: "Expired", value: number(subscriptions.expired), tone: "muted" },
            { label: "Cancelled", value: number(subscriptions.cancelled), tone: "muted" },
            { label: "Monthly", value: number(subscriptions.monthly), tone: "premium" },
            { label: "Yearly", value: number(subscriptions.yearly), tone: "premium" },
          ]}
          title="Subscriptions"
        />
      </section>

      <section aria-label="Book collections" className="grid gap-4 xl:grid-cols-2">
        <DashboardBookList
          books={popularBooksQuery.data}
          description="The five most-read books in the library"
          isError={popularBooksQuery.isError}
          isLoading={popularBooksQuery.isLoading}
          onRetry={() => void popularBooksQuery.refetch()}
          showViews
          title="Popular books"
        />
        <DashboardBookList
          books={recentBooksQuery.data}
          description="The five newest additions to Readora"
          isError={recentBooksQuery.isError}
          isLoading={recentBooksQuery.isLoading}
          onRetry={() => void recentBooksQuery.refetch()}
          title="Recently added"
        />
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-readora-lg" aria-label="Loading dashboard" role="status">
      <div className="space-y-2">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <Card className="border border-border py-0 shadow-card" key={item}>
            <CardContent className="space-y-3 p-readora-md">
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-7 w-1/3" />
              <Skeleton className="h-3 w-3/5" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <Card className="border border-border py-0 shadow-card" key={item}>
            <CardContent className="grid grid-cols-3 gap-4 p-readora-md">
              {[0, 1, 2].map((entry) => (
                <div className="space-y-2" key={entry}>
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
