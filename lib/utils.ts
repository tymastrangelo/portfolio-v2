/**
 * Conditional className joiner.
 *
 * The usual shadcn version is clsx + tailwind-merge. Nothing in this codebase
 * passes conflicting Tailwind utilities that need resolving (the calls are all
 * `cn(base, condition && extra)`), so two dependencies would buy nothing here.
 * If a component ever does need real conflict resolution, swap this for
 * tailwind-merge rather than working around it at the call site.
 */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
