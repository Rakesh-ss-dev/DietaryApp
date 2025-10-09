import { FC } from 'react';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
}

const Step1PersonalDetails: FC<Props> = ({ formData, setFormData, errors, setErrors }) => {

  const handleChange = (key: string, value: string | number) => {
    setFormData({ ...formData, [key]: value });
    setErrors && setErrors({ ...errors, [key]: '' });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Personal Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <Input
            type="text"
            value={formData.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Age</label>
          <Input
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleChange('age', Number(e.target.value))}
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Mobile Number</label>
          <Input
            type="tel"
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Email Address</label>
          <Input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">City</label>
          <Input
            type="text"
            value={formData.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            value={formData.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Profession</label>
          <Input
            type="text"
            value={formData.profession || ''}
            onChange={(e) => handleChange('profession', e.target.value)}
          />
          {errors.profession && <p className="text-red-500 text-sm">{errors.profession}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Height (cm)</label>
          <Input
            type="number"
            value={formData.height || ''}
            onChange={(e) => handleChange('height', Number(e.target.value))}
          />
          {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Weight (kg)</label>
          <Input
            type="number"
            value={formData.weight || ''}
            onChange={(e) => handleChange('weight', Number(e.target.value))}
          />
          {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Body Mass Index (BMI)</label>
          <Input
            type="text"
            value={formData.bmi || ''}
            onChange={(e) => handleChange('bmi', e.target.value)}
          />
          {errors.bmi && <p className="text-red-500 text-sm">{errors.bmi}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Your Goals</label>
          <TextArea
            value={formData.goals || ''}
            onChange={(value) => { handleChange('goals', value) }}
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-1">
            Goals in SMART format (Specific, Measurable, Attainable, Realistic, Timely, Sustainable)
          </p>
          {errors.goals && <p className="text-red-500 text-sm">{errors.goals}</p>}
        </div>
      </div>
    </div>
  );
};

export default Step1PersonalDetails;
