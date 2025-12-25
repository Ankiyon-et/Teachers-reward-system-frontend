// src/composables/usePublicTeacherSelection.ts
import { ref, watch } from "vue";
import * as api from "@/services/publicSelection";
import type {
  PublicSchool,
  PublicGrade,
  PublicTeacher,
} from "@/services/publicSelection";

export function usePublicTeacherSelection() {
  const schools = ref<PublicSchool[]>([]);
  const grades = ref<PublicGrade[]>([]);
  const teachers = ref<PublicTeacher[]>([]);

  const selectedSchoolId = ref<number | null>(null);
  const selectedGradeId = ref<number | null>(null);
  const selectedTeacher = ref<PublicTeacher | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSchools() {
    loading.value = true;
    try {
      schools.value = await api.getSchools();
    } catch (e) {
      error.value = "Failed to load schools";
    } finally {
      loading.value = false;
    }
  }

  async function fetchGrades() {
    if (!selectedSchoolId.value) return;
    loading.value = true;
    try {
      grades.value = await api.getGradesBySchool(selectedSchoolId.value);
    } finally {
      loading.value = false;
    }
  }

  async function fetchTeachers() {
    if (!selectedSchoolId.value || !selectedGradeId.value) return;
    loading.value = true;
    try {
      teachers.value = await api.getTeachers(
        selectedSchoolId.value,
        selectedGradeId.value
      );
    } finally {
      loading.value = false;
    }
  }

  watch(selectedSchoolId, () => {
    grades.value = [];
    teachers.value = [];
    selectedGradeId.value = null;
    selectedTeacher.value = null;
    fetchGrades();
  });

  watch(selectedGradeId, () => {
    teachers.value = [];
    selectedTeacher.value = null;
    fetchTeachers();
  });

  return {
    schools,
    grades,
    teachers,
    selectedSchoolId,
    selectedGradeId,
    selectedTeacher,
    loading,
    error,
    fetchSchools,
  };
}
