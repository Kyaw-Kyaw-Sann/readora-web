import { QueryClient } from "@tanstack/react-query";

import { queryConfig } from "@/lib/query/config";

export function createQueryClient() {
  return new QueryClient({ defaultOptions: queryConfig });
}
