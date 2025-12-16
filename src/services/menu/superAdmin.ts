import { GridIcon, CalenderIcon, UserCircleIcon, ListIcon, TableIcon, PageIcon } from "@/icons";

export const superAdminMenu = [
  {
    title: "Super Admin Pages",
    items: [
      { name: "Dashboard", path: "/super-admin/dashboard", icon: GridIcon },
      { name: "Schools", path: "/super-admin/schools", icon: TableIcon },
      { name: "Super Admins", path: "/super-admin/super-admins", icon: UserCircleIcon },
      { name: "Profile", path: "/super-admin/profile", icon: UserCircleIcon },
    ],
  },
];
