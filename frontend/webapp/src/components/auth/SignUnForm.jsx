import React from "react";
import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Confirmation from "./Confirmation";

export default function SignUpForm({ formData, setFormData }) {
  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    console.log(formData);
  };

  const [step, setStep] = useState(1);

  const formSteps = [
    <Step1
      formData={formData}
      setFormData={setFormData}
      handleNextStep={handleNextStep}
    />,
    <Step2 formData={formData} setFormData={setFormData} />,
    <Confirmation formData={formData} setFormData={setFormData} />,
  ];

  return (
    <div className="w-full px-[20px] lg:px-[80px] xl:px-[160px] py-[20px]">
      {formSteps[step - 1]}

      <div>
        <div className="flex justify-between">
          {step > 1 && (
            <button
              className="btn"
              onClick={() => {
                setStep(step - 1);
                handlePrevStep();
              }}
            >
              Previous
            </button>
          )}

          { step > 1 && step < formSteps.length && (
            <button
              className="btn"
              onClick={() => {
                setStep(step + 1);
                handleNextStep();
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
