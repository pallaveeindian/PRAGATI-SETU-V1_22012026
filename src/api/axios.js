// src/api/axios.js
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAuth,
  clearAuth,
  getApiHeaders,
  getUser,
} from "../utils/storage";

import CryptoJS from "crypto-js";
const API_ENCRYPTION_KEY = import.meta.env.VITE_API_ENCRYPTION_KEY;

// ------------------------
// Decryption Algorithm (VUN:14 Patch fix)
// ------------------------

export const decryptPayload = (responseData) => {
  // If it doesn't match our {iv, data} payload shape, return it as-is
  if (
    !responseData ||
    typeof responseData !== "object" ||
    !responseData.iv ||
    !responseData.data
  ) {
    return responseData;
  }

  try {
    const key = CryptoJS.enc.Utf8.parse(API_ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Base64.parse(responseData.iv);
    const ciphertext = CryptoJS.enc.Base64.parse(responseData.data);

    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("API Decryption failed:", error);
    return responseData;
  }
};

// ------------------------
// Axios instance
// ------------------------

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {},
});

// ------------------------
// Helpers
// ------------------------

function isAuthUrl(url = "") {
  return url.startsWith("/auth/") || url.includes("/auth/");
}

function isLookupUrl(url = "") {
  return url.startsWith("/lookups/") || url.includes("/lookups/");
}

// ------------------------
// Request interceptor
// ------------------------

api.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    config.headers = config.headers || {};
    config.withCredentials = true;

    const auth = isAuthUrl(url);
    const lookup = isLookupUrl(url);

    // LOOKUPS: only X-API headers, NO Authorization
    if (lookup) {
      // remove any Authorization if present
      delete config.headers["Authorization"];

      const apiHdrs = (getApiHeaders && getApiHeaders()) || {};
      const apiId =
        apiHdrs.apiId || apiHdrs["X-API-ID"] || "TH_EPS.BDOuser_test.co.in";
      const apiKey =
        apiHdrs.apiKey ||
        apiHdrs["X-API-KEY"] ||
        "wFR8IpSeNMawCF4RPLXit1POGuQAJTSmRexBBOwO";

      config.headers["X-API-ID"] = apiId;
      config.headers["X-API-KEY"] = apiKey;

      return config;
    }

    // AUTH: no Authorization, no X-API
    if (auth) {
      delete config.headers["Authorization"];
      delete config.headers["X-API-ID"];
      delete config.headers["X-API-KEY"];
      return config;
    }

    // OTHER API endpoints: Bearer token, no X-API
    delete config.headers["X-API-ID"];
    delete config.headers["X-API-KEY"];

    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ------------------------
// Response interceptor (401 → refresh + retry)
// ------------------------

let isRefreshing = false;
let refreshPromise = null;

/**
 * Call /auth/refresh/ using cookies (ps_refresh).
 * Store new access token via setAuth (keeps refresh from storage if present).
 */
async function performRefresh() {
  if (!refreshPromise) {
    isRefreshing = true;
    const client = axios.create({
      baseURL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    refreshPromise = client
      .post("/auth/refresh/")
      .then((res) => {
        const data = res?.data || {};
        const newAccess = data.access || data.access_token || null;
        const existingRefresh = getRefreshToken();
        if (newAccess) {
          setAuth({
            access: newAccess,
            user: getUser(),
          });
        }
        return newAccess;
      })
      .catch((err) => {
        clearAuth();
        throw err;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => {
    // 1. Decrypt Successful Responses
    if (response.data) {
      response.data = decryptPayload(response.data);
    }
    return response;
  },
  async (error) => {
    // 2. Decrypt Error Responses (Backend encrypts 400/401/500 errors too)
    if (error.response && error.response.data) {
      error.response.data = decryptPayload(error.response.data);
    }

    const originalConfig = error?.config;

    if (!originalConfig) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    const url = originalConfig.url || "";

    // If not unauthorized, just bubble up
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite loop
    if (originalConfig._retry) {
      return Promise.reject(error);
    }

    const auth = isAuthUrl(url);
    const lookup = isLookupUrl(url);

    // Do not auto-refresh for auth or lookup endpoints
    if (auth || lookup) {
      return Promise.reject(error);
    }

    try {
      originalConfig._retry = true;
      const newAccess = await performRefresh();

      if (newAccess) {
        originalConfig.headers = originalConfig.headers || {};
        originalConfig.headers["Authorization"] = `Bearer ${newAccess}`;
      }

      return api(originalConfig);
    } catch (e) {
      return Promise.reject(e);
    }
  },
);

// ------------------------
// Generic CRUD factory for DRF viewsets
// ------------------------

export function makeCrud(basePath) {
  const path = basePath.endsWith("/") ? basePath : `${basePath}/`;

  // NOTE: return several common aliases so callers across the app
  // can use either `list`/`retrieve` or `detail`/`get` etc.
  return {
    // List collection: GET /resource/?params
    list: (params) => api.get(path, { params }),

    // Retrieve single: GET /resource/:id/
    retrieve: (id, params) =>
      api.get(`${path}${encodeURIComponent(id)}/`, { params }),

    // alias common name 'detail' used in some components
    detail: (id, params) =>
      api.get(`${path}${encodeURIComponent(id)}/`, { params }),

    // alias 'get' for convenience
    get: (id, params) =>
      api.get(`${path}${encodeURIComponent(id)}/`, { params }),

    // Create: POST /resource/
    create: (data) => api.post(path, data),

    // MULTIPART (for file upload)
    createMultipart: (formData) =>
      api.post(path, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),

    // Update (full): PUT /resource/:id/
    update: (id, data) => api.put(`${path}${encodeURIComponent(id)}/`, data),

    // Partial update: PATCH /resource/:id/
    partialUpdate: (id, data) =>
      api.patch(`${path}${encodeURIComponent(id)}/`, data),

    // Destroy: DELETE /resource/:id/
    destroy: (id) => api.delete(`${path}${encodeURIComponent(id)}/`),
  };
}

// ------------------------
// AUTH APIS
// ------------------------

export const AUTH_API = {
  login: (data) =>
    api.post("/auth/login/", data, {
      headers: {
        "X-App-Client": "TMS_WEB",
      },
    }),

  captcha: () =>
    api.get("/auth/captcha/", {
      headers: {
        "X-App-Client": "TMS_WEB",
      },
    }),

  refresh: () => api.post("/auth/refresh/"),
  logout: () => api.post("/auth/logout/"),
  crpRequestOtp: (data) => api.post("/auth/crp-request-otp/", data),
  crpVerifyOtp: (data) => api.post("/auth/crp-verify-otp/", data),
};

// ------------------------
// LOOKUP / CORE APIS
// ------------------------
//
// These map to core.api.views_lookups + UPSRLM proxy views + geo-scope.
//

export const LOOKUP_API = {
  // Master geo units (via DRF router)
  states: makeCrud("/lookups/states/"),
  mandals: makeCrud("/lookups/mandals/"),
  district_categories: makeCrud("/lookups/district-categories/"),
  districts: makeCrud("/lookups/districts/"),
  blocks: makeCrud("/lookups/blocks/"),
  blocksByDistrict: (districtId) =>
    api.get(`/lookups/blocks/${encodeURIComponent(districtId)}/`),
  FULLblocksByDistrict: (districtId, params = {}) =>
    api.get(`/lookups/blocks/${encodeURIComponent(districtId)}/`, {
      params,
    }),
  block_detail: makeCrud("/lookups/blocks/detail/"),
  panchayats: makeCrud("/lookups/panchayats/"),
  panchayatsByBlock: (blockId, config = {}) =>
    api.get(`/lookups/panchayats/${encodeURIComponent(blockId)}/`, config),
  panchayat_detail: makeCrud("/lookups/panchayats/detail/"),
  villages: makeCrud("/lookups/villages/"),
  villagesByPanchayat: (panchayatId, config = {}) =>
    api.get(`/lookups/villages/${encodeURIComponent(panchayatId)}/`, config),
  village_detail: makeCrud("/lookups/villages/detail/"),
  users: makeCrud("/lookups/users/"),

  // SHG / VO / CLF master lists (DB backed)

  //  find CLF
  upsrlmFindClf: (params) =>
    api.get(`/lookups/find-clf-by-member/`, { params }),

  clfList: makeCrud("/lookups/clf-list/"),
  voList: makeCrud("/lookups/vo-list/"),
  shgList: makeCrud("/lookups/shg-list/"),

  // Beneficiary list under SHG (view)
  // GET /lookups/beneficiary-list/?shg_code=... OR /lookups/beneficiary-list/<shg_code>/
  beneficiaryList: (params) =>
    api.get("/lookups/beneficiary-list/", { params }),
  beneficiaryListByShg: (shgCode, params) =>
    api.get(`/lookups/beneficiary-list/${encodeURIComponent(shgCode)}/`, {
      params,
    }),

  // Beneficiary detail and related master tables
  beneficiaryDetail: (memberCode, params) =>
    api.get(`/lookups/beneficiary-detail/${encodeURIComponent(memberCode)}/`, {
      params,
    }),

  // CLF / VO / SHG detail + members/etc (master_* tables)
  clfDetail: (clfCode, params) =>
    api.get(`/lookups/clf-detail/${encodeURIComponent(clfCode)}/`, { params }),
  clfMembers: (clfCode, params) =>
    api.get(`/lookups/clf-members/${encodeURIComponent(clfCode)}/`, {
      params,
    }),
  clfPanchayats: (clfCode, params) =>
    api.get(`/lookups/clf-panchayats/${encodeURIComponent(clfCode)}/`, {
      params,
    }),
  clfVillages: (clfCode, params) =>
    api.get(`/lookups/clf-villages/${encodeURIComponent(clfCode)}/`, {
      params,
    }),
  clfVos: (clfCode, params) =>
    api.get(`/lookups/clf-vos/${encodeURIComponent(clfCode)}/`, { params }),

  voDetail: (voCode, params) =>
    api.get(`/lookups/vo-detail/${encodeURIComponent(voCode)}/`, { params }),
  voMembers: (voCode, params) =>
    api.get(`/lookups/vo-members/${encodeURIComponent(voCode)}/`, { params }),
  voPanchayats: (voCode, params) =>
    api.get(`/lookups/vo-panchayats/${encodeURIComponent(voCode)}/`, {
      params,
    }),
  voVillages: (voCode, params) =>
    api.get(`/lookups/vo-villages/${encodeURIComponent(voCode)}/`, {
      params,
    }),
  voShgs: (voCode, params) =>
    api.get(`/lookups/vo-shgs/${encodeURIComponent(voCode)}/`, { params }),

  shgDetail: (shgCode, params) =>
    api.get(`/lookups/shg-detail/${encodeURIComponent(shgCode)}/`, {
      params,
    }),
  shgMembers: (shgCode, params) =>
    api.get(`/lookups/shg-members/${encodeURIComponent(shgCode)}/`, { params }),

  // ------------------------
  // UPSRLM + APISetu proxies
  // (core.api.upsrlm_views)
  // ------------------------

  // CLF via UPSRLM
  upsrlmClfList: (blockId, params) =>
    api.get(`/lookups/upsrlm-clf-list/${encodeURIComponent(blockId)}/`, {
      params,
    }),
  upsrlmClfDetail: (clfCode, params) =>
    api.get(`/lookups/upsrlm-clf-detail/${encodeURIComponent(clfCode)}/`, {
      params,
    }),
  upsrlmClfPanchayats: (clfCode, params) =>
    api.get(`/lookups/upsrlm-clf-panchayats/${encodeURIComponent(clfCode)}/`, {
      params,
    }),
  upsrlmClfMembers: (clfCode, params) =>
    api.get(`/lookups/upsrlm-clf-members/${encodeURIComponent(clfCode)}/`, {
      params,
    }),
  upsrlmClfVillages: (clfCode, params) =>
    api.get(`/lookups/upsrlm-clf-villages/${encodeURIComponent(clfCode)}/`, {
      params,
    }),

  // VO via UPSRLM
  upsrlmVoList: (blockId, params) =>
    api.get(`/lookups/upsrlm-vo-list/${encodeURIComponent(blockId)}/`, {
      params,
    }),
  upsrlmVoDetail: (voCode, params) =>
    api.get(`/lookups/upsrlm-vo-detail/${encodeURIComponent(voCode)}/`, {
      params,
    }),
  upsrlmVoPanchayats: (voCode, params) =>
    api.get(`/lookups/upsrlm-vo-panchayats/${encodeURIComponent(voCode)}/`, {
      params,
    }),
  upsrlmVoMembers: (voCode, params) =>
    api.get(`/lookups/upsrlm-vo-members/${encodeURIComponent(voCode)}/`, {
      params,
    }),
  upsrlmVoVillages: (voCode, params) =>
    api.get(`/lookups/upsrlm-vo-villages/${encodeURIComponent(voCode)}/`, {
      params,
    }),
  upsrlmVoShgs: (voCode, params) =>
    api.get(`/lookups/upsrlm-vo-shgs/${encodeURIComponent(voCode)}/`, {
      params,
    }),

  // SHG via UPSRLM (list/details/members)
  upsrlmShgList: (blockId, params) =>
    api.get(`/upsrlm-shg-list/${encodeURIComponent(blockId)}/`, {
      params,
    }),
  upsrlmShgDetail: (shgCode, params) =>
    api.get(`/upsrlm-shg-detail/${encodeURIComponent(shgCode)}/`, { params }),
  upsrlmShgMembers: (shgCode, params) =>
    api.get(`/upsrlm-shg-members/${encodeURIComponent(shgCode)}/`, { params }),

  // ------------------------
  // Geo-scope mapping by user
  // ------------------------

  // GET /lookups/user-geoscope/<user_id>/
  userGeoscopeByUserId: (userId, params) =>
    api.get(`/lookups/user-geoscope/${encodeURIComponent(userId)}/`, {
      params,
    }),
};

// ------------------------
// epSakhi APIS
// ------------------------
//
// These map to epSakhi.api.urls viewsets and custom views.
//

export const EPSAKHI_API = {
  // CRP master + mapping
  crp: makeCrud("/epsakhi/crp/"),
  crpPanchayatMap: makeCrud("/epsakhi/crud-panchayats-under-crp/"),

  // ✅ ADDED from source: CRP List with panchayats (fixes CRPTable.jsx error)
  crpPanchList: (params) => api.get(`/epsakhi/crp-panch-list/`, { params }),

  // ✅ ADDED from source: CRP Panchayat bulk operations
  crpPanchayatBulk: (data) => api.post("/epsakhi/crp-panchayat-bulk/", data),

  // BeneficiaryRecorded + related enterprise forms
  beneficiaryRecorded: makeCrud("/epsakhi/beneficiary-recorded/"),
  existingEnterprise: makeCrud("/epsakhi/existing-enterprises/"),
  newEnterprise: makeCrud("/epsakhi/new-enterprises/"),
  enterpriseLoanDetails: makeCrud("/epsakhi/enterprise-loan-details/"),
  enterpriseSupportDetails: makeCrud("/epsakhi/enterprise-support-details/"),
  enterpriseTrainingReqs: makeCrud("/epsakhi/enterprise-training-reqs/"),
  enterpriseMedia: makeCrud("/epsakhi/enterprise-media/"),
  enterpriseProducts: makeCrud("/epsakhi/enterprise-products/"),
  enterpriseTypes: makeCrud("/epsakhi/enterprise-types/"),
  noEnterpriseForms: makeCrud("/epsakhi/no-enterprise-forms/"),
  noEnterpriseWages: makeCrud("/epsakhi/no-enterprise-wages/"),

  // ------------------------
  // Custom epSakhi views
  // ------------------------

  // Beneficiaries under SHG (LokOS) → BeneficiaryRecorded join
  beneficiaryRecordedByShg: (shgCode, params) =>
    api.get(
      `/epsakhi/beneficiary-recorded/by-shg/${encodeURIComponent(shgCode)}/`,
      { params },
    ),

  beneficiaryRecordedByMember: (memberCode, params) =>
    api.get(
      `/epsakhi/beneficiary-recorded/by-member/${encodeURIComponent(memberCode)}/`,
      { params },
    ),

  // CRP → Panchayats linkage
  crpLinkPanchayats: (crpId, data) =>
    api.post(
      `/epsakhi/crp/${encodeURIComponent(crpId)}/link-panchayats/`,
      data,
    ),

  crpPanchayats: (crpId, params) =>
    api.get(`/epsakhi/crp/${encodeURIComponent(crpId)}/panchayats/`, {
      params,
    }),

  crpDetailByMember: (memberCode, params) =>
    api.get(`/epsakhi/crp/by-member/${encodeURIComponent(memberCode)}/`, {
      params,
    }),

  crpDetailByUserId: (userId, params) =>
    api.get(`/epsakhi/crp/by-user-id/${encodeURIComponent(userId)}/`, {
      params,
    }),

  panchayatsUnderCrp: (crpId, params) =>
    api.get(`/epsakhi/panchayats-under-crp/${encodeURIComponent(crpId)}/`, {
      params,
    }),

  panchayatsUnderCrpByUserId: (userId, params) =>
    api.get(`/epsakhi/panchayats-under-crp/id/${encodeURIComponent(userId)}/`, {
      params,
    }),

  // UPSRLM SHG wrappers used by app (epSakhi views wrapping core UPSRLM)
  upsrlmShgList: (blockId, params) =>
    api.get(`/upsrlm-shg-list/${encodeURIComponent(blockId)}/`, {
      params,
    }),
  upsrlmShgDetail: (shgCode, params) =>
    api.get(`/upsrlm-shg-detail/${encodeURIComponent(shgCode)}/`, {
      params,
    }),
  upsrlmShgMembers: (shgCode, params) =>
    api.get(`/upsrlm-shg-members/${encodeURIComponent(shgCode)}/`, {
      params,
    }),

  //  MOU FORM CREATE (POST API)
  mouFormCreate: (data) => api.post("/epsakhi/mou-form/create/", data),
  mouFormList: (params) => api.get("/epsakhi/mou-enterprise/list/", { params }),
  mouFormDetail: (id, params) =>
    api.get(`/epsakhi/mou-form/detail/${encodeURIComponent(id)}/`, { params }),

  mouFormTargetsList: (params) => api.get("/epsakhi/mou-targets/", { params }),
};

// ------------------------
// TMS APIS (Training Management System)
// ------------------------
//
// These map to TMS.api.urls router viewsets + dashboard views.
//

export const TMS_API = {
  // 1. Master / configuration viewsets
  trainingThemes: makeCrud("/tms/training-themes/"),
  trainingSubThemes: makeCrud("/tms/training-subthemes/"),
  trainingCategories: makeCrud("/tms/training-categories/"),
  trainingTypologies: makeCrud("/tms/training-typologies/"),
  trainingTypes: makeCrud("/tms/training-types/"),
  trainingTopics: makeCrud("/tms/training-topics/"),
  tpcpCentreDetails: makeCrud("/tms/tpcp_to_centre/details/"),
  trainingPlans: makeCrud("/tms/training-plans/"),

  // ------------------------------------
  // User Management
  // ------------------------------------

  // DMMU -> List BMMU users under district
  bmmuUsers: (params) => api.get("/tms/bmmu-users/", { params }),

  // SMMU -> List all DMMU users
  dmmuUsers: (params) => api.get("/tms/dmmu-users/", { params }),

  // SMMU -> Manage user
  manageUser: (data) => api.post("/tms/manage-user/", data),

  // TMS REPORT
  trainingReports: makeCrud("/tms/cmp-training-report/"),
  // Master trainer + certificates
  masterTrainers: makeCrud("/tms/master-trainers/"),
  masterTrainerCertificates: makeCrud("/tms/master-trainer-certificates/"),

  // Training partner master + related
  trainingPartners: makeCrud("/tms/training-partners/"),
  trainingPartnerBanks: makeCrud("/tms/training-partner-banks/"),
  trainingPartnerContactPersons: makeCrud(
    "/tms/training-partner-contact-persons/",
  ),
  trainingPartnerCentres: makeCrud("/tms/training-partner-centres/"),
  trainingPartnerCentreRooms: makeCrud("/tms/training-partner-centre-rooms/"),
  tpcpCentreLinks: makeCrud("/tms/tpcp-centre-links/"),
  trainingPartnerSubmissions: makeCrud("/tms/training-partner-submissions/"),
  trainingPartnerTargets: makeCrud("/tms/training-partner-targets/"),

  // TRP user scope mapping
  trpUserScopes: makeCrud("/tms/trp-user-scopes/"),

  // Training Request workflow
  trainingRequests: makeCrud("/tms/training-requests/"),
  // Custom Training Request Deletion
  deleteTrainingRequest: (requestId) =>
    api.delete(
      `/tms/training-request/delete/${encodeURIComponent(requestId)}/`,
    ),
  // Training Request list with Filters
  trainingRequestsList: makeCrud("/tms/training-requests-list/"),

  trBeneficiaries: makeCrud("/tms/training-request-beneficiaries/"),
  trTrainers: makeCrud("/tms/training-request-trainers/"),

  // For BMMU TMS Dashboard
  trainingRequestBeneficiaries: makeCrud(
    "/tms/training-request-beneficiaries/",
  ),
  trainingRequestTrainers: makeCrud("/tms/training-request-trainers/"),

  // Batch workflow
  batches: makeCrud("/tms/batches/"),
  batchschedule: makeCrud("/tms/batch-schedules/"),
  batchMasterTrainers: makeCrud("/tms/batch-master-trainers/"),
  batchBeneficiaries: makeCrud("/tms/batch-beneficiaries/"),
  batchTrainers: makeCrud("/tms/batch-trainers/"),
  batchEkyc: makeCrud("/tms/batch-ekyc/"),
  batchAttendance: makeCrud("/tms/batch-attendance/"),
  participantAttendance: makeCrud("/tms/participant-attendance/"),
  tpBatchCostBreakups: makeCrud("/tms/tp-batch-cost-breakups/"),
  batchCosts: makeCrud("/tms/batch-costs/"),
  batchMedia: makeCrud("/tms/batch-media/"),
  batchClosureRequest: makeCrud("/tms/batch-closure-request/"),
  trClosures: makeCrud("/tms/tr-closures/"),
  batchParticipantCertificates: makeCrud(
    "/tms/batch-participant-certificates/",
  ),

  // SMMU TP Targets bulk upload
  bulkUploadTargets: {
    create: (data, config = {}) =>
      // Change 'axios.post' to 'api.post' and revert the path to start with '/tms/'
      api.post("/tms/tp-targets/bulk-upload/", data, config),
  },

  // ------------------------
  // Dashboards / reports
  // ------------------------

  bmmu: {
    dashboard: (params) => api.get("/tms/bmmu/dashboard/", { params }),
    trainingsList: (params) => api.get("/tms/bmmu/trainings-list/", { params }),
    requests: (params) => api.get("/tms/bmmu/requests/", { params }),
    requestDetail: (requestId, params) =>
      api.get(`/tms/bmmu/requests/${encodeURIComponent(requestId)}/`, {
        params,
      }),
    batchesForRequest: (requestId, params) =>
      api.get(`/tms/bmmu/requests/${encodeURIComponent(requestId)}/batches/`, {
        params,
      }),
    batchDetail: (batchId, params) =>
      api.get(`/tms/bmmu/batches/${encodeURIComponent(batchId)}/`, { params }),
    batchAttendanceByDate: (batchId, params) =>
      api.get(
        `/tms/bmmu/batches/${encodeURIComponent(batchId)}/attendance-by-date/`,
        { params },
      ),
  },

  smmu: {
    dashboard: (params) => api.get("/tms/smmu/dashboard/", { params }),
    requests: (params) => api.get("/tms/smmu/requests/", { params }),
    requestDetail: (requestId, params) =>
      api.get(`/tms/smmu/requests/${encodeURIComponent(requestId)}/`, {
        params,
      }),
    partnerTargets: (params) =>
      api.get("/tms/smmu/partner-targets/", { params }),
  },

  dmmu: {
    dashboard: (params) => api.get("/tms/dmmu/dashboard/", { params }),
    requests: (params) => api.get("/tms/dmmu/requests/", { params }),
    requestDetail: (requestId, params) =>
      api.get(`/tms/dmmu/requests/${encodeURIComponent(requestId)}/`, {
        params,
      }),
    batchDetail: (batchId, params) =>
      api.get(`/tms/dmmu/batches/${encodeURIComponent(batchId)}/detail/`, {
        params,
      }),
    batchAttendanceByDate: (batchId, params) =>
      api.get(
        `/tms/dmmu/batches/${encodeURIComponent(batchId)}/attendance-by-date/`,
        { params },
      ),
  },

  firstLogin: {
    status: () => api.get("/tms/first-login/change-password/"),
    verifyPassword: (data) =>
      api.post("/tms/first-login/password-verify/", data),
    changePassword: (data) =>
      api.post("/tms/first-login/change-password/", data),
  },

  // TMS V2 APIs

  // Find Training Partner acc to latest target for TR creation
  trainingPartnerByTarget: (params) =>
    api.get("/tms/tp/by-target/", { params }),

  // ------------------------------------
  // TP & DTP User Management
  // ------------------------------------
  userManagement: {
    // List users (params: { type: 'dtp' } or { type: 'tpcp' })
    list: (params) => api.get("/tms/tp/user-management/", { params }),

    // Get single user details
    detail: (userId) =>
      api.get(`/tms/tp/user-management/${encodeURIComponent(userId)}/`),

    // Update username and/or assigned centres
    update: (userId, data) =>
      api.put(`/tms/tp/user-management/${encodeURIComponent(userId)}/`, data),

    // Delete user
    destroy: (userId) =>
      api.delete(`/tms/tp/user-management/${encodeURIComponent(userId)}/`),

    // Reset password & remove first login tracker
    resetPassword: (userId) =>
      api.post(
        `/tms/tp/user-management/${encodeURIComponent(userId)}/reset-password/`,
      ),
  },

  batchCreator: {
    // Get Eligible Trainees
    trainees: (params) => api.get("/tms/batch-creator/trainees/", { params }),

    // Create Batch (Separate / Combined)
    create: (data) => api.post("/tms/batch-creator/create/", data),

    // Update Batch
    update: (batchId, data) =>
      api.put(
        `/tms/batch-creator/update/${encodeURIComponent(batchId)}/`,
        data,
      ),

    // Delete Batch
    delete: (batchId) =>
      api.delete(`/tms/batch-creator/delete/${encodeURIComponent(batchId)}/`),
  },

  // partner ID API
  parentPartner: (params = {}) =>
    api.get("/tms/dtp/parent-partner/", { params }),

  // Batch Detail V2
  batchDetailV2: (batchId) =>
    api.get(
      `/tms/batches/comprehensive-detail/${encodeURIComponent(batchId)}/`,
    ),
};

// ------------------------
// LDMS APIS (Lakhpati Didi Management System)
// ------------------------
//
// These map to LDMS.api.urls router viewsets, analytics + dashboard views.
//

export const LDMS_API = {
  // Map Analytics via UPSRLM proxy (Total SHGs, VOs, CLFs)
  upsrlmAnalytics: (params) =>
    api.get(`/ldms/map-analytics/`, {
      params,
    }),

  // Departments and Schemes
  departments: (params) =>
    api.get(`/ldms/departments/`, {
      params,
    }),

  schemes: (params) =>
    api.get(`/ldms/schemes/`, {
      params,
    }),

  // Support Mapping and Capturing
  recorPLDS: makeCrud("/ldms/recorded-plds/"),
  SBTypes: makeCrud("/ldms/sbtypes/"),
  SupportBuckets: makeCrud("/ldms/support-buckets/"),
  SBTrainings: makeCrud("/ldms/training-supports/"),
  BucketApprovals: makeCrud("/ldms/bucket-approvals/"),
  BenefReport: (params) =>
    api.get(`/ldms/reports/recorded-beneficiaries/`, {
      params,
    }),
};

// ------------------------
// NEW API add-on Section
// ------------------------

// ------------------------
// Default export
// ------------------------

export default api;
