import { NAV_DATA } from "./data";
import { ADMIN_TEMPLATE_BASE_PATH } from "@nextadmin/utils/admin-path";

/**
 * Checks if the current pathname matches the target href, or if the pathname is a subpath of the target href.=
 */
export function isPathActive(href: string, pathname: string): boolean {
  if (!href) return false;

  const route = pathname.startsWith(ADMIN_TEMPLATE_BASE_PATH)
    ? pathname.slice(ADMIN_TEMPLATE_BASE_PATH.length) || "/"
    : pathname;

  if (href === "/") {
    return route === "/";
  }

  return route === href || route.startsWith(href + "/");
}

/**
 * Find the nav group whose child URLs include the current pathname.
 * Returns the group's `title` (used as the Disclosure `id`) or null.
 */
export function findActiveGroupKey(pathname: string): string | null {
  const route = pathname.startsWith(ADMIN_TEMPLATE_BASE_PATH)
    ? pathname.slice(ADMIN_TEMPLATE_BASE_PATH.length) || "/"
    : pathname;

  for (const section of NAV_DATA) {
    for (const item of section.items) {
      if (item.items && item.items.length > 0) {
        const hasMatch = item.items.some((child) => child.url && isPathActive(child.url, route));
        if (hasMatch) return item.title;
      }
    }
  }
  return null;
}
