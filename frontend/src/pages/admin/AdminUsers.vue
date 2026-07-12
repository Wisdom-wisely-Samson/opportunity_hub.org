<template>
  <div class="admin-page space-y-6 animate-fade-in">
    <section class="admin-hero">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-2xl">
          <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-primary-400/10 px-3 py-1 text-xs font-semibold text-primary-100">
            <ShieldCheckIcon class="h-4 w-4" />
            Admin Console
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-white md:text-4xl">
            User Management
          </h1>
          <p class="mt-2 text-sm leading-6 text-primary-50">
            Monitor accounts, update access levels, and keep user status clean across the platform.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <PrimaryButton variant="ghost" @click="resetFilters">
            Reset Filters
          </PrimaryButton>
          <PrimaryButton :disabled="isLoading" @click="fetchUsers">
            <ArrowPathIcon :class="['h-4 w-4', isLoading && 'animate-spin']" />
            Refresh
          </PrimaryButton>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        class="admin-card"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-accent-100">{{ metric.label }}</p>
            <p class="mt-2 text-3xl font-bold text-white">{{ metric.value }}</p>
            <p class="mt-1 text-xs text-primary-100">{{ metric.caption }}</p>
          </div>
          <div :class="['flex h-11 w-11 items-center justify-center rounded-xl', metric.iconClass]">
            <component :is="metric.icon" class="h-5 w-5 text-white" />
          </div>
        </div>
      </article>
    </section>

    <section class="admin-panel">
      <div class="border-b admin-divider p-4">
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div class="relative flex-1">
            <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-100" />
            <input
              v-model="filters.search"
              type="search"
              placeholder="Search by name or email"
              class="admin-input pl-10 pr-4"
            />
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[520px]">
            <select
              v-model="filters.role"
              class="admin-input"
              @change="resetAndFetch"
            >
              <option value="" class="text-gray-900">All roles</option>
              <option v-for="role in roleOptions" :key="role" :value="role" class="text-gray-900">
                {{ formatLabel(role) }}
              </option>
            </select>

            <select
              v-model="filters.status"
              class="admin-input"
              @change="resetAndFetch"
            >
              <option value="" class="text-gray-900">All status</option>
              <option value="active" class="text-gray-900">Active</option>
              <option value="inactive" class="text-gray-900">Inactive</option>
            </select>

            <select
              v-model="filters.verified"
              class="admin-input"
              @change="pageChanged(1)"
            >
              <option value="" class="text-gray-900">Any email</option>
              <option value="verified" class="text-gray-900">Verified</option>
              <option value="unverified" class="text-gray-900">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 border-b admin-divider px-4 py-3 text-sm text-primary-100 sm:flex-row sm:items-center sm:justify-between">
        <span>{{ pagination.total || filteredUsers.length }} users found</span>
        <span>Page {{ pagination.page || page }} of {{ pagination.pages || 1 }}</span>
      </div>

      <div v-if="isLoading" class="space-y-4 p-5">
        <LoadingSkeleton v-for="n in 6" :key="n" type="list" />
      </div>

      <EmptyState
        v-else-if="!filteredUsers.length"
        title="No users found"
        description="Try adjusting the filters or refresh the user list."
        :icon="UsersIcon"
      />

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[860px] text-left">
          <thead class="admin-table-head">
            <tr>
              <th class="px-5 py-3 font-semibold">User</th>
              <th class="px-5 py-3 font-semibold">Role</th>
              <th class="px-5 py-3 font-semibold">Status</th>
              <th class="px-5 py-3 font-semibold">Email</th>
              <th class="px-5 py-3 font-semibold">Joined</th>
              <th class="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="user in filteredUsers" :key="user._id" class="admin-row">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-500/15 text-sm font-bold text-primary-100">
                    <img
                      v-if="user.profilePicture?.url"
                      :src="user.profilePicture.url"
                      :alt="user.fullName || user.email"
                      class="h-full w-full object-cover"
                    />
                    <span v-else>{{ initials(user) }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="truncate font-semibold text-white">{{ user.fullName || "Unnamed user" }}</p>
                    <p class="truncate text-xs text-primary-100">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4">
                <span :class="roleClass(user.role)">
                  {{ formatLabel(user.role) }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span :class="statusClass(user.isActive)">
                  {{ user.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span :class="verifiedClass(user.isEmailVerified)">
                  <CheckBadgeIcon v-if="user.isEmailVerified" class="h-4 w-4" />
                  {{ user.isEmailVerified ? "Verified" : "Unverified" }}
                </span>
              </td>
              <td class="px-5 py-4 text-sm text-primary-100">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-5 py-4">
                <div class="flex justify-end gap-2">
                  <button
                    class="admin-icon-button"
                    title="View user"
                    @click="viewUser(user)"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </button>
                  <button
                    class="admin-icon-button"
                    title="Edit access"
                    @click="editUser(user)"
                  >
                    <PencilSquareIcon class="h-4 w-4" />
                  </button>
                  <button
                    class="rounded-lg border border-red-400/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                    title="Deactivate user"
                    @click="deleteUser(user)"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Pagination
      :current-page="page"
      :total-pages="pagination.pages || 1"
      @update:page="pageChanged"
    />

    <div
      v-if="showDetails && selectedUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/85 p-4 backdrop-blur"
      @click.self="closePanels"
    >
      <div class="w-full max-w-xl rounded-2xl border border-primary-500/50 bg-primary-800 p-6 shadow-2xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-primary-200">User Profile</p>
            <h2 class="mt-1 text-2xl font-bold text-white">{{ selectedUser.fullName || "Unnamed user" }}</h2>
            <p class="text-sm text-primary-100">{{ selectedUser.email }}</p>
          </div>
          <button class="rounded-lg p-2 text-primary-100 hover:bg-primary-700 hover:text-accent" @click="closePanels">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <dl class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div v-for="item in detailItems" :key="item.label" class="admin-inner p-4">
            <dt class="text-xs font-medium uppercase tracking-wider text-accent-100">{{ item.label }}</dt>
            <dd class="mt-1 text-sm font-semibold text-white">{{ item.value }}</dd>
          </div>
        </dl>

        <div class="mt-6 flex justify-end gap-3">
          <PrimaryButton variant="ghost" @click="closePanels">Close</PrimaryButton>
          <PrimaryButton @click="editUser(selectedUser)">
            <PencilSquareIcon class="h-4 w-4" />
            Edit Access
          </PrimaryButton>
        </div>
      </div>
    </div>

    <div
      v-if="showEdit && selectedUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/85 p-4 backdrop-blur"
      @click.self="closePanels"
    >
      <form class="w-full max-w-lg rounded-2xl border border-primary-500/50 bg-primary-800 p-6 shadow-2xl" @submit.prevent="saveUser">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-primary-200">Access Control</p>
            <h2 class="mt-1 text-2xl font-bold text-white">Edit user access</h2>
            <p class="text-sm text-primary-100">{{ selectedUser.email }}</p>
          </div>
          <button type="button" class="rounded-lg p-2 text-primary-100 hover:bg-primary-700 hover:text-accent" @click="closePanels">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <div class="mt-6 space-y-4">
          <label class="block">
            <span class="text-sm font-medium text-accent-100">Role</span>
            <select v-model="editForm.role" class="admin-input mt-2">
              <option v-for="role in roleOptions" :key="role" :value="role" class="text-gray-900">
                {{ formatLabel(role) }}
              </option>
            </select>
          </label>

          <div class="grid gap-3 sm:grid-cols-2">
            <label class="admin-inner flex items-center justify-between p-4">
              <span>
                <span class="block text-sm font-medium text-white">Active account</span>
                <span class="text-xs text-primary-100">Allow platform access</span>
              </span>
              <input v-model="editForm.isActive" type="checkbox" class="h-5 w-5 rounded border-primary-300 bg-primary-900 text-accent focus:ring-accent" />
            </label>

            <label class="admin-inner flex items-center justify-between p-4">
              <span>
                <span class="block text-sm font-medium text-white">Email verified</span>
                <span class="text-xs text-primary-100">Mark email as trusted</span>
              </span>
              <input v-model="editForm.isEmailVerified" type="checkbox" class="h-5 w-5 rounded border-primary-300 bg-primary-900 text-accent focus:ring-accent" />
            </label>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <PrimaryButton type="button" variant="ghost" @click="closePanels">Cancel</PrimaryButton>
          <PrimaryButton type="submit" :disabled="saving">
            <ArrowPathIcon v-if="saving" class="h-4 w-4 animate-spin" />
            Save Changes
          </PrimaryButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import {
  ArrowPathIcon,
  BuildingOffice2Icon,
  CheckBadgeIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

import EmptyState from "@/components/ui/EmptyState.vue";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton.vue";
import Pagination from "@/components/ui/Pagination.vue";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";
import { useToast } from "@/composables/useToast";
import { adminService } from "@/services/adminService";

const toast = useToast();

const isLoading = ref(true);
const saving = ref(false);
const users = ref([]);
const dashboard = ref({});
const selectedUser = ref(null);
const showDetails = ref(false);
const showEdit = ref(false);
const page = ref(1);
const pagination = ref({ page: 1, pages: 1, total: 0 });

const filters = reactive({
  search: "",
  role: "",
  status: "",
  verified: "",
});

const editForm = reactive({
  role: "refugee",
  isActive: true,
  isEmailVerified: false,
});

const roleOptions = ["refugee", "organization", "admin"];

const filteredUsers = computed(() => {
  if (!filters.verified) return users.value;

  return users.value.filter((user) => {
    return filters.verified === "verified"
      ? user.isEmailVerified
      : !user.isEmailVerified;
  });
});

const roleCounts = computed(() => {
  return (dashboard.value.usersByRole || []).reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});
});

const metrics = computed(() => [
  {
    label: "Total Users",
    value: dashboard.value.stats?.totalUsers ?? pagination.value.total ?? 0,
    caption: "Active platform accounts",
    icon: UsersIcon,
    iconClass: "bg-blue-500/20",
  },
  {
    label: "Refugees",
    value: roleCounts.value.refugee || 0,
    caption: "Talent and opportunity seekers",
    icon: UserGroupIcon,
    iconClass: "bg-emerald-500/20",
  },
  {
    label: "Organizations",
    value: roleCounts.value.organization || 0,
    caption: "Partner and employer accounts",
    icon: BuildingOffice2Icon,
    iconClass: "bg-violet-500/20",
  },
  {
    label: "Admins",
    value: roleCounts.value.admin || 0,
    caption: "Privileged console users",
    icon: ShieldCheckIcon,
    iconClass: "bg-amber-500/20",
  },
]);

const detailItems = computed(() => {
  const user = selectedUser.value || {};

  return [
    { label: "Role", value: formatLabel(user.role) },
    { label: "Status", value: user.isActive ? "Active" : "Inactive" },
    { label: "Email", value: user.isEmailVerified ? "Verified" : "Unverified" },
    { label: "Joined", value: formatDate(user.createdAt) },
    { label: "Last Login", value: formatDate(user.lastLogin) },
    { label: "Location", value: user.currentLocation || "Not provided" },
  ];
});

let searchTimeout = null;

watch(
  () => filters.search,
  () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      page.value = 1;
      fetchUsers();
    }, 350);
  }
);

const fetchDashboard = async () => {
  try {
    const { data } = await adminService.getDashboard();
    dashboard.value = data.data || {};
  } catch {
    dashboard.value = {};
  }
};

const fetchUsers = async () => {
  isLoading.value = true;

  try {
    const params = {
      page: page.value,
      limit: 20,
      search: filters.search || undefined,
      role: filters.role || undefined,
      active: filters.status === "active" ? true : filters.status === "inactive" ? false : undefined,
    };

    const { data } = await adminService.getUsers(params);
    users.value = data.data || [];
    pagination.value = data.meta || { page: page.value, pages: 1, total: users.value.length };
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to load users");
  } finally {
    isLoading.value = false;
  }
};

const resetAndFetch = () => {
  page.value = 1;
  fetchUsers();
};

const resetFilters = () => {
  filters.search = "";
  filters.role = "";
  filters.status = "";
  filters.verified = "";
  page.value = 1;
  fetchUsers();
};

const pageChanged = (nextPage) => {
  page.value = nextPage;
  fetchUsers();
};

const viewUser = (user) => {
  selectedUser.value = user;
  showEdit.value = false;
  showDetails.value = true;
};

const editUser = (user) => {
  selectedUser.value = user;
  editForm.role = user.role || "refugee";
  editForm.isActive = user.isActive !== false;
  editForm.isEmailVerified = Boolean(user.isEmailVerified);
  showDetails.value = false;
  showEdit.value = true;
};

const saveUser = async () => {
  if (!selectedUser.value?._id) return;
  saving.value = true;

  try {
    const { data } = await adminService.updateUser(selectedUser.value._id, {
      role: editForm.role,
      isActive: editForm.isActive,
      isEmailVerified: editForm.isEmailVerified,
    });

    const updated = data.data;
    users.value = users.value.map((user) => (user._id === updated._id ? updated : user));
    selectedUser.value = updated;
    toast.success("User access updated");
    closePanels();
    fetchDashboard();
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to update user");
  } finally {
    saving.value = false;
  }
};

const deleteUser = async (user) => {
  if (!window.confirm(`Deactivate ${user.fullName || user.email}?`)) return;

  try {
    await adminService.deleteUser(user._id);
    users.value = users.value.map((item) =>
      item._id === user._id ? { ...item, isActive: false } : item
    );
    toast.success("User deactivated");
    fetchDashboard();
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to deactivate user");
  }
};

const closePanels = () => {
  showDetails.value = false;
  showEdit.value = false;
  selectedUser.value = null;
};

const initials = (user) => {
  const source = user.fullName || user.email || "U";
  return source
    .split(/[.@\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const formatLabel = (value) => {
  if (!value) return "Not set";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const roleClass = (role) => {
  const classes = {
    admin: "border-red-400/20 bg-red-500/10 text-red-200",
    organization: "border-violet-400/20 bg-violet-500/10 text-violet-200",
    refugee: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  };

  return `inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${classes[role] || "border-primary-400/40 bg-primary-900 text-primary-50"}`;
};

const statusClass = (isActive) => {
  return `inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
    isActive
      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
      : "border-primary-400/40 bg-primary-900 text-primary-100"
  }`;
};

const verifiedClass = (isVerified) => {
  return `inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
    isVerified
      ? "border-blue-400/20 bg-blue-500/10 text-blue-200"
      : "border-amber-400/20 bg-amber-500/10 text-amber-200"
  }`;
};

onMounted(async () => {
  await Promise.all([fetchDashboard(), fetchUsers()]);
});
</script>
