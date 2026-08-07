import React, { useState, useEffect, useContext } from "react";
import { LOOKUP_API } from "../../../api/axios.js";
import { AuthContext } from "../../../contexts/AuthContext";
import { getCanonicalRole } from "../../../utils/roleUtils";

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

export default function ApplicationFilters({ 
  filters, 
  setFilters, 
  applications = [],       
  setFilteredApps,         
  onApply = () => {}, 
  onReset = () => {} 
}) {
  const { user } = useContext(AuthContext);
  const role = getCanonicalRole(user || {});
  const isBmmuUser =
    role === "bmmu" ||
    Number(user?.role_id ?? user?.role) === 1 ||
    String(user?.role_name || user?.role || "").toLowerCase().includes("bmmu");

  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);
  
  const [isBlockLocked, setIsBlockLocked] = useState(false);
  const [lockedBlock, setLockedBlock] = useState(null);

  // 🟢 FILTERING LOGIC (Sirf Button Click Par Chalega)
  const executeFiltering = (currentFilters) => {
    if (!applications || !setFilteredApps) return;

    const result = applications.filter((app) => {
      const matchesBlock = !currentFilters.block || normalizeValue(app.block) === normalizeValue(currentFilters.block);
      const matchesPanchayat = !currentFilters.panchayat || normalizeValue(app.panchayat) === normalizeValue(currentFilters.panchayat);
      const matchesVillage = !currentFilters.village || normalizeValue(app.village) === normalizeValue(currentFilters.village);
      const matchesSocialCategory = !currentFilters.socialCategory || normalizeValue(app.socialCategory) === normalizeValue(currentFilters.socialCategory);
      const matchesReligion = !currentFilters.religion || normalizeValue(app.religion) === normalizeValue(currentFilters.religion);

      return matchesBlock && matchesPanchayat && matchesVillage && matchesSocialCategory && matchesReligion;
    });

    setFilteredApps(result);
  };

  // Load BMMU Geoscope and Lock Block
  useEffect(() => {
    let isMounted = true;
    async function loadUserGeoscope() {
      if (!user?.id) return;
      try {
        const cached = JSON.parse(localStorage.getItem("ps_user_geoscope") || "null");
        const geoscope = cached || (await LOOKUP_API.userGeoscopeByUserId(user.id))?.data;
        try { localStorage.setItem("ps_user_geoscope", JSON.stringify(geoscope)); } catch (e) {}

        if (isMounted && isBmmuUser) {
          const geoBlockId = geoscope && (geoscope.block_id || (Array.isArray(geoscope.blocks) && (geoscope.blocks[0]?.block_id || geoscope.blocks[0]?.id || geoscope.blocks[0])));
          const candidateFromUser = user?.block_id || user?.blockId || user?.api_block_code || user?.lokos_block_id || user?.block || null;
          const blockId = geoBlockId || candidateFromUser || null;

          if (blockId) {
            let blockObj = null;
            try {
              const br = await LOOKUP_API.blocks.retrieve(blockId);
              blockObj = br?.data || br;
            } catch (e) {}

            if (!blockObj || !resolveName(blockObj, ["block_name_en", "block_name", "name"])) {
              try {
                const listRes = await LOOKUP_API.blocks.list({ page_size: 1000 });
                const allBlocks = extractLookupList(listRes);
                const foundBlock = allBlocks.find(b => 
                  String(b.id) === String(blockId) || String(b.block_id) === String(blockId) || String(b.api_block_code) === String(blockId)
                );
                if (foundBlock) blockObj = foundBlock;
              } catch (e2) {}
            }

            if (!blockObj) blockObj = { id: blockId, block_name_en: String(blockId) };

            const blockName = resolveName(blockObj, ["block_name_en", "block_name", "name", "blockName", "label"]) || String(blockId);
            const canonical = { ...blockObj, id: String(blockId), block_id: String(blockId), block_name_en: blockName, block_name: blockName, name: blockName };

            if (isMounted) {
              setLockedBlock(canonical);
              setIsBlockLocked(true);
              setBlocks([canonical]); 
              
              const newFilters = { 
                ...filters, 
                blockId: String(blockId), 
                block: blockName !== String(blockId) ? blockName : filters.block, 
                panchayatId: "", panchayat: "", villageId: "", village: "" 
              };
              
              setFilters(newFilters);
              // 🔴 NOTE: Yahan se executeFiltering(newFilters) hata diya gaya hai.
              // Taki jab tak user "Apply" na kare, data hide na ho.
            }
          }
        }
      } catch (err) {
        if (isMounted) setIsBlockLocked(false);
      }
    }
    loadUserGeoscope();
    return () => { isMounted = false; };
  }, [user?.id, isBmmuUser]);

  // Load All Blocks (For Non-BMMU)
  useEffect(() => {
    if (isBmmuUser) return;
    let isMounted = true;
    async function loadBlocks() {
      try {
        const res = await LOOKUP_API.blocks.list({ page_size: 1000 });
        if (isMounted) setBlocks(extractLookupList(res));
      } catch (err) {
        if (isMounted) setBlocks([]);
      }
    }
    loadBlocks();
    return () => { isMounted = false; };
  }, [isBmmuUser]);

  // Load Panchayats
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

  // Load Villages
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

  // 🟢 HANDLERS (Sirf tab data filter hoga)
  const handleApplyClick = () => {
    executeFiltering(filters);
    onApply(filters);
  };

  const handleResetFilters = () => {
    const nextFilters = { blockId: "", block: "", panchayatId: "", panchayat: "", villageId: "", village: "", socialCategory: "", religion: "" };
    setFilters(nextFilters);
    setPanchayats([]);
    setVillages([]);
    
    // Reset karne pe saara data wapas show hoga
    if (setFilteredApps && applications) {
      setFilteredApps(applications);
    }
    onReset(nextFilters);
  };

  const handleBlockChange = (e) => {
    setFilters((prev) => ({ ...prev, blockId: e.target.value, block: e.target.selectedOptions[0]?.text || "", panchayatId: "", panchayat: "", villageId: "", village: "" }));
  };

  const handlePanchayatChange = (e) => {
    setFilters((prev) => ({ ...prev, panchayatId: e.target.value, panchayat: e.target.selectedOptions[0]?.text || "", villageId: "", village: "" }));
  };

  const handleVillageChange = (e) => {
    setFilters((prev) => ({ ...prev, villageId: e.target.value, village: e.target.selectedOptions[0]?.text || "" }));
  };

  const visibleBlocks = isBmmuUser && isBlockLocked && lockedBlock ? [lockedBlock] : blocks;

  return (
    <div style={styles.filterCard}>
      <h4 style={{ margin: "0 0 10px 0", color: "#2F5FB3" }}>Filter Applications</h4>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        
        {isBmmuUser && isBlockLocked ? (
          <div style={styles.lockedField}>
            <span style={styles.lockedLabel}>Block</span>
            <span style={styles.lockedValue}>
              {(filters.block !== String(filters.blockId) ? filters.block : null) || lockedBlock?.name || lockedBlock?.block_name_en || "Assigned Block"}
            </span>
          </div>
        ) : (
          <select style={styles.select} value={filters.blockId} onChange={handleBlockChange}>
            <option value="">All Blocks</option>
            {visibleBlocks.map((b, i) => {
              const blockId = typeof b === "string" ? b : (b.id || b.block_id || i);
              const blockName = resolveName(b, ["block_name_en", "name", "label"]) || String(blockId);
              return <option key={blockId} value={blockId}>{blockName}</option>;
            })}
          </select>
        )}

        <select style={styles.select} value={filters.panchayatId} onChange={handlePanchayatChange} disabled={!filters.blockId || panchayats.length === 0}>
          <option value="">All Panchayats</option>
          {panchayats.map((p, i) => {
            const panchayatId = typeof p === "string" ? p : (p.id || p.panchayat_id || i);
            const panchayatName = resolveName(p, ["panchayat_name_en", "name", "label"]) || String(panchayatId);
            return <option key={panchayatId} value={panchayatId}>{panchayatName}</option>;
          })}
        </select>

        <select style={styles.select} value={filters.villageId} onChange={handleVillageChange} disabled={!filters.panchayatId || villages.length === 0}>
          <option value="">All Villages</option>
          {villages.map((v, i) => {
            const villageId = typeof v === "string" ? v : (v.id || v.village_id || i);
            const villageName = resolveName(v, ["village_name_en", "name", "label"]) || String(villageId);
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

        <button style={styles.applyBtn} type="button" onClick={handleApplyClick}>Apply Filters</button>
        <button style={styles.resetBtn} type="button" onClick={handleResetFilters}>Reset Filters</button>
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
  applyBtn: { padding: "8px 15px", backgroundColor: "#2F5FB3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 2px 4px rgba(47, 95, 179, 0.2)" },
  resetBtn: { padding: "8px 15px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", color: "#475569", fontWeight: "bold" },
};