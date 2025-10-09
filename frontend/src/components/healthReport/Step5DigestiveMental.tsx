import React from 'react';
import Radio from '../form/input/Radio';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
}

const Step5DigestiveMental: React.FC<Props> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Digestive & Metabolic Indicators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className='md:col-span-2 p-5 border rounded bg-gray-50'>
          <div className='block md:flex flex-nowrap align-center gap-4 justify-between'>
            <label className="w-full md:w-1/3 block mb-1 font-medium">Burping</label>
            <div className='w-full md:w-2/3 flex flex-nowrap align-center gap-4'>
              <Radio
                id="burpingSevere"
                name="burping"
                value="Severe"
                checked={formData.burping === "Severe"}
                onChange={() => handleChange('burping', 'Severe')}
                label="Severe"
                className='w-full md:w-1/3'
              />
              <Radio
                id="burpingModerate"
                name="burping"
                value="Moderate"
                checked={formData.burping === "Moderate"}
                onChange={() => handleChange('burping', 'Moderate')}
                label="Moderate"
                className='w-full md:w-1/3'
              />
              <Radio
                id="burpingLight"
                name="burping"
                value="Light"
                checked={formData.burping === "Light"}
                onChange={() => handleChange('burping', 'Light')}
                label="Light"
                className='w-full md:w-1/3'
              />
            </div>
          </div>
        </div>
        <div className='md:col-span-2 p-5 border rounded bg-gray-50'>
          <div className='block md:flex flex-nowrap align-center gap-4 justify-between'>
            <label className="w-full md:w-1/3 block mb-1 font-medium">Bloating</label>
            <div className='w-full md:w-2/3 flex flex-nowrap align-center gap-4'>
              <Radio
                id="bloatingSevere"
                name="bloating"
                value="Abdominal"
                checked={formData.bloating === "Abdominal"}
                onChange={() => handleChange('bloating', 'Abdominal')}
                label="Abdominal"
                className='w-full md:w-1/3'
              />
              <Radio
                id="bloatingPeripheral"
                name="bloating"
                value="Peripheral"
                checked={formData.bloating === "Peripheral"}
                onChange={() => handleChange('bloating', 'Peripheral')}
                label="Peripheral"
                className='w-full md:w-1/3'
              />
            </div>
          </div>
        </div>
        <div className='md:col-span-2 p-5 border rounded bg-gray-50'>
          <div className='block md:flex flex-nowrap align-center gap-4 justify-between'>
            <label className="w-full md:w-1/3 block mb-1 font-medium">Prolonged Fullness</label>
            <div className='w-full md:w-2/3 flex flex-nowrap align-center gap-4'>
              <Radio
                id="prolongedFullnessSevere"
                name="prolongedFullness"
                value="Severe"
                checked={formData.prolongedFullness === "Severe"}
                onChange={() => handleChange('prolongedFullness', 'Severe')}
                label="Severe"
                className='w-full md:w-1/3'
              />
              <Radio
                id="prolongedFullnessModerate"
                name="prolongedFullness"
                value="Moderate"
                checked={formData.prolongedFullness === "Moderate"}
                onChange={() => handleChange('prolongedFullness', 'Moderate')}
                label="Moderate"
                className='w-full md:w-1/3'
              />
              <Radio
                id="prolongedFullnessLight"
                name="prolongedFullness"
                value="Light"
                checked={formData.prolongedFullness === "Light"}
                onChange={() => handleChange('prolongedFullness', 'Light')}
                label="Light"
                className='w-full md:w-1/3'
              />
            </div>
          </div>
        </div>
        <div className='md:col-span-2 p-5 border rounded bg-gray-50'>
          <div className='block md:flex flex-nowrap align-center gap-4 justify-between'>
            <label className="w-full md:w-1/3 block mb-1 font-medium">Improper Bowel Movements</label>
            <div className='w-full md:w-2/3 flex flex-nowrap align-center gap-4'>
              <Radio
                id="improperBowelMovementsConstipation"
                name="improperBowelMovements"
                value="Constipation"
                checked={formData.improperBowelMovements === "Constipation"}
                onChange={() => handleChange('improperBowelMovements', 'Constipation')}
                label="Constipation"
                className='w-full md:w-1/3'
              />
              <Radio
                id="improperBowelMovementsDiarrhea"
                name="improperBowelMovements"
                value="Diarrhea"
                checked={formData.improperBowelMovements === "Diarrhea"}
                onChange={() => handleChange('improperBowelMovements', 'Diarrhea')}
                label="Diarrhea"
                className='w-full md:w-1/3'
              />
            </div>
          </div>
        </div>
        <div className='md:col-span-2 p-5 border rounded bg-gray-50'>
          <div className='block md:flex flex-nowrap align-center gap-4 justify-between'>
            <label className="w-full md:w-1/3 block mb-1 font-medium">Post-Meal Tiredness</label>
            <div className='w-full md:w-2/3 flex flex-nowrap align-center gap-4'>
              <Radio
                id="postMealTirednessSevere"
                name="postMealTiredness"
                value="Severe"
                checked={formData.postMealTiredness === "Severe"}
                onChange={() => handleChange('postMealTiredness', 'Severe')}
                label="Severe"
                className='w-full md:w-1/3'
              />
              <Radio
                id="postMealTirednessModerate"
                name="postMealTiredness"
                value="Moderate"
                checked={formData.postMealTiredness === "Moderate"}
                onChange={() => handleChange('postMealTiredness', 'Moderate')}
                label="Moderate"
                className='w-full md:w-1/3'
              />
              <Radio
                id="postMealTirednessLight"
                name="postMealTiredness"
                value="Light"
                checked={formData.postMealTiredness === "Light"}
                onChange={() => handleChange('postMealTiredness', 'Light')}
                label="Light"
                className='w-full md:w-1/3'
              />
            </div>
          </div>
        </div>
        <div className='md:col-span-2 p-5 border rounded bg-gray-50'>
          <div className='block md:flex flex-nowrap align-center gap-4 justify-between'>
            <label className="w-full md:w-1/3 block mb-1 font-medium">Acidity or Heatburn</label>
            <div className='w-full md:w-2/3 flex flex-nowrap align-center gap-4'>
              <Radio
                id="acidityOrHeartburnSevere"
                name="acidityOrHeartburn"
                value="Severe"
                checked={formData.acidityOrHeartburn === "Severe"}
                onChange={() => handleChange('acidityOrHeartburn', 'Severe')}
                label="Severe"
                className='w-full md:w-1/3'
              />
              <Radio
                id="acidityOrHeartburnModerate"
                name="acidityOrHeartburn"
                value="Moderate"
                checked={formData.acidityOrHeartburn === "Moderate"}
                onChange={() => handleChange('acidityOrHeartburn', 'Moderate')}
                label="Moderate"
                className='w-full md:w-1/3'
              />
              <Radio
                id="acidityOrHeartburnLight"
                name="acidityOrHeartburn"
                value="Light"
                checked={formData.acidityOrHeartburn === "Light"}
                onChange={() => handleChange('acidityOrHeartburn', 'Light')}
                label="Light"
                className='w-full md:w-1/3'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5DigestiveMental;
