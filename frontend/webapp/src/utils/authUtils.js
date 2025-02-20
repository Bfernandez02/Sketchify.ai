import toast from "react-hot-toast";

function validateSignInForm(form) {
  if (!form.email) {
    toast.error("Email is required", { id: "email" });
    return false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    toast.error("Email is invalid", { id: "email2" });
    return false;
  }
  if (!form.password) {
    toast.error("Password is required", { id: "password" });
    return false;
  }
  return true;
}

function validateSignUpForm(formData, currentStep) {
  if (currentStep === 1) {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields", { id: "fields" });
      return false;
    }

    if (!emailIsValid(formData.email)) {
      toast.error("Please enter a valid email address", { id: "email" });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", { id: "password" });
      return false;
    }
    if (!passwordIsValid(formData.password)) {
      toast.error("Password must meet all requirements", { id: "password2" });
      return false;
    }

    return true;
  } else if (currentStep === 2) {
    if (formData.name == "") {
      toast.error("Please enter your name", { id: "date" });
      return false;
    }
    if (formData.bio == "") {
      toast.error("Please enter your bio", { id: "bio" });
      return false;
    }
    if (formData.profile == null) {
      toast.error("Please upload a profile image", { id: "profile" });
      return false;
    }
    return true;
  }

  if (currentStep === 3) {
    return true;
  }
}

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordIsValid(password) {
  if (password.length < 8) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[0-9]/.test(password)) {
    return false;
  }
  return true;
}

export {
  validateSignInForm,
  validateSignUpForm,
  emailIsValid,
  passwordIsValid,
};
