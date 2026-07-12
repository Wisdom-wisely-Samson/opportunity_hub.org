<template>
  <div class="space-y-6 max-w-2xl">
    <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
      Organization Profile
    </h1>

    <!-- Logo Upload -->
    <div class="card">
      <h2 class="font-bold text-gray-900 mb-4">Organization Logo</h2>
      <div class="flex items-center gap-4 sm:gap-6">
        <div
          class="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-gray-200"
        >
          <img
            v-if="form.logoPreview || org?.logo?.url"
            :src="form.logoPreview || org?.logo?.url"
            alt="Logo"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-primary text-2xl font-bold">{{
            initials
          }}</span>
        </div>
        <div>
          <label
            class="btn-outline btn-sm cursor-pointer inline-flex items-center gap-1.5"
          >
            <Upload class="w-3.5 h-3.5" />
            Change Logo
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleLogoChange"
            />
          </label>
          <p class="text-xs text-gray-500 mt-1.5">JPG, PNG or WebP. Max 5MB.</p>
          <button
            v-if="form.logoFile"
            @click="uploadLogo"
            :disabled="uploadingLogo"
            class="btn-primary btn-sm mt-2 flex items-center gap-2"
          >
            <Loader2 v-if="uploadingLogo" class="w-4 h-4 animate-spin" />
            {{ uploadingLogo ? "Uploading..." : "Save Logo" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Form -->
    <div class="card">
      <h2 class="font-bold text-gray-900 mb-4">Organization Details</h2>
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="label">Organization Name *</label>
          <input
            v-model="form.organizationName"
            type="text"
            required
            class="input-field"
          />
        </div>
        <div>
          <label class="label">Organization Type *</label>
          <select v-model="form.type" required class="select-field">
            <option value="">Select type...</option>
            <option value="ngo">NGO / Non-Profit</option>
            <option value="employer">Employer / Company</option>
            <option value="university">University / Academic</option>
            <option value="training_provider">Training Provider</option>
            <option value="government">Government Agency</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Contact Email</label>
            <input
              v-model="form.contactEmail"
              type="email"
              class="input-field"
              placeholder="contact@org.com"
            />
          </div>
          <div>
            <label class="label">Phone Number</label>
            <input
              v-model="form.phone"
              type="tel"
              class="input-field"
              placeholder="+254 700 000 000"
            />
          </div>
        </div>
        <div>
          <label class="label">Website</label>
          <input
            v-model="form.website"
            type="url"
            class="input-field"
            placeholder="https://yourorg.org"
          />
        </div>
        <div>
          <label class="label">Country</label>
          <input
            v-model="form.country"
            type="text"
            class="input-field"
            placeholder="e.g. Uganda"
          />
        </div>
        <div>
          <label class="label">Address</label>
          <input
            v-model="form.address"
            type="text"
            class="input-field"
            placeholder="Physical address"
          />
        </div>
        <div>
          <label class="label">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="textarea-field"
            placeholder="Tell us about your organization, mission, and what you do..."
          ></textarea>
          <p class="text-xs text-gray-400 mt-1">
            {{ form.description?.length || 0 }}/1000
          </p>
        </div>

        <div
          v-if="saveError"
          class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
        >
          {{ saveError }}
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="btn-primary w-full btn-lg flex items-center justify-center gap-2"
        >
          <Loader2 v-if="isSaving" class="w-5 h-5 animate-spin" />
          {{ isSaving ? "Saving..." : "Save Profile" }}
        </button>
      </form>
    </div>

    <!-- Verification Status -->
    <div class="card">
      <h2 class="font-bold text-gray-900 mb-3">Verification Status</h2>
      <div
        v-if="org?.isVerified"
        class="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl"
      >
        <BadgeCheck class="w-8 h-8 text-green-500 flex-shrink-0" />
        <div>
          <p class="font-semibold text-green-800">Verified Organization</p>
          <p class="text-sm text-green-600">
            Verified on {{ new Date(org.verifiedAt).toLocaleDateString() }}
          </p>
        </div>
      </div>
      <div
        v-else
        class="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800"
      >
        <Clock class="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p class="font-semibold mb-1">Pending Verification</p>
          <p>
            Our admin team will review and verify your organization. This
            usually takes 1-3 business days.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { organizationService } from "@/services/organizationService";
import { useToast } from "@/composables/useToast";
import { extractErrorMessage } from "@/utils/helpers";
import { Upload, Loader2, BadgeCheck, Clock } from "lucide-vue-next";

const toast = useToast();
const org = ref(null);
const isSaving = ref(false);
const uploadingLogo = ref(false);
const saveError = ref("");

const form = reactive({
  organizationName: "",
  type: "",
  contactEmail: "",
  phone: "",
  website: "",
  country: "",
  address: "",
  description: "",
  logoFile: null,
  logoPreview: "",
});

const initials = computed(() => {
  return (form.organizationName || "O")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});

const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Logo must be under 5MB");
    return;
  }
  form.logoFile = file;
  form.logoPreview = URL.createObjectURL(file);
};

const uploadLogo = async () => {
  if (!form.logoFile) return;
  uploadingLogo.value = true;
  try {
    const fd = new FormData();
    fd.append("logo", form.logoFile);
    const { data } = await organizationService.uploadLogo(fd);
    org.value = data.data;
    form.logoFile = null;
    form.logoPreview = "";
    toast.success("Logo updated!");
  } catch (err) {
    toast.error(extractErrorMessage(err));
  } finally {
    uploadingLogo.value = false;
  }
};

const handleSave = async () => {
  isSaving.value = true;
  saveError.value = "";
  try {
    const payload = {
      organizationName: form.organizationName,
      type: form.type,
      contactEmail: form.contactEmail,
      phone: form.phone,
      website: form.website,
      country: form.country,
      address: form.address,
      description: form.description,
    };
    const { data } = await organizationService.updateProfile(payload);
    org.value = data.data;
    toast.success("Profile saved!");
  } catch (err) {
    saveError.value = extractErrorMessage(err);
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  try {
    const { data } = await organizationService.getMyProfile();
    org.value = data.data;
    Object.assign(form, {
      organizationName: org.value.organizationName || "",
      type: org.value.type || "",
      contactEmail: org.value.contactEmail || "",
      phone: org.value.phone || "",
      website: org.value.website || "",
      country: org.value.country || "",
      address: org.value.address || "",
      description: org.value.description || "",
    });
  } catch {
    /* silent */
  }
});
</script>
