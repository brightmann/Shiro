import type { Pager } from '@mx-space/api-client'
import type { FC } from 'react'

import { MotionButtonBase } from '~/components/ui/button'
import { Link } from '~/i18n/navigation'

const className =
  'rounded-md border-[2px] border-accent/50 px-4 py-2 hover:border-accent text-accent transition-colors'

const currentClassName =
  'rounded-md border-[2px] border-accent bg-accent px-4 py-2 text-white'

const disabledClassName =
  'rounded-md border-[2px] border-accent/20 px-4 py-2 text-accent/40'

interface Props {
  pagination: Pager
  // Preserved across page links when present in the URL (sorting / language / size).
  query?: {
    sortBy?: string
    orderBy?: string
    lang?: string
    size?: string
  }
}

const buildHref = (page: number, query?: Props['query']) => {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (query?.sortBy) params.set('sortBy', query.sortBy)
  if (query?.orderBy) params.set('orderBy', query.orderBy)
  if (query?.lang) params.set('lang', query.lang)
  if (query?.size) params.set('size', query.size)
  return `/posts?${params.toString()}`
}

// Numbered pager: Previous | 1 | 2 | … | N | Next, hidden on a single page.
// Up to 7 pages every number is shown; above that, 1 / prev / current / next / last with ellipses.
const getPageItems = (
  currentPage: number,
  totalPage: number,
): (number | '…')[] => {
  if (totalPage <= 7) {
    return Array.from({ length: totalPage }, (_, i) => i + 1)
  }
  const shown = [
    ...new Set([1, totalPage, currentPage - 1, currentPage, currentPage + 1]),
  ]
    .filter((n) => n >= 1 && n <= totalPage)
    .sort((a, b) => a - b)
  const items: (number | '…')[] = []
  shown.forEach((n, i) => {
    if (i > 0 && n - shown[i - 1] > 1) items.push('…')
    items.push(n)
  })
  return items
}

export const PostPagination: FC<Props> = ({ pagination, query }) => {
  const { currentPage, totalPage, hasPrevPage, hasNextPage } = pagination

  if (totalPage <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
    >
      {hasPrevPage ? (
        <Link href={buildHref(currentPage - 1, query)}>
          <MotionButtonBase tabIndex={-1} className={className}>
            Previous
          </MotionButtonBase>
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Previous
        </span>
      )}

      {getPageItems(currentPage, totalPage).map((item, i) =>
        item === '…' ? (
          <span key={`ellipsis-${i}`} className="px-1">
            …
          </span>
        ) : item === currentPage ? (
          <span key={item} aria-current="page" className={currentClassName}>
            {item}
          </span>
        ) : (
          <Link key={item} href={buildHref(item, query)}>
            <MotionButtonBase tabIndex={-1} className={className}>
              {item}
            </MotionButtonBase>
          </Link>
        ),
      )}

      {hasNextPage ? (
        <Link href={buildHref(currentPage + 1, query)}>
          <MotionButtonBase tabIndex={-1} className={className}>
            Next
          </MotionButtonBase>
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Next
        </span>
      )}
    </nav>
  )
}
