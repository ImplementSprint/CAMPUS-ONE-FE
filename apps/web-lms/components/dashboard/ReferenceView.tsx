"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, BookOpen, AlertCircle, X, ChevronDown, Edit, Trash2, Eye, EyeOff, Save, Send, Printer, Search, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrintTemplate, PrintTable, PrintThead, PrintTh, PrintTd, PrintInfoGrid, PrintSection } from "@/components/ui/PrintTemplate";

// Circular Avatar illustration matching the user's screenshots exactly!
export function DefaultAvatarSVG({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={cn("rounded-full border border-gray-100 shadow-sm bg-gray-50", className)} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill="#F3F4F6"/>
      {/* Suit jacket */}
      <path d="M40 180C40 145 65 120 100 120C135 120 160 145 160 180H40Z" fill="#F5A623"/>
      {/* Shirt */}
      <path d="M80 120L100 150L120 120H80Z" fill="#FFFFFF"/>
      {/* Red tie */}
      <path d="M96 130L100 175L104 175L104 130H96Z" fill="#EF4444"/>
      {/* Head / Neck */}
      <circle cx="100" cy="70" r="35" fill="#FCD34D"/>
      <rect x="92" y="90" width="16" height="30" fill="#FCD34D"/>
      {/* Hair */}
      <path d="M65 70C65 40 80 30 100 30C120 30 135 40 135 70C135 45 125 40 100 40C75 40 65 45 65 70Z" fill="#1F2937"/>
      {/* Red Glasses frame */}
      <rect x="75" y="62" width="20" height="12" rx="2" stroke="#EF4444" strokeWidth="3" fill="none"/>
      <rect x="105" y="62" width="20" height="12" rx="2" stroke="#EF4444" strokeWidth="3" fill="none"/>
      <line x1="95" y1="68" x2="105" y2="68" stroke="#EF4444" strokeWidth="3"/>
    </svg>
  );
}

export function EmployeeAvatar({ employee, className = "w-24 h-24" }: { employee: any; className?: string }) {
  if (employee && employee.image) {
    return (
      <img 
        src={employee.image} 
        alt={employee.name} 
        className={cn("rounded-full border border-gray-150 shadow-sm object-cover bg-gray-50", className)}
      />
    );
  }
  return <DefaultAvatarSVG className={className} />;
}

export function StudentAvatar({ student, className = "w-24 h-24" }: { student: any; className?: string }) {
  if (student && student.image) {
    return (
      <img 
        src={student.image} 
        alt={student.name} 
        className={cn("rounded-full border border-gray-150 shadow-sm object-cover bg-gray-50", className)}
      />
    );
  }
  return <DefaultAvatarSVG className={className} />;
}

interface ReferenceViewProps {
  parent: "Classes" | "Subjects" | "Students" | "Employees" | "Fees" | "Attendance";
  activeSubtab: string;
}

export function ReferenceView({ parent, activeSubtab }: ReferenceViewProps) {
  const router = useRouter();
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
  const [selectedEmployeeForLetter, setSelectedEmployeeForLetter] = useState<any | null>(null);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [selectedStudentForLetter, setSelectedStudentForLetter] = useState<any | null>(null);

  // Reset internal sub-states on active tab switch
  useEffect(() => {
    setEditingEmployee(null);
    setSelectedEmployeeForLetter(null);
    setEditingStudent(null);
    setSelectedStudentForLetter(null);
  }, [parent, activeSubtab]);

  if (parent === "Classes") {
    if (activeSubtab === "All Classes") return <AllClassesGrid />;
    if (activeSubtab === "New Class") return <NewClassForm />;
  }

  if (parent === "Subjects") {
    if (activeSubtab === "Classes With Subjects") return <ClassesWithSubjectsList />;
    if (activeSubtab === "Assign Subjects") return <AssignSubjectsForm />;
  }

  if (parent === "Students") {
    if (editingStudent) {
      return (
        <EditStudentForm 
          student={editingStudent} 
          onCancel={() => setEditingStudent(null)} 
        />
      );
    }
    if (activeSubtab === "All Students") {
      return (
        <AllStudentsGrid 
          onEdit={(stu) => setEditingStudent(stu)} 
          onViewDetails={(stu) => setSelectedStudentForLetter(stu)} 
        />
      );
    }
    if (activeSubtab === "Add New") return <AdmissionForm />;
    if (activeSubtab === "Admission Letter") {
      return (
        <AdmissionLetterView 
          selectedStudent={selectedStudentForLetter} 
          onBack={() => {
            setSelectedStudentForLetter(null);
            router.push("/students?tab=all-students");
          }} 
        />
      );
    }
    if (activeSubtab === "Student ID Cards") {
      return (
        <StudentIDCardsView 
          selectedStudent={selectedStudentForLetter} 
          onBack={() => {
            setSelectedStudentForLetter(null);
            router.push("/students?tab=all-students");
          }} 
        />
      );
    }
    if (activeSubtab === "Print Basic List") return <PrintBasicListView />;
    if (activeSubtab === "Manage Login") return <ManageLoginView />;
  }

  if (parent === "Employees") {
    if (editingEmployee) {
      return (
        <EditEmployeeForm 
          employee={editingEmployee} 
          onCancel={() => setEditingEmployee(null)} 
        />
      );
    }
    if (activeSubtab === "All Employees") {
      return (
        <AllEmployeesGrid 
          onEdit={(emp) => setEditingEmployee(emp)} 
          onViewDetails={(emp) => setSelectedEmployeeForLetter(emp)} 
        />
      );
    }
    if (activeSubtab === "Add New") return <NewEmployeeForm />;
    if (activeSubtab === "Job Letter") {
      return (
        <JobLetterView 
          initialEmployee={selectedEmployeeForLetter} 
          onBack={() => setSelectedEmployeeForLetter(null)} 
        />
      );
    }
    if (activeSubtab === "Manage Login") return <StaffLoginView />;
  }

  if (parent === "Fees") {
    if (activeSubtab === "Generate Fees Invoice") return <GenerateFeesInvoiceView />;
    if (activeSubtab === "Collect Fees") return <CollectFeesView />;
    if (activeSubtab === "Fees Paid Slip") return <FeesPaidSlipView />;
    if (activeSubtab === "Fees Defaulters") return <FeesDefaultersView />;
  }

  if (parent === "Attendance") {
    if (activeSubtab === "Students Attendance") return <StudentsAttendanceView />;
    if (activeSubtab === "Employees Attendance") return <EmployeesAttendanceView />;
    if (activeSubtab === "Class wise Report") return <ClassWiseReportView />;
    if (activeSubtab === "Students Attendance Report") return <StudentsAttendanceReportView />;
    if (activeSubtab === "Employees Attendance Report") return <EmployeesAttendanceReportView />;
  }

  return (
    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-2xl">
      Content for {parent} / {activeSubtab} is under development to match the reference.
    </div>
  );
}

function AllStudentsGrid({ onEdit, onViewDetails }: { onEdit: (student: any) => void; onViewDetails: (student: any) => void }) {
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSubmit, setSearchSubmit] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data.filter((stu: any) => 
            stu.name !== "John Doe" && 
            stu.name !== "Jane Smith" && 
            stu.level !== "Grade 10" && 
            stu.level !== "Grade 9" &&
            stu.level !== "Class 9" &&
            stu.level !== "Class 10"
          );
          setStudents(filtered);
          localStorage.setItem("campus_one_students", JSON.stringify(filtered));
        } else {
          throw new Error("Invalid format");
        }
      })
      .catch(() => {
        const local = localStorage.getItem("campus_one_students");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            const filtered = parsed.filter((stu: any) => 
              stu.name !== "John Doe" && 
              stu.name !== "Jane Smith" && 
              stu.level !== "Grade 10" && 
              stu.level !== "Grade 9" &&
              stu.level !== "Class 9" &&
              stu.level !== "Class 10"
            );
            setStudents(filtered);
          } catch (e) {
            loadDefaultMock();
          }
        } else {
          loadDefaultMock();
        }
      });

    function loadDefaultMock() {
      const defaultStudents = [
        { id: "S103", name: "Student One", level: "Class 3", status: "Enrolled" },
        { id: "S104", name: "Student Two", level: "Class 4", status: "Enrolled" }
      ];
      setStudents(defaultStudents);
      localStorage.setItem("campus_one_students", JSON.stringify(defaultStudents));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      const updated = students.filter(stu => stu.id !== id);
      setStudents(updated);
      localStorage.setItem("campus_one_students", JSON.stringify(updated));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmit(searchQuery);
  };

  const filteredStudents = students.filter(stu => 
    !searchSubmit || stu.name.toLowerCase().includes(searchSubmit.toLowerCase()) || (stu.level && stu.level.toLowerCase().includes(searchSubmit.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-4">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 px-2 relative z-10 -mb-2 w-fit">
            Search Student <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="text" 
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or grade level..." 
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all shadow-sm" 
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
        <button onClick={() => window.location.href = "?tab=add-new"} className="flex flex-col items-center justify-center gap-3 h-[280px] rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group shadow-sm hover:shadow-md">
          <div className="p-4 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform shadow-inner">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-bold text-primary tracking-tight">Add New Student</span>
        </button>

        {filteredStudents.map((student) => (
          <div key={student.id} className="flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-gray-200 bg-white hover:border-primary/50 transition-all shadow-sm hover:shadow-md h-[280px] relative group overflow-hidden">
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-600 border border-green-100 shadow-sm">
              {student.status || "Enrolled"}
            </span>

            <StudentAvatar student={student} className="w-20 h-20 shadow-md group-hover:scale-105 transition-transform" />

            <h3 className="text-lg font-bold text-gray-900 mt-3 tracking-tight truncate w-full">{student.name}</h3>
            <p className="text-gray-500 font-medium text-xs mt-0.5 truncate w-full">{student.level || "Class 1"}</p>

            <div className="flex items-center gap-3 mt-5">
              {/* Edit Student Button */}
              <button 
                onClick={() => onEdit(student)}
                title="Edit Student"
                className="w-8 h-8 rounded-full border border-blue-100 bg-blue-50/50 hover:bg-blue-600 text-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>

              {/* Delete Student Button */}
              <button 
                onClick={() => handleDelete(student.id)}
                title="Delete Student"
                className="w-8 h-8 rounded-full border border-red-100 bg-red-50/50 hover:bg-red-600 text-red-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed right-6 top-6 z-50 flex min-w-[280px] max-w-xs items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-bold text-green-600">Success!</p>
        <p className="mt-0.5 text-xs text-gray-500">{message}</p>
      </div>
      <button onClick={onClose} className="shrink-0 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100" type="button">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function EditStudentForm({ student, onCancel }: { student: any; onCancel: () => void }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState(student.name || "");
  const [level, setLevel] = useState(student.level || "Class 1");
  const [rollNo, setRollNo] = useState(student.rollNo || "");
  const [gender, setGender] = useState(student.gender || "");
  const [dob, setDob] = useState(student.dob || "");
  const [cnic, setCnic] = useState(student.cnic || "");
  const [status, setStatus] = useState(student.status || "Enrolled");
  const [image, setImage] = useState(student.image || "");

  const [fatherName, setFatherName] = useState(student.fatherName || "");
  const [fatherMobile, setFatherMobile] = useState(student.fatherMobile || "");
  const [fatherCnic, setFatherCnic] = useState(student.fatherCnic || "");
  const [fatherOccupation, setFatherOccupation] = useState(student.fatherOccupation || "");
  const [fatherEducation, setFatherEducation] = useState(student.fatherEducation || "");
  const [fatherProfession, setFatherProfession] = useState(student.fatherProfession || "");
  const [fatherIncome, setFatherIncome] = useState(student.fatherIncome || "");

  const [motherName, setMotherName] = useState(student.motherName || "");
  const [motherCnic, setMotherCnic] = useState(student.motherCnic || "");
  const [motherEducation, setMotherEducation] = useState(student.motherEducation || "");
  const [motherMobile, setMotherMobile] = useState(student.motherMobile || "");
  const [motherOccupation, setMotherOccupation] = useState(student.motherOccupation || "");
  const [motherProfession, setMotherProfession] = useState(student.motherProfession || "");
  const [motherIncome, setMotherIncome] = useState(student.motherIncome || "");

  const [presentAddress, setPresentAddress] = useState(student.presentAddress || "");
  const [permanentAddress, setPermanentAddress] = useState(student.permanentAddress || "");
  const [orphan, setOrphan] = useState(student.orphan || "");
  const [discount, setDiscount] = useState(student.discount || "");

  const [identificationMark, setIdentificationMark] = useState(student.identificationMark || "");
  const [bloodGroup, setBloodGroup] = useState(student.bloodGroup || "");
  const [disease, setDisease] = useState(student.disease || "");
  const [cast, setCast] = useState(student.cast || "");
  const [osc, setOsc] = useState(student.osc || "");
  const [previousSchool, setPreviousSchool] = useState(student.previousSchool || "");
  const [previousBoardRollNo, setPreviousBoardRollNo] = useState(student.previousBoardRollNo || "");
  const [additionalNote, setAdditionalNote] = useState(student.additionalNote || "");
  const [religion, setReligion] = useState(student.religion || "");
  const [totalSiblings, setTotalSiblings] = useState(student.totalSiblings || "");
  const [family, setFamily] = useState(student.family || "");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const local = localStorage.getItem("campus_one_students");
    let currentStudents = [];
    if (local) {
      try {
        currentStudents = JSON.parse(local);
      } catch (err) {
        currentStudents = [];
      }
    }

    const updatedStudents = currentStudents.map((stu: any) => {
      if (stu.id === student.id) {
        return {
          ...stu,
          name,
          level,
          rollNo,
          gender,
          dob,
          cnic,
          status,
          image,

          fatherName,
          fatherMobile,
          fatherCnic,
          fatherOccupation,
          fatherEducation,
          fatherProfession,
          fatherIncome,

          motherName,
          motherCnic,
          motherEducation,
          motherMobile,
          motherOccupation,
          motherProfession,
          motherIncome,

          presentAddress,
          permanentAddress,
          orphan,
          discount,

          identificationMark,
          bloodGroup,
          disease,
          cast,
          osc,
          previousSchool,
          previousBoardRollNo,
          additionalNote,
          religion,
          totalSiblings,
          family
        };
      }
      return stu;
    });

    localStorage.setItem("campus_one_students", JSON.stringify(updatedStudents));
    setIsSuccess(true);
    setTimeout(() => { setIsSuccess(false); onCancel(); }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 no-print">
      {isSuccess && <SuccessToast message="Student record updated successfully." onClose={() => setIsSuccess(false)} />}
      {/* Breadcrumbs matching Image 2 */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-3">
        <span>Students</span>
        <span>/</span>
        <span className="flex items-center gap-1.5 text-primary">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Edit Student
        </span>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Title and pills matching Image 2 */}
        <div className="flex flex-col items-center justify-center gap-2 mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Edit Student</h2>
        </div>

        <form onSubmit={handleUpdate} className="space-y-12">
          {/* Section 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm">1</div>
              <h3 className="text-lg font-bold text-gray-900">Student & Guardian Details</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2fr] gap-8 items-start">
              {/* Picture optional box */}
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 gap-4 text-center">
                <span className="bg-gray-200 text-gray-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">Picture - Optional</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
                
                {image ? (
                  <img 
                    src={image} 
                    alt="Upload preview" 
                    className="w-24 h-24 rounded-full border border-gray-150 shadow-md object-cover bg-white" 
                  />
                ) : (
                  <DefaultAvatarSVG className="w-24 h-24 shadow-md" />
                )}

                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary hover:bg-[#D97706] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/10 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Choose Image
                </button>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">Max size 100KB</span>
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of Student" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <select required value={level} onChange={(e) => setLevel(e.target.value)} className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10">
                    <option value="">Select Class</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Roll No <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" value={rollNo} onChange={(e) => setRollNo(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g. 101" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select required value={gender} onChange={(e) => setGender(e.target.value)} className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Date Of Birth <span className="text-red-500">*</span>
                  </label>
                  <input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Birth Form ID / CNIC <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" value={cnic} onChange={(e) => setCnic(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g. 36582319" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Enrollment Status <span className="text-red-500">*</span>
                  </label>
                  <select required value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10">
                    <option value="Enrolled">Enrolled</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Any Identification Mark?</label>
                  <input type="text" value={identificationMark} onChange={(e) => setIdentificationMark(e.target.value)} placeholder="e.g. Mole on right cheek" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Blood Group</label>
                  <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} placeholder="e.g. O+" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Disease If Any?</label>
                  <input type="text" value={disease} onChange={(e) => setDisease(e.target.value)} placeholder="e.g. None" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Cast</label>
                  <input type="text" value={cast} onChange={(e) => setCast(e.target.value)} placeholder="e.g. Cast details" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Religion</label>
                  <input type="text" value={religion} onChange={(e) => setReligion(e.target.value)} placeholder="e.g. Christian" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Parent / Guardian Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm">2</div>
              <h3 className="text-lg font-bold text-gray-900">Parent / Guardian Information</h3>
            </div>
            
            {/* Father details grid */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-bold text-amber-900">Father's Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Father's Name" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Mobile <span className="text-red-500">*</span></label>
                  <input required type="text" value={fatherMobile} onChange={(e) => setFatherMobile(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g. +639xxxxxxxx" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's CNIC / NIC</label>
                  <input type="text" value={fatherCnic} onChange={(e) => setFatherCnic(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Father's CNIC / NIC" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Occupation</label>
                  <input type="text" value={fatherOccupation} onChange={(e) => setFatherOccupation(e.target.value)} placeholder="e.g. Engineer" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Education</label>
                  <input type="text" value={fatherEducation} onChange={(e) => setFatherEducation(e.target.value)} placeholder="e.g. Bachelors" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Profession</label>
                  <input type="text" value={fatherProfession} onChange={(e) => setFatherProfession(e.target.value)} placeholder="e.g. IT Specialist" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Income</label>
                  <input type="text" value={fatherIncome} onChange={(e) => setFatherIncome(e.target.value)} placeholder="e.g. 50000" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Mother details grid */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-bold text-amber-900">Mother's Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Name<span className="text-red-500"> *</span></label>
                  <input required type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="Mother's Name" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Mobile<span className="text-red-500"> *</span></label>
                  <input required type="text" value={motherMobile} onChange={(e) => setMotherMobile(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Mother's Mobile" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's CNIC / NIC</label>
                  <input type="text" value={motherCnic} onChange={(e) => setMotherCnic(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Mother's CNIC / NIC" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Occupation</label>
                  <input type="text" value={motherOccupation} onChange={(e) => setMotherOccupation(e.target.value)} placeholder="Mother's Occupation" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Education</label>
                  <input type="text" value={motherEducation} onChange={(e) => setMotherEducation(e.target.value)} placeholder="Mother's Education" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Profession</label>
                  <input type="text" value={motherProfession} onChange={(e) => setMotherProfession(e.target.value)} placeholder="Mother's Profession" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Income</label>
                  <input type="text" value={motherIncome} onChange={(e) => setMotherIncome(e.target.value)} placeholder="Mother's Income" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Family setup details */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-bold text-amber-900">Family & Siblings Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Total Siblings</label>
                  <input type="number" value={totalSiblings} onChange={(e) => setTotalSiblings(e.target.value)} placeholder="e.g. 2" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Family Type</label>
                  <input type="text" value={family} onChange={(e) => setFamily(e.target.value)} placeholder="e.g. Joint / Nuclear" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Additional Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm">3</div>
              <h3 className="text-lg font-bold text-gray-900">Contact & Additional Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Present Address <span className="text-red-500">*</span></label>
                <input required type="text" value={presentAddress} onChange={(e) => setPresentAddress(e.target.value)} placeholder="Current Address" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Permanent Address</label>
                <input type="text" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} placeholder="Permanent Address" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Orphan Student <span className="text-red-500">*</span></label>
                <select required value={orphan} onChange={(e) => setOrphan(e.target.value)} className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10" style={{color: !orphan ? "#9ca3af" : ""}}>
                  <option value="" disabled>Select Orphan Status</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Discount in Fee (%)</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="e.g. 10" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Previous School</label>
                <input type="text" value={previousSchool} onChange={(e) => setPreviousSchool(e.target.value)} placeholder="e.g. City School" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Previous ID / Board Roll No</label>
                <input type="text" value={previousBoardRollNo} onChange={(e) => setPreviousBoardRollNo(e.target.value)} placeholder="e.g. Roll No" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">OSC Status</label>
                <input type="text" value={osc} onChange={(e) => setOsc(e.target.value)} placeholder="e.g. None" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Any Additional Note</label>
                <input type="text" value={additionalNote} onChange={(e) => setAdditionalNote(e.target.value)} placeholder="Add any special remarks..." className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-150">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 h-12 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 h-12 rounded-xl bg-primary hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-lg shadow-primary/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdmissionForm() {
  const [showAlert, setShowAlert] = useState(false);
  const [classCount, setClassCount] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // State variables for all student info fields
  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [level, setLevel] = useState("Class 1");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [cnic, setCnic] = useState("");
  
  const [fatherName, setFatherName] = useState("");
  const [fatherMobile, setFatherMobile] = useState("");
  const [fatherCnic, setFatherCnic] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [orphan, setOrphan] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState("");

  // Newly added details states
  const [identificationMark, setIdentificationMark] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [disease, setDisease] = useState("");
  const [cast, setCast] = useState("");
  const [osc, setOsc] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [previousBoardRollNo, setPreviousBoardRollNo] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [religion, setReligion] = useState("");
  
  const [fatherEducation, setFatherEducation] = useState("");
  const [fatherProfession, setFatherProfession] = useState("");
  const [fatherIncome, setFatherIncome] = useState("");
  const [totalSiblings, setTotalSiblings] = useState("");
  const [family, setFamily] = useState("");

  const [motherName, setMotherName] = useState("");
  const [motherCnic, setMotherCnic] = useState("");
  const [motherEducation, setMotherEducation] = useState("");
  const [motherMobile, setMotherMobile] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [motherProfession, setMotherProfession] = useState("");
  const [motherIncome, setMotherIncome] = useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/classes")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          setClassCount(data.length);
          if (data.length === 0) setShowAlert(true);
        } else {
          throw new Error("Invalid format");
        }
      })
      .catch(() => {
        const local = localStorage.getItem("campus_one_classes");
        let count = 4; // default mock count
        if (local) {
          try {
            count = JSON.parse(local).length;
          } catch (e) {}
        }
        setClassCount(count);
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setStudentName("");
    setRollNo("");
    setLevel("Class 1");
    setGender("");
    setDob("");
    setCnic("");
    setFatherName("");
    setFatherMobile("");
    setFatherCnic("");
    setFatherOccupation("");
    setFatherEducation("");
    setFatherProfession("");
    setFatherIncome("");
    
    setPresentAddress("");
    setPermanentAddress("");
    setOrphan("");
    setDiscount("");
    setImage("");

    setIdentificationMark("");
    setBloodGroup("");
    setDisease("");
    setCast("");
    setOsc("");
    setPreviousSchool("");
    setPreviousBoardRollNo("");
    setAdditionalNote("");
    setReligion("");
    setTotalSiblings("");
    setFamily("");

    setMotherName("");
    setMotherCnic("");
    setMotherEducation("");
    setMotherMobile("");
    setMotherOccupation("");
    setMotherProfession("");
    setMotherIncome("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newStudent = {
      id: "S" + Date.now().toString().slice(-4),
      name: studentName,
      level: level || "Class 1",
      rollNo,
      gender,
      dob,
      cnic,
      
      fatherName,
      fatherMobile,
      fatherCnic,
      fatherOccupation,
      fatherEducation,
      fatherProfession,
      fatherIncome,
      
      presentAddress,
      permanentAddress,
      orphan,
      discount,
      image,
      status: "Enrolled",
      fee: "₱150.00",

      // New properties
      identificationMark,
      bloodGroup,
      disease,
      cast,
      osc,
      previousSchool,
      previousBoardRollNo,
      additionalNote,
      religion,
      totalSiblings,
      family,

      motherName,
      motherCnic,
      motherEducation,
      motherMobile,
      motherOccupation,
      motherProfession,
      motherIncome
    };

    const local = localStorage.getItem("campus_one_students");
    let currentStudents = [];
    if (local) {
      try {
        currentStudents = JSON.parse(local);
      } catch (err) {
        currentStudents = [];
      }
    }
    currentStudents.push(newStudent);
    localStorage.setItem("campus_one_students", JSON.stringify(currentStudents));

    // Also try to POST to backend
    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent)
      });
    } catch (err) {
      console.warn("Backend not running, student persisted locally.");
    }

    setIsSuccess(true);
    handleReset();

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {isSuccess && <SuccessToast message="Student has been successfully admitted." onClose={() => setIsSuccess(false)} />}

      {showAlert && classCount === 0 && (
        <div className="rounded-xl overflow-hidden border border-primary/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-primary px-4 py-2 flex items-center justify-between">
            <span className="text-[11px] font-black text-white uppercase tracking-tighter">Campus One</span>
            <button onClick={() => setShowAlert(false)} className="text-[#111] hover:bg-gray-100 rounded-md p-1 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white p-6 flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <AlertCircle className="w-5 h-5 text-primary" />
              <span>Alert</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">No Class has been found. Please add at least one Class before to access this feature.</p>
            <button className="mt-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2 rounded-lg text-xs font-bold transition-colors">
              Ok, Add Class
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admission Form</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Student Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">1</div>
              <h3 className="text-lg font-bold text-gray-900">Student Information</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2fr] gap-8 items-start">
              {/* Image Picker */}
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 gap-4 text-center">
                <span className="bg-gray-200 text-gray-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">Picture - Optional</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
                
                {image ? (
                  <img 
                    src={image} 
                    alt="Upload preview" 
                    className="w-24 h-24 rounded-full border border-gray-150 shadow-md object-cover bg-white" 
                  />
                ) : (
                  <DefaultAvatarSVG className="w-24 h-24 shadow-md" />
                )}

                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary hover:bg-[#D97706] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/10 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Choose Image
                </button>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">Max size 100KB</span>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Student Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Name Of Student" 
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Roll No <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 101" 
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Class <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    value={level} 
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-500 focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10"
                  >
                    <option value="Class 1">Select Class</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Gender <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-500 focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Date Of Birth <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-500 focus:border-[#F59E0B] outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Student Birth Form ID / CNIC <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Birth Form ID / CNIC" 
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Any Identification Mark?</label>
                  <input 
                    type="text" 
                    value={identificationMark}
                    onChange={(e) => setIdentificationMark(e.target.value)}
                    placeholder="e.g. Mole on right cheek" 
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Blood Group</label>
                  <input 
                    type="text" 
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    placeholder="e.g. O+" 
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Disease If Any?</label>
                  <input 
                    type="text" 
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    placeholder="e.g. None" 
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Cast</label>
                  <input 
                    type="text" 
                    value={cast}
                    onChange={(e) => setCast(e.target.value)}
                    placeholder="e.g. Cast details" 
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Religion</label>
                  <input 
                    type="text" 
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    placeholder="e.g. Christian" 
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Parent / Guardian Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">2</div>
              <h3 className="text-lg font-bold text-gray-900">Parent / Guardian Information</h3>
            </div>
            
            {/* Father details grid */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-bold text-amber-900">Father's Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Father's Name" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Mobile <span className="text-red-500">*</span></label>
                  <input required type="text" value={fatherMobile} onChange={(e) => setFatherMobile(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g. +639xxxxxxxx" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's CNIC / NIC</label>
                  <input type="text" value={fatherCnic} onChange={(e) => setFatherCnic(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Father's CNIC / NIC" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Occupation</label>
                  <input type="text" value={fatherOccupation} onChange={(e) => setFatherOccupation(e.target.value)} placeholder="e.g. Engineer" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Education</label>
                  <input type="text" value={fatherEducation} onChange={(e) => setFatherEducation(e.target.value)} placeholder="e.g. Bachelors" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Profession</label>
                  <input type="text" value={fatherProfession} onChange={(e) => setFatherProfession(e.target.value)} placeholder="e.g. IT Specialist" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Father's Income</label>
                  <input type="text" value={fatherIncome} onChange={(e) => setFatherIncome(e.target.value)} placeholder="e.g. 50000" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Mother details grid */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-bold text-amber-900">Mother's Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Name<span className="text-red-500"> *</span></label>
                  <input required type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="Mother's Name" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Mobile<span className="text-red-500"> *</span></label>
                  <input required type="text" value={motherMobile} onChange={(e) => setMotherMobile(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Mother's Mobile" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's CNIC / NIC</label>
                  <input type="text" value={motherCnic} onChange={(e) => setMotherCnic(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Mother's CNIC / NIC" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Occupation</label>
                  <input type="text" value={motherOccupation} onChange={(e) => setMotherOccupation(e.target.value)} placeholder="Mother's Occupation" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Education</label>
                  <input type="text" value={motherEducation} onChange={(e) => setMotherEducation(e.target.value)} placeholder="Mother's Education" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Profession</label>
                  <input type="text" value={motherProfession} onChange={(e) => setMotherProfession(e.target.value)} placeholder="Mother's Profession" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mother's Income</label>
                  <input type="text" value={motherIncome} onChange={(e) => setMotherIncome(e.target.value)} placeholder="Mother's Income" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Family setup details */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-bold text-amber-900">Family & Siblings Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Total Siblings</label>
                  <input type="number" value={totalSiblings} onChange={(e) => setTotalSiblings(e.target.value)} placeholder="e.g. 2" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Family Type</label>
                  <input type="text" value={family} onChange={(e) => setFamily(e.target.value)} placeholder="e.g. Joint / Nuclear" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Additional Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">3</div>
              <h3 className="text-lg font-bold text-gray-900">Contact & Additional Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Present Address <span className="text-red-500">*</span></label>
                <input required type="text" value={presentAddress} onChange={(e) => setPresentAddress(e.target.value)} placeholder="Current Address" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Permanent Address</label>
                <input type="text" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} placeholder="Permanent Address" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Orphan Student <span className="text-red-500">*</span></label>
                <select required value={orphan} onChange={(e) => setOrphan(e.target.value)} className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10" style={{color: !orphan ? "#9ca3af" : ""}}>
                  <option value="" disabled>Select Orphan Status</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Discount in Fee (%)</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="e.g. 10" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Previous School</label>
                <input type="text" value={previousSchool} onChange={(e) => setPreviousSchool(e.target.value)} placeholder="e.g. City School" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Previous ID / Board Roll No</label>
                <input type="text" value={previousBoardRollNo} onChange={(e) => setPreviousBoardRollNo(e.target.value)} placeholder="e.g. Roll No" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">OSC Status</label>
                <input type="text" value={osc} onChange={(e) => setOsc(e.target.value)} placeholder="e.g. None" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Any Additional Note</label>
                <input type="text" value={additionalNote} onChange={(e) => setAdditionalNote(e.target.value)} placeholder="Add any special remarks..." className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center pt-4 border-t border-gray-100">
            <button type="button" onClick={handleReset} className="px-8 py-3 rounded-xl bg-white/5 text-gray-900 font-bold hover:bg-gray-50 border border-gray-200 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Reset
            </button>
            <button type="submit" className="px-12 py-3 rounded-xl bg-primary text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Submit Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdmissionLetterView({ selectedStudent, onBack }: { selectedStudent?: any; onBack?: () => void }) {
  const [searchQuery, setSearchQuery] = useState(selectedStudent?.name || "");
  const [studentLetter, setStudentLetter] = useState<any | null>(selectedStudent || null);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let list: any[] = [];
    const local = localStorage.getItem("campus_one_students");
    if (local) {
      try {
        list = JSON.parse(local);
      } catch (e) {}
    }
    
    // Filter out our deleted mocks (John Doe and Jane Smith) just in case
    list = list.filter((stu: any) => 
      stu.name !== "John Doe" && 
      stu.name !== "Jane Smith" &&
      stu.level !== "Grade 10" &&
      stu.level !== "Grade 9" &&
      stu.level !== "Class 9" &&
      stu.level !== "Class 10"
    );

    if (list.length === 0) {
      list = [
        { id: "S103", name: "Student One", level: "Class 3", status: "Enrolled", dob: "2010-05-12" },
        { id: "S104", name: "Student Two", level: "Class 4", status: "Enrolled", dob: "2011-08-22" }
      ];
    }
    setAllStudents(list);

    if (selectedStudent) {
      setStudentLetter(selectedStudent);
      setSearchQuery(selectedStudent.name);
    }
  }, [selectedStudent]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter((stu) => {
      return !searchQuery || stu.name.toLowerCase().includes(searchQuery.toLowerCase()) || stu.id.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [allStudents, searchQuery]);

  const username = studentLetter ? ("166458a48W" + studentLetter.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4)) : "";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {onBack && (
        <div className="flex items-center justify-between no-print">
          <button 
            onClick={onBack}
            className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Students
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center gap-6 shadow-sm no-print">
        <div className="relative w-full max-w-md">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4 bg-white px-2 relative z-10 -mb-2 w-fit block">Search Student<span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={searchQuery}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="Search Student" 
            className="w-full h-14 rounded-full border border-gray-200 bg-white pl-6 pr-12 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all shadow-sm"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
          {showDropdown && filteredStudents.length > 0 && (
            <div className="absolute top-16 left-0 w-full bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-gray-100">
              {filteredStudents.map((stu) => (
                <button
                  key={stu.id}
                  type="button"
                  onClick={() => {
                    setStudentLetter(stu);
                    setSearchQuery(stu.name);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-6 py-3.5 text-xs hover:bg-[#F59E0B]/5 transition-colors flex flex-col gap-0.5"
                >
                  <span className="font-bold text-gray-900">{stu.name}</span>
                  <span className="text-gray-400 font-semibold font-mono text-[10px]">{stu.id} — {stu.level}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-gray-500 text-sm font-medium">Search for a student to generate and preview their admission letter.</p>
      </div>

      {studentLetter && (
        <div className="space-y-6">
          {/* Dashboard Confirmation Box matching Image 2 with amber theme */}
          <div className="max-w-xl mx-auto rounded-3xl border-2 border-gray-150 bg-white shadow-xl overflow-hidden no-print">
            <div className="bg-[#F59E0B] text-white text-center py-4 text-xs font-black uppercase tracking-widest">
              Admission Confirmation
            </div>
            <div className="p-8 flex flex-col items-center gap-6">
              <StudentAvatar student={studentLetter} className="w-24 h-24 shadow-md" />
              <h2 className="text-2xl font-black text-amber-900 tracking-tight">{studentLetter.name}</h2>
              
              <div className="w-full space-y-0.5 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-150 shadow-inner">
                <div className="flex justify-between py-2 border-b border-gray-200/50">
                  <span className="text-gray-500 font-semibold">Registration/ID</span>
                  <span className="font-bold text-gray-900">{studentLetter.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200/50">
                  <span className="text-gray-500 font-semibold">Class</span>
                  <span className="font-bold text-gray-900">{studentLetter.level || "Class 1"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200/50">
                  <span className="text-gray-500 font-semibold">Admission Date</span>
                  <span className="font-bold text-gray-900">{studentLetter.dob || new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200/50">
                  <span className="text-gray-500 font-semibold">Father's Name</span>
                  <span className="font-bold text-gray-900">{studentLetter.fatherName || "—"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 font-semibold">Father's Mobile</span>
                  <span className="font-bold text-gray-900 font-mono">{studentLetter.fatherMobile || "—"}</span>
                </div>
              </div>

              <button 
                onClick={() => window.print()}
                className="w-full h-12 rounded-2xl bg-[#F59E0B] hover:bg-[#d97706] text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[#F59E0B]/20 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Print Admission Letter
              </button>
            </div>
          </div>

          {/* Printable letter block */}
          <PrintTemplate title="Admission Letter">
            {/* Student photo + core details */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "32px", borderBottom: "1px solid #E5E7EB", paddingBottom: "20px" }}>
              <div style={{ width: "110px", height: "110px", borderRadius: "50%", border: "4px solid #F3F4F6", overflow: "hidden", flexShrink: 0, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <StudentAvatar student={studentLetter} className="w-full h-full object-cover" />
              </div>
              <PrintInfoGrid items={[
                { label: "Serial No",                  value: "1,842,900" },
                { label: "Date Of Birth",              value: studentLetter.dob },
                { label: "Date of Admission",          value: studentLetter.dob || new Date().toLocaleDateString() },
                { label: "Registration No",            value: studentLetter.id, highlight: true },
                { label: "Student Birth Form ID / NIC",value: studentLetter.nic },
                { label: "Discount In Fee",            value: studentLetter.discount ? `${studentLetter.discount}%` : "0%" },
                { label: "Student Name",               value: studentLetter.name },
                { label: "Gender",                     value: studentLetter.gender || "Male" },
                { label: "Admission Status",           value: studentLetter.status || "Enrolled" },
                { label: "Class",                      value: studentLetter.level || "Class 1" },
                { label: "Religion",                   value: studentLetter.religion },
                { label: "Mobile No",                  value: studentLetter.phone },
              ]} />
            </div>

            {/* Address */}
            <PrintSection>
              <PrintInfoGrid columns={2} items={[
                { label: "Address", value: studentLetter.presentAddress || studentLetter.permanentAddress },
              ]} />
            </PrintSection>

            {/* Extra details — 3 columns */}
            <PrintSection title="Additional Details">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px 24px" }}>
                {/* Col 1 – Student extras */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    ["Any Identification Mark?", studentLetter.identificationMark],
                    ["Blood Group",              studentLetter.bloodGroup],
                    ["Disease If Any?",          studentLetter.disease],
                    ["Cast",                     studentLetter.cast],
                    ["Orphan Student",           studentLetter.orphan],
                    ["OSC",                      studentLetter.osc],
                    ["Previous School",          studentLetter.previousSchool],
                    ["Previous ID / Board Roll No", studentLetter.previousBoardRollNo],
                    ["Any Additional Note",      studentLetter.additionalNote],
                  ].map(([label, val]) => (
                    <div key={label as string} style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginTop: "2px" }}>↳ {val || "—"}</span>
                    </div>
                  ))}
                </div>
                {/* Col 2 – Father */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    ["Father's Name",    studentLetter.fatherName],
                    ["Father National ID", studentLetter.fatherCnic],
                    ["Education",        studentLetter.fatherEducation],
                    ["Mobile No",        studentLetter.fatherMobile],
                    ["Occupation",       studentLetter.fatherOccupation],
                    ["Profession",       studentLetter.fatherProfession],
                    ["Income",           studentLetter.fatherIncome || "0"],
                    ["Total Siblings",   studentLetter.totalSiblings || "0"],
                    ["Family",           studentLetter.family],
                  ].map(([label, val]) => (
                    <div key={label as string} style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginTop: "2px" }}>↳ {val || "—"}</span>
                    </div>
                  ))}
                </div>
                {/* Col 3 – Mother */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    ["Mother's Name",    studentLetter.motherName],
                    ["Mother National ID", studentLetter.motherCnic],
                    ["Education",        studentLetter.motherEducation],
                    ["Mobile No",        studentLetter.motherMobile],
                    ["Occupation",       studentLetter.motherOccupation],
                    ["Profession",       studentLetter.motherProfession],
                    ["Income",           studentLetter.motherIncome || "0"],
                  ].map(([label, val]) => (
                    <div key={label as string} style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginTop: "2px" }}>↳ {val || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PrintSection>
          </PrintTemplate>
        </div>
      )}
    </div>
  );
}

function StudentIDCardsView({ selectedStudent, onBack }: { selectedStudent?: any; onBack?: () => void }) {
  const [activeStyle, setActiveStyle] = useState("Default");
  const [targetStudent, setTargetStudent] = useState<any | null>(null);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let list: any[] = [];
    const local = localStorage.getItem("campus_one_students");
    if (local) {
      try {
        list = JSON.parse(local);
      } catch (e) {}
    }
    
    // Filter out our deleted mocks (John Doe and Jane Smith) just in case
    list = list.filter((stu: any) => 
      stu.name !== "John Doe" && 
      stu.name !== "Jane Smith" &&
      stu.level !== "Grade 10" &&
      stu.level !== "Grade 9" &&
      stu.level !== "Class 9" &&
      stu.level !== "Class 10"
    );

    if (list.length === 0) {
      list = [
        { id: "S103", name: "Student One", level: "Class 3", status: "Enrolled", dob: "2010-05-12" },
        { id: "S104", name: "Student Two", level: "Class 4", status: "Enrolled", dob: "2011-08-22" }
      ];
    }
    setAllStudents(list);

    if (selectedStudent) {
      setTargetStudent(selectedStudent);
      setSearchQuery(selectedStudent.name);
    }
  }, [selectedStudent]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter((stu) => {
      return !searchQuery || stu.name.toLowerCase().includes(searchQuery.toLowerCase()) || stu.id.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [allStudents, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {onBack && (
        <div className="flex items-center justify-between no-print">
          <button 
            onClick={onBack}
            className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Students
          </button>
        </div>
      )}

      {/* Style selector top toolbar matching Image 2 */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 no-print w-full bg-white p-6 rounded-2xl border border-gray-150 shadow-sm">
        {/* Style selection buttons on the left */}
        <div className="flex flex-wrap items-center gap-3">
          {["Default", "Style 1", "Style 2", "Style 3", "Style 4"].map((style) => (
            <button 
              key={style}
              onClick={() => setActiveStyle(style)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border shadow-sm",
                activeStyle === style 
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/10 scale-105" 
                  : "bg-white text-gray-600 border-gray-250 hover:bg-gray-50 hover:text-primary"
              )}
            >
              {activeStyle === style && <span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1.5 -mt-0.5" />}
              {style}
            </button>
          ))}
        </div>

        {/* Filter / Search inputs on the right */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Student* field */}
          <div className="relative">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit block">Search Student<span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={searchQuery}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              placeholder="Search Student" 
              className="w-56 h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-primary outline-none transition-all shadow-sm"
            />
            {showDropdown && filteredStudents.length > 0 && (
              <div className="absolute top-14 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-gray-100">
                {filteredStudents.map((stu) => (
                  <button
                    key={stu.id}
                    type="button"
                    onClick={() => {
                      setTargetStudent(stu);
                      setSearchQuery(stu.name);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-xs hover:bg-primary/5 transition-colors flex flex-col gap-0.5"
                  >
                    <span className="font-bold text-gray-900">{stu.name}</span>
                    <span className="text-gray-400 font-semibold font-mono text-[10px]">{stu.id} — {stu.level}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-12 flex flex-col items-center justify-center text-center gap-6 min-h-[520px] relative overflow-hidden no-print">
        {!targetStudent ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p className="text-gray-500 font-medium">Search for a student to generate their ID card</p>
          </div>
        ) : (
        <>
        {/* Animated preview window */}
        <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center">
          {/* Main ID Card frame */}
          <div className={cn(
            "w-[340px] h-[520px] rounded-[2.5rem] border overflow-hidden shadow-2xl flex flex-col relative bg-white transition-all duration-300",
            activeStyle === "Default" && "border-primary/20 shadow-primary/5",
            activeStyle === "Style 1" && "border-blue-150 shadow-blue-600/5 bg-gradient-to-b from-blue-50/20 to-white",
            activeStyle === "Style 2" && "border-amber-150 shadow-amber-600/5 bg-[#FFFDF9]",
            activeStyle === "Style 3" && "border-rose-150 shadow-rose-600/5",
            activeStyle === "Style 4" && "border-gray-300 shadow-gray-600/5"
          )}>
            {/* Artistic Header Ribbon */}
            <div className={cn(
              "h-28 flex flex-col items-center justify-center text-white px-6 text-center relative",
              activeStyle === "Default" && "bg-primary",
              activeStyle === "Style 1" && "bg-blue-600",
              activeStyle === "Style 2" && "bg-amber-600",
              activeStyle === "Style 3" && "bg-rose-600",
              activeStyle === "Style 4" && "bg-gray-800"
            )}>
              <div className="absolute -bottom-6 left-6 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
              </div>
              <h2 className="text-lg font-black uppercase tracking-widest drop-shadow-sm ml-8">Campus One</h2>
              <p className="text-[8px] font-black opacity-80 uppercase tracking-widest mt-0.5 ml-8">Your School Software</p>
            </div>

            {/* Photo Avatar Panel */}
            <div className="flex flex-col items-center mt-8 relative">
              <div className={cn(
                "w-28 h-28 rounded-full border-[5px] border-white shadow-xl overflow-hidden flex items-center justify-center bg-gray-50 z-10 transition-colors",
                activeStyle === "Default" && "ring-4 ring-primary/20",
                activeStyle === "Style 1" && "ring-4 ring-blue-5",
                activeStyle === "Style 2" && "ring-4 ring-amber-5",
                activeStyle === "Style 3" && "ring-4 ring-rose-5",
                activeStyle === "Style 4" && "ring-4 ring-gray-100"
              )}>
                <StudentAvatar student={targetStudent} className="w-full h-full object-cover" />
              </div>

              {/* Barcode block under picture */}
              <div className="flex flex-col items-center mt-4">
                <div className="flex gap-0.5 items-center justify-center h-8 px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="w-0.5 h-full bg-gray-900" />
                  <div className="w-1.5 h-full bg-gray-900" />
                  <div className="w-0.5 h-full bg-gray-900" />
                  <div className="w-1 h-full bg-gray-900" />
                  <div className="w-0.5 h-full bg-gray-900" />
                  <div className="w-1.5 h-full bg-gray-900" />
                  <div className="w-0.5 h-full bg-gray-900" />
                  <div className="w-1.5 h-full bg-gray-900" />
                  <div className="w-0.5 h-full bg-gray-900" />
                  <div className="w-1 h-full bg-gray-900" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1 font-mono">{targetStudent.id}</span>
              </div>
            </div>

            {/* Details Panel */}
            <div className="flex-1 px-8 pt-4 pb-6 flex flex-col items-center text-center">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1",
                activeStyle === "Default" && "bg-primary/10 text-primary",
                activeStyle === "Style 1" && "bg-blue-50 text-blue-600",
                activeStyle === "Style 2" && "bg-amber-50 text-amber-600",
                activeStyle === "Style 3" && "bg-rose-50 text-rose-600",
                activeStyle === "Style 4" && "bg-gray-100 text-gray-600"
              )}>
                🎓 Student
              </span>

              {/* Grid ledger items */}
              <div className="w-full mt-6 space-y-2 text-xs font-semibold text-gray-700 bg-gray-50/50 p-4 rounded-2xl border border-gray-150/60 shadow-inner">
                <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Student ID</span>
                  <span className="text-gray-900 font-black">{targetStudent.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Class Name</span>
                  <span className="text-gray-900 font-black">{targetStudent.level || "Class 1"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">DOA</span>
                  <span className="text-gray-900 font-black">{targetStudent.dob || "23 May, 2026"}</span>
                </div>
              </div>
            </div>

            {/* QR code printed on bottom right inside the card */}
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white border border-gray-200 rounded-lg p-1 shadow-sm flex items-center justify-center">
              <svg className="w-full h-full text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm12 3v3h6v-3h-6zm4-3v3h2v-3h-2z"/><rect x="7" y="7" width="2" height="2" fill="currentColor"/><rect x="15" y="7" width="2" height="2" fill="currentColor"/><rect x="7" y="15" width="2" height="2" fill="currentColor"/><rect x="17" y="17" width="2" height="2" fill="currentColor"/></svg>
            </div>
          </div>
        </div>

        <button 
          onClick={() => window.print()}
          className="px-8 py-3.5 bg-primary hover:bg-[#D97706] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Print ID Card
        </button>
        </>
        )}
      </div>

      {/* Printable ID card wrapper */}
      {targetStudent && (
      <div className="print-only-container hidden print:block bg-white text-black p-10 font-sans leading-relaxed text-sm">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-[340px] h-[520px] rounded-[2.5rem] border border-gray-400 bg-white overflow-hidden shadow-none flex flex-col relative">
            <div className="h-28 bg-gray-900 text-white flex flex-col items-center justify-center px-6 text-center relative">
              <h2 className="text-lg font-black uppercase tracking-widest">Campus One</h2>
              <p className="text-[8px] font-black opacity-80 uppercase tracking-widest mt-0.5">Your School Software</p>
            </div>

            <div className="flex flex-col items-center mt-8 relative">
              <div className="w-28 h-28 rounded-full border-[5px] border-white shadow-xl overflow-hidden flex items-center justify-center bg-gray-50 z-10 ring-4 ring-gray-100">
                <StudentAvatar student={targetStudent} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col items-center mt-4">
                <div className="flex gap-0.5 items-center justify-center h-8 px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="w-0.5 h-full bg-gray-900" />
                  <div className="w-1.5 h-full bg-gray-900" />
                  <div className="w-0.5 h-full bg-gray-900" />
                  <div className="w-1 h-full bg-gray-900" />
                  <div className="w-0.5 h-full bg-gray-900" />
                  <div className="w-1.5 h-full bg-gray-900" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1 font-mono">{targetStudent.id}</span>
              </div>
            </div>

            <div className="flex-1 px-8 pt-4 pb-6 flex flex-col items-center text-center">
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                🎓 Student
              </span>

              <div className="w-full mt-6 space-y-2 text-xs font-semibold text-gray-700 bg-gray-50/50 p-4 rounded-2xl border border-gray-150 shadow-inner">
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Student ID</span>
                  <span className="text-gray-900 font-black">{targetStudent.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Class Name</span>
                  <span className="text-gray-900 font-black">{targetStudent.level || "Class 1"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">DOA</span>
                  <span className="text-gray-900 font-black">{targetStudent.dob || "23 May, 2026"}</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white border border-gray-200 rounded-lg p-1 shadow-sm flex items-center justify-center">
              <svg className="w-full h-full text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm12 3v3h6v-3h-6zm4-3v3h2v-3h-2z"/><rect x="7" y="7" width="2" height="2" fill="currentColor"/><rect x="15" y="7" width="2" height="2" fill="currentColor"/><rect x="7" y="15" width="2" height="2" fill="currentColor"/><rect x="17" y="17" width="2" height="2" fill="currentColor"/></svg>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

function PrintBasicListView() {
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  const itemsPerPage = 10;

  // Retrieve and load students from localStorage, fall back to robust mock
  const studentsList = useMemo(() => {
    let list = [];
    const local = localStorage.getItem("campus_one_students");
    if (local) {
      try {
        list = JSON.parse(local);
      } catch (err) {}
    }
    if (!list || list.length === 0) {
      list = Array.from({ length: 24 }).map((_, i) => ({
        id: `CO-${1000 + i}`,
        name: `Student ${String.fromCharCode(65 + (i % 26))} Name`,
        fatherName: `Father Name ${i + 1}`,
        level: i % 2 === 0 ? "Class 1" : "Class 2",
        fee: "₱150.00",
        fatherMobile: `+63 912 345 ${6000 + i}`
      }));
    }
    return list;
  }, [isSuccess]);

  // Extract unique classes dynamically
  const classes = useMemo(() => {
    const set = new Set<string>();
    
    // Load custom classes first
    const localClasses = localStorage.getItem("campus_one_classes");
    if (localClasses) {
      try {
        const parsed = JSON.parse(localClasses);
        parsed.forEach((c: any) => {
          if (c.name) set.add(c.name);
        });
      } catch (err) {}
    }
    
    // Also include levels from existing students
    studentsList.forEach((s: any) => {
      if (s.level) set.add(s.level);
    });
    
    // Defaults
    ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"].forEach(c => set.add(c));
    return Array.from(set).sort();
  }, [studentsList]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClass) {
      setIsSuccess(true);
      setCurrentPage(1);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!isSuccess) return [];
    
    return studentsList
      .filter((student: any) => student.level === selectedClass)
      .filter((student: any) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            student.name.toLowerCase().includes(query) ||
            student.id.toLowerCase().includes(query) ||
            (student.fatherName && student.fatherName.toLowerCase().includes(query)) ||
            (student.fatherMobile && student.fatherMobile.toLowerCase().includes(query))
          );
        }
        return true;
      });
  }, [isSuccess, selectedClass, searchQuery, studentsList]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatFee = (fee: string | number) => {
    if (!fee) return "₱150.00";
    const str = String(fee).trim();
    if (str.startsWith("$")) {
      return "₱" + str.substring(1);
    }
    if (!str.startsWith("₱") && !str.includes("₱")) {
      return "₱" + str;
    }
    return str;
  };

  const handleExport = (type: string) => {
    if (type === "Print") {
      window.print();
    } else if (type === "Excel") {
      setExportMessage("Generating Excel spreadsheet...");
      
      const headers = ["Sr", "ID", "Student Name", "Father Name", "Class", "Fee Remainings", "Phone"];
      const rows = filteredStudents.map((s: any, i: number) => [
        i + 1,
        s.id,
        s.name,
        s.fatherName || "N/A",
        s.level || "Class 1",
        formatFee(s.fee),
        s.fatherMobile || "N/A"
      ]);
      const tsvContent = [headers.join("\t"), ...rows.map((r: any) => r.join("\t"))].join("\n");
      const blob = new Blob([tsvContent], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Campus_One_Students_Class_${selectedClass.replace(/\s+/g, "_")}.xls`;
      link.click();
      
      setTimeout(() => setExportMessage(""), 2000);
    } else if (type === "PDF") {
      setExportMessage("Formatting PDF Ledger Document...");
      setTimeout(() => {
        setExportMessage("");
        window.print(); // Falls back nicely to print layout styled as PDF exporter
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {exportMessage && (
        <div className="rounded-xl overflow-hidden border border-green-500/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 no-print">
          <div className="bg-green-500 px-4 py-2 flex items-center justify-between">
            <span className="text-[11px] font-black text-white uppercase tracking-tighter">Campus One</span>
            <button type="button" onClick={() => setExportMessage("")} className="text-white hover:bg-green-600 rounded-md p-1 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white p-6 flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-black">✓</span>
              <span>Document Export</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{exportMessage}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm no-print">
        <div className="p-8 space-y-8">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full max-w-md">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Select Class <span className="text-red-500">*</span></label>
              <select 
                required
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setIsSuccess(false);
                }}
                className="mt-2 w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10"
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="h-12 bg-primary text-white font-black px-8 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
              Generate List
            </button>
          </form>

          {isSuccess && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {["Excel", "PDF", "Print"].map(tool => (
                    <button 
                      key={tool} 
                      type="button"
                      onClick={() => handleExport(tool)}
                      className="px-6 py-2.5 bg-gray-50 border border-gray-250 rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 shadow-sm"
                    >
                      {tool === "Print" && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>}
                      {tool}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Search:</span>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by name, ID..."
                    className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all w-64 shadow-sm" 
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                  <thead className="bg-primary text-white text-[9px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-3 py-2">Sr</th>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Student Name</th>
                      <th className="px-3 py-2">Father</th>
                      <th className="px-3 py-2">Class</th>
                      <th className="px-3 py-2">Fee Remainings</th>
                      <th className="px-3 py-2">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {paginatedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-20 text-center text-gray-500/40 font-bold uppercase tracking-widest text-[11px] bg-gray-50/30">
                          No matching students found
                        </td>
                      </tr>
                    ) : (
                      paginatedStudents.map((student: any, i: number) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-2 font-mono text-gray-500 text-[10px]">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                          <td className="px-3 py-2 font-bold text-gray-900 text-[10px]">{student.id}</td>
                          <td className="px-3 py-2 font-semibold text-gray-700 text-[10px]">{student.name}</td>
                          <td className="px-3 py-2 text-gray-600 text-[10px]">{student.fatherName || "N/A"}</td>
                          <td className="px-3 py-2">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">{student.level || "Class 1"}</span>
                          </td>
                          <td className="px-3 py-2 font-bold text-red-500 text-[10px]">{formatFee(student.fee)}</td>
                          <td className="px-3 py-2 text-gray-500 font-mono text-[10px]">{student.fatherMobile || "N/A"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-500 px-2">
                <span>Showing {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries</span>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || filteredStudents.length === 0}
                    className="hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-gray-500 font-bold uppercase tracking-widest"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages || filteredStudents.length === 0}
                    className="hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-gray-500 font-bold uppercase tracking-widest"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print ledger sheet */}
      {isSuccess && (
        <PrintTemplate title="Student Basic List" subtitle={`Class: ${selectedClass}`}>
          <PrintTable>
            <PrintThead>
              <tr>
                <PrintTh>Sr</PrintTh>
                <PrintTh>Student ID</PrintTh>
                <PrintTh>Student Name</PrintTh>
                <PrintTh>Father&apos;s Name</PrintTh>
                <PrintTh>Class</PrintTh>
                <PrintTh>Fee Remaining</PrintTh>
                <PrintTh>Phone</PrintTh>
              </tr>
            </PrintThead>
            <tbody>
              {filteredStudents.map((s: any, i: number) => (
                <tr key={s.id}>
                  <PrintTd variant="muted">{i + 1}</PrintTd>
                  <PrintTd variant="bold">{s.id}</PrintTd>
                  <PrintTd variant="bold">{s.name}</PrintTd>
                  <PrintTd>{s.fatherName || "N/A"}</PrintTd>
                  <PrintTd>{s.level || "Class 1"}</PrintTd>
                  <PrintTd variant="red">{formatFee(s.fee)}</PrintTd>
                  <PrintTd variant="muted">{s.fatherMobile || "N/A"}</PrintTd>
                </tr>
              ))}
            </tbody>
          </PrintTable>
        </PrintTemplate>
      )}
    </div>
  );
}

function AllClassesGrid() {
  const [classes, setClasses] = useState<any[]>([]);
  const [assignedSubjects, setAssignedSubjects] = useState<any[]>([]);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editAdviser, setEditAdviser] = useState("");
  const [editFees, setEditFees] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  function subjectCountForClass(clsName: string) {
    const classSubjects = assignedSubjects.find((as: any) => as.className === clsName);
    return classSubjects ? classSubjects.subjects.length : 0;
  }
  
  useEffect(() => {
    const loadClasses = () => {
      let loadedClasses: any[] = [];
      const local = localStorage.getItem("campus_one_classes");

      if (local) {
        try {
          // Filter out any old hardcoded mock data that might be in local storage
          loadedClasses = JSON.parse(local).filter((c: any) =>
            !["Class 10A", "Class 9B", "Class 10", "Class 9", "Class 11C", "Class 8D"].includes(c.name)
          );
        } catch (e) {
          console.error("Failed to parse local storage for classes:", e);
          loadedClasses = []; // Fallback to empty if local storage is corrupted
        }
      }
      setClasses(loadedClasses);

      // Load assigned subjects
      let loadedAssignedSubjects: any[] = [];
      const localAssignedSubjects = localStorage.getItem("campus_one_assigned_subjects");
      if (localAssignedSubjects) {
        try {
          loadedAssignedSubjects = JSON.parse(localAssignedSubjects);
        } catch (e) {
          console.error("Failed to parse local storage for assigned subjects:", e);
        }
      }
      setAssignedSubjects(loadedAssignedSubjects);
    };
    loadClasses();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      loadClasses();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Reload data when modal closes
  useEffect(() => {
    if (!editingClass) {
      // Reload assigned subjects when modal closes
      try {
        const localAssignedSubjects = localStorage.getItem("campus_one_assigned_subjects");
        const loadedAssignedSubjects = localAssignedSubjects ? JSON.parse(localAssignedSubjects) : [];
        setAssignedSubjects(loadedAssignedSubjects);
      } catch (e) {
        console.error("Failed to reload assigned subjects:", e);
      }
    }
  }, [editingClass]);

  const handleEdit = (cls: any) => {
    setEditingClass(cls);
    setEditName(cls.name);
    setEditAdviser(cls.adviser);
    setEditFees(cls.monthlyTuitionFees);
    setValidationErrors({});
  };

  const validateEdit = () => {
    const errors: Record<string, string> = {};
    
    if (!editName.trim()) {
      errors.name = "Class Name is required";
    }
    if (!editAdviser.trim()) {
      errors.adviser = "Adviser is required";
    }
    if (!editFees.trim()) {
      errors.fees = "Monthly Fees is required";
    } else if (isNaN(Number(editFees)) || Number(editFees) <= 0) {
      errors.fees = "Monthly Fees must be a positive number";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = () => {
    if (!validateEdit()) {
      return;
    }
    
    const updated = classes.map(c => 
      c.id === editingClass.id 
        ? { ...c, name: editName, adviser: editAdviser, monthlyTuitionFees: editFees }
        : c
    );
    setClasses(updated);
    localStorage.setItem("campus_one_classes", JSON.stringify(updated));
    setEditingClass(null);
    setValidationErrors({});
  };

  const handleDelete = (clsId: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    const updated = classes.filter(c => c.id !== clsId);
    setClasses(updated);
    localStorage.setItem("campus_one_classes", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <a href="/classes?tab=new-class" className="flex flex-col items-center justify-center gap-3 h-[280px] w-full max-w-2xl rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group col-span-full mx-auto">
          <div className="p-3 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-bold text-primary">Add New</span>
        </a>

        {classes.length > 0 ? (
          classes.map((cls) => (
            <div key={cls.id} className="flex flex-col p-6 rounded-2xl border border-gray-200 bg-white hover:border-primary/50 transition-colors shadow-sm group cursor-pointer relative overflow-hidden" onClick={() => handleEdit(cls)}>
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                  subjectCountForClass(cls.name) > 0 ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                )}>
                  {subjectCountForClass(cls.name) > 0 ? "Assigned" : "No Subjects"}
                </span>
              </div>
              <h3 className="mt-4 font-bold text-lg text-gray-900">{cls.name}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Adviser</span>
                  <span className="font-semibold text-gray-900">{cls.adviser}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Monthly Fees</span>
                  <span className="font-semibold text-gray-900">₱{cls.monthlyTuitionFees}</span>
                </div>
              </div>
              
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(cls);
                  }}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cls.id);
                  }}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500/40 font-bold uppercase tracking-widest text-[11px] bg-gray-50/30 p-10 rounded-2xl">
            No classes added yet. Click "Add New" to create your first class.
          </div>
        )}
      </div>

      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900">Edit Class</h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Class Name <span className="text-red-500">*</span>
                </span>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    if (validationErrors.name) {
                      setValidationErrors(prev => ({ ...prev, name: "" }));
                    }
                  }}
                  className={cn(
                    "mt-1 w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 transition",
                    validationErrors.name 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  )}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{validationErrors.name}</p>
                )}
              </label>

              <label className="block">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Adviser <span className="text-red-500">*</span>
                </span>
                <input 
                  type="text"
                  value={editAdviser}
                  onChange={(e) => {
                    setEditAdviser(e.target.value);
                    if (validationErrors.adviser) {
                      setValidationErrors(prev => ({ ...prev, adviser: "" }));
                    }
                  }}
                  className={cn(
                    "mt-1 w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 transition",
                    validationErrors.adviser 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  )}
                />
                {validationErrors.adviser && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{validationErrors.adviser}</p>
                )}
              </label>

              <label className="block">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Monthly Fees <span className="text-red-500">*</span>
                </span>
                <input 
                  type="number"
                  value={editFees}
                  onChange={(e) => {
                    setEditFees(e.target.value);
                    if (validationErrors.fees) {
                      setValidationErrors(prev => ({ ...prev, fees: "" }));
                    }
                  }}
                  className={cn(
                    "mt-1 w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                    validationErrors.fees 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  )}
                />
                {validationErrors.fees && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{validationErrors.fees}</p>
                )}
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button 
                onClick={() => {
                  setEditingClass(null);
                  setValidationErrors({});
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NewClassForm() {
  const [className, setClassName] = useState("");
  const [monthlyTuitionFees, setMonthlyTuitionFees] = useState("");
  const [classTeacher, setClassTeacher] = useState("");
  const [message, setMessage] = useState(""); // Unified message state for toast

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!className.trim() || !monthlyTuitionFees.trim() || !classTeacher.trim()) {
      setMessage("All fields are required.");
      return;
    }
    if (isNaN(Number(monthlyTuitionFees)) || Number(monthlyTuitionFees) <= 0) {
      setMessage("Monthly Tuition Fees must be a positive number.");
      return;
    }

    // Generate a unique ID for the new class
    const newClassId = "C" + Date.now().toString().slice(-6); // e.g., C123456

    const newClass = {
      id: newClassId,
      name: className.trim(),
      adviser: classTeacher.trim(),
      monthlyTuitionFees: monthlyTuitionFees.trim(),
      status: "Ready", // Default status for a new class
      students: 0, // Initially no students
    };

    // Retrieve existing classes from local storage
    const localClasses = localStorage.getItem("campus_one_classes");
    let currentClasses = [];
    if (localClasses) {
      try {
        currentClasses = JSON.parse(localClasses);
      } catch (e) { /* ignore parse error, start fresh */ }
    }
    currentClasses.push(newClass);
    localStorage.setItem("campus_one_classes", JSON.stringify(currentClasses));

    // Mock saving logic
    setMessage("Creating new class...");
    setTimeout(() => {
      // Simulate success
      setMessage("New class created successfully!");
      // Clear form fields
      setClassName("");
      setMonthlyTuitionFees("");
      setClassTeacher("");

      // Hide message after a few seconds
      setTimeout(() => setMessage(""), 3000);
    }, 4000);

    // No redirection here, as per requirement
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {message && (
        <div className="fixed top-24 right-10 z-50 rounded-xl bg-white border border-gray-100 shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 min-w-[300px]">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            message.includes("successfully") ? "bg-green-100 text-green-600" :
            message.includes("Creating") ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
          )}>
            {message.includes("successfully") ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            ) : message.includes("Creating") ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="font-bold text-lg">!</span>
            )}
          </div>
          <div className="flex-1">
            <p className={cn("text-sm font-bold", 
              message.includes("successfully") ? "text-green-700" : 
              message.includes("Creating") ? "text-blue-700" : "text-red-700"
            )}>
              {message.includes("successfully") ? "Success!" : 
               message.includes("Creating") ? "Please wait" : "Action Required"}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{message}</p>
          </div>
          <button type="button" onClick={() => setMessage("")} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add New Class</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Class Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. Class 9A"
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Monthly Tuition Fees <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              min="0"
              required
              value={monthlyTuitionFees}
              onChange={(e) => setMonthlyTuitionFees(e.target.value.replace(/[^0-9]/g, ''))} // Ensure only numbers
              placeholder="e.g. 5000"
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Class Teacher <span className="text-red-500">*</span></label>
            <input 
              type="text"
              required
              value={classTeacher}
              onChange={(e) => setClassTeacher(e.target.value)}
              placeholder="e.g. Ms. Smith"
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
            />
          </div>
          <button type="submit" className="w-full mt-4 bg-primary text-white font-black py-4 rounded-full hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center shadow-lg shadow-primary/20">
            CREATE
          </button>
        </form>
      </div>
    </div>
  );
}

function ClassesWithSubjectsList() {
  const [classes, setClasses] = useState<any[]>([]);
  const [assignedSubjects, setAssignedSubjects] = useState<any[]>([]);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editAdviser, setEditAdviser] = useState("");
  const [editFees, setEditFees] = useState("");
  const [editSubjects, setEditSubjects] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  function subjectCountForClass(clsName: string) {
    const classSubjects = assignedSubjects.find((as: any) => as.className === clsName);
    return classSubjects ? classSubjects.subjects.length : 0;
  }

  useEffect(() => {
    const loadData = () => {
      // Load classes
      let loadedClasses: any[] = [];
      const localClasses = localStorage.getItem("campus_one_classes");
      if (localClasses) {
        try {
          loadedClasses = JSON.parse(localClasses).filter((c: any) =>
            !["Class 10A", "Class 9B", "Class 10", "Class 9", "Class 11C", "Class 8D"].includes(c.name)
          );
        } catch (e) {
          console.error("Failed to parse local storage for classes:", e);
        }
      }
      setClasses(loadedClasses);

      // Load assigned subjects
      let loadedAssignedSubjects: any[] = [];
      const localAssignedSubjects = localStorage.getItem("campus_one_assigned_subjects");
      if (localAssignedSubjects) {
        try {
          loadedAssignedSubjects = JSON.parse(localAssignedSubjects);
        } catch (e) {
          console.error("Failed to parse local storage for assigned subjects:", e);
        }
      }
      setAssignedSubjects(loadedAssignedSubjects);
    };
    loadData();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Reload data when modal closes
  useEffect(() => {
    if (!editingClass) {
      // Reload assigned subjects when modal closes
      try {
        const localAssignedSubjects = localStorage.getItem("campus_one_assigned_subjects");
        const loadedAssignedSubjects = localAssignedSubjects ? JSON.parse(localAssignedSubjects) : [];
        setAssignedSubjects(loadedAssignedSubjects);
      } catch (e) {
        console.error("Failed to reload assigned subjects:", e);
      }
    }
  }, [editingClass]);

  const handleEdit = (cls: any) => {
    setEditingClass(cls);
    setEditName(cls.name);
    setEditAdviser(cls.adviser);
    setEditFees(cls.monthlyTuitionFees);
    
    // Load assigned subjects for this class from localStorage
    try {
      const assignedSubjectsData = JSON.parse(localStorage.getItem("campus_one_assigned_subjects") || "[]");
      const classSubjects = assignedSubjectsData.find((as: any) => as.className === cls.name);
      if (classSubjects && classSubjects.subjects) {
        setEditSubjects(classSubjects.subjects.map((s: any) => s.name));
      } else {
        setEditSubjects([]);
      }
    } catch (e) {
      console.error("Failed to load assigned subjects:", e);
      setEditSubjects([]);
    }
    
    setValidationErrors({});
  };

  const validateEdit = () => {
    const errors: Record<string, string> = {};
    
    if (!editName.trim()) {
      errors.name = "Class Name is required";
    }
    if (!editAdviser.trim()) {
      errors.adviser = "Adviser is required";
    }
    if (!editFees.trim()) {
      errors.fees = "Monthly Fees is required";
    } else if (isNaN(Number(editFees)) || Number(editFees) <= 0) {
      errors.fees = "Monthly Fees must be a positive number";
    }
    if (!editSubjects || editSubjects.length === 0) {
      errors.subjects = "Assign Subjects is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = () => {
    if (!validateEdit()) {
      return;
    }
    
    const updated = classes.map(c => 
      c.id === editingClass.id 
        ? { ...c, name: editName, adviser: editAdviser, monthlyTuitionFees: editFees }
        : c
    );
    setClasses(updated);
    localStorage.setItem("campus_one_classes", JSON.stringify(updated));
    
    setEditingClass(null);
    setValidationErrors({});
  };

  const handleDelete = (clsId: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    const updated = classes.filter(c => c.id !== clsId);
    setClasses(updated);
    localStorage.setItem("campus_one_classes", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <a href="/subjects?tab=assign-subjects" className="flex flex-col items-center justify-center gap-3 h-[280px] w-full max-w-2xl rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group col-span-full mx-auto">
          <div className="p-3 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-bold text-primary">Assign Subjects</span>
        </a>

        {classes.length > 0 ? (
          classes.map((cls) => (
            <div key={cls.id} className="flex flex-col p-6 rounded-2xl border border-gray-200 bg-white hover:border-primary/50 transition-colors shadow-sm group cursor-pointer relative" onClick={() => handleEdit(cls)}>
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                  subjectCountForClass(cls.name) > 0 ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                )}>
                  {subjectCountForClass(cls.name) > 0 ? "Assigned" : "No Subjects"}
                </span>
              </div>
              <h3 className="mt-4 font-bold text-lg text-gray-900">{cls.name}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Adviser</span>
                  <span className="font-semibold text-gray-900">{cls.adviser}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Monthly Fees</span>
                  <span className="font-semibold text-gray-900">₱{cls.monthlyTuitionFees}</span>
                </div>
              </div>
              
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(cls);
                  }}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cls.id);
                  }}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500/40 font-bold uppercase tracking-widest text-[11px] bg-gray-50/30 p-10 rounded-2xl">
            No classes found. Please add classes first to assign subjects.
          </div>
        )}
      </div>

      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900">Edit Class</h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Class Name <span className="text-red-500">*</span>
                </span>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    if (validationErrors.name) {
                      setValidationErrors(prev => ({ ...prev, name: "" }));
                    }
                  }}
                  className={cn(
                    "mt-1 w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 transition",
                    validationErrors.name 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  )}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{validationErrors.name}</p>
                )}
              </label>

              <label className="block">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Assign Adviser <span className="text-red-500">*</span>
                </span>
                <select 
                  value={editAdviser}
                  onChange={(e) => {
                    setEditAdviser(e.target.value);
                    if (validationErrors.adviser) {
                      setValidationErrors(prev => ({ ...prev, adviser: "" }));
                    }
                  }}
                  className={cn(
                    "mt-1 w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 transition appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20fill=%22none%22%20viewBox=%220%200%2020%2020%22%3E%3Cpath%20stroke=%22%236b7280%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20stroke-width=%222%22%20d=%22m6%208%204%204%204-4%22/%3E%3C/svg%3E')] bg-[length:1.5em_1.5em] bg-no-repeat bg-[right_0.5rem_center] pr-8",
                    validationErrors.adviser 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  )}
                >
                  <option value="">Select an Adviser</option>
                  {(() => {
                    try {
                      const employees = JSON.parse(localStorage.getItem("campus_one_employees") || "[]");
                      return employees.map((emp: any) => (
                        <option key={emp.name} value={emp.name}>
                          {emp.name}
                        </option>
                      ));
                    } catch (e) {
                      console.error("Failed to parse employees from localStorage:", e);
                      return null;
                    }
                  })()}
                </select>
                {validationErrors.adviser && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{validationErrors.adviser}</p>
                )}
              </label>

              <label className="block">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Monthly Fees <span className="text-red-500">*</span>
                </span>
                <input 
                  type="number"
                  value={editFees}
                  onChange={(e) => {
                    setEditFees(e.target.value);
                    if (validationErrors.fees) {
                      setValidationErrors(prev => ({ ...prev, fees: "" }));
                    }
                  }}
                  className={cn(
                    "mt-1 w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                    validationErrors.fees 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  )}
                />
                {validationErrors.fees && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{validationErrors.fees}</p>
                )}
              </label>

              <label className="block">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Assign Subjects <span className="text-red-500">*</span>
                </span>
                <input 
                  type="text"
                  value={Array.isArray(editSubjects) ? editSubjects.join(", ") : editSubjects}
                  onChange={(e) => {
                    const input = e.target.value;
                    const subjects = input.split(",").map(s => s.trim()).filter(s => s);
                    setEditSubjects(subjects);
                    if (validationErrors.subjects) {
                      setValidationErrors(prev => ({ ...prev, subjects: "" }));
                    }
                  }}
                  placeholder="Enter subject names separated by commas"
                  className={cn(
                    "mt-1 w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 transition",
                    validationErrors.subjects 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  )}
                />
                {validationErrors.subjects && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{validationErrors.subjects}</p>
                )}
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setEditingClass(null);
                  setValidationErrors({});
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AssignSubjectsForm() {
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([{ name: "", marks: "" }]);
  const [message, setMessage] = useState(""); // Unified message state for toast
  const [classes, setClasses] = useState<any[]>([]); // To populate class dropdown
  const searchParams = useSearchParams(); // Hook to read URL params

  useEffect(() => {
    const loadClasses = () => {
      let loadedClasses: any[] = [];
      const localClasses = localStorage.getItem("campus_one_classes");
      if (localClasses) {
        try {
          loadedClasses = JSON.parse(localClasses).filter((c: any) =>
            !["Class 10A", "Class 9B", "Class 10", "Class 9", "Class 11C", "Class 8D"].includes(c.name)
          );
        } catch (e) {
          console.error("Failed to parse local storage for classes:", e);
        }
      }
      setClasses(loadedClasses);

      // Pre-select class if provided in URL params
      const classFromUrl = searchParams.get("class");
      if (classFromUrl && loadedClasses.some(cls => cls.name === classFromUrl)) {
        setSelectedClass(classFromUrl);
        // Also load existing subjects for this class if available
        const localAssignedSubjects = localStorage.getItem("campus_one_assigned_subjects");
        if (localAssignedSubjects) {
          try {
            const parsedAssigned = JSON.parse(localAssignedSubjects);
            const existingSubjects = parsedAssigned.find((item: any) => item.className === classFromUrl);
            if (existingSubjects && existingSubjects.subjects.length > 0) {
              setSubjects(existingSubjects.subjects);
            }
          } catch (e) {
            console.error("Failed to parse local storage for assigned subjects:", e);
          }
        }
      }
    };
    loadClasses();
  }, [searchParams]); // Re-run effect if searchParams change

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: "", marks: "" }]);
  };

  const handleRemoveSubject = (indexToRemove: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (!selectedClass) {
      setMessage("Please select a class.");
      return;
    }

    // Validate subjects
    for (const sub of subjects) {
      if (!sub.name.trim()) {
        setMessage("Subject name cannot be empty.");
        return;
      }
      if (!sub.marks.trim() || isNaN(Number(sub.marks)) || Number(sub.marks) <= 0) {
        setMessage(`Marks for subject "${sub.name}" must be a positive number.`);
        return;
      }
    }

    // Save to local storage
    const localAssignedSubjects = localStorage.getItem("campus_one_assigned_subjects");
    let currentAssignedSubjects: { className: string; subjects: { name: string; marks: string }[] }[] = [];
    if (localAssignedSubjects) {
      try {
        currentAssignedSubjects = JSON.parse(localAssignedSubjects);
      } catch (e) { /* ignore parse error */ }
    }

    // Find if class already has assigned subjects
    const existingClassIndex = currentAssignedSubjects.findIndex(
      (item) => item.className === selectedClass
    );

    if (existingClassIndex !== -1) {
      // Update existing class's subjects
      currentAssignedSubjects[existingClassIndex].subjects = subjects;
    } else {
      // Add new class with subjects
      currentAssignedSubjects.push({ className: selectedClass, subjects: subjects });
    }

    localStorage.setItem("campus_one_assigned_subjects", JSON.stringify(currentAssignedSubjects));
    
    setMessage("Subjects assigned successfully!");
    // Clear form fields after successful submission
    setSelectedClass("");
    setSubjects([{ name: "", marks: "" }]);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {message && (
        <div className="fixed top-24 right-10 z-50 rounded-xl bg-white border border-gray-100 shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 min-w-[300px]">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            message.includes("successfully") ? "bg-green-100 text-green-600" :
            message.includes("Please select") || message.includes("cannot be empty") || message.includes("must be a positive number") ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
          )}>
            {message.includes("successfully") ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            ) : message.includes("Please select") || message.includes("cannot be empty") || message.includes("must be a positive number") ? (
              <span className="font-bold text-lg">!</span>
            ) : (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <div className="flex-1">
            <p className={cn("text-sm font-bold", 
              message.includes("successfully") ? "text-green-700" : 
              message.includes("Please select") || message.includes("cannot be empty") || message.includes("must be a positive number") ? "text-red-700" : "text-blue-700"
            )}>
              {message.includes("successfully") ? "Success!" : "Action Required"}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{message}</p>
          </div>
          <button type="button" onClick={() => setMessage("")} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Assign Subjects</h2>
          <p className="text-sm text-gray-500 font-medium">Select a class and define the subjects taught, along with their total marks.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Class <span className="text-red-500">*</span></label>
            <select
              required
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-4">
            {subjects.map((sub, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative group">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subject Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={sub.name}
                    onChange={(e) => {
                      const newSubs = [...subjects];
                      newSubs[index].name = e.target.value;
                      setSubjects(newSubs);
                    }}
                    placeholder="Name Of Subject"
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Marks <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    value={sub.marks}
                    onChange={(e) => {
                      const newSubs = [...subjects];
                      // Ensure only numbers are accepted
                      newSubs[index].marks = e.target.value.replace(/[^0-9]/g, '');
                      setSubjects(newSubs);
                    }}
                    placeholder="Total Exam Marks"
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                {subjects.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSubject(index)} 
                    className="absolute -right-3 -top-3 w-7 h-7 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    title="Remove Subject"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button type="button" onClick={handleAddSubject} className="bg-primary/10 hover:bg-primary/20 transition-colors text-primary px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20 flex items-center gap-2"><Plus className="w-3 h-3" /> Add More</button>
          </div>

          <button type="submit" className="w-full mt-4 bg-primary text-white font-black py-4 rounded-full hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center shadow-lg shadow-primary/20">
            ASSIGN
          </button>
        </form>
      </div>
    </div>
  );
}
function ManageLoginView() {
  const [students, setStudents] = useState<any[]>([]);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("Select");
  const [tableSearch, setTableSearch] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Buffer state to capture username/password edits dynamically
  const [editableUsernames, setEditableUsernames] = useState<Record<string, string>>({});
  const [editablePasswords, setEditablePasswords] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const local = localStorage.getItem("campus_one_students");
    if (local) {
      try {
        const list = JSON.parse(local);
        setStudents(list);

        // Prepopulate username / passwords in temp buffer if they don't have one
        const usernames: Record<string, string> = {};
        const passwords: Record<string, string> = {};
        list.forEach((stud: any) => {
          usernames[stud.id] = stud.username || (stud.id.toLowerCase() + "_" + stud.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4));
          passwords[stud.id] = stud.password || ("pass_" + stud.id.toLowerCase());
        });
        setEditableUsernames(usernames);
        setEditablePasswords(passwords);
      } catch (e) {}
    } else {
      // Setup some default mock students to keep interface looking stunning if empty
      const mocks = Array.from({ length: 12 }).map((_, i) => ({
        id: `CO-${1000 + i}`,
        name: `Student ${String.fromCharCode(65 + (i % 26))} Name`,
        level: i % 2 === 0 ? "Class 1" : "Class 2",
        status: "Enrolled",
        dob: "2010-05-12"
      }));
      setStudents(mocks);
      const usernames: Record<string, string> = {};
      const passwords: Record<string, string> = {};
      mocks.forEach((stud: any) => {
        usernames[stud.id] = stud.id.toLowerCase() + "_" + stud.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4);
        passwords[stud.id] = "pass_" + stud.id.toLowerCase();
      });
      setEditableUsernames(usernames);
      setEditablePasswords(passwords);
    }
  }, []);

  // Dynamically pull distinct class options
  const classes = useMemo(() => {
    const set = new Set<string>();
    students.forEach(s => {
      if (s.level) set.add(s.level);
    });
    ["Class 1", "Class 2"].forEach(c => set.add(c));
    return Array.from(set).sort();
  }, [students]);

  const handleSaveCredentials = (id: string) => {
    const updated = students.map(stud => {
      if (stud.id === id) {
        return {
          ...stud,
          username: editableUsernames[id],
          password: editablePasswords[id]
        };
      }
      return stud;
    });
    setStudents(updated);
    localStorage.setItem("campus_one_students", JSON.stringify(updated));

    triggerNotification("Success: Student login credentials updated successfully!");
  };

  const handleSendCredentials = (stud: any) => {
    triggerNotification(`Success: Login details sent via Email/SMS to student ${stud.name} successfully!`);
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleReloadAll = () => {
    setSidebarSearch("");
    setSelectedClass("Select");
    setTableSearch("");
  };

  const handleExportExcel = () => {
    let content = "ID\tStudent Name\tClass\tUsername\tPassword\r\n";
    filteredList.forEach(stud => {
      const username = editableUsernames[stud.id] || (stud.id.toLowerCase() + "_stud");
      const password = editablePasswords[stud.id] || "pass123";
      content += `${stud.id}\t${stud.name}\t${stud.level || "Class 1"}\t${username}\t${password}\r\n`;
    });
    
    const blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Campus_One_Student_Credentials.xls");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification("Success: Credentials exported to Excel spreadsheet successfully!");
  };

  const buildLoginPrintHTML = (clonedTable: HTMLTableElement, tabTitle: string) => {
    clonedTable.querySelectorAll('.no-print').forEach(el => el.remove());
    clonedTable.querySelectorAll('span svg').forEach(icon => {
      const span = icon.parentElement;
      if (span) span.remove();
    });
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `<html><head><title>${tabTitle}</title><style>
body { font-family: Inter, sans-serif; margin: 40px; color: #111827; }
.doc-header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #E5E7EB; }
.doc-header h1 { margin: 0; font-size: 26px; font-weight: 900; color: #1F2937; letter-spacing: -0.5px; }
.doc-header .tagline { margin: 3px 0 0; font-size: 8px; font-weight: 800; color: #6B7280; text-transform: uppercase; letter-spacing: 3px; }
.doc-header h2 { margin: 12px 0 0; font-size: 18px; font-weight: 900; color: #F59E0B; text-transform: uppercase; letter-spacing: 2px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.doc-header .gen-date { margin: 4px 0 0; font-size: 8px; color: #9CA3AF; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { border: 1px solid #FCD34D; padding: 10px 12px; text-align: left; }
th { background-color: #F59E0B; color: white; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
tr:nth-child(even) td { background-color: #FFFBEB; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
tr:nth-child(odd) td { background-color: white; }
input { border: none; background: transparent; font-size: 12px; font-family: inherit; width: 100%; }
@page { size: A4; margin: 0.6in; }
</style></head><body>
<div class="doc-header">
  <h1>Campus One</h1>
  <p class="tagline">Your School Software</p>
  <h2>${tabTitle}</h2>
  <p class="gen-date">Generated On: ${date}</p>
</div>
${clonedTable.outerHTML}
</body></html>`;
  };

  const handlePrintTable = () => {
    const tableElement = document.querySelector('table');
    if (tableElement) {
      const clonedTable = tableElement.cloneNode(true) as HTMLTableElement;
      const printWindow = window.open('', '', 'height=600,width=1000');
      if (!printWindow) return;
      printWindow.document.write(buildLoginPrintHTML(clonedTable, 'Student Login Credentials'));
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportPDF = () => {
    const tableElement = document.querySelector('table');
    if (tableElement) {
      const clonedTable = tableElement.cloneNode(true) as HTMLTableElement;
      const printWindow = window.open('', '', 'height=600,width=1000');
      if (!printWindow) return;
      printWindow.document.write(buildLoginPrintHTML(clonedTable, 'Student Login Credentials'));
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredList = students.filter(stud => {
    const matchesSidebarName = !sidebarSearch || stud.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || stud.id.toLowerCase().includes(sidebarSearch.toLowerCase());
    const matchesSidebarClass = selectedClass === "Select" || stud.level === selectedClass;
    
    const matchesTableSearch = !tableSearch || 
      stud.name.toLowerCase().includes(tableSearch.toLowerCase()) || 
      (stud.level && stud.level.toLowerCase().includes(tableSearch.toLowerCase())) ||
      stud.id.toLowerCase().includes(tableSearch.toLowerCase());

    return matchesSidebarName && matchesSidebarClass && matchesTableSearch;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredList.length);
  const paginatedList = filteredList.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [sidebarSearch, selectedClass, tableSearch]);

  return (
    <div className="space-y-8 pb-16">
      {notification && <SuccessToast message={notification} onClose={() => setNotification(null)} />}

      {/* Full width container */}
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm no-print">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Search Student <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Search Student" 
                className="w-full h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Select Class <span className="text-red-500">*</span></label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10" style={{ color: selectedClass === "Select" ? '#6b7280' : '#111827' }}>
                <option value="Select" style={{ color: '#6b7280' }}>Select Class</option>
                {classes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Table Panel */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 no-print">
              <div className="flex flex-wrap gap-2">
                {["Excel", "PDF", "Print"].map(tool => (
                  <button 
                    key={tool} 
                    onClick={() => {
                      if (tool === "Excel") handleExportExcel();
                      if (tool === "PDF") handleExportPDF();
                      if (tool === "Print") handlePrintTable();
                    }} 
                    className="px-4 py-2 bg-gray-50 border border-gray-250 rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 shadow-sm"
                  >
                    {tool === "Excel" && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
                    {tool === "PDF" && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>}
                    {tool === "Print" && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>}
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[15px]">
                <thead className="bg-primary text-white text-[13px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-4 py-4 text-center">ID</th>
                    <th className="px-4 py-4 text-center">Student Name</th>
                    <th className="px-4 py-4 text-center">Class</th>
                    <th className="px-4 py-4 text-center">Username</th>
                    <th className="px-4 py-4 text-center">Password</th>
                    <th className="px-4 py-4 text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center text-gray-500/40 font-bold uppercase tracking-widest text-[14px] bg-gray-50/30">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    paginatedList.map(stud => (
                      <tr key={stud.id} className="hover:bg-gray-50/40 transition-colors">
                        <td className="px-4 py-4 font-bold text-gray-900 text-[12px] text-center">{stud.id}</td>
                        <td className="px-4 py-4 font-semibold text-gray-700 text-[12px] text-center">{stud.name}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">{stud.level || "Class 1"}</span>
                        </td>
                        
                        {/* Username field with inline visual icon */}
                        <td className="px-4 py-4 text-center">
                          <div className="relative w-32 mx-auto">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            </span>
                            <input 
                              type="text" 
                              readOnly
                              value={editableUsernames[stud.id] || ""} 
                              onChange={(e) => setEditableUsernames({ ...editableUsernames, [stud.id]: e.target.value })} 
                              className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 focus:border-[#F59E0B] outline-none transition-all shadow-inner"
                            />
                          </div>
                        </td>

                        {/* Password field with eye toggles */}
                        <td className="px-4 py-4 text-center">
                          <div className="relative w-44 mx-auto">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                            </span>
                            <input 
                              type={showPassword[stud.id] ? "text" : "password"} 
                              readOnly
                              value={editablePasswords[stud.id] || ""} 
                              onChange={(e) => setEditablePasswords({ ...editablePasswords, [stud.id]: e.target.value })} 
                              className="w-full h-8 pl-8 pr-8 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 focus:border-[#F59E0B] outline-none transition-all shadow-inner"
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword({ ...showPassword, [stud.id]: !showPassword[stud.id] })} 
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword[stud.id] ? (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                              ) : (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 no-print text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleSaveCredentials(stud.id)} 
                              title="Save Credentials" 
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-[#F5A623]/10 hover:text-primary hover:border-primary/20 text-gray-600 transition-all flex items-center justify-center shadow-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                            </button>
                            <button 
                              onClick={() => handleSendCredentials(stud)} 
                              title="Email Credentials" 
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 text-gray-600 transition-all flex items-center justify-center shadow-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
            </div>

            {/* Pagination stats footer */}
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 px-2 pt-4 border-t border-gray-100 no-print">
              <span>Showing {filteredList.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filteredList.length} entries</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || filteredList.length === 0}
                  className="hover:text-primary transition-colors disabled:opacity-30 font-bold uppercase tracking-widest"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || filteredList.length === 0}
                  className="hover:text-primary transition-colors disabled:opacity-30 font-bold uppercase tracking-widest"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print sheet */}
      <PrintTemplate title="Student Login Credentials" subtitle="Confidential — Do Not Distribute">
        <PrintTable>
          <PrintThead>
            <tr>
              <PrintTh>ID</PrintTh>
              <PrintTh>Student Name</PrintTh>
              <PrintTh>Class Name</PrintTh>
              <PrintTh>Login Username</PrintTh>
              <PrintTh>Login Password</PrintTh>
            </tr>
          </PrintThead>
          <tbody>
            {filteredList.map(stud => (
              <tr key={stud.id}>
                <PrintTd variant="bold">{stud.id}</PrintTd>
                <PrintTd variant="bold">{stud.name}</PrintTd>
                <PrintTd>{stud.level || "Class 1"}</PrintTd>
                <PrintTd variant="muted">{editableUsernames[stud.id] || "N/A"}</PrintTd>
                <PrintTd variant="muted">{editablePasswords[stud.id] || "N/A"}</PrintTd>
              </tr>
            ))}
          </tbody>
        </PrintTable>
      </PrintTemplate>
    </div>
  );
}



function AllEmployeesGrid({ onEdit, onViewDetails }: { onEdit: (emp: any) => void; onViewDetails: (emp: any) => void }) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSubmit, setSearchSubmit] = useState("");

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
          localStorage.setItem("campus_one_employees", JSON.stringify(data));
        } else {
          throw new Error("Invalid format");
        }
      })
      .catch(() => {
        const local = localStorage.getItem("campus_one_employees");
        if (local) {
          try {
            setEmployees(JSON.parse(local));
          } catch (e) {
            loadDefaultMock();
          }
        } else {
          loadDefaultMock();
        }
      });

    function loadDefaultMock() {
      const defaultEmployees = [
        { id: "1", name: "Albert Einstein", role: "Professor", department: "Science", status: "Active" },
        { id: "2", name: "Marie Curie", role: "Professor", department: "Science", status: "Active" },
        { id: "3", name: "Isaac Newton", role: "Professor", department: "Mathematics", status: "Active" },
        { id: "4", name: "Ada Lovelace", role: "Professor", department: "Technology", status: "Active" }
      ];
      setEmployees(defaultEmployees);
      localStorage.setItem("campus_one_employees", JSON.stringify(defaultEmployees));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      const updated = employees.filter(emp => emp.id !== id);
      setEmployees(updated);
      localStorage.setItem("campus_one_employees", JSON.stringify(updated));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmit(searchQuery);
  };

  const filteredEmployees = employees.filter(emp => 
    !searchSubmit || emp.name.toLowerCase().includes(searchSubmit.toLowerCase()) || (emp.department && emp.department.toLowerCase().includes(searchSubmit.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-4">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 px-2 relative z-10 -mb-2 w-fit">
            Search Employee <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="text" 
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or department..." 
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all shadow-sm" 
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
        <button onClick={() => window.location.href = "?tab=add-new"} className="flex flex-col items-center justify-center gap-3 h-[280px] rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group shadow-sm hover:shadow-md">
          <div className="p-4 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform shadow-inner">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-bold text-primary tracking-tight">Add New Employee</span>
        </button>

        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-gray-200 bg-white hover:border-primary/50 transition-all shadow-sm hover:shadow-md h-[280px] relative group overflow-hidden">
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-600 border border-green-100 shadow-sm">
              {emp.status || "Active"}
            </span>

            <EmployeeAvatar employee={emp} className="w-20 h-20 shadow-md group-hover:scale-105 transition-transform" />

            <h3 className="text-lg font-bold text-gray-900 mt-3 tracking-tight truncate w-full">{emp.name}</h3>
            <p className="text-gray-500 font-medium text-xs mt-0.5 truncate w-full">{emp.role}</p>

            <div className="flex items-center gap-3 mt-5">
              {/* Edit Button */}
              <button 
                onClick={() => onEdit(emp)}
                title="Edit Employee"
                className="w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-inner"
              >
                <Edit className="w-4 h-4" />
              </button>

              {/* Delete Button */}
              <button 
                onClick={() => handleDelete(emp.id)}
                title="Delete Employee"
                className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-inner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewEmployeeForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("Professor");
  const [joiningDate, setJoiningDate] = useState("");
  const [salary, setSalary] = useState("");
  const [image, setImage] = useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      mobile,
      role,
      joiningDate,
      salary,
      image,
      department: "Administration",
      status: "Active"
    };

    // Save locally first to guarantee immediate offline-first success!
    const local = localStorage.getItem("campus_one_employees");
    let currentEmployees = [];
    if (local) {
      try {
        currentEmployees = JSON.parse(local);
      } catch (err) {
        currentEmployees = [];
      }
    }
    const newEmp = {
      id: Date.now().toString(),
      ...payload
    };
    currentEmployees.push(newEmp);
    localStorage.setItem("campus_one_employees", JSON.stringify(currentEmployees));

    // Also try to POST to backend
    try {
      await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Backend not running, persisted locally instead.");
    }

    // Reset fields
    setName("");
    setMobile("");
    setRole("Professor");
    setJoiningDate("");
    setSalary("");
    setImage("");

    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const handleReset = () => {
    setName("");
    setMobile("");
    setRole("Professor");
    setJoiningDate("");
    setSalary("");
    setImage("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {isSuccess && <SuccessToast message="Employee has been successfully registered." onClose={() => setIsSuccess(false)} />}

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Add New Employee</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm">1</div>
              <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2fr] gap-8 items-start">
              {/* Picture Upload Area */}
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 gap-4 text-center">
                <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">Picture - Optional</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
                
                {image ? (
                  <img 
                    src={image} 
                    alt="Upload preview" 
                    className="w-24 h-24 rounded-full border border-gray-150 shadow-md object-cover bg-white" 
                  />
                ) : (
                  <DefaultAvatarSVG className="w-24 h-24 shadow-md" />
                )}

                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary hover:bg-[#D97706] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/10 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Choose Image
                </button>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">Max size 100KB</span>
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of Employee" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Employee Role <span className="text-red-500">*</span>
                  </label>
                  <input readOnly value="Professor" className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none cursor-default" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Mobile No for SMS/WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g +63xxxxxxxxxx" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Monthly Salary <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                    <input required type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="0.00" className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-8 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#F59E0B] outline-none transition-all" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Date of Joining <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" value={joiningDate} onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2);
                    }
                    if (value.length >= 5) {
                      value = value.slice(0, 5) + '/' + value.slice(5, 9);
                    }
                    setJoiningDate(value);
                  }} placeholder="MM/DD/YYYY" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all placeholder:text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center pt-4 border-t border-gray-100">
            <button type="button" onClick={handleReset} className="px-8 py-3 rounded-xl bg-white/5 text-gray-900 font-bold hover:bg-gray-50 border border-gray-200 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Reset
            </button>
            <button type="submit" className="px-12 py-3 rounded-xl bg-primary text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Employee Form matching Image 2 exactly
function EditEmployeeForm({ employee, onCancel }: { employee: any; onCancel: () => void }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState(employee.name || "");
  const [mobile, setMobile] = useState(employee.mobile || "");
  const [role, setRole] = useState("Professor");
  const [joiningDate, setJoiningDate] = useState(employee.joiningDate || "");
  const [salary, setSalary] = useState(employee.salary || "");
  const [image, setImage] = useState(employee.image || "");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const local = localStorage.getItem("campus_one_employees");
    let currentEmployees = [];
    if (local) {
      try {
        currentEmployees = JSON.parse(local);
      } catch (err) {
        currentEmployees = [];
      }
    }

    const updatedEmployees = currentEmployees.map((emp: any) => {
      if (emp.id === employee.id) {
        return {
          ...emp,
          name,
          mobile,
          role,
          joiningDate,
          salary,
          image
        };
      }
      return emp;
    });

    localStorage.setItem("campus_one_employees", JSON.stringify(updatedEmployees));
    setIsSuccess(true);
    setTimeout(() => { setIsSuccess(false); onCancel(); }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 no-print">
      {isSuccess && <SuccessToast message="Employee record updated successfully." onClose={() => setIsSuccess(false)} />}
      {/* Breadcrumbs matching Image 2 */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-3">
        <span>Employees</span>
        <span>/</span>
        <span className="flex items-center gap-1.5 text-primary">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Edit Staff
        </span>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Title and pills matching Image 2 */}
        <div className="flex flex-col items-center justify-center gap-2 mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Edit Employee</h2>
        </div>

        <form onSubmit={handleUpdate} className="space-y-12">
          {/* Section 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm">1</div>
              <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2fr] gap-8 items-start">
              {/* Picture optional box */}
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 gap-4 text-center">
                <span className="bg-gray-200 text-gray-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">Picture - Optional</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
                
                {image ? (
                  <img 
                    src={image} 
                    alt="Upload preview" 
                    className="w-24 h-24 rounded-full border border-gray-150 shadow-md object-cover bg-white" 
                  />
                ) : (
                  <DefaultAvatarSVG className="w-24 h-24 shadow-md" />
                )}

                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary hover:bg-[#D97706] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/10 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Choose Image
                </button>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">Max size 100KB</span>
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of Employee" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Employee Role <span className="text-red-500">*</span>
                  </label>
                  <input readOnly value="Professor" className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none cursor-default" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Mobile No for SMS/WhatsApp
                  </label>
                  <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g +63xxxxxxxxxx" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Monthly Salary <span className="text-red-500">*</span>
                  </label>
                  <input required type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Monthly Salary" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Date of Joining <span className="text-red-500">*</span>
                  </label>
                  <input required type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4 justify-center pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="px-8 py-3 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-50 border border-gray-200 transition-all flex items-center gap-2">
              Cancel
            </button>
            <button type="submit" className="px-12 py-3 rounded-xl bg-primary text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// QR Code SVG Generator for beautiful print layouts!
function QRCodeSVG() {
  return (
    <svg className="w-16 h-16 border border-gray-100 p-1 bg-white rounded-lg shadow-sm" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#FFFFFF"/>
      <rect x="5" y="5" width="25" height="25" fill="#1F2937"/>
      <rect x="10" y="10" width="15" height="15" fill="#FFFFFF"/>
      <rect x="13" y="13" width="9" height="9" fill="#1F2937"/>
      <rect x="70" y="5" width="25" height="25" fill="#1F2937"/>
      <rect x="75" y="10" width="15" height="15" fill="#FFFFFF"/>
      <rect x="78" y="13" width="9" height="9" fill="#1F2937"/>
      <rect x="5" y="70" width="25" height="25" fill="#1F2937"/>
      <rect x="10" y="75" width="15" height="15" fill="#FFFFFF"/>
      <rect x="13" y="78" width="9" height="9" fill="#1F2937"/>
      <rect x="40" y="10" width="10" height="10" fill="#1F2937"/>
      <rect x="50" y="25" width="12" height="12" fill="#1F2937"/>
      <rect x="40" y="45" width="20" height="20" fill="#1F2937"/>
      <rect x="75" y="45" width="10" height="15" fill="#1F2937"/>
      <rect x="70" y="70" width="15" height="15" fill="#1F2937"/>
      <rect x="45" y="75" width="15" height="10" fill="#1F2937"/>
    </svg>
  );
}

// Job Letter and Staff Profile view matching Image 3 & 4 exactly
function JobLetterView({ initialEmployee, onBack }: { initialEmployee?: any; onBack?: () => void }) {
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(initialEmployee || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const local = localStorage.getItem("campus_one_employees");
    if (local) {
      try {
        setEmployees(JSON.parse(local));
      } catch (e) {}
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Dynamic PRINT ONLY letter wrapper */}
      {selectedEmployee && (
        <PrintTemplate title="Job Letter" subtitle={selectedEmployee.role}>
          <PrintInfoGrid columns={2} items={[
            { label: "Serial No / ID",        value: selectedEmployee.id, highlight: true },
            { label: "Registration Date",     value: selectedEmployee.joiningDate || "18 May, 2000" },
            { label: "Employee Name",         value: selectedEmployee.name },
            { label: "Father / Husband Name", value: selectedEmployee.fatherName },
            { label: "National ID",           value: selectedEmployee.nationalId },
            { label: "Employee Role",         value: selectedEmployee.role },
            { label: "Monthly Salary",        value: selectedEmployee.salary ? `₱${selectedEmployee.salary}` : "₱12,323" },
            { label: "Mobile No",             value: selectedEmployee.mobile },
            { label: "Home Address",          value: selectedEmployee.address },
            { label: "Date of Birth",         value: selectedEmployee.dob },
            { label: "Blood Group",           value: selectedEmployee.bloodGroup },
            { label: "Experience",            value: selectedEmployee.experience },
            { label: "Email Address",         value: selectedEmployee.email },
          ]} />

          {/* QR Portal Code Scan Section */}
          <PrintSection title="Scan to Access Portal">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "16px 0" }}>
              {["Web Portal", "Android App", "iOS App"].map(label => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <QRCodeSVG />
                  <span style={{ fontSize: "9px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                </div>
              ))}
            </div>
          </PrintSection>

          {/* Rules */}
          <PrintSection title="Rules and Regulations">
            <p style={{ fontSize: "10px", color: "#4B5563", lineHeight: "1.6" }}>
              The school rules have been established in partnership with the community over a long period of time. They reflect the school community&apos;s expectations of acceptable standards of behaviour, dress, and personal presentation. Students and staff are expected to follow the school rules at all times when on the school grounds, representing the school, attending a school activity or when clearly associated with the school.
            </p>
          </PrintSection>

          {/* Signature */}
          <div style={{ marginTop: "40px", display: "flex", justifyContent: "flex-end" }}>
            <div style={{ borderTop: "1px solid #1F2937", paddingTop: "8px", textAlign: "right" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}>Signature of Authority</span>
              <span style={{ fontSize: "9px", color: "#6B7280" }}>Campus Principal / Director</span>
            </div>
          </div>
        </PrintTemplate>
      )}

      {/* Screen-Only layout */}
      <div className="max-w-5xl mx-auto space-y-6 no-print">
        {selectedEmployee ? (
          <div className="space-y-6">
            {/* Nav controls */}
            <div className="flex items-center justify-between">
              <button onClick={() => { setSelectedEmployee(null); if (onBack) onBack(); }} className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-900 transition-all flex items-center gap-2">
                ← Back to Employee List
              </button>
            </div>

            {/* Profile detail card matching Image 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
              {/* Left detail: avatar and name */}
              <div className="flex flex-col items-center text-center min-w-[200px] border-r border-gray-100 pr-0 md:pr-8">
                <EmployeeAvatar employee={selectedEmployee} className="w-28 h-28 shadow-lg" />
                <h3 className="mt-4 font-black text-2xl text-gray-900 tracking-tight">{selectedEmployee.name}</h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedEmployee.role}</span>
              </div>

              {/* Center detail columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 flex-1 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registration/ID</span>
                  <p className="font-bold text-gray-900 text-lg">{selectedEmployee.id}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee Role</span>
                  <p className="font-bold text-gray-900 text-lg">{selectedEmployee.role}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Joining</span>
                  <p className="font-bold text-gray-900 text-lg">{selectedEmployee.joiningDate || "18 May, 2000"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Status</span>
                  <p className="font-black text-green-600 text-sm flex items-center gap-1 mt-0.5">✔ Active</p>
                </div>
              </div>

              {/* Right side: print controls */}
              <div className="flex flex-col items-center justify-center min-w-[200px] border-l border-gray-100 pl-0 md:pl-8">
                <button onClick={handlePrint} className="px-6 py-3 bg-primary hover:bg-[#D97706] text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-primary/10 hover:scale-[1.03] transition-all">
                  <Printer className="w-4.5 h-4.5" />
                  Print Job Letter
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Search bar selection board if no employee is currently active */
          <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center gap-6 shadow-sm min-h-[400px]">
            <div className="text-center space-y-2 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Generate Job Letter</h3>
              <p className="text-gray-500 text-sm">Select an employee from the table or directory to generate their official job letter.</p>
            </div>
            
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Employee by Name..." 
                className="w-full h-14 rounded-full border border-gray-200 bg-white pl-6 pr-12 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all shadow-sm"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-50 transition-colors">
                <Search className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {searchQuery.trim().length > 0 && (
              <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl max-h-[220px] overflow-y-auto divide-y divide-gray-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {filteredEmployees.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400">No employees match this name.</div>
                ) : (
                  filteredEmployees.map(emp => (
                    <button key={emp.id} onClick={() => setSelectedEmployee(emp)} className="w-full p-4 flex items-center gap-3 text-left hover:bg-[#F5A623]/10/50 transition-colors">
                      <EmployeeAvatar employee={emp} className="w-8 h-8" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{emp.name}</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{emp.role}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

// Credentials Manage screen matching Image 5 in every detail
function StaffLoginView() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [selectRole, setSelectRole] = useState("Select");
  const [tableSearch, setTableSearch] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // States to capture current inputs for username/password changes
  const [editableUsernames, setEditableUsernames] = useState<Record<string, string>>({});
  const [editablePasswords, setEditablePasswords] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const local = localStorage.getItem("campus_one_employees");
    if (local) {
      try {
        const list = JSON.parse(local);
        setEmployees(list);

        // Prepopulate username / passwords in temp buffer if they don't have one
        const usernames: Record<string, string> = {};
        const passwords: Record<string, string> = {};
        list.forEach((emp: any) => {
          usernames[emp.id] = emp.username || ("1664586" + emp.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4));
          passwords[emp.id] = emp.password || ("1664586" + emp.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4));
        });
        setEditableUsernames(usernames);
        setEditablePasswords(passwords);
      } catch (e) {}
    }
  }, []);

  const handleSaveCredentials = (id: string) => {
    const updated = employees.map(emp => {
      if (emp.id === id) {
        return {
          ...emp,
          username: editableUsernames[id],
          password: editablePasswords[id]
        };
      }
      return emp;
    });
    setEmployees(updated);
    localStorage.setItem("campus_one_employees", JSON.stringify(updated));

    triggerNotification("Success: Staff login credentials updated successfully!");
  };

  const handleSendCredentials = (emp: any) => {
    triggerNotification(`Success: Login details sent via Email/SMS to ${emp.name} successfully!`);
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleReloadAll = () => {
    setSearchEmployee("");
    setSelectRole("Select");
    setTableSearch("");
  };

  const handleExportExcel = () => {
    let content = "ID\tStaff Name\tRole\tUsername\tPassword\r\n";
    filteredList.forEach(emp => {
      const username = editableUsernames[emp.id] || ("1664586" + emp.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4));
      const password = editablePasswords[emp.id] || ("1664586" + emp.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4));
      content += `${emp.id}\t${emp.name}\t${emp.role}\t${username}\t${password}\r\n`;
    });
    
    const blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Campus_One_Staff_Credentials.xls");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification("Success: Credentials exported to Excel spreadsheet successfully!");
  };

  const buildStaffLoginPrintHTML = (clonedTable: HTMLTableElement, tabTitle: string) => {
    clonedTable.querySelectorAll('.no-print').forEach(el => el.remove());
    clonedTable.querySelectorAll('span svg').forEach(icon => {
      const span = icon.parentElement;
      if (span) span.remove();
    });
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `<html><head><title>${tabTitle}</title><style>
body { font-family: Inter, sans-serif; margin: 40px; color: #111827; }
.doc-header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #E5E7EB; }
.doc-header h1 { margin: 0; font-size: 26px; font-weight: 900; color: #1F2937; letter-spacing: -0.5px; }
.doc-header .tagline { margin: 3px 0 0; font-size: 8px; font-weight: 800; color: #6B7280; text-transform: uppercase; letter-spacing: 3px; }
.doc-header h2 { margin: 12px 0 0; font-size: 18px; font-weight: 900; color: #F59E0B; text-transform: uppercase; letter-spacing: 2px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.doc-header .gen-date { margin: 4px 0 0; font-size: 8px; color: #9CA3AF; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { border: 1px solid #FCD34D; padding: 10px 12px; text-align: left; }
th { background-color: #F59E0B; color: white; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
tr:nth-child(even) td { background-color: #FFFBEB; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
tr:nth-child(odd) td { background-color: white; }
input { border: none; background: transparent; font-size: 12px; font-family: inherit; width: 100%; }
@page { size: A4; margin: 0.6in; }
</style></head><body>
<div class="doc-header">
  <h1>Campus One</h1>
  <p class="tagline">Your School Software</p>
  <h2>${tabTitle}</h2>
  <p class="gen-date">Generated On: ${date}</p>
</div>
${clonedTable.outerHTML}
</body></html>`;
  };

  const handlePrintTable = () => {
    const tableElement = document.querySelector('table');
    if (tableElement) {
      const clonedTable = tableElement.cloneNode(true) as HTMLTableElement;
      const printWindow = window.open('', '', 'height=600,width=1000');
      if (!printWindow) return;
      printWindow.document.write(buildStaffLoginPrintHTML(clonedTable, 'Employee Login Credentials'));
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportPDF = () => {
    const tableElement = document.querySelector('table');
    if (tableElement) {
      const clonedTable = tableElement.cloneNode(true) as HTMLTableElement;
      const printWindow = window.open('', '', 'height=600,width=1000');
      if (!printWindow) return;
      printWindow.document.write(buildStaffLoginPrintHTML(clonedTable, 'Employee Login Credentials'));
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Filter logic based on left filter bar + table top search
  const filteredList = employees.filter(emp => {
    const matchesSidebarName = !searchEmployee || emp.name.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesSidebarRole = selectRole === "Select" || emp.role === selectRole;
    
    const matchesTableSearch = !tableSearch || 
      emp.name.toLowerCase().includes(tableSearch.toLowerCase()) || 
      emp.role.toLowerCase().includes(tableSearch.toLowerCase()) ||
      emp.id.toLowerCase().includes(tableSearch.toLowerCase());

    return matchesSidebarName && matchesSidebarRole && matchesTableSearch;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredList.length);
  const paginatedList = filteredList.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchEmployee, selectRole, tableSearch]);

  return (
    <div className="space-y-6">
      {notification && <SuccessToast message={notification} onClose={() => setNotification(null)} />}

      {/* Full width container */}
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm no-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 px-2 relative z-10 -mb-2 w-fit">Search Employee <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
                placeholder="Search Employee" 
                className="w-full h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 px-2 relative z-10 -mb-2 w-fit">Select Role <span className="text-red-500">*</span></label>
              <select value={selectRole} onChange={(e) => setSelectRole(e.target.value)} className="w-full h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:border-[#F59E0B] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10" style={{ color: selectRole === "Select" ? '#6b7280' : '#111827' }}>
                <option value="Select" style={{ color: '#6b7280' }}>Select Role</option>
                <option value="Principal">Principal</option>
                <option value="Management Staff">Management Staff</option>
                <option value="Teacher">Teacher</option>
                <option value="Accountant">Accountant</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table Panel */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 no-print">
              <div className="flex flex-wrap gap-2">
                {["Excel", "PDF", "Print"].map(tool => (
                  <button 
                    key={tool}
                    onClick={() => {
                      if (tool === "Excel") handleExportExcel();
                      if (tool === "PDF") handleExportPDF();
                      if (tool === "Print") handlePrintTable();
                    }} 
                    className="px-4 py-2 bg-gray-50 border border-gray-250 rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 shadow-sm"
                  >
                    {tool === "Excel" && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
                    {tool === "PDF" && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>}
                    {tool === "Print" && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>}
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                <thead className="bg-primary text-white text-[11px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-4 py-4 text-center">ID</th>
                    <th className="px-4 py-4 text-center">Staff Name</th>
                    <th className="px-4 py-4 text-center">Role</th>
                    <th className="px-4 py-4 text-center">Username</th>
                    <th className="px-4 py-4 text-center">Password</th>
                    <th className="px-4 py-4 text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center text-gray-500/40 font-bold uppercase tracking-widest text-[12px] bg-gray-50/30">
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    paginatedList.map(emp => (
                      <tr key={emp.id} className="hover:bg-gray-50/40 transition-colors">
                        <td className="px-4 py-4 font-bold text-gray-900 text-[12px] text-center">{emp.id}</td>
                        <td className="px-4 py-4 font-semibold text-gray-700 text-[12px] text-center">{emp.name}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">{emp.role}</span>
                        </td>
                        
                        {/* Username field with inline visual icon */}
                        <td className="px-4 py-4 text-center">
                          <div className="relative w-48 mx-auto">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                              <Users className="w-3 h-3" />
                            </span>
                            <input 
                              type="text" 
                              readOnly
                              value={editableUsernames[emp.id] || ""} 
                              onChange={(e) => setEditableUsernames({ ...editableUsernames, [emp.id]: e.target.value })}
                              className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 focus:border-[#F59E0B] outline-none transition-all shadow-inner"
                            />
                          </div>
                        </td>

                        {/* Password field with eye toggles */}
                        <td className="px-4 py-4 text-center">
                          <div className="relative w-44 mx-auto">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                            </span>
                            <input 
                              type={showPassword[emp.id] ? "text" : "password"} 
                              readOnly
                              value={editablePasswords[emp.id] || ""} 
                              onChange={(e) => setEditablePasswords({ ...editablePasswords, [emp.id]: e.target.value })}
                              className="w-full h-8 pl-8 pr-8 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 focus:border-[#F59E0B] outline-none transition-all shadow-inner"
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword({ ...showPassword, [emp.id]: !showPassword[emp.id] })} 
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword[emp.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>

                        {/* Floppy save and Letter envelope send icon actions */}
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleSaveCredentials(emp.id)} 
                              title="Save Credentials" 
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-[#F5A623]/10 hover:text-primary hover:border-primary/20 text-gray-600 transition-all flex items-center justify-center shadow-sm"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleSendCredentials(emp)} 
                              title="Email Credentials" 
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 text-gray-600 transition-all flex items-center justify-center shadow-sm"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
            </div>

            {/* Pagination stats footer */}
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 px-2">
              <span>Showing {filteredList.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filteredList.length} entries</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || filteredList.length === 0}
                  className="hover:text-primary transition-colors disabled:opacity-30 font-bold uppercase tracking-widest"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || filteredList.length === 0}
                  className="hover:text-primary transition-colors disabled:opacity-30 font-bold uppercase tracking-widest"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-Only credentials list */}
      <PrintTemplate title="Staff Credentials Ledger" subtitle="Confidential — Do Not Distribute">
        <PrintTable>
          <PrintThead>
            <tr>
              <PrintTh>ID</PrintTh>
              <PrintTh>Staff Name</PrintTh>
              <PrintTh>Role</PrintTh>
              <PrintTh>Username</PrintTh>
              <PrintTh>Password</PrintTh>
            </tr>
          </PrintThead>
          <tbody>
            {filteredList.map(emp => {
              const username = editableUsernames[emp.id] || ("1664586" + emp.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 4));
              const password = editablePasswords[emp.id] || ("1664586" + emp.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 4));
              return (
                <tr key={emp.id}>
                  <PrintTd variant="bold">{emp.id}</PrintTd>
                  <PrintTd variant="bold">{emp.name}</PrintTd>
                  <PrintTd>{emp.role}</PrintTd>
                  <PrintTd variant="muted">{username}</PrintTd>
                  <PrintTd variant="muted">{password}</PrintTd>
                </tr>
              );
            })}
          </tbody>
        </PrintTable>
      </PrintTemplate>
    </div>
  );
}

function GenerateFeesInvoiceView() {
  const [className, setClassName] = useState("");
  const [month, setMonth] = useState("");
  const [hasBankAccount, setHasBankAccount] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState<number | null>(null);

  useEffect(() => {
    setHasBankAccount(!!localStorage.getItem("campus_fees_account"));
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setGeneratedCount(null);
    if (!className.trim() || !month) { setError("Please fill in all required fields."); return; }
    if (!hasBankAccount) { setError("Please configure your bank account info under General Settings → Accounts For Fees Invoice first."); return; }
    setGenerating(true);
    try {
      const res = await fetch(`/api/students?search=${encodeURIComponent(className.trim())}`);
      const students: Record<string, string>[] = await res.json();
      const matching = students.filter(s => (s.class ?? "").toLowerCase().includes(className.trim().toLowerCase()));
      await Promise.all(matching.map(s => fetch("/api/fees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId: s.studentId ?? s.id, studentName: s.name ?? "", class: s.class ?? className, month, status: "unpaid", type: "invoice" }) })));
      setGeneratedCount(matching.length);
    } catch { setError("Failed to generate invoices. Please try again."); } finally { setGenerating(false); }
  }

  if (hasBankAccount === null) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!hasBankAccount && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium">Bank account information is required before generating invoices.{" "}<a href="/general-settings?tab=accounts-fees-invoice" className="font-bold underline hover:text-amber-900">Configure it in General Settings</a>.</p>
        </div>
      )}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col items-center gap-6 shadow-sm">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-gray-900">Generate Fees Invoice</h3>
          <p className="text-gray-500 text-sm">Enter a class and select a month to generate invoices for all students.</p>
        </div>
        <form onSubmit={handleGenerate} className="w-full max-w-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative w-full">
              <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Class <span className="text-red-500">*</span></span>
              <input type="text" value={className} onChange={e => setClassName(e.target.value)} placeholder="e.g. Grade 10 - Section A" className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400" />
            </div>
            <div className="relative w-full">
              <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Month <span className="text-red-500">*</span></span>
              <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
          {generatedCount !== null && <p className="text-sm text-green-600 font-bold text-center">{generatedCount === 0 ? "No students found in that class." : `✓ Generated ${generatedCount} invoice(s) for ${className}`}</p>}
          <div className="flex justify-center">
            <button type="submit" disabled={!hasBankAccount || generating} className="bg-primary text-white font-black px-12 py-4 rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
              {generating ? "Generating..." : "Generate Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CollectFeesView() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Record<string, string>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [collectingStudent, setCollectingStudent] = useState<Record<string, string> | null>(null);
  const [feeAmount, setFeeAmount] = useState("");
  const [feeMonth, setFeeMonth] = useState("");
  const [feeMethod, setFeeMethod] = useState("Cash");
  const [feeNotes, setFeeNotes] = useState("");
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeSuccess, setFeeSuccess] = useState(false);
  const [feeError, setFeeError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try { const res = await fetch(`/api/students?search=${encodeURIComponent(query.trim())}`); const data = await res.json(); setResults(Array.isArray(data) ? data : []); }
    catch { setResults([]); } finally { setLoading(false); }
  }

  async function handleCollectFee(e: React.FormEvent) {
    e.preventDefault(); setFeeError("");
    if (!feeAmount.trim() || !feeMonth) { setFeeError("Amount and month are required."); return; }
    setFeeLoading(true);
    try {
      const res = await fetch("/api/fees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId: collectingStudent?.studentId ?? collectingStudent?.id ?? "", studentName: collectingStudent?.name ?? "", class: collectingStudent?.class ?? "", amount: feeAmount, month: feeMonth, paymentMethod: feeMethod, notes: feeNotes, status: "paid" }) });
      if (!res.ok) throw new Error("Failed to record payment.");
      setFeeSuccess(true);
      setTimeout(() => { setCollectingStudent(null); setFeeAmount(""); setFeeMonth(""); setFeeMethod("Cash"); setFeeNotes(""); setFeeSuccess(false); }, 1500);
    } catch (err: unknown) { setFeeError(err instanceof Error ? err.message : "Failed to record payment."); } finally { setFeeLoading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900">Collect Fees of a Student</h3>
          <p className="text-gray-500 text-sm">Search for a student to collect fees.</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by student name or ID" className="w-full h-14 rounded-full border border-gray-200 bg-white pl-6 pr-16 text-sm text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-primary hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </form>
        {loading && <p className="text-center text-sm text-gray-400 font-medium py-8">Searching...</p>}
        {!loading && searched && results?.length === 0 && <p className="text-center text-sm text-gray-400 font-medium py-8">No students found for &ldquo;{query}&rdquo;.</p>}
        {!loading && results && results.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-[13px]">
              <thead><tr className="bg-primary text-white"><th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Name</th><th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">ID</th><th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Class</th><th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((student, i) => (
                  <tr key={student.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                    <td className="px-6 py-4 font-medium text-gray-900">{student.name ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-500">{student.studentId ?? student.id}</td>
                    <td className="px-6 py-4 text-gray-500">{student.class ?? "—"}</td>
                    <td className="px-6 py-4"><button onClick={() => { setCollectingStudent(student); setFeeAmount(""); setFeeMonth(""); setFeeMethod("Cash"); setFeeNotes(""); setFeeError(""); setFeeSuccess(false); }} className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/90 transition-colors">Collect Fee</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {collectingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div><h3 className="text-lg font-black text-gray-900">Collect Fee</h3><p className="text-sm text-gray-500 mt-0.5">{collectingStudent.name ?? "—"} · {collectingStudent.class ?? "—"}</p></div>
              <button onClick={() => setCollectingStudent(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            {feeSuccess ? (
              <div className="text-center py-8 space-y-3"><div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto"><svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg></div><p className="font-bold text-green-700">Payment recorded successfully!</p></div>
            ) : (
              <form onSubmit={handleCollectFee} className="space-y-4">
                <div className="relative"><span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-primary uppercase tracking-widest">Amount <span className="text-red-500">*</span></span><input type="number" min="0" step="0.01" value={feeAmount} onChange={e => setFeeAmount(e.target.value)} placeholder="0.00" className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
                <div className="relative"><span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-primary uppercase tracking-widest">Fees Month <span className="text-red-500">*</span></span><input type="month" value={feeMonth} onChange={e => setFeeMonth(e.target.value)} className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
                <div className="relative"><span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-primary uppercase tracking-widest">Payment Method <span className="text-red-500">*</span></span><select value={feeMethod} onChange={e => setFeeMethod(e.target.value)} className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary appearance-none"><option>Cash</option><option>Online Transfer</option><option>Check</option></select></div>
                <div className="relative"><span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-primary uppercase tracking-widest">Notes</span><input type="text" value={feeNotes} onChange={e => setFeeNotes(e.target.value)} placeholder="Optional" className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
                {feeError && <p className="text-sm text-red-500 font-medium">{feeError}</p>}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setCollectingStudent(null)} className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={feeLoading} className="flex-1 h-12 bg-primary text-white font-black rounded-xl hover:bg-primary/90 disabled:opacity-60">{feeLoading ? "Saving..." : "Record Payment"}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FeesPaidSlipView() {
  type Student = Record<string, string>;
  const [query, setQuery] = useState(""); const [month, setMonth] = useState(""); const [results, setResults] = useState<Student[] | null>(null); const [selected, setSelected] = useState<Student | null>(null); const [loading, setLoading] = useState(false); const [searched, setSearched] = useState(false); const [slip, setSlip] = useState(false); const [formError, setFormError] = useState(""); const [schoolName, setSchoolName] = useState("Campus One");
  useEffect(() => { fetch("/api/school").then(r => r.json()).then(d => { if (d?.name) setSchoolName(d.name); }).catch(() => {}); }, []);
  async function handleSearch(e: React.FormEvent) { e.preventDefault(); if (!query.trim()) return; setLoading(true); setSearched(true); setSelected(null); setSlip(false); try { const res = await fetch(`/api/students?search=${encodeURIComponent(query.trim())}`); const data = await res.json(); setResults(Array.isArray(data) ? data : []); } catch { setResults([]); } finally { setLoading(false); } }
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); setFormError(""); if (!selected) { setFormError("Please search for and select a student first."); return; } if (!month) { setFormError("Please select a fees month."); return; } setSlip(true); }
  const monthLabel = month ? new Date(month + "-02").toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
        <div className="space-y-1"><h3 className="text-lg font-bold text-gray-900">Fees Paid Slips</h3><p className="text-gray-500 text-sm">Search for a student and select a month to generate their payment slip.</p></div>
        <form onSubmit={handleSearch} className="relative w-full">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search student by name or ID" className="w-full h-14 rounded-full border border-gray-200 bg-white pl-6 pr-16 text-sm text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-primary hover:bg-primary/90 transition-colors"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
        </form>
        {loading && <p className="text-center text-sm text-gray-400 py-4">Searching...</p>}
        {!loading && searched && results?.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No students found for &ldquo;{query}&rdquo;.</p>}
        {!loading && results && results.length > 0 && !selected && (
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-[13px] text-left"><thead><tr className="bg-primary text-white"><th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Name</th><th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">ID</th><th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Class</th><th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Select</th></tr></thead>
              <tbody className="divide-y divide-gray-100">{results.map((s, i) => (<tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}><td className="px-5 py-3 font-semibold text-gray-900">{s.name ?? "—"}</td><td className="px-5 py-3 text-gray-500">{s.studentId ?? s.id}</td><td className="px-5 py-3 text-gray-500">{s.class ?? "—"}</td><td className="px-5 py-3"><button onClick={() => { setSelected(s); setSlip(false); }} className="px-3 py-1.5 text-[11px] font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary/10">Select</button></td></tr>))}</tbody>
            </table>
          </div>
        )}
        {selected && (<div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-4 flex items-center justify-between"><div><p className="text-[10px] font-bold text-primary uppercase tracking-widest">Selected Student</p><p className="mt-1 font-bold text-gray-900">{selected.name ?? "—"}</p><p className="text-xs text-gray-500">{selected.class ?? "—"}</p></div><button onClick={() => { setSelected(null); setSlip(false); setResults(null); setSearched(false); setQuery(""); }} className="text-xs text-gray-400 hover:text-gray-600 font-bold">Change</button></div>)}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative w-full max-w-xs"><span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fees Month <span className="text-red-500">*</span></span><input type="month" value={month} onChange={e => { setMonth(e.target.value); setSlip(false); }} className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
          {formError && <p className="text-sm text-red-500 font-medium">{formError}</p>}
          <button type="submit" className="bg-primary text-white font-black px-10 py-3.5 rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-primary/20">Generate Slip</button>
        </form>
      </div>
      {slip && selected && month && (
        <div className="rounded-2xl border-2 border-primary/20 bg-white shadow-sm overflow-hidden">
          <div className="bg-primary px-8 py-6 text-white text-center"><h2 className="text-xl font-black uppercase tracking-widest">{schoolName}</h2><p className="text-white/70 text-sm font-medium mt-1">Official Fees Paid Slip</p></div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Name</p><p className="mt-1 font-bold text-gray-900">{selected.name ?? "—"}</p></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student ID</p><p className="mt-1 font-bold text-gray-900">{selected.studentId ?? selected.id}</p></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class</p><p className="mt-1 font-bold text-gray-900">{selected.class ?? "—"}</p></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fees Month</p><p className="mt-1 font-bold text-gray-900">{monthLabel}</p></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Status</p><span className="mt-1 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">PAID</span></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Generated</p><p className="mt-1 font-bold text-gray-900">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p></div>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-6 flex items-center justify-between">
              <p className="text-xs text-gray-400 italic">This is a system-generated slip.</p>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-black rounded-full hover:bg-primary/90"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>Print Slip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeesDefaultersView() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm no-print">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Fees Defaulters List</h3>
            <button onClick={() => window.print()} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-xs font-bold border border-red-500/20">Print List</button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Pending Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-500/40 font-bold uppercase tracking-widest text-[11px] bg-gray-50/30">
                    No defaulters found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PrintTemplate title="Fees Defaulters List">
        <PrintTable>
          <PrintThead>
            <tr>
              <PrintTh>ID</PrintTh>
              <PrintTh>Student Name</PrintTh>
              <PrintTh>Class</PrintTh>
              <PrintTh>Pending Amount</PrintTh>
              <PrintTh>Status</PrintTh>
            </tr>
          </PrintThead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "#9CA3AF", fontSize: "11px" }}>No defaulters found</td>
            </tr>
          </tbody>
        </PrintTable>
      </PrintTemplate>
    </div>
  );
}

function StudentsAttendanceView() {
  const today = new Date().toISOString().split("T")[0];
  type Person = Record<string, string>; type AttendanceRow = { person: Person; status: string };
  const [date, setDate] = useState(today); const [classInput, setClassInput] = useState(""); const [rows, setRows] = useState<AttendanceRow[] | null>(null); const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false); const [formError, setFormError] = useState(""); const [saveSuccess, setSaveSuccess] = useState(false);
  async function handleLoad(e: React.FormEvent) { e.preventDefault(); setFormError(""); if (!date || !classInput.trim()) { setFormError("Date and Class are required."); return; } setLoading(true); setSaveSuccess(false); try { const res = await fetch(`/api/students?search=${encodeURIComponent(classInput.trim())}`); const data: Person[] = await res.json(); const matching = data.filter(s => (s.class ?? "").toLowerCase().includes(classInput.trim().toLowerCase())); setRows(matching.map(p => ({ person: p, status: "present" }))); } catch { setRows([]); } finally { setLoading(false); } }
  async function handleSave() { if (!rows || rows.length === 0) return; setSaving(true); setSaveSuccess(false); try { await Promise.all(rows.map(r => fetch("/api/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ personId: r.person.studentId ?? r.person.id, personName: r.person.name ?? "", class: r.person.class ?? classInput, date, status: r.status, type: "student" }) }))); setSaveSuccess(true); } catch { } finally { setSaving(false); } }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-gray-900">Add/Update Attendance</h3>
        <form onSubmit={handleLoad} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative"><span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date <span className="text-red-500">*</span></span><input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
          <div className="relative"><span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Class <span className="text-red-500">*</span></span><input type="text" value={classInput} onChange={e => setClassInput(e.target.value)} placeholder="e.g. Grade 10 - Section A" className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400" /></div>
          {formError && <p className="text-sm text-red-500 font-medium col-span-2">{formError}</p>}
          <button type="submit" className="col-span-2 md:w-fit bg-primary text-white font-black px-10 py-3 rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-primary/20">{loading ? "Loading..." : "Add/Update Attendance"}</button>
        </form>
      </div>
      {rows !== null && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          {rows.length === 0 ? <p className="px-8 py-12 text-center text-gray-400 italic text-sm">No students found in &ldquo;{classInput}&rdquo;.</p> : (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between"><p className="text-sm font-bold text-gray-700">{rows.length} student{rows.length !== 1 ? "s" : ""} — {new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>{saveSuccess && <span className="text-xs font-bold text-green-600">✓ Attendance saved!</span>}</div>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-[13px]"><thead><tr className="bg-primary text-white"><th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">#</th><th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Name</th><th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">ID</th><th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Status</th></tr></thead>
                  <tbody>{rows.map((row, i) => (<tr key={row.person.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}><td className="px-5 py-3 text-gray-400">{i + 1}</td><td className="px-5 py-3 font-semibold text-gray-900">{row.person.name ?? "—"}</td><td className="px-5 py-3 text-gray-500">{row.person.studentId ?? row.person.id}</td><td className="px-5 py-3"><select value={row.status} onChange={e => setRows(rows.map((r, j) => j === i ? { ...r, status: e.target.value } : r))} className={cn("rounded-lg border px-3 py-1.5 text-xs font-bold outline-none transition", row.status === "present" ? "bg-green-50 border-green-200 text-green-700" : row.status === "absent" ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700")}><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></td></tr>))}</tbody>
                </table>
              </div>
              <div className="flex justify-end"><button onClick={handleSave} disabled={saving} className="bg-primary text-white font-black px-10 py-3 rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 disabled:opacity-60">{saving ? "Saving..." : "Save Attendance"}</button></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmployeesAttendanceView() {
  const today = new Date().toISOString().split("T")[0];
  type Person = Record<string, string>; type AttendanceRow = { person: Person; status: string };
  const [date, setDate] = useState(today); const [searchInput, setSearchInput] = useState(""); const [rows, setRows] = useState<AttendanceRow[] | null>(null); const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false); const [formError, setFormError] = useState(""); const [saveSuccess, setSaveSuccess] = useState(false);
  async function handleLoad(e: React.FormEvent) { e.preventDefault(); setFormError(""); if (!date) { setFormError("Date is required."); return; } setLoading(true); setSaveSuccess(false); try { const qs = searchInput.trim() ? `?search=${encodeURIComponent(searchInput.trim())}` : ""; const res = await fetch(`/api/employees${qs}`); const data: Person[] = await res.json(); setRows(Array.isArray(data) ? data.map(p => ({ person: p, status: "present" })) : []); } catch { setRows([]); } finally { setLoading(false); } }
  async function handleSave() { if (!rows || rows.length === 0) return; setSaving(true); setSaveSuccess(false); try { await Promise.all(rows.map(r => fetch("/api/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ personId: r.person.employeeId ?? r.person.id, personName: r.person.name ?? "", department: r.person.department ?? "", date, status: r.status, type: "employee" }) }))); setSaveSuccess(true); } catch { } finally { setSaving(false); } }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-gray-900">Add/Update Attendance</h3>
        <form onSubmit={handleLoad} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative"><span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date <span className="text-red-500">*</span></span><input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
          <div className="relative"><span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Search Employee</span><input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Leave blank to load all" className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400" /></div>
          {formError && <p className="text-sm text-red-500 font-medium col-span-2">{formError}</p>}
          <button type="submit" className="col-span-2 md:w-fit bg-primary text-white font-black px-10 py-3 rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-primary/20">{loading ? "Loading..." : "Add/Update Attendance"}</button>
        </form>
      </div>
      {rows !== null && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          {rows.length === 0 ? <p className="px-8 py-12 text-center text-gray-400 italic text-sm">No employees found.</p> : (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between"><p className="text-sm font-bold text-gray-700">{rows.length} employee{rows.length !== 1 ? "s" : ""} — {new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>{saveSuccess && <span className="text-xs font-bold text-green-600">✓ Attendance saved!</span>}</div>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-[13px]"><thead><tr className="bg-primary text-white"><th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">#</th><th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Name</th><th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Role</th><th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Status</th></tr></thead>
                  <tbody>{rows.map((row, i) => (<tr key={row.person.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}><td className="px-5 py-3 text-gray-400">{i + 1}</td><td className="px-5 py-3 font-semibold text-gray-900">{row.person.name ?? "—"}</td><td className="px-5 py-3 text-gray-500">{row.person.role ?? "—"}</td><td className="px-5 py-3"><select value={row.status} onChange={e => setRows(rows.map((r, j) => j === i ? { ...r, status: e.target.value } : r))} className={cn("rounded-lg border px-3 py-1.5 text-xs font-bold outline-none transition", row.status === "present" ? "bg-green-50 border-green-200 text-green-700" : row.status === "absent" ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700")}><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></td></tr>))}</tbody>
                </table>
              </div>
              <div className="flex justify-end"><button onClick={handleSave} disabled={saving} className="bg-primary text-white font-black px-10 py-3 rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 disabled:opacity-60">{saving ? "Saving..." : "Save Attendance"}</button></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClassWiseReportView() {
  const today = new Date().toISOString().split("T")[0];
  type AttendanceRecord = Record<string, string>;
  const [date, setDate] = useState(today); const [records, setRecords] = useState<AttendanceRecord[] | null>(null); const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) { e.preventDefault(); setLoading(true); try { const res = await fetch(`/api/attendance?search=${encodeURIComponent(date)}`); const data = await res.json(); setRecords(Array.isArray(data) ? data.filter((r: AttendanceRecord) => r.date === date || r.date?.startsWith(date)) : []); } catch { setRecords([]); } finally { setLoading(false); } }
  const byClass = records ? records.reduce<Record<string, AttendanceRecord[]>>((acc, r) => { const key = r.class ?? "Unclassified"; acc[key] = [...(acc[key] ?? []), r]; return acc; }, {}) : null;
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm flex flex-col items-center gap-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <div className="relative"><span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date <span className="text-red-500">*</span></span><input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white font-black py-3.5 rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>{loading ? "Loading..." : "Submit"}</button>
        </form>
      </div>
      {byClass && Object.keys(byClass).length === 0 && <div className="rounded-2xl border border-gray-200 bg-white px-8 py-12 shadow-sm text-center text-gray-400 italic text-sm">No attendance records found for {new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.</div>}
      {byClass && Object.entries(byClass).map(([className, rows]) => (
        <div key={className} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-primary/5 border-b border-primary/10 flex items-center justify-between"><h4 className="font-black text-gray-900">{className}</h4><div className="flex gap-3 text-xs font-bold"><span className="text-green-600">{rows.filter(r => r.status === "present").length} Present</span><span className="text-red-500">{rows.filter(r => r.status === "absent").length} Absent</span><span className="text-amber-500">{rows.filter(r => r.status === "late").length} Late</span></div></div>
          <table className="w-full text-left text-[13px]"><thead><tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100"><th className="px-5 py-3">#</th><th className="px-5 py-3">Name</th><th className="px-5 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{rows.map((r, i) => (<tr key={r.id ?? i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}><td className="px-5 py-3 text-gray-400">{i + 1}</td><td className="px-5 py-3 font-semibold text-gray-900">{r.personName ?? "—"}</td><td className="px-5 py-3"><span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide", r.status === "present" ? "bg-green-100 text-green-700" : r.status === "absent" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600")}>{r.status ?? "—"}</span></td></tr>))}</tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function StudentsAttendanceReportView() {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const dateRangeLabel = `${firstOfMonth.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm no-print">
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4">
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-black flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {dateRangeLabel}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {["Copy", "CSV", "Excel", "PDF"].map(tool => (
                <button key={tool} className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all">{tool}</button>
              ))}
              <button onClick={() => window.print()} className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all">Print</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Search:</span>
              <input type="text" className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">DATE</th>
                  <th className="px-6 py-4">DAY</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">NAME</th>
                  <th className="px-6 py-4">CLASS</th>
                  <th className="px-6 py-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-500/40 font-bold uppercase tracking-widest text-[11px] bg-gray-50/30">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PrintTemplate title="Students Attendance Report" subtitle={dateRangeLabel}>
        <PrintTable>
          <PrintThead>
            <tr>
              <PrintTh>Date</PrintTh>
              <PrintTh>Day</PrintTh>
              <PrintTh>ID</PrintTh>
              <PrintTh>Name</PrintTh>
              <PrintTh>Class</PrintTh>
              <PrintTh>Status</PrintTh>
            </tr>
          </PrintThead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#9CA3AF", fontSize: "11px" }}>No data available</td>
            </tr>
          </tbody>
        </PrintTable>
      </PrintTemplate>
    </div>
  );
}

function EmployeesAttendanceReportView() {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const dateRangeLabel = `${firstOfMonth.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm no-print">
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4">
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-black flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {dateRangeLabel}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {["Copy", "CSV", "Excel", "PDF"].map(tool => (
                <button key={tool} className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all">{tool}</button>
              ))}
              <button onClick={() => window.print()} className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all">Print</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Search:</span>
              <input type="text" className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">DATE</th>
                  <th className="px-6 py-4">DAY</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">NAME</th>
                  <th className="px-6 py-4">TYPE</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4">TIME <span className="text-[10px] font-normal italic">[Card Scanning]</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-gray-500/40 font-bold uppercase tracking-widest text-[11px] bg-gray-50/30">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PrintTemplate title="Employees Attendance Report" subtitle={dateRangeLabel}>
        <PrintTable>
          <PrintThead>
            <tr>
              <PrintTh>Date</PrintTh>
              <PrintTh>Day</PrintTh>
              <PrintTh>ID</PrintTh>
              <PrintTh>Name</PrintTh>
              <PrintTh>Type</PrintTh>
              <PrintTh>Status</PrintTh>
              <PrintTh>Time</PrintTh>
            </tr>
          </PrintThead>
          <tbody>
            <tr>
              <td colSpan={7} style={{ padding: "24px", textAlign: "center", color: "#9CA3AF", fontSize: "11px" }}>No data available</td>
            </tr>
          </tbody>
        </PrintTable>
      </PrintTemplate>
    </div>
  );
}














