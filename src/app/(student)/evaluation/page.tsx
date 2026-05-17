import DashboardLayout from '@/components/DashboardLayout';

export default function EvaluationPage() {
  return (
    <DashboardLayout>
      <div className="p-6 w-full space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <h1 className="text-xl font-black text-gray-900">Course Evaluation</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-3xl mb-3">📋</p>
          <p className="font-black text-gray-900">Course Evaluation</p>
          <p className="text-sm text-gray-500 mt-2">Course evaluation forms will be available here during the evaluation period.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

