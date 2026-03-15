"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getStatsOverview } from "@/src/lib/selectors/stats";

export function useStatsOverview() {
  const overview = useLiveQuery(() => getStatsOverview(), [], null);

  return {
    overview,
    loading: overview === undefined || overview === null,
  };
}
