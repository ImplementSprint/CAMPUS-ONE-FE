import DashboardLayout from '@/components/DashboardLayout';

const support = [
  { icon: '✉️', title: 'Email Support', desc: 'support@university.edu.ph', color: 'bg-amber-500' },
  { icon: '📞', title: 'Phone Support', desc: '+63 2 1234 5678', color: 'bg-blue-500' },
  { icon: '💬', title: 'Live Chat', desc: 'Available Mon-Fri, 8AM-5PM', color: 'bg-green-500' },
];

const faqs = [
  { q: 'How do I enroll in subjects?', a: 'Go to Online Enrollment, select your term, then click Proceed to Enrollment. Choose Block Schedule or Pick Subjects.' },
  { q: 'How do I add or drop a course?', a: 'Navigate to Advised Courses and click the Add/Drop Courses button at the bottom.' },
  { q: 'Where can I view my grades?', a: 'Click on View Semestral Grades in the sidebar.' },
  { q: 'How do I check my graduation status?', a: 'Go to the Graduation page to see your GWA and Latin Honors eligibility.' },
  { q: 'How do I update my profile?', a: 'Visit the Profile page. Contact the registrar to update official records.' },
];

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="p-6 w-full space-y-5">
        <h1 className="text-xl font-black text-gray-900">Help & Support</h1>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          {support.map(s => (
            <div key={s.title} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition cursor-pointer">
              <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center text-xl`}>{s.icon}</div>
              <div>
                <p className="font-semibold text-gray-900">{s.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-semibold text-gray-900 mb-4">Frequently Asked Questions</p>
          <div className="space-y-3">
            {faqs.map(f => (
              <div key={f.q} className="border border-gray-100 rounded-xl p-4">
                <p className="font-semibold text-gray-900 text-sm mb-1.5">{f.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

