import { useState } from 'react';
import Step1PersonalDetails from '../components/healthReport/Step1PersonalDetails';
import Step2HealthBackground from '../components/healthReport/Step2HealthBackground';
import Step3DailyHabits from '../components/healthReport/Step3DailyHabits';
import Step4FoodChoices from '../components/healthReport/Step4FoodChoices';
import Step5DigestiveMental from '../components/healthReport/Step5DigestiveMental';
import Step6StressMentalWellness from '../components/healthReport/Step6StressMentalWellness';
import Step7DietaryRecall from '../components/healthReport/Step7DietaryRecall';

const HealthLifestyleForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const validateStep = () => {
    const stepErrors: any = {};
    switch (step) {
      case 1:
        if (!formData.fullName) stepErrors.fullName = 'Name is required';
        if (!formData.age) stepErrors.age = 'Age is required';
        if (!formData.gender) stepErrors.gender = 'Gender is required';
        if (!formData.profession) stepErrors.profession = 'Profession is required';
        if (!formData.height) stepErrors.height = 'Height is required';
        if (!formData.weight) stepErrors.weight = 'Weight is required';
        if (!formData.mobile) stepErrors.mobile = 'Mobile number is required';
        if (!formData.bmi) stepErrors.bmi = 'BMI is required';
        if (!formData.goals) stepErrors.goals = 'Goals are required';

        break;
      case 2:
        // Add validation for Step 2 if needed
        break;
      case 3:
        // Add validation for Step 3 if needed
        break;
      case 4:
        // Add validation for Step 4 if needed
        break;
      case 5:
        // Add validation for Step 5 if needed
        break;
      case 6:
        // Add validation for Step 6 if needed
        break;
      case 7:
        // Add validation for Step 7 if needed
        break;
      default:
        break;
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      console.log('Submitted:', formData);
    }
  };

  const totalSteps = 7;

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Health & Lifestyle Form</h1>
          <div className="w-full bg-gray-200 h-2 rounded mb-6">
            <div className="bg-brand-600 h-2 rounded transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === totalSteps) {
              handleSubmit();
            } else {
              handleNext();
            }
          }}
        >
          {step === 1 && (
            <Step1PersonalDetails formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}
          {step === 2 && (
            <Step2HealthBackground formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}
          {step === 3 && (
            <Step3DailyHabits formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}
          {step === 4 && (
            <Step4FoodChoices formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}
          {step === 5 && (
            <Step5DigestiveMental formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}
          {step === 6 && (
            <Step6StressMentalWellness formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}
          {step === 7 && (
            <Step7DietaryRecall formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="bg-brand-600 text-white px-4 py-2 rounded"
            >
              {step === totalSteps ? 'Submit' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default HealthLifestyleForm;
