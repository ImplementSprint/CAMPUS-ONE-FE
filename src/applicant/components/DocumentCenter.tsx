'use client'
import { useState, useEffect, useRef } from "react";
import type { RequirementItem, SchoolLevel, ApplicantType } from "../types/admissions.types";
import { uploadApplicantDocument, logEvent } from "@/applicant/services/admissions.service";
import { Upload, FileText } from "lucide-react";

type DocStatus = "not_uploaded" | "submitted" | "approved" | "rejected";

interface DocState {
  status: DocStatus;
  fileName: string | null;
  fileUrl: string | null;
  submittedAt: string | null;
}

interface Props {
  requirements: RequirementItem[];
  schoolLevel: SchoolLevel;
  applicantType: ApplicantType;
  applicantId: string;
}

export function DocumentCenter({ requirements, schoolLevel, applicantType, applicantId }: Props) {
  const [docStates, setDocStates] = useState<Record<string, DocState>>(() =>
    Object.fromEntries(requirements.map((r) => [r.id, { status: "not_uploaded" as DocStatus, fileName: null, fileUrl: null, submittedAt: null }]))
  );

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Re-sync when requirements change
  useEffect(() => {
    setDocStates(
      Object.fromEntries(requirements.map((r) => [r.id, { status: "not_uploaded" as DocStatus, fileName: null, fileUrl: null, submittedAt: null }]))
    );
  }, [requirements]);

  const handleFileSelect = async (reqId: string, reqName: string, file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [reqId]: "Only PDF files are allowed" }));
      return;
    }

    // Validate file size (3MB max)
    const maxSize = 3 * 1024 * 1024; // 3MB in bytes
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, [reqId]: "File size must not exceed 3MB" }));
      return;
    }

    setUploadingId(reqId);
    setErrors((prev) => ({ ...prev, [reqId]: "" }));

    const res = await uploadApplicantDocument({
      applicant_id: applicantId,
      document_name: reqName,
      file,
      school_level: schoolLevel,
      applicant_type: applicantType,
    });

    setUploadingId(null);

    if (res.error) {
      setErrors((prev) => ({ ...prev, [reqId]: res.error!.message }));
    } else {
      const ev = docStates[reqId]?.status !== "not_uploaded" ? "document_replaced" : "document_uploaded";
      await logEvent(ev, schoolLevel, applicantType, { document_name: reqName });
      
      setDocStates((prev) => ({
        ...prev,
        [reqId]: {
          status: "submitted",
          fileName: file.name,
          fileUrl: res.data!.file_url,
          submittedAt: new Date().toLocaleDateString("en-PH"),
        },
      }));
    }

    // Clear file input
    if (fileInputRefs.current[reqId]) {
      fileInputRefs.current[reqId]!.value = "";
    }
  };

  const triggerFileInput = (reqId: string) => {
    fileInputRefs.current[reqId]?.click();
  };

  return (
    <div className="space-y-4">
      {/* Important Notes Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">LIST OF REQUIREMENTS</h3>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-bold text-amber-900 mb-2">IMPORTANT NOTES:</p>
          <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside">
            <li>Only pdf can be uploaded. Maximum of 3MB only.</li>
            <li>Ensure that you submit the correct requirements to avoid delay in the processing of your application.</li>
            <li>
              If you missed downloading the APPLICATION GRADES FORM from the front page, you can download it here:{" "}
              <a href="#" className="text-blue-600 underline font-medium">
                College Application Form
              </a>
            </li>
            <li>Please ensure that you have filled out all required fields on the APPLICATION GRADES FORM before proceeding with the upload.</li>
            <li>Once you have completed the form, click the "Upload file" button below to submit it.</li>
          </ul>
        </div>
      </div>

      {/* Required Documents Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-amber-500 px-5 py-3">
          <h3 className="text-sm font-bold text-white">REQUIRED DOCUMENTS</h3>
        </div>

        <div className="p-5">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_100px] gap-3 mb-3 pb-2 border-b border-gray-200">
            <div className="text-xs font-bold text-gray-700">Filename</div>
            <div className="text-xs font-bold text-gray-700">Requirements</div>
            <div className="text-xs font-bold text-gray-700 text-center">Action</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-3">
            {requirements.map((req) => {
              const state = docStates[req.id] ?? { status: "not_uploaded", fileName: null, fileUrl: null, submittedAt: null };
              const isUploading = uploadingId === req.id;
              const error = errors[req.id];

              return (
                <div key={req.id}>
                  <div className="grid grid-cols-[1fr_2fr_100px] gap-3 items-center py-2">
                    {/* Filename */}
                    <div className="text-sm text-gray-600">
                      {state.fileName ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate text-xs">{state.fileName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Upload document here</span>
                      )}
                    </div>

                    {/* Requirements */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-800">{req.name}</span>
                        {req.required && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">
                            REQUIRED
                          </span>
                        )}
                      </div>
                      {req.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{req.description}</p>
                      )}
                    </div>

                    {/* Action */}
                    <div className="flex justify-center">
                      <input
                        ref={(el) => {
                          fileInputRefs.current[req.id] = el;
                        }}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(req.id, req.name, file);
                        }}
                      />
                      <button
                        onClick={() => triggerFileInput(req.id)}
                        disabled={isUploading}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isUploading
                            ? "bg-gray-100 text-gray-400 cursor-wait"
                            : state.status !== "not_uploaded"
                            ? "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                            : "bg-[#F59E0B] text-white hover:bg-[#D97706]"
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3 h-3" />
                            <span>{state.status !== "not_uploaded" ? "Replace" : "Upload"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mt-1 text-xs text-red-500 pl-3">
                      {error}
                    </div>
                  )}

                  {/* Divider */}
                  {req.id !== requirements[requirements.length - 1]?.id && (
                    <div className="border-b border-gray-100 mt-3" />
                  )}
                </div>
              );
            })}
          </div>

          {requirements.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-sm">No requirements found for this selection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
