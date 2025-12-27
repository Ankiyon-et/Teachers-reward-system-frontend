import { api } from "./api";

export type SchoolAdmin = {
  id: number;
  title: string;
  school_id: number;
  user: {
    id: number;
    name: string;
    email: string;
    role_id: number;
  };
};

export type CreateSchoolAdminPayload = {
  name: string;
  email: string;
  password: string;
  title: string;
};

export async function getSchoolAdmins() {
  const res = await api.get<SchoolAdmin[]>("/list/school-admins");
  return res.data;
}

export async function createSchoolAdmin(payload: CreateSchoolAdminPayload) {
  const res = await api.post("/create/school-admins", payload);
  return res.data;
}

export async function deleteSchoolAdmin(id: number) {
  const res = await api.delete(`/delete/school-admin/${id}`);
  return res.data;
}
