import { useState, useMemo, useEffect } from 'react';
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    ReferenceLine
} from 'recharts';
import {
    Activity,
    Heart,
    Scale,
    TrendingUp,
    Calendar,
    ArrowDown,
    ArrowUp,
    Plus,
    Ruler,
    Target,
    Award,
    Loader2
} from 'lucide-react';
import { format, differenceInYears } from 'date-fns';
import { useParams } from 'react-router';
import axiosInstance from '../../api/axios'; // Ensure this path is correct
import ComponentCard from '../common/ComponentCard';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
interface ClientData {
    _id: string;
    name: string;
    date_of_birth: string;
    height: number;
    gender: string;
    bloodGroup: string;
    package: {
        _id: string;
        name: string;
        price: number;
    };
    cause: string[];
    status: string;
    trainer?: {
        _id: string;
        name: string;
    };
}

export interface HealthReport {
    _id: string;
    date: string;
    weight: number;
    height: number;
    bmi: number;
    bmiStatus: string;
    measurements: {
        chest: number;
        waist: number;
        biceps: number;
        hips: number;
    };
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    sugarLevels: {
        fasting: number;
        postMeal: number;
    };
}

// ----------------------------------------------------------------------
// Helper Component: Stat Card
// ----------------------------------------------------------------------
const StatCard = ({ title, value, unit, icon: Icon, trend, color }: any) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-baseline">
                {value} <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
            </h3>
            {trend && (
                <div className={`flex items-center mt-2 text-xs font-medium ${parseFloat(trend) < 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {parseFloat(trend) < 0 ? <ArrowDown size={14} className="mr-1" /> : <ArrowUp size={14} className="mr-1" />}
                    {Math.abs(parseFloat(trend))}% from start
                </div>
            )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
            <Icon size={24} />
        </div>
    </div>
);

// ----------------------------------------------------------------------
// Main Dashboard Component
// ----------------------------------------------------------------------

const HealthDashboard = () => {
    const { clientId } = useParams();
    const { isOpen, openModal, closeModal } = useModal();
    // State
    const [isLoading, setIsLoading] = useState(true);
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [healthData, setHealthData] = useState<HealthReport[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        weight: '',
        systolic: '',
        diastolic: '',
        fasting: '',
        postMeal: '',
        chest: '',
        waist: '',
        hips: '',
        biceps: ''
    });

    // Fetch Client Details on Mount
    useEffect(() => {
        const fetchClientDetails = async () => {
            if (!clientId) return;
            try {
                setIsLoading(true);
                const res = await axiosInstance.get(`/client/details/${clientId}`); // Ensure endpoint matches your backend
                setClientData(res.data);
                const reportsRes = await axiosInstance.get(`/client/reports/${clientId}`);
                setHealthData(reportsRes.data);

            } catch (error) {
                console.error("Error fetching client details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClientDetails();
    }, [clientId]);

    // Handle Input Changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Calculate BMI
    const calculateBMI = (weight: number, height: number) => {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        let status = 'Normal';
        if (bmi < 18.5) status = 'Underweight';
        else if (bmi >= 25 && bmi < 30) status = 'Overweight';
        else if (bmi >= 30) status = 'Obese';
        return { bmi: parseFloat(bmi.toFixed(1)), status };
    };

    // Submit New Entry
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientData) return;

        const { bmi, status } = calculateBMI(Number(formData.weight), clientData.height);

        const newEntry = {
            clientId: clientData._id, // Attach client ID
            date: new Date().toISOString(),
            weight: Number(formData.weight),
            height: clientData.height,
            bmi: bmi,
            bmiStatus: status,
            measurements: {
                chest: Number(formData.chest) || 0,
                waist: Number(formData.waist) || 0,
                hips: Number(formData.hips) || 0,
                biceps: Number(formData.biceps) || 0
            },
            bloodPressure: {
                systolic: Number(formData.systolic),
                diastolic: Number(formData.diastolic)
            },
            sugarLevels: {
                fasting: Number(formData.fasting),
                postMeal: Number(formData.postMeal)
            }
        };

        try {
            // Optimistic UI Update (Update local state immediately)
            const tempIdEntry = { ...newEntry, _id: Date.now().toString() };
            setHealthData(prev => [...prev, tempIdEntry]);

            // API Call
            await axiosInstance.post('/client/health-report/', newEntry);
            setFormData({
                weight: '', systolic: '', diastolic: '', fasting: '', postMeal: '', chest: '', waist: '', hips: '', biceps: ''
            });
            toast.success("Health record added successfully!");
            closeModal();
        } catch (error) {
            console.error("Failed to save health record", error);
            // Optionally revert state here if API fails
        }
    };

    // Sort Data for Charts
    const sortedData = useMemo(() => {
        return [...healthData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(d => ({
            ...d,
            formattedDate: format(new Date(d.date), 'MMM dd'),
        }));
    }, [healthData]);

    const latest = sortedData[sortedData.length - 1];
    const first = sortedData[0];

    // Calculate Trends
    const weightTrend = first && latest ? ((latest.weight - first.weight) / first.weight) * 100 : 0;
    const bmiTrend = first && latest ? ((latest.bmi - first.bmi) / first.bmi) * 100 : 0;

    // Loading State UI
    if (isLoading || !clientData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <p className="text-gray-500">Loading client profile...</p>
                </div>
            </div>
        );
    }

    // Calculate Age Safe Check
    const clientAge = clientData.date_of_birth ? differenceInYears(new Date(), new Date(clientData.date_of_birth)) : 'N/A';

    return (
        <ComponentCard title="Health Dashboard">


            {/* HEADER & USER PROFILE ROW */}
            <div className="flex flex-col xl:flex-row gap-6 mb-8">

                {/* User Details Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                                {clientData.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    {clientData.name}
                                    {clientData.package && (
                                        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs border border-yellow-200 flex items-center gap-1">
                                            <Award size={10} /> {clientData.package.name}
                                        </span>
                                    )}

                                </h2>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Target size={14} />
                                    {clientData.cause?.join(', ') || 'General Fitness'}
                                </p>
                                <p className='text-sm text-gray-500'> Trainer: <span className="font-medium text-gray-700">{clientData?.trainer?.name || 'N/A'}
                                </span></p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <span className="text-xs text-gray-400 block uppercase tracking-wider">Age</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{clientAge} Years</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <span className="text-xs text-gray-400 block uppercase tracking-wider">Gender</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{clientData.gender}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <span className="text-xs text-gray-400 block uppercase tracking-wider">Blood</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{clientData.bloodGroup}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <span className="text-xs text-gray-400 block uppercase tracking-wider">Height</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{clientData.height} cm</span>
                        </div>
                    </div>
                    <div className='flex mt-4 justify-between items-center'>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 shadow-sm">
                            <Calendar size={16} />
                            Today: {format(new Date(), 'MMM dd, yyyy')}
                        </div>
                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg w-full md:w-auto justify-center"
                        >
                            <Plus size={20} />
                            Add Daily Input
                        </button>
                    </div>
                </div>
            </div>

            {/* ADD DATA FORM MODAL */}
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[700px] m-4"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add Health Record</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Section: Vitals */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                            <Scale size={16} /> Vitals
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                <input required type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 75" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP</label>
                                <input required type="number" name="systolic" value={formData.systolic} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 120" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP</label>
                                <input required type="number" name="diastolic" value={formData.diastolic} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 80" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Sugar */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                            <Activity size={16} /> Glucose Levels (mg/dL)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fasting</label>
                                <input required type="number" name="fasting" value={formData.fasting} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 95" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Post Meal</label>
                                <input required type="number" name="postMeal" value={formData.postMeal} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 140" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Body Measurements */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                            <Ruler size={16} /> Body Measurements (cm)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Chest</label>
                                <input type="number" name="chest" value={formData.chest} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="cm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Waist</label>
                                <input type="number" name="waist" value={formData.waist} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="cm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hips</label>
                                <input type="number" name="hips" value={formData.hips} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="cm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Biceps</label>
                                <input type="number" name="biceps" value={formData.biceps} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="cm" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => closeModal()} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Save Record</button>
                    </div>
                </form>
            </Modal>


            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Current Weight"
                    value={latest?.weight || 0}
                    unit="kg"
                    icon={Scale}
                    trend={weightTrend.toFixed(1)}
                    color="indigo"
                />
                <StatCard
                    title="Current BMI"
                    value={latest?.bmi || 0}
                    unit={`(${latest?.bmiStatus || 'N/A'})`}
                    icon={Activity}
                    trend={bmiTrend.toFixed(1)}
                    color="blue"
                />
                <StatCard
                    title="Blood Pressure"
                    value={latest ? `${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic}` : 'N/A'}
                    unit="mmHg"
                    icon={Heart}
                    color="red"
                />
                <StatCard
                    title="Fasting Sugar"
                    value={latest?.sugarLevels.fasting || 0}
                    unit="mg/dL"
                    icon={TrendingUp}
                    color="emerald"
                />
            </div>

            {/* CHARTS SECTION 1: Weight & BMI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Weight & BMI History</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Correlation between body weight and BMI over time.</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sortedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} domain={['auto', 'auto']} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} domain={['auto', 'auto']} hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="weight"
                                    name="Weight (kg)"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorWeight)"
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="bmi"
                                    name="BMI"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Blood Pressure</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Systolic vs Diastolic.</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[60, 160]} />
                                <Tooltip />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Max Normal Sys', fill: '#ef4444', fontSize: 10, position: 'insideBottomRight' }} />
                                <Line type="monotone" dataKey="bloodPressure.systolic" name="Systolic" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="bloodPressure.diastolic" name="Diastolic" stroke="#f43f5e" strokeWidth={2} strokeOpacity={0.6} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION 2: Body Composition & Sugar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Body Measurements</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Trends in Waist, Chest, and Hips (cm).</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sortedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} domain={['auto', 'auto']} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="measurements.waist" name="Waist" stroke="#f59e0b" strokeWidth={2} />
                                <Line type="monotone" dataKey="measurements.chest" name="Chest" stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey="measurements.hips" name="Hips" stroke="#8b5cf6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Sugar Levels</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Fasting vs Post Meal (mg/dL).</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sortedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} />
                                <Legend />
                                <Bar dataKey="sugarLevels.fasting" name="Fasting" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="sugarLevels.postMeal" name="Post Meal" fill="#34d399" radius={[4, 4, 0, 0]} fillOpacity={0.6} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </ComponentCard >
    );
};

export default HealthDashboard;