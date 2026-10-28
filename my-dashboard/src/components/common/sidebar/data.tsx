import { GearIcon } from "@nextadmin/components/common/header/icons";
import { HomeIcon } from "./icon";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: <HomeIcon />,
        items: [
          {
            title: "OVERVIEW",
            url: "/",
          },
        ],
      },
      {
        title: "Account Settings",
        url: "/settings",
        icon: <GearIcon />,
        items: [],
        hint: "SECURITY",
      },
    ],
  },
];
