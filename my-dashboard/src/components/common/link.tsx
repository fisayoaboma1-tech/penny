import NextLink from "next/link";
import type { ComponentProps } from "react";
import { adminTemplatePath } from "@nextadmin/utils/admin-path";

type LinkProps = ComponentProps<typeof NextLink>;

export default function Link({ href, ...props }: LinkProps) {
  return (
    <NextLink
      {...props}
      href={typeof href === "string" ? adminTemplatePath(href) : href}
    />
  );
}
