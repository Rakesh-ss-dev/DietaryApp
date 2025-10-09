import { FC } from 'react';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import TextArea from '../form/input/TextArea';
import Switch from '../form/switch/Switch';
import Radio from '../form/input/Radio';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
}

const Step3DailyHabits: FC<Props> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (key: string, value: string | number) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Daily Habits & Lifestyle</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 align-center">
        <div className='md:col-span-2'>
          <label className="block mb-1 font-medium">Caffeine Consumption</label>
          <div className='flex flex-nowrap align-center gap-4 justify-between'>
            <div>
              <Label> Coffee: </Label>
              <Input
                type="number"
                value={formData.coffee || ''}
                onChange={(e) => handleChange('coffee', Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Cups per day"
              />
            </div>
            <div>
              <Label> Green Tea: </Label>
              <Input
                type="number"
                value={formData.greenTea || ''}
                onChange={(e) => handleChange('greenTea', Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Cups per day"
              />
            </div>
            <div>
              <Label> Energy Drink: </Label>
              <Input
                type="number"
                value={formData.energyDrink || ''}
                onChange={(e) => handleChange('energyDrink', Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Servings per day"
              />
            </div>
          </div>
        </div>
        <div className='md:col-span-2'>
          <label className="block mb-1 font-medium">Alchohol Usage</label>
          <TextArea
            value={formData.alcoholUsage || ''}
            onChange={(e: any) => handleChange('alcoholUsage', e)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="How often and how much alcohol do you consume?"
          />
        </div>
        <div className='md:col-span-2'>
          <label className="block mb-1 font-medium">Hydration</label>
          <input
            type="number"
            value={formData.hydration || ''}
            onChange={(e) => handleChange('hydration', Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder='Litres of water consumed daily'
          />
        </div>
        <div className='md:col-span-2'>
          <label className="block mb-1 font-medium">Smoking</label>
          <div className='flex flex-nowrap items-center justify-between align-center my-4'>
            <Switch
              label="Smoking Habits"
              defaultChecked={false}
              onChange={(event: any) => handleChange('smokingHabits', event)}
            />
            {formData.smokingHabits && (
              <Input
                type='number'
                value={formData.smokingQuantity || ''}
                onChange={(e: any) => handleChange('smokingQuantity', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Cigarettes per day"
              />
            )}
          </div>
        </div>
        <div className='md:col-span-2'>
          <label className="block mb-1 font-medium">Dietary Supplements</label>
          <TextArea
            value={formData.dietarySupplements || ''}
            onChange={(e: any) => handleChange('dietarySupplements', e)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className='md:col-span-2'>
          <label className="block mb-1 font-medium">Activity Description & Frequency</label>
          <div className='block md:flex flex-nowrap items-center justify-between align-center my-4'>
            <Radio
              id="adf1"
              name="adf"
              value="Sedentary"
              checked={formData.adf === "Sedentary"}
              onChange={(value) => handleChange('adf', value)}
              label="Sedentary"
              className='my-3 md:my-0'
            />
            <Radio
              id="adf2"
              name="adf"
              value="Lightly Active"
              checked={formData.adf === "Lightly Active"}
              onChange={(value) => handleChange('adf', value)}
              label="Lightly Active"
              className='my-3 md:my-0'
            />
            <Radio
              id="adf3"
              name="adf"
              value="Moderately Active"
              checked={formData.adf === "Moderately Active"}
              onChange={(value) => handleChange('adf', value)}
              label="Moderately Active"
              className='my-3 md:my-0'
            />
            <Radio
              id="adf4"
              name="adf"
              value="Highly Active"
              checked={formData.adf === "Highly Active"}
              onChange={(value) => handleChange('adf', value)}
              label="Highly Active"
              className='my-3 md:my-0'
            />
          </div>

        </div>
        <div className='md:col-span-2'>
          <label className="block mb-1 font-medium">Sleep Pattern</label>
          <div className='block md:flex flex-nowrap items-center align-center justify-between gap-3 my-4'>
            <div className='w-full md:w-1/4'>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Sleep Duration (hours)</label>
              <Input
                type='number'
                value={formData.sleepDuration || ''}
                onChange={(e: any) => handleChange('sleepDuration', e.target.value)}
                placeholder="Average hours of sleep per night"
              />
            </div>
            <div className='w-1/2'>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Sleep Quality</label>
              <div className='block md:flex flex-nowrap justify-between items-center gap-2'>
                <Radio
                  id="sleepQuality1"
                  name="sleepQuality"
                  value="Satisfactory"
                  checked={formData.sleepQuality === "Satisfactory"}
                  onChange={(value) => handleChange('sleepQuality', value)}
                  label="Satisfactory"
                  className='my-3 md:my-0'
                />
                <Radio
                  id="sleepQuality2"
                  name="sleepQuality"
                  value="Need Improvement"
                  checked={formData.sleepQuality === "Need Improvement"}
                  onChange={(value) => handleChange('sleepQuality', value)}
                  label="Need Improvement"
                  className='my-3 md:my-0'
                />
                <Radio
                  id="sleepQuality3"
                  name="sleepQuality"
                  value="Poor"
                  checked={formData.sleepQuality === "Poor"}
                  onChange={(value) => handleChange('sleepQuality', value)}
                  label="Poor"
                  className='my-3 md:my-0'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3DailyHabits;
