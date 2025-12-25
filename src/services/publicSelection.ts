// src/services/publicSelection.ts
import { api } from "./api";

export type PublicSchool = {
  id: number;
  name: string;
  logo?: string | null;
};

export type PublicGrade = {
  id: number;
  name: string;
};

export type PublicTeacher = {
  id: number;
  subject: string;
  average_rating: string;
  user: {
    id: number;
    name: string;
  };
};

// GET /list/schools
export async function getSchools() {
  const res = await api.get<PublicSchool[]>("/list/schools");
  return res.data;
}

// GET /list/grades/{schoolId}
export async function getGradesBySchool(schoolId: number) {
  const res = await api.get<PublicGrade[]>(`/list/grades/${schoolId}`);
  return res.data;
}

// GET /list/teachers/{schoolId}/{gradeId}
export async function getTeachers(schoolId: number, gradeId: number) {
  const res = await api.get<PublicTeacher[]>(
    `/list/teachers/${schoolId}/${gradeId}`
  );
  return res.data;
}
