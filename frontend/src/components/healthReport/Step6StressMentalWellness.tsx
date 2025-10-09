import React from 'react';
import Switch from '../form/switch/Switch';
import Radio from '../form/input/Radio';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
}

const Step6StressMentalWellness: React.FC<Props> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Stress & Mental Wellness</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className='md:col-span-2'>
          <div className='block md:flex flex-nowrap align-center gap-4 justify-between'>
            <div className='my-3 md:my-0'>
              <Switch
                label="Under-eye Dark Circles"
                defaultChecked={false}
                onChange={(event: any) => handleChange('underEyeDarkCircles', event)}
              />
            </div>
            <div className='my-3 md:my-0'>
              <Switch
                label="Memory Issues"
                defaultChecked={false}
                onChange={(event: any) => handleChange('memoryIssues', event)}
              />
            </div>
            <div className='my-3 md:my-0'>
              <Switch
                label="Sugar Cravings"
                defaultChecked={false}
                onChange={(event: any) => handleChange('sugarCravings', event)}

              />
            </div>
          </div>
        </div>
        <div className='md:col-span-2'>
          <div className='flex flex-nowrap align-center gap-4 justify-between'>
            <Switch
              label="Perceived Stress Level"
              defaultChecked={false}
              onChange={(event: any) => handleChange('perceivedStressLevel', event)}
            />
          </div>
        </div>
        <div className='md:col-span-2 p-5 border rounded bg-gray-50'>
          <label className="block mb-1 font-medium">Emotional State</label>
          <div className='flex flex-nowrap align-center gap-4 justify-between'>
            <Radio
              id="emotionalStateAnxious"
              name="emotionalState"
              value="Anxious"
              checked={formData.emotionalState === "Anxious"}
              onChange={() => handleChange('emotionalState', 'Anxious')}
              label="Anxious"
            />
            <Radio
              id="emotionalStateCalm"
              name="emotionalState"
              value="Calm"
              checked={formData.emotionalState === "Calm"}
              onChange={() => handleChange('emotionalState', 'Calm')}
              label="Calm"
            />
            <Radio
              id="emotionalStateDepressed"
              name="emotionalState"
              value="Depressed"
              checked={formData.emotionalState === "Depressed"}
              onChange={() => handleChange('emotionalState', 'Depressed')}
              label="Depressed"
            />
          </div>
        </div>
        <div className='md:col-span-2 p-5 border rounded bg-gray-50'>
          <label className="block mb-1 font-medium">Immune Health</label>
          <div className='flex flex-nowrap align-center gap-4 justify-between'>
            <Radio
              id="immuneHealthAnxious"
              name="immuneHealth"
              value="Frequent Illness"
              checked={formData.immuneHealth === "Frequent Illness"}
              onChange={() => handleChange('immuneHealth', 'Frequent Illness')}
              label="Frequent Illness"
            />
            <Radio
              id="immuneHealthCalm"
              name="immuneHealth"
              value="Rarely Sick"
              checked={formData.immuneHealth === "Rarely Sick"}
              onChange={() => handleChange('immuneHealth', 'Rarely Sick')}
              label="Rarely Sick"
            />
            <Radio
              id="immuneHealthDepressed"
              name="immuneHealth"
              value="Occasionally Sick"
              checked={formData.immuneHealth === "Occasionally Sick"}
              onChange={() => handleChange('immuneHealth', 'Occasionally Sick')}
              label="Occasionally Sick"
            />
          </div>
        </div>
      </div>
    </div >
  );
};

export default Step6StressMentalWellness;
