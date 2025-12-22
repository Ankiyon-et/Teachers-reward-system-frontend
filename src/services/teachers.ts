import { api } from "./api";

export type Teacher = {
  id: number;
  subject: string;
  user: {
    name: string;
    email: string;
  };
};

export type CreateTeacherPayload = {
  name: string;
  email: string;
  password: string;
  subject: string;
};

export async function getTeachers() {
  const res = await api.get<Teacher[]>("/list/teachers");
  return res.data;
}

export async function createTeacher(payload: CreateTeacherPayload) {
  const res = await api.post("/create/teachers", payload);
  return res.data;
}

export async function deleteTeacher(id: number) {
  const res = await api.delete(`/delete/teachers/${id}`);
  return res.data;
}

export async function assignGradesToTeacher(
  teacherId: number,
  gradeIds: number[]
) {
  const res = await api.post(
    `/teachers/${teacherId}/assign-grades`,
    { grade_ids: gradeIds }
  );
  return res.data;
}
