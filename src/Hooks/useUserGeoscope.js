// src/Hooks/useUserGeoscope.js
import { useEffect, useState } from "react";
import { LOOKUP_API } from "../api/axios";

/* ================= HOOK 1: FETCH RAW GEOSCOPE DATA ================= */
export default function useUserGeoscope() {
  const [geoScope, setGeoScope] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id");
  const roleId = localStorage.getItem("user_role_id");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await LOOKUP_API.userGeoscopeByUserId(userId);
        console.log("==================================");
        console.log("USER ID :", userId);
        console.log("ROLE ID :", roleId);
        console.log("GEOSCOPE RESPONSE :", response.data);
        console.log("==================================");
        setGeoScope({
          roleId,
          ...(response?.data || {}),
        });
      } catch (err) {
        console.error("User geoscope fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, roleId]);

  return {
    geoScope,
    loading,
  };
}

/* ================= HOOK 2: MANAGE ZONE FORM FILTER SCOPES ================= */
export function useCanteenFilters({
  district,
  setDistrict,
  block,
  setBlock,
  geoScope,
  geoLoading,
  extractListing,
}) {
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const roleId = Number(localStorage.getItem("user_role_id"));

  const isBMM = roleId === 1;
  const isDMM = roleId === 2;
  const isSMM = roleId === 3;

  const safeFirst = (arr) => (Array.isArray(arr) && arr.length ? arr[0] : null);

  /* ================= 1. FETCH & RESTRICT DISTRICTS DROPDOWN ================= */
  useEffect(() => {
    if (geoLoading) return;

    const fetchInitialDistricts = async () => {
      try {
        setLoadingFilters(true);
        const response = await LOOKUP_API.districts.list({ page_size: 200 });
        let fetchedDistricts = extractListing(response);

        const assignedDistrictId =
          geoScope?.districts?.[0] ||
          geoScope?.district ||
          safeFirst(geoScope?.districts);

        if (geoScope) {
          if (isBMM || isDMM) {
            if (assignedDistrictId) {
              fetchedDistricts = fetchedDistricts.filter(
                (d) => String(d.district_id) === String(assignedDistrictId),
              );
            }
          } else if (isSMM) {
            const allowedDistricts = geoScope.districts || [];
            if (allowedDistricts.length > 0) {
              fetchedDistricts = fetchedDistricts.filter(
                (d) =>
                  allowedDistricts.includes(Number(d.district_id)) ||
                  allowedDistricts.includes(String(d.district_id)),
              );
            }
          }
        }
        setDistricts(fetchedDistricts);
      } catch (err) {
        console.error("Error loading master districts scope:", err);
        setDistricts([]);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchInitialDistricts();
  }, [geoScope, geoLoading, roleId]);

  /* ================= 2. ENFORCE AUTO-FILL AND SYNC RULES ================= */
  useEffect(() => {
    if (geoLoading || !geoScope) return;

    const assignedDistrictId =
      geoScope.districts?.[0] ||
      geoScope.district ||
      safeFirst(geoScope.districts) ||
      "";
    const assignedBlockId =
      geoScope.blocks?.[0] ||
      geoScope.block ||
      safeFirst(geoScope.blocks) ||
      "";

    if (isBMM) {
      if (
        assignedDistrictId &&
        String(district) !== String(assignedDistrictId)
      ) {
        setDistrict(String(assignedDistrictId));
      }
      if (assignedBlockId && String(block) !== String(assignedBlockId)) {
        setBlock(String(assignedBlockId));
      }
    } else if (isDMM) {
      if (
        assignedDistrictId &&
        String(district) !== String(assignedDistrictId)
      ) {
        setDistrict(String(assignedDistrictId));
      }
    }
  }, [geoScope, geoLoading, roleId, district, block]);

  /* ================= 3. FETCH & RESTRICT BLOCKS DROPDOWN ================= */
  useEffect(() => {
    if (geoLoading) return;

    const fetchBlocksScope = async () => {
      if (!district) {
        setBlocks([]);
        return;
      }

      try {
        const response = await LOOKUP_API.blocksByDistrict(district);
        let fetchedBlocks = extractListing(response);

        if (geoScope) {
          if (isBMM) {
            const assignedBlockId =
              geoScope.block_id || geoScope.block || safeFirst(geoScope.blocks);
            if (assignedBlockId) {
              fetchedBlocks = fetchedBlocks.filter(
                (b) => String(b.block_id) === String(assignedBlockId),
              );
            }
          } else if (isDMM) {
            const allowedBlocks = geoScope.blocks || [];
            if (allowedBlocks.length > 0) {
              fetchedBlocks = fetchedBlocks.filter(
                (b) =>
                  allowedBlocks.includes(Number(b.block_id)) ||
                  allowedBlocks.includes(String(b.block_id)),
              );
            }
          }
        }
        setBlocks(fetchedBlocks);
      } catch (err) {
        console.error("Error running contextual blocks request:", err);
        setBlocks([]);
      }
    };

    fetchBlocksScope();
  }, [district, geoScope, geoLoading, roleId]);

  return {
    districts,
    blocks,
    isBMM,
    isDMM,
    isSMM,
    loading: loadingFilters,
  };
}
