export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return "";
  const now = new Date();
  const d = new Date(date);
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 7) return formatDate(date);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

export const daysUntilDeadline = (deadline) => {
  const now = new Date();
  const d = new Date(deadline);
  const diff = d - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const deadlineLabel = (deadline) => {
  const days = daysUntilDeadline(deadline);
  if (days < 0) return "Expired";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `${days} days left`;
  return `${formatDate(deadline)}`;
};

export const deadlineUrgency = (deadline) => {
  const days = daysUntilDeadline(deadline);
  if (days < 0) return "expired";
  if (days <= 3) return "urgent";
  if (days <= 7) return "soon";
  return "normal";
};

export const categoryLabel = (category) => {
  const labels = {
    job: "Job",
    scholarship: "Scholarship",
    grant: "Grant",
    training: "Training",
    internship: "Internship",
    fellowship: "Fellowship",
    entrepreneurship: "Entrepreneurship",
  };
  return labels[category] || category;
};

// Modern SaaS-style icons (using Heroicons / Lucide style names)
export const categoryIcon = (category) => {
  const icons = {
    job: "briefcase", // modern briefcase icon
    scholarship: "graduation-cap",
    grant: "banknote", // money/banknote icon
    training: "book-open",
    internship: "beaker", // lab/science icon
    fellowship: "award", // trophy/award icon
    entrepreneurship: "rocket", // startup rocket icon
  };
  return icons[category] || "clipboard-document";
};

// Get avatar image or fallback initials
export const getAvatar = (user) => {
  if (!user) return { initials: "?", image: null };

  // Refugee → profile picture
  if (user.role === "refugee" && user.profilePicture?.url) {
    return {
      initials: getInitials(user.fullName || user.email),
      image: user.profilePicture.url,
    };
  }

  // Organization → logo
  if (user.role === "organization" && user.organization?.logo?.url) {
    return {
      initials: getInitials(user.organization.organizationName),
      image: user.organization.logo.url,
    };
  }

  // Fallback → initials only
  return { initials: getInitials(user.fullName || user.email), image: null };
};

export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const extractErrorMessage = (error) => {
  const responseData = error?.response?.data;
  const validationErrors = responseData?.errors;

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    const firstError = validationErrors[0];
    const message = firstError?.msg || firstError?.message || firstError;
    if (message) return message;
  }

  return responseData?.message || error?.message || "Something went wrong";
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const truncate = (text, length = 100) => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
};
