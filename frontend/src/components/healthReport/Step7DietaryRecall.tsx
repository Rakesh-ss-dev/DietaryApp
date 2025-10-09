import React from 'react';
import TextArea from '../form/input/TextArea';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
}

const Step7DietaryRecall: React.FC<Props> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dietary Recall</h2>
      <p>Record of food consumed in the past 24 - 48 hours</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Morning Meal</label>
          <TextArea
            value={formData.morningMeal || ''}
            onChange={(e) => handleChange('morningMeal', e)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Mid-Morning Intake</label>
          <TextArea
            value={formData.midMorningIntake || ''}
            onChange={(e) => handleChange('midMorningIntake', e)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Afternoon Meal</label>
          <TextArea
            value={formData.afternoonMeal || ''}
            onChange={(e) => handleChange('afternoonMeal', e)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Evening Snack</label>
          <TextArea
            value={formData.eveningSnack || ''}
            onChange={(e) => handleChange('eveningSnack', e)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Night-Time Meal</label>
          <TextArea
            value={formData.nightTimeMeal || ''}
            onChange={(e) => handleChange('nightTimeMeal', e)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Additional Details<span className='text-sm text-gray-500'>(e.g., Portions, Cooking ,etc)</span></label>
          <TextArea 
            value={formData.additionalDetails || ''}
            onChange={(e) => handleChange('additionalDetails', e)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step7DietaryRecall;
