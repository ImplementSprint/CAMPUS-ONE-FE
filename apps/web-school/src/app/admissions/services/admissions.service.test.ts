import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

type FetchCall = {
  url: string;
  init: RequestInit;
};

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;
const originalFileReader = globalThis.FileReader;

function installSelectedSchoolWindow() {
  const storage = new Map<string, string>([
    [
      "campus-one:selected-school",
      JSON.stringify({ schoolId: "institution-123", schoolSlug: "san-beda" }),
    ],
  ]);

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { search: "", hostname: "localhost" },
      localStorage: {
        getItem(key: string) {
          return storage.get(key) ?? null;
        },
      },
    },
  });
}

function installFetch(calls: FetchCall[], payload: unknown = { data: { id: "applicant-123" }, error: null }) {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: async (url: string | URL | Request, init?: RequestInit) => {
      calls.push({ url: String(url), init: init ?? {} });
      return {
        ok: true,
        json: async () => payload,
      } as Response;
    },
  });
}

afterEach(() => {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: originalFetch,
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: originalWindow,
  });
  Object.defineProperty(globalThis, "FileReader", {
    configurable: true,
    value: originalFileReader,
  });
});

describe("web-school admissions backend adapter", () => {
  it("creates applicant profiles through the backend with selected-school headers", async () => {
    const calls: FetchCall[] = [];
    installSelectedSchoolWindow();
    installFetch(calls);

    const { createApplicantProfile } = await import("./admissions.service.ts");
    const result = await createApplicantProfile({
      email: " Applicant@Example.edu ",
      school_level: "College",
      applicant_type: "Freshman",
    });

    assert.deepEqual(result, {
      data: { id: "applicant-123" },
      error: null,
    });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "http://localhost:4000/api/application/create-profile");
    assert.equal(calls[0].init.method, "POST");
    assert.deepEqual(calls[0].init.headers, {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-School-Slug": "san-beda",
      "X-Institution-Id": "institution-123",
    });
    assert.equal(
      calls[0].init.body,
      JSON.stringify({
        email: "applicant@example.edu",
        school_level: "College",
        applicant_type: "Freshman",
      }),
    );
  });

  it("uploads applicant documents through the backend as base64", async () => {
    const calls: FetchCall[] = [];
    installSelectedSchoolWindow();
    installFetch(calls, {
      data: {
        id: "doc-1",
        applicant_id: "applicant-123",
        document_name: "Transcript",
        file_name: "transcript.pdf",
        file_url: "storage://applicant-documents/institution-123/applicant-123/transcript.pdf",
        status: "submitted",
        submitted_at: "2026-06-12T00:00:00.000Z",
        school_level: "College",
        applicant_type: "Freshman",
      },
      error: null,
    });
    Object.defineProperty(globalThis, "FileReader", {
      configurable: true,
      value: class {
        result: string | null = null;
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;

        readAsDataURL() {
          this.result = "data:application/pdf;base64,cGRmIGJ5dGVz";
          this.onload?.();
        }
      },
    });

    const { uploadApplicantDocument } = await import("./admissions.service.ts");
    const file = new File(["pdf bytes"], "transcript.pdf", { type: "application/pdf" });
    const result = await uploadApplicantDocument({
      applicant_id: "applicant-123",
      document_name: "Transcript",
      file,
      school_level: "College",
      applicant_type: "Freshman",
    });

    assert.equal(result.error, null);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "http://localhost:4000/api/application/upload-document");
    assert.equal(calls[0].init.method, "POST");
    assert.equal(
      calls[0].init.body,
      JSON.stringify({
        applicant_id: "applicant-123",
        document_name: "Transcript",
        file_name: "transcript.pdf",
        file_type: "application/pdf",
        file_base64: "cGRmIGJ5dGVz",
        school_level: "College",
        applicant_type: "Freshman",
      }),
    );
  });
});
