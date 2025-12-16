import { GridIcon, UserCircleIcon, ListIcon, TableIcon } from "@/icons";

export const schoolAdminMenu = [
  {
    title: "School Admin Pages",
    items: [
      { name: "Dashboard", path: "/school-admin/dashboard", icon: GridIcon },
      { name: "Teachers", path: "/school-admin/teachers", icon: UserCircleIcon },
      { name: "Grades", path: "/school-admin/grades", icon: TableIcon },
      { name: "Reports", path: "/school-admin/reports", icon: ListIcon },
      { name: "Profile", path: "/school-admin/profile", icon: UserCircleIcon },
    ],
  },
];
