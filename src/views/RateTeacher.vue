<template>
  <FullScreenLayout>
    <div
      class="min-h-screen flex items-center justify-center
             bg-gray-50 dark:bg-gray-950 px-4"
    >
      <div
        class="w-full max-w-md space-y-6
               bg-white dark:bg-gray-900
               border border-gray-200 dark:border-gray-800
               rounded-xl p-6"
      >
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">
          Rate a Teacher
        </h2>

        <!-- School -->
        <div class="space-y-1">
          <label class="label">School</label>
          <select v-model="selectedSchoolId" class="input">
            <option disabled value="">Select school</option>
            <option v-for="s in schools" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
        </div>

        <!-- Grade -->
        <div v-if="grades.length" class="space-y-1">
          <label class="label">Grade</label>
          <select v-model="selectedGradeId" class="input">
            <option disabled value="">Select grade</option>
            <option v-for="g in grades" :key="g.id" :value="g.id">
              {{ g.name }}
            </option>
          </select>
        </div>

        <!-- Teacher -->
        <div v-if="teachers.length" class="space-y-1">
          <label class="label">Teacher</label>
          <select v-model="selectedTeacher" class="input">
            <option disabled value="">Select teacher</option>
            <option v-for="t in teachers" :key="t.id" :value="t">
              {{ t.user.name }} — ⭐ {{ t.average_rating }}
            </option>
          </select>
        </div>

        <!-- Star Rating -->
        <div class="space-y-1">
          <label class="label">Rating</label>

          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="rating = star"
              class="text-3xl transition"
              :class="
                star <= rating
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              "
            >
              ★
            </button>
          </div>
        </div>

        <!-- Comment -->
        <div class="space-y-1">
          <label class="label">Comment (optional)</label>
          <textarea
            v-model="comment"
            rows="3"
            class="input resize-none"
            placeholder="Write your feedback..."
          />
        </div>

        <!-- Submit -->
        <Button
          variant="primary"
          class="w-full"
          :disabled="!selectedTeacher"
          @click="submitRating"
        >
          Submit Rating
        </Button>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import FullScreenLayout from "@/components/layout/FullScreenLayout.vue";
import Button from "@/components/ui/Button.vue";
import { usePublicTeacherSelection } from "@/composables/usePublicTeacherSelection";
import { api } from "@/services/api";

const {
  schools,
  grades,
  teachers,
  selectedSchoolId,
  selectedGradeId,
  selectedTeacher,
  fetchSchools,
} = usePublicTeacherSelection();

const rating = ref(5);
const comment = ref("");

onMounted(fetchSchools);

async function submitRating() {
  if (!selectedTeacher.value) return;

  await api.post("/rate", {
    teacher_id: selectedTeacher.value.id,
    value: rating.value,
    comment: comment.value,
  });

  alert("Rating submitted successfully 🎉");

  // reset
  rating.value = 5;
  comment.value = "";
}
</script>

<style scoped>
.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(55 65 81);
}

.dark .label {
  color: rgb(209 213 219);
}

.input {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid rgb(209 213 219);
  padding: 0.5rem 0.75rem;
  background: white;
  color: rgb(17 24 39);
}

.dark .input {
  background: rgb(17 24 39);
  border-color: rgb(55 65 81);
  color: white;
}
</style>
