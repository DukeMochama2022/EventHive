import { toast } from "react-toastify";

// Toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Success toast
export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    ...toastConfig,
    ...options,
  });
};

// Error toast
export const showError = (message, options = {}) => {
  toast.error(message, {
    ...toastConfig,
    autoClose: 5000, // Longer display for errors
    ...options,
  });
};

// Info toast
export const showInfo = (message, options = {}) => {
  toast.info(message, {
    ...toastConfig,
    ...options,
  });
};

// Warning toast
export const showWarning = (message, options = {}) => {
  toast.warning(message, {
    ...toastConfig,
    ...options,
  });
};

// Loading toast (returns toast ID for dismissal)
export const showLoading = (message = "Loading...") => {
  return toast.loading(message, {
    position: "top-right",
  });
};

// Dismiss specific toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Update loading toast to success/error
export const updateToast = (toastId, type, message) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: type === "error" ? 5000 : 3000,
  });
};

// Common success messages
export const successMessages = {
  login: "Successfully logged in!",
  logout: "Successfully logged out!",
  packageCreated: "Package created successfully!",
  packageUpdated: "Package updated successfully!",
  packageDeleted: "Package deleted successfully!",
  categoryCreated: "Category created successfully!",
  categoryUpdated: "Category updated successfully!",
  categoryDeleted: "Category deleted successfully!",
  profileUpdated: "Profile updated successfully!",
  imageUploaded: "Image uploaded successfully!",
};

// Common error messages
export const errorMessages = {
  loginFailed: "Login failed. Please check your credentials.",
  networkError: "Network error. Please check your connection.",
  serverError: "Server error. Please try again later.",
  validationError: "Please check your input and try again.",
  unauthorized: "You don't have permission to perform this action.",
  notFound: "The requested resource was not found.",
  imageUploadFailed: "Image upload failed. Please try again.",
  deleteFailed: "Failed to delete. Please try again.",
  updateFailed: "Failed to update. Please try again.",
  createFailed: "Failed to create. Please try again.",
};

// Common info messages
export const infoMessages = {
  loading: "Loading...",
  saving: "Saving...",
  deleting: "Deleting...",
  uploading: "Uploading...",
  processing: "Processing...",
};

// Common warning messages
export const warningMessages = {
  unsavedChanges: "You have unsaved changes. Are you sure you want to leave?",
  deleteConfirmation: "Are you sure you want to delete this item?",
  logoutConfirmation: "Are you sure you want to logout?",
};
 