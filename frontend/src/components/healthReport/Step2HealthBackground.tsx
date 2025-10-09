import { FC } from 'react';
import TextArea from '../form/input/TextArea';
import Switch from '../form/switch/Switch';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
}

const Step2HealthBackground: FC<Props> = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Health Background</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Previous Surgeries/Traumas</label>
          <TextArea
            value={formData.previousSurgeries || ''}
            onChange={(value) => handleChange('previousSurgeries', value)}
            rows={3}
            placeholder='Describe any previous surgeries or traumas'
          />
        </div>
        <div>
          <div className='mt-4'>
            <label className="block mb-1 font-medium">Dependence History</label>
            <div className='rounded overflow-hidden border bg-white p-3'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
                <div className='my-3'>
                  <Switch
                    label="Alchohol Usage"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('alchoholUsage', event)}
                  />
                </div>
                <div className='my-3'>
                  <Switch
                    label="Drug Usage"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('drugUsage', event)}
                  />
                </div>
                <div className='my-3'>
                  <Switch
                    label="Smoking"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('smoking', event)}
                  />
                </div>
                <div className='my-3'>
                  <Switch
                    label="Caffeine Beverages"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('caffeineBeverages', event)}
                  />
                </div>
                <div className='my-3 md:col-span-2'>
                  <Switch
                    label="Tobacco Consumption"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('tobaccoConsumption', event)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='mt-4'>
            <label className="block mb-1 font-medium">Family History</label>
            <div className='rounded overflow-hidden border bg-white p-3'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
                <div className='my-3'>
                  <Switch
                    label="Diabetes"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('diabetes', event)}
                  />
                </div>
                <div className='my-3'>
                  <Switch
                    label="Heart Disease"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('heartDisease', event)}
                  />
                </div>
                <div className='my-3'>
                  <Switch
                    label="Cancer"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('cancer', event)}
                  />
                </div>
                <div className='my-3'>
                  <Switch
                    label="Hypertension"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('hypertension', event)}
                  />

                </div>
                <div className='my-3'>
                  <Switch
                    label="High Cholesterol"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('highCholesterol', event)}
                  />
                </div>
                <div className='my-3'>
                  <Switch
                    label="Obesity"
                    defaultChecked={false}
                    onChange={(event: any) => handleChange('obesity', event)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Existing Health Conditions or Metabolic Syndrome</label>
          <TextArea
            value={formData.healthConditions || ''}
            onChange={(e) => handleChange('healthConditions', e)}
            rows={3}
            placeholder='Describe any existing health conditions or metabolic syndrome'
          />
        </div>
      </div>
    </div>
  );
};

export default Step2HealthBackground;
