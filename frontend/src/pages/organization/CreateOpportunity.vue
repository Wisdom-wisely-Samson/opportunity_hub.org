<template>
  <div class="max-w-2xl space-y-6">
    <div class="flex items-center gap-3">
      <router-link
        to="/org/opportunities"
        class="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
      </router-link>
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
        {{ isEditing ? "Edit Opportunity" : "Post New Opportunity" }}
      </h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Basic Info -->
      <div class="card space-y-4">
        <h2 class="font-bold text-gray-900">Basic Information</h2>
        <div>
          <label class="label">Opportunity Title *</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="input-field"
            placeholder="e.g. Junior Software Developer"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Category *</label>
            <select v-model="form.category" required class="select-field">
              <option value="">Select category...</option>
              <option value="job">Job</option>
              <option value="scholarship">Scholarship</option>
              <option value="grant">Grant</option>
              <option value="training">Training</option>
              <option value="internship">Internship</option>
              <option value="fellowship">Fellowship</option>
              <option value="entrepreneurship">Entrepreneurship</option>
            </select>
          </div>
          <div>
            <label class="label">Status</label>
            <select v-model="form.status" class="select-field">
              <option value="active">Active (Published)</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div>
          <label class="label">Description *</label>
          <textarea
            v-model="form.description"
            required
            rows="5"
            class="textarea-field"
            placeholder="Describe the opportunity, responsibilities, and what candidates can expect..."
          ></textarea>
          <p class="text-xs text-gray-400 mt-1">
            {{ form.description?.length || 0 }}/5000
          </p>
        </div>

        <!-- Cover Image Upload -->
        <div>
          <label class="label"
            >Cover Image
            <span class="text-gray-400 font-normal">(optional)</span></label
          >

          <!-- Upload Area -->
          <div
            v-if="!coverImagePreview"
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary hover:bg-gray-50',
            ]"
          >
            <ImageUp class="w-8 h-8 mx-auto text-gray-300 mb-3" />
            <p class="text-sm font-medium text-gray-600">
              Click to upload or drag and drop
            </p>
            <p class="text-xs text-gray-400 mt-1">
              PNG, JPG, WEBP · Max 5MB · Recommended 1200×630px
            </p>
          </div>

          <!-- Preview -->
          <div
            v-else
            class="relative rounded-xl overflow-hidden border border-gray-200"
          >
            <img
              :src="coverImagePreview"
              alt="Cover preview"
              class="w-full h-48 object-cover"
            />
            <div
              class="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors group flex items-center justify-center"
            >
              <div
                class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2"
              >
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  @click="removeCoverImage"
                  class="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <input
            ref="fileInputRef"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            @change="handleFileChange"
          />
          <p v-if="coverImageError" class="text-xs text-red-500 mt-1">
            {{ coverImageError }}
          </p>
        </div>
      </div>

      <!-- Details -->
      <div class="card space-y-4">
        <h2 class="font-bold text-gray-900">Location & Deadline</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Location *</label>
            <input
              v-model="form.location"
              type="text"
              required
              class="input-field"
              placeholder="e.g. Kampala, Uganda"
            />
          </div>
          <div>
            <label class="label">Application Deadline *</label>
            <input
              v-model="form.deadline"
              type="date"
              required
              class="input-field"
              :min="minDate"
            />
          </div>
        </div>
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <input
            v-model="form.isRemote"
            type="checkbox"
            id="isRemote"
            class="w-4 h-4 text-primary rounded border-gray-300 cursor-pointer"
          />
          <label
            for="isRemote"
            class="text-sm font-medium text-gray-700 cursor-pointer"
            >This opportunity is remote / can be done online</label
          >
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label"
              >Salary / Stipend
              <span class="text-gray-400 font-normal">(optional)</span></label
            >
            <input
              v-model="form.salary"
              type="text"
              class="input-field"
              placeholder="e.g. $500/month or USD 6,000/year"
            />
          </div>
          <div>
            <label class="label"
              >Duration
              <span class="text-gray-400 font-normal">(optional)</span></label
            >
            <input
              v-model="form.duration"
              type="text"
              class="input-field"
              placeholder="e.g. 6 months, 1 year"
            />
          </div>
        </div>
      </div>

      <!-- Requirements -->
      <div class="card space-y-4">
        <h2 class="font-bold text-gray-900">Requirements & Benefits</h2>
        <div>
          <label class="label">Requirements</label>
          <div class="flex gap-2 mb-2">
            <input
              v-model="newReq"
              @keydown.enter.prevent="addItem('requirements', newReq)"
              type="text"
              class="input-field"
              placeholder="Add a requirement..."
            />
            <button
              type="button"
              @click="addItem('requirements', newReq)"
              class="btn-primary btn-sm px-4"
            >
              Add
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(req, i) in form.requirements"
              :key="i"
              class="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
            >
              {{ req }}
              <button
                type="button"
                @click="removeItem('requirements', i)"
                class="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        </div>
        <div>
          <label class="label">Benefits</label>
          <div class="flex gap-2 mb-2">
            <input
              v-model="newBenefit"
              @keydown.enter.prevent="addItem('benefits', newBenefit)"
              type="text"
              class="input-field"
              placeholder="Add a benefit..."
            />
            <button
              type="button"
              @click="addItem('benefits', newBenefit)"
              class="btn-primary btn-sm px-4"
            >
              Add
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(b, i) in form.benefits"
              :key="i"
              class="flex items-center gap-1.5 bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full"
            >
              {{ b }}
              <button
                type="button"
                @click="removeItem('benefits', i)"
                class="text-green-400 hover:text-red-500 transition-colors"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        </div>
        <div>
          <label class="label"
            >Tags
            <span class="text-gray-400 font-normal">(for search)</span></label
          >
          <div class="flex gap-2 mb-2">
            <input
              v-model="newTag"
              @keydown.enter.prevent="addItem('tags', newTag)"
              type="text"
              class="input-field"
              placeholder="e.g. technology, youth, women"
            />
            <button
              type="button"
              @click="addItem('tags', newTag)"
              class="btn-primary btn-sm px-4"
            >
              Add
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(tag, i) in form.tags"
              :key="i"
              class="flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeItem('tags', i)"
                class="text-primary/50 hover:text-red-500 transition-colors"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="submitError"
        class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
      >
        {{ submitError }}
      </div>

      <div class="flex gap-3">
        <router-link
          to="/org/opportunities"
          class="btn-outline btn-lg flex-1 text-center"
          >Cancel</router-link
        >
        <button
          type="submit"
          :disabled="isSubmitting"
          class="btn-primary btn-lg flex-1 flex items-center justify-center gap-2"
        >
          <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
          {{
            isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Opportunity"
                : "Post Opportunity"
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { opportunityService } from "@/services/opportunityService";
import { useToast } from "@/composables/useToast";
import { extractErrorMessage } from "@/utils/helpers";
import { ArrowLeft, ImageUp, X, Loader2 } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const isSubmitting = ref(false);
const submitError = ref("");
const newReq = ref("");
const newBenefit = ref("");
const newTag = ref("");

// Cover image state
const fileInputRef = ref(null);
const coverImageFile = ref(null);
const coverImagePreview = ref("");
const coverImageError = ref("");
const isDragging = ref(false);

const isEditing = computed(() => !!route.params.id);

const form = reactive({
  title: "",
  category: "",
  description: "",
  location: "",
  deadline: "",
  isRemote: false,
  salary: "",
  duration: "",
  requirements: [],
  benefits: [],
  tags: [],
  status: "active",
});

const minDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
});

const addItem = (field, val) => {
  const v = val?.trim();
  if (v && !form[field].includes(v)) form[field].push(v);
  if (field === "requirements") newReq.value = "";
  if (field === "benefits") newBenefit.value = "";
  if (field === "tags") newTag.value = "";
};

const removeItem = (field, idx) => form[field].splice(idx, 1);

const triggerFileInput = () => fileInputRef.value?.click();

const validateAndSetFile = (file) => {
  coverImageError.value = "";
  if (!file) return;
  const allowed = ["image/png", "image/jpeg", "image/webp"];
  if (!allowed.includes(file.type)) {
    coverImageError.value = "Only PNG, JPG, and WEBP images are allowed.";
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    coverImageError.value = "Image must be under 5MB.";
    return;
  }
  coverImageFile.value = file;
  coverImagePreview.value = URL.createObjectURL(file);
};

const handleFileChange = (e) => validateAndSetFile(e.target.files[0]);

const handleDrop = (e) => {
  isDragging.value = false;
  validateAndSetFile(e.dataTransfer.files[0]);
};

const removeCoverImage = () => {
  coverImageFile.value = null;
  coverImagePreview.value = "";
  coverImageError.value = "";
  if (fileInputRef.value) fileInputRef.value.value = "";
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitError.value = "";

  try {
    const payload = new FormData();

    // Append all form fields
    Object.entries(form).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        payload.append(key, JSON.stringify(val));
      } else {
        payload.append(key, val);
      }
    });

    // Append cover image if selected
    if (coverImageFile.value) {
      payload.append("coverImage", coverImageFile.value);
    }

    if (isEditing.value) {
      await opportunityService.updateOpportunity(route.params.id, payload);
      toast.success("Opportunity updated!");
    } else {
      await opportunityService.createOpportunity(payload);
      toast.success("Opportunity posted!");
    }

    router.push("/org/opportunities");
  } catch (err) {
    submitError.value = extractErrorMessage(err);
  } finally {
    isSubmitting.value = false;
  }
};
onMounted(async () => {
  if (!isEditing.value) return;

  try {
    const { data } = await opportunityService.getOpportunityById(
      route.params.id,
    );
    const opp = data.data;

    // Populate form fields
    form.title = opp.title;
    form.category = opp.category;
    form.description = opp.description;
    form.location = opp.location;
    form.deadline = opp.deadline?.split("T")[0]; // ensure YYYY-MM-DD
    form.isRemote = opp.isRemote;
    form.salary = opp.salary || "";
    form.duration = opp.duration || "";
    form.requirements = opp.requirements || [];
    form.benefits = opp.benefits || [];
    form.tags = opp.tags || [];
    form.status = opp.status || "active";

    // Load existing cover image preview
    if (opp.coverImage?.url) {
      coverImagePreview.value = opp.coverImage.url;
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to load opportunity");
  }
});
</script>
