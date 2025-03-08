// components/auth/SignUpForm.jsx
import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Confirmation from "./Confirmation";
import { validateSignUpForm } from "@/firebase/validate_auth";
import { auth } from "@/firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { saveUserToFirestore } from "@/firebase/utils";
import toast from "react-hot-toast";

export default function SignUpForm({ formData, setFormData, onSubmit, onGoogleSignUp }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNextStep = async () => {
    if (!validateSignUpForm(formData, step)) return;
    
    if (step === 2) {
      setLoading(true);
      try {
        await onSubmit();
        // Move to confirmation step after successful signup
        setStep(3);
      } catch (error) {
        console.error(error);
        // Error handling is done in the parent component
      }
      setLoading(false);
    } else {
      setStep(step + 1);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await onGoogleSignUp();
      // Move to confirmation step after successful Google signup
      setStep(3);
    } catch (error) {
      console.error(error);
      // Error handling is done in the parent component
    }
    setLoading(false);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const formSteps = [
    <Step1
      key="step1"
      formData={formData}
      setFormData={setFormData}
      handleNextStep={handleNextStep}
      onGoogleSignUp={handleGoogleSignup}
    />,
    <Step2
      key="step2"
      formData={formData}
      setFormData={setFormData}
      handleNextStep={handleNextStep}
      loading={loading}
    />,
    <Confirmation 
      key="confirmation"
      formData={formData}
    />,
  ];

  return (
    <div className="w-full px-[20px] lg:px-[80px] xl:px-[160px] py-[20px]">
      {formSteps[step - 1]}

      <div>
        <div className="flex justify-between">
          {step > 1 && step < formSteps.length && (
            <button
              className="btn"
              onClick={handlePrevStep}
              disabled={loading}
            >
              Previous
            </button>
          )}

          {step > 1 && step < formSteps.length && (
            <button
              className="btn"
              onClick={handleNextStep}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}