import React, { useState, useEffect } from "react";
import { LOOKUP_API } from "../../../../api/axios.js";
import { useAuth } from "../../../../contexts/AuthContext.jsx";
import { getCanonicalRole } from "../../../../utils/roleUtils.js";

// --- Helper functions ---
const extractLookupList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.results)) return res.data.results;
  if (Array.isArray(res?.data)) return res.data;
  if (res?.data && typeof res.data === "object") {
    const nested = Object.values(res.data).find(Array.isArray);
    return nested || [];
  }
  return [];
};

const resolveName = (obj, keys = []) => {
  if (typeof obj === "string") return obj;
  if (!obj || typeof obj !== "object") return null;
  for (const k of keys) {
    if (obj[k]) return obj[k];
  }
  for (const v of Object.values(obj)) {
    if (typeof v === "string") {
      const s = v.trim();
      if (s && !/^\d+$/.test(s)) return s;
    }
  }
  return null;
};

const normalizeValue = (value) => (value ?? "").toString().trim().toLowerCase();

export default function DmmApplicationFilters({ 
  applications = [],       // 🟢 Parent se raw data receive hoga
  setFilteredApps,         // 🟢 Parent ko filtered data bhejne ke liye
  onApplyFilters = () => {}, 
  onClearFilters = () => {} 
}) {
  const { user } = useAuth();
  const role = getCanonicalRole(user || {});
  const isDmmuUser = role === "dmmu" || String(user?.role_name || "").toLowerCase().includes("dmmu");

  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [filters, setFilters] = useState({ 
    districtId: "", district: "", blockId: "", block: "", 
    panchayatId: "", panchayat: "", villageId: "", village: "", 
    socialCategory: "", religion: "" 
  });

  // 🟢 CORE FILTERING LOGIC (Sirf Button Click Par Chalega)
  const executeFiltering = (currentFilters) => {
    if (!applications || !setFilteredApps) return;

    const result = applications.filter((app) => {
      const matchesDistrict = !currentFilters.district || normalizeValue(app.district) === normalizeValue(currentFilters.district);
      const matchesBlock = !currentFilters.block || normalizeValue(app.block) === normalizeValue(currentFilters.block);
      const matchesPanchayat = !currentFilters.panchayat || normalizeValue(app.panchayat) === normalizeValue(currentFilters.panchayat);
      const matchesVillage = !currentFilters.village || normalizeValue(app.village) === normalizeValue(currentFilters.village);
      const matchesSocialCategory = !currentFilters.socialCategory || normalizeValue(app.socialCategory) === normalizeValue(currentFilters.socialCategory);
      const matchesReligion = !currentFilters.religion || normalizeValue(app.religion) === normalizeValue(currentFilters.religion);

      return matchesDistrict && matchesBlock && matchesPanchayat && matchesVillage && matchesSocialCategory && matchesReligion;
    });

    setFilteredApps(result);
  };

  // Load All Blocks
  useEffect(() => {
    let isMounted = true;
    async function loadBlocks() {
      try {
        const districtId = filters.districtId || "";
        let res;
        if (districtId) {
          res = await LOOKUP_API.blocksByDistrict(districtId);
        } else {
          res = await LOOKUP_API.blocks.list({ page_size: 1000 });
        }
        if (isMounted) setBlocks(extractLookupList(res));
      } catch (err) {
        if (isMounted) setBlocks([]);
      }
    }
    loadBlocks();
    return () => { isMounted = false; };
  }, [filters.districtId]);

  // Load user geoscope (Lock District for DMMU)
  useEffect(() => {
    let isMounted = true;
    async function loadUserGeoscope() {
      if (!user?.id) return;
      try {
        const cached = JSON.parse(localStorage.getItem("ps_user_geoscope") || "null");
        const geoscope = cached || (await LOOKUP_API.userGeoscopeByUserId(user.id))?.data;
        try { localStorage.setItem("ps_user_geoscope", JSON.stringify(geoscope)); } catch (e) {}

        if (isMounted && isDmmuUser) {
          const geoDistrictId = geoscope && (geoscope.district_id || (Array.isArray(geoscope.districts) && (geoscope.districts[0]?.district_id || geoscope.districts[0]?.id || geoscope.districts[0])));
          const candidateFromUser = user?.district_id || user?.districtId || user?.api_district_code || user?.lokos_district_id || user?.district || null;
          const districtId = geoDistrictId || candidateFromUser || null;

          if (districtId) {
            let districtObj = null;
            try {
              const dr = await LOOKUP_API.districts.retrieve(districtId);
              districtObj = dr?.data || dr;
            } catch (e) {
              try {
                const listRes = await LOOKUP_API.districts.list?.({ page_size: 1000, id: districtId });
                const listItems = extractLookupList(listRes);
                if (listItems && listItems.length > 0) districtObj = listItems[0];
              } catch (e2) {}
              if (!districtObj) districtObj = { id: districtId, district_name_en: String(districtId) };
            }

            const districtName = resolveName(districtObj, ["district_name_en", "district_name", "name", "label"]) || String(districtId);
            const canonical = { ...districtObj, id: String(districtId), district_id: String(districtId), district_name_en: districtName, district_name: districtName };

            setFilters((prev) => ({ ...prev, districtId: String(districtId), district: districtName, blockId: "", block: "", panchayatId: "", panchayat: "", villageId: "", village: "" }));
            setDistricts([canonical]);
          }
        }
      } catch (err) {}
    }
    loadUserGeoscope();
    return () => { isMounted = false; };
  }, [user?.id, isDmmuUser]);

  // Load Panchayats when Block changes
  useEffect(() => {
    if (!filters.blockId) { setPanchayats([]); setVillages([]); return; }
    let isMounted = true;
    async function loadPanchayats() {
      try {
        const res = await LOOKUP_API.panchayatsByBlock(filters.blockId);
        if (isMounted) { setPanchayats(extractLookupList(res)); setVillages([]); }
      } catch (err) {
        if (isMounted) { setPanchayats([]); setVillages([]); }
      }
    }
    loadPanchayats();
    return () => { isMounted = false; };
  }, [filters.blockId]);

  // Load Districts (all)
  useEffect(() => {
    if (isDmmuUser) return;
    let isMounted = true;
    async function loadDistricts() {
      try {
        const params = { page_size: 1000, fields: "district_name_en,district_name,api_district_code,id" };
        const res = await LOOKUP_API.districts.list?.(params) || await LOOKUP_API.districts?.list?.();
        if (isMounted) setDistricts(extractLookupList(res));
      } catch (err) {
        if (isMounted) setDistricts([]);
      }
    }
    loadDistricts();
    return () => { isMounted = false; };
  }, [isDmmuUser]);

  // Load Villages when Panchayat changes
  useEffect(() => {
    if (!filters.panchayatId) { setVillages([]); return; }
    let isMounted = true;
    async function loadVillages() {
      try {
        const res = await LOOKUP_API.villagesByPanchayat(filters.panchayatId);
        if (isMounted) setVillages(extractLookupList(res));
      } catch (err) {
        if (isMounted) setVillages([]);
      }
    }
    loadVillages();
    return () => { isMounted = false; };
  }, [filters.panchayatId]);

  // 🟢 HANDLERS (Filtering only happens here)
  const handleApplyClick = () => {
    executeFiltering(filters);
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    const baseClearedFilters = { district: "", block: "", panchayat: "", village: "" };
    const baseResetFilters = { districtId: "", district: "", blockId: "", block: "", panchayatId: "", panchayat: "", villageId: "", village: "", socialCategory: "", religion: "" };

    const districtValue = filters.district || resolveName(districts[0], ["district_name_en", "district_name", "name", "label"]) || "";
    const districtIdValue = filters.districtId || (districts[0] && (districts[0].id || districts[0].district_id || districts[0].districtId || districts[0].api_district_code || ""));

    const resetFilters = isDmmuUser && districtIdValue
      ? { ...baseResetFilters, districtId: districtIdValue, district: districtValue }
      : baseResetFilters;

    setFilters(resetFilters);
    setPanchayats([]);
    setVillages([]);
    
    // 🟢 Reset karne par poora array wapas bhej do (Data hide nahi hoga)
    if (setFilteredApps && applications) {
      setFilteredApps(applications);
    }
    
    onClearFilters(baseClearedFilters);
  };

  const handleBlockChange = (e) => {
    setFilters((prev) => ({ ...prev, blockId: e.target.value, block: e.target.selectedOptions[0]?.text || "", panchayatId: "", panchayat: "", villageId: "", village: "" }));
    setPanchayats([]); setVillages([]);
  };

  const handlePanchayatChange = (e) => {
    setFilters((prev) => ({ ...prev, panchayatId: e.target.value, panchayat: e.target.selectedOptions[0]?.text || "", villageId: "", village: "" }));
    setVillages([]);
  };

  const handleVillageChange = (e) => {
    setFilters((prev) => ({ ...prev, villageId: e.target.value, village: e.target.selectedOptions[0]?.text || "" }));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    const districtName = e.target.selectedOptions[0]?.text || "";
    setFilters((prev) => ({ ...prev, districtId, district: districtName, blockId: "", block: "", panchayatId: "", panchayat: "", villageId: "", village: "" }));
    setPanchayats([]); setVillages([]);
  };

  return (
    <div style={styles.filterCard}>
      <h4 style={{ margin: "0 0 10px 0", color: "#2F5FB3" }}>Filter Applications</h4>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        
        {isDmmuUser && filters.districtId ? (
          <div style={styles.lockedField}>
            <span style={styles.lockedLabel}>District</span>
            <span style={styles.lockedValue}>{filters.district || (districts[0] && (districts[0].district_name_en || districts[0].district_name || districts[0].name)) || "-"}</span>
          </div>
        ) : (
          <select style={styles.select} value={filters.districtId} onChange={handleDistrictChange}>
            <option value="">All Districts</option>
            {districts.map((d, i) => {
              const districtId = typeof d === "string" ? d : (d.id || d.district_id || d.districtId || d.api_district_code || d.lokos_district_id || String(i));
              const districtName = typeof d === "string" ? d : (d.district_name_en || d.district_name || d.name || d.name_en || d.label || d.title || String(d.api_district_code || d.id || i));
              return <option key={districtId} value={districtId}>{districtName}</option>;
            })}
          </select>
        )}

        <select style={styles.select} value={filters.blockId} onChange={handleBlockChange}>
          <option value="">All Blocks</option>
          {blocks.map((b, i) => {
            const blockId = typeof b === "string" ? b : (b.id || b.block_id || b.blockId || i);
            const blockName = resolveName(b, ["block_name_en", "name_en", "block_name", "name", "blockName", "label", "title"]) || String(blockId);
            return <option key={blockId} value={blockId}>{blockName}</option>;
          })}
        </select>

        <select style={styles.select} value={filters.panchayatId} onChange={handlePanchayatChange} disabled={!filters.blockId || panchayats.length === 0}>
          <option value="">All Panchayats</option>
          {panchayats.map((p, i) => {
            const panchayatId = typeof p === "string" ? p : (p.id || p.panchayat_id || p.panchayatId || i);
            const panchayatName = resolveName(p, ["panchayat_name_en", "name_en", "panchayat_name", "name", "panchayatName", "label", "title"]) || String(panchayatId);
            return <option key={panchayatId} value={panchayatId}>{panchayatName}</option>;
          })}
        </select>

        <select style={styles.select} value={filters.villageId} onChange={handleVillageChange} disabled={!filters.panchayatId || villages.length === 0}>
          <option value="">All Villages</option>
          {villages.map((v, i) => {
            const villageId = typeof v === "string" ? v : (v.id || v.village_id || v.villageId || i);
            const villageName = resolveName(v, ["village_name_en", "name_en", "village_name", "name", "villageName", "label", "title"]) || String(villageId);
            return <option key={villageId} value={villageId}>{villageName}</option>;
          })}
        </select>

        <select style={styles.select} value={filters.socialCategory} onChange={(e) => setFilters((prev) => ({ ...prev, socialCategory: e.target.value }))}>
          <option value="">All Social Categories</option>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>

        <select style={styles.select} value={filters.religion} onChange={(e) => setFilters((prev) => ({ ...prev, religion: e.target.value }))}>
          <option value="">All Religions</option>
          <option value="Hindu">Hindu</option>
          <option value="Muslim">Muslim</option>
          <option value="Christian">Christian</option>
          <option value="Sikh">Sikh</option>
        </select>

        <button style={styles.resetBtn} onClick={handleResetFilters}>Reset Filters</button>
        <button style={{...styles.resetBtn, backgroundColor: "#2563eb", color: "white"}} onClick={handleApplyClick}>Apply Filters</button>
      </div>
    </div>
  );
}

const styles = {
  filterCard: { backgroundColor: "white", padding: "15px 20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: "4px solid #FF961C" },
  select: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", outline: "none", backgroundColor: "#f9fafb", color: "#333", fontSize: "14px", flex: 1, minWidth: "150px" },
  lockedField: { display: "flex", flexDirection: "column", gap: "4px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", minWidth: "180px", flex: 1 },
  lockedLabel: { fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" },
  lockedValue: { fontSize: "14px", fontWeight: "600", color: "#0f172a" },
  resetBtn: { padding: "8px 15px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", color: "#475569", fontWeight: "bold" },
};