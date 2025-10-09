import React from 'react';
import TextArea from '../form/input/TextArea';
import Radio from '../form/input/Radio';
import Input from '../form/input/InputField';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
}

const Step4FoodChoices: React.FC<Props> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Food Choices & Preferences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className='md:col-span-2'>
          <label className="block mb-1 font-medium">Allergic Foods</label>
          <TextArea
            value={formData.allergicFoods || ''}
            onChange={(e: any) => handleChange('allergicFoods', e)}
            placeholder='List any foods you are allergic to'
          />
        </div>
        <div className='md:col-span-2'>
          <label className="block mb-1 font-medium">Dietary Preference</label>
          <div className='rounded overflow-hidden border bg-white p-3'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='my-3 flex flex-nowrap items-center justify-between'>
                <Radio
                  id='Vegetarian'
                  name='dietaryPreference'
                  label="Vegetarian"
                  value='vegetarian'
                  checked={formData.dietaryPreference === 'vegetarian'}
                  onChange={() => handleChange('dietaryPreference', 'vegetarian')}
                />
                <Radio
                  id='Non-Vegetarian'
                  name='dietaryPreference'
                  label="Non-Vegetarian"
                  value='non-vegetarian'
                  checked={formData.dietaryPreference === 'non-vegetarian'}
                  onChange={() => handleChange('dietaryPreference', 'non-vegetarian')}
                />
              </div>
            </div>
            <div className='md:col-span-2 my-3'>
              <label className="block mb-1 font-medium text-sm">Cuisine Preference</label>
              <div className='rounded overflow-hidden border bg-white p-3'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='my-3 flex flex-nowrap items-center justify-between'>
                    <Radio
                      id='South_Indian'
                      name='cuisinePreference'
                      label="South Indian"
                      value='south_indian'
                      checked={formData.cuisinePreference === 'south_indian'}
                      onChange={() => handleChange('cuisinePreference', 'south_indian')}
                    />
                    <Radio
                      id='North_Indian'
                      name='cuisinePreference'
                      label="North Indian"
                      value='north_indian'
                      checked={formData.cuisinePreference === 'north_indian'}
                      onChange={() => handleChange('cuisinePreference', 'north_indian')}
                    />
                    <Radio
                      id='Other'
                      name='cuisinePreference'
                      label="Other"
                      value='other'
                      checked={formData.cuisinePreference === 'other'}
                      onChange={() => handleChange('cuisinePreference', 'other')}
                    />

                  </div>
                  <div>
                    {formData.cuisinePreference === 'other' && (
                      <TextArea
                        value={formData.otherCuisine || ''}
                        onChange={(e: any) => handleChange('otherCuisine', e)}
                        placeholder='Please specify your cuisine preference'
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-3'>
                <div>
                  <label className="block mb-1 text-sm font-medium">Food Favourites</label>
                  <TextArea
                    value={formData.foodFavorites || ''}
                    onChange={(e: any) => handleChange('foodFavorites', e)}
                    placeholder='List your favorite foods'
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Food Avoidances</label>
                  <TextArea
                    value={formData.foodAvoidance || ''}
                    onChange={(e: any) => handleChange('foodAvoidance', e)}
                    placeholder='List foods you avoid'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='md:col-span-2 my-3'>
          <label className="block mb-1 font-medium text-sm">No. of Meals</label>
          <Input
            type='number'
            value={formData.numberOfMeals || ''}
            onChange={(e: any) => handleChange('numberOfMeals', e.target.value)}
            placeholder='Enter number of meals'
          />
        </div>
      </div>
    </div>
  );
};

export default Step4FoodChoices;
