export const ADMIN_TEMPLATE_BASE_PATH = "/admin-template";

export function adminTemplatePath(path: string) {
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path === ADMIN_TEMPLATE_BASE_PATH ||
    path.startsWith(`${ADMIN_TEMPLATE_BASE_PATH}/`)
  ) {
    return path;
  }

  return path === "/" ? ADMIN_TEMPLATE_BASE_PATH : `${ADMIN_TEMPLATE_BASE_PATH}${path}`;
}
