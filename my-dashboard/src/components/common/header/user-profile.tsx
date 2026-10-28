"use client";

import {
  GearIcon,
  LogoutIcon,
} from "@nextadmin/components/common/header/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@nextadmin/components/tailgrids/core/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@nextadmin/components/tailgrids/core/dropdown";
import { AltArrowDownIcon } from "@nextadmin/utils/icon";
import Link from "@nextadmin/components/common/link";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { useRouter } from "next/navigation";

interface UserProfileMenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export function UserProfileButton() {
  const { profile, user, signOut } = useAdminAuth();
  const router = useRouter();
  const displayUser: UserProfile = {
    name: profile?.full_name || user?.email || "Admin",
    email: profile?.email || user?.email || "",
    avatarUrl: profile?.profile_image_url || undefined,
  };

  const menuItems: UserProfileMenuItem[] = [
    {
      href: "/settings",
      icon: <GearIcon />,
      label: "Account Settings",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2.5 rounded-lg border-0 p-0 transition-all outline-none focus-visible:ring-4 focus-visible:ring-input-primary-focus-border/20 focus-visible:ring-offset-1">
        <Avatar>
          <AvatarImage src={displayUser.avatarUrl} alt={displayUser.name} className="size-10 rounded-lg" />
          <AvatarFallback className="rounded-lg border border-border-secondary-alt bg-background-gray-secondary_alt">
            {displayUser.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <span className="text-sm leading-5 font-medium text-text-primary">{displayUser.name}</span>

        <AltArrowDownIcon className="text-icon-tertiary transition-transform duration-200 group-aria-expanded:-rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent placement="bottom end" className="w-70 overflow-hidden p-0 shadow-3xl">
        <DropdownMenuHeader className="flex w-full items-center justify-start gap-2 border-b border-border-secondary-alt px-4 py-3">
          <Avatar size="md">
            <AvatarImage src={displayUser.avatarUrl} alt={displayUser.name} />
            <AvatarFallback className="border border-border-secondary-alt bg-background-gray-secondary_alt">
              {displayUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">{displayUser.name}</span>
            <span className="truncate text-xs text-gray-500">{displayUser.email}</span>
          </span>
        </DropdownMenuHeader>

        <DropdownMenuSection className="p-1.5">
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              href={item.href}
              className="cursor-pointer px-3 py-2.5"
              render={(domProps) =>
                "href" in domProps ? <Link {...domProps} /> : <div {...domProps} />
              }
            >
              <span className="shrink-0 text-icon-secondary group-hover:text-text-primary">
                {item.icon}
              </span>
              <span className="leading-5 font-medium">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuSection>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onAction={async () => {
            await signOut();
            router.replace("/admin-template/login");
          }}
          className="m-1.5 w-auto cursor-pointer px-3 py-2.5"
        >
          <span className="text-icon-secondary group-hover:text-text-primary">
            <LogoutIcon />
          </span>
          <span className="leading-5">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
