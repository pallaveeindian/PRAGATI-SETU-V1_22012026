// src/pages/PlanningDeptUpdate/utils/mappingData.js
import apiPayloadCSV from '../assets/abapi_data/api_payload.csv';
import blocksListCSV from '../assets/abapi_data/blocks_list.csv';
import dataPeriodCSV from '../assets/abapi_data/dataperiod.csv';
import deptListCSV from '../assets/abapi_data/dept_list.csv';
import districtsListCSV from '../assets/abapi_data/districts_list.csv';
import indicatorCodesCSV from '../assets/abapi_data/indicatorcodes_list.csv';
import periodicityCSV from '../assets/abapi_data/periodicity.csv';

// In-memory storage for our parsed CSV data
let isInitialized = false;
const store = {
    payloadTemplate: [],
    blocks: [],
    districts: [],
    indicators: [],
    departments: [],
    periods: [],
    months: [],
    apiKey: ""
};

/**
 * A robust CSV Parser that correctly handles commas inside quotes.
 * (e.g., for the Disclaimer column)
 */
const parseCSV = (csvText) => {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"' && insideQuotes && nextChar === '"') {
            currentCell += '"';
            i++; // Skip escaped quote
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') i++; // Skip \n in \r\n
            currentRow.push(currentCell.trim());
            
            // Only add row if it's not completely empty
            if (currentRow.some(cell => cell !== '')) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }
    // Push the last cell/row if file doesn't end with a newline
    if (currentCell !== '' || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== '')) {
            rows.push(currentRow);
        }
    }
    
    // Convert array of arrays to array of objects using first row as headers
    const headers = rows[0];
    const dataObjects = [];
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const obj = {};
        headers.forEach((header, index) => {
            if (header) {
                obj[header.trim()] = row[index] !== undefined ? row[index] : null;
            }
        });
        dataObjects.push(obj);
    }
    
    return dataObjects;
};

/**
 * Utility to fetch and parse a single CSV
 */
const fetchAndParse = async (csvFileUrl) => {
    try {
        const response = await fetch(csvFileUrl);
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error(`Error loading CSV from ${csvFileUrl}:`, error);
        return [];
    }
};

/**
 * 1. INITIALIZATION FUNCTION
 * Call this once when the application loads (e.g., in PDUContext or PDULayout)
 */
export const initializeMappingData = async () => {
    if (isInitialized) return true;

    try {
        const [
            payloadData,
            blocksData,
            districtsData,
            indicatorsData,
            departmentsData,
            periodsData,
            monthsData
        ] = await Promise.all([
            fetchAndParse(apiPayloadCSV),
            fetchAndParse(blocksListCSV),
            fetchAndParse(districtsListCSV),
            fetchAndParse(indicatorCodesCSV),
            fetchAndParse(deptListCSV),
            fetchAndParse(periodicityCSV),
            fetchAndParse(dataPeriodCSV)
        ]);

        store.payloadTemplate = payloadData;
        store.blocks = blocksData;
        store.districts = districtsData;
        store.indicators = indicatorsData;
        store.departments = departmentsData;
        store.periods = periodsData;
        store.months = monthsData;

        // Extract API key from the payload csv (it was stored at the bottom)
        const rawPayloadText = await (await fetch(apiPayloadCSV)).text();
        const apiKeyMatch = rawPayloadText.match(/API KEY:\s*([A-F0-9]+)/);
        if (apiKeyMatch && apiKeyMatch[1]) {
            store.apiKey = apiKeyMatch[1].trim();
        }

        isInitialized = true;
        console.log("Mapping Data initialized successfully.", store);
        return true;
    } catch (error) {
        console.error("Failed to initialize mapping data:", error);
        return false;
    }
};


/**
 * 2. GETTER FUNCTIONS
 * Use these across your components and payloadBuilders to get exact mapped data.
 */

// --- BLOCK MAPPINGS ---

export const getBlockByLokosId = (lokosBlockId) => {
    const block = store.blocks.find(b => String(b.lokos_block_id) === String(lokosBlockId));
    if (!block) return null;
    
    return {
        apiBlockCode: block.api_block_code,
        blockNameEn: block.block_name,
        blockNameHi: block['Block Name (Hindi)'],
        lokosId: block.lokos_block_id
    };
};

export const getApiBlockCode = (lokosBlockId) => {
    const block = getBlockByLokosId(lokosBlockId);
    return block ? block.apiBlockCode : null;
};

// --- DISTRICT MAPPINGS ---

export const getDistrictByLokosId = (lokosDistrictId) => {
    const district = store.districts.find(d => String(d.lokos_district_id) === String(lokosDistrictId));
    if (!district) return null;

    return {
        apiDistrictCode: district.api_district_code,
        districtNameEn: district.district_name,
        districtNameHi: district['Ditrsict Name(Hindi)'],
        lokosId: district.lokos_district_id
    };
};

export const getApiDistrictCode = (lokosDistrictId) => {
    const district = getDistrictByLokosId(lokosDistrictId);
    return district ? district.apiDistrictCode : null;
};

// --- INDICATOR MAPPINGS (0511, 0512) ---

export const getIndicatorDetails = (indicatorCode) => {
    const indicator = store.indicators.find(i => String(i.IndicatorCode) === String(indicatorCode));
    if (!indicator) return null;

    return {
        indicatorCode: indicator.IndicatorCode,
        indicatorName: indicator['Indicator Name'],
        progHeadCode: indicator['Indicator Head Code'],
        periodicityId: indicator.Periodicity,
        leadDeptId: indicator.LeadDeptNameID,
        indicatorType: indicator.IndicatorType,
        weightage: indicator.weightagePercente
    };
};

// --- DEPARTMENT & DATE MAPPINGS ---

export const getDepartmentDetails = (deptCode) => {
    const dept = store.departments.find(d => String(d.api_dept_code) === String(deptCode));
    return dept ? {
        deptCode: dept.api_dept_code,
        deptNameEn: dept.dept_name,
        deptNameHi: dept['Department Name (Hindi)']
    } : null;
};

export const getMonthDetails = (monthCode) => {
    const month = store.months.find(m => String(m.api_month_code) === String(monthCode));
    return month ? {
        monthCode: month.api_month_code,
        monthNameEn: month.month_name,
        monthNameHi: month['Month (Hindi)']
    } : null;
};

export const getPeriodicityDetails = (periodCode) => {
    const period = store.periods.find(p => String(p.api_period_code) === String(periodCode));
    return period ? {
        periodCode: period.api_period_code,
        periodNameEn: period.periodicity,
        periodNameHi: period['Periodicity (Hindi)']
    } : null;
};

// --- PAYLOAD HELPERS ---

export const getDisclaimerTemplate = () => {
    // Finds the disclaimer text from the payload template csv
    const row = store.payloadTemplate.find(r => r['Column Name'] === 'Disclaimer');
    return row ? row.Example : null;
};

export const getPlanningDeptApiKey = () => {
    return store.apiKey;
};

export const getAllAspirationalBlocks = () => store.blocks;