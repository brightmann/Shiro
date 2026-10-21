'use client'

import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export const OwnerName = () => {
  // Fresh Core has no master user yet (user: null).
  const ownerName = useAggregationSelector((state) => state.user?.name ?? '')

  return ownerName
}
