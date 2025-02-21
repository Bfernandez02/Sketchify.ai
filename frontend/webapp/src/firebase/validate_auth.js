import toast from "react-hot-toast";

export const validateSignUpForm = (formData, step) => {
  if (step === 1) {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    // Password validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/[a-z]/.test(formData.password)) {
      toast.error("Password must contain at least one lowercase letter");
      return false;
    }

    if (!/[0-9]/.test(formData.password)) {
      toast.error("Password must contain at least one number");
      return false;
    }
  }

  if (step === 2) {
    if (!formData.name || !formData.bio) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (!formData.profile) {
      toast.error("Please upload a profile image");
      return false;
    }
  }

  return true;
};