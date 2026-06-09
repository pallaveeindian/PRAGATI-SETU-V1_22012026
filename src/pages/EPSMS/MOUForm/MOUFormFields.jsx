import React, { useState, useEffect } from "react";
import { EPSAKHI_API, LOOKUP_API } from "../../../api/axios";

// =======================================================
// CONSTANTS & LOOKUP DATA
// =======================================================
const ENTERPRISE_TYPE_TREE = [
  {
    parent: { en: "Food Processing Sector", hi: "खाद्य प्रसंस्करण क्षेत्र" },
    children: [
      { en: "Spice manufacturing", hi: "मसाला निर्माण" },
      { en: "Pickles, preserves (murabba), papad", hi: "अचार, मुरब्बा, पापड़" },
      { en: "Savoury snacks, bhujiya, namkeen", hi: "नमकीन, भुजिया" },
      {
        en: "Instant mixes (idli mix, gram flour mix, kheer mix)",
        hi: "इंस्टेंट मिश्रण (इडली, बेसन, खीर)",
      },
      {
        en: "Bakery items (cookies, cake, bread)",
        hi: "बेकरी उत्पाद (कुकी, केक, ब्रेड)",
      },
      {
        en: "Millet-based products (jowar, bajra cookies, snacks)",
        hi: "मिलेट आधारित उत्पाद (ज्वार, बाजरा)",
      },
      {
        en: "Cold-pressed oils (mustard/sesame)",
        hi: "कोल्ड-प्रेस्ड तेल (सरसों/तिल)",
      },
      { en: "Honey processing", hi: "शहद प्रसंस्करण" },
      { en: "Jam–jelly–squash", hi: "जैम–जेली–स्क्वैश" },
      { en: "Ready-to-eat products", hi: "तैयार खाने योग्य उत्पाद" },
      { en: "Jaggery Production", hi: "गुड़ उत्पादन" },
      {
        en: "Whole grain/pulses/flour sorting–grading–packaging unit",
        hi: "साबुत अनाज/दाल/आटा छँटाई–ग्रेडिंग–पैकेजिंग इकाई",
      },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: {
      en: "Handicraft & Artisan Sector",
      hi: "हस्तशिल्प एवं कारीगर क्षेत्र",
    },
    children: [
      { en: "Zari and zardozi work", hi: "जरी एवं ज़रदोज़ी कार्य" },
      { en: "Chikankari embroidery", hi: "चिकनकारी कढ़ाई" },
      { en: "Woodwork", hi: "लकड़ी का काम" },
      { en: "Terracotta / clay products", hi: "टेरेकोटा / मिट्टी के उत्पाद" },
      { en: "Bamboo / cane craft", hi: "बांस / बेंत शिल्प" },
      {
        en: "Handmade jewellery (terracotta jewellery, oxidised jewellery)",
        hi: "हस्तनिर्मित आभूषण (टेरेकोटा, ऑक्सीडाइज़्ड)",
      },
      { en: "Handmade candles", hi: "हस्तनिर्मित मोमबत्तियाँ" },
      { en: "Crochet / woollen products", hi: "क्रोशिया / ऊनी उत्पाद" },
      { en: "Paper craft, greeting cards", hi: "पेपर क्राफ्ट, ग्रीटिंग कार्ड" },
      {
        en: "Handbags, jute bags, embroidered bags",
        hi: "हैंडबैग, जूट बैग, कढ़ाई वाले बैग",
      },
      {
        en: "Ration/vegetable/shopping bags (non-woven alternatives)",
        hi: "राशन/सब्ज़ी/शॉपिंग बैग (नॉन-वोवन विकल्प)",
      },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: { en: "Textile & Apparel Sector", hi: "वस्त्र एवं परिधान क्षेत्र" },
    children: [
      {
        en: "Boutique unit (stitching–cutting–embellishment)",
        hi: "बुटीक इकाई (सिलाई–कटिंग–सजावट)",
      },
      { en: "School uniform stitching unit", hi: "स्कूल यूनिफॉर्म सिलाई इकाई" },
      { en: "Ladies’ garments", hi: "महिला परिधान" },
      {
        en: "Bedsheet/quilt/pillow cover unit",
        hi: "बेडशीट/रजाई/तकिया कवर इकाई",
      },
      {
        en: "ODOP textile-based products (Varanasi saree, Bhadohi carpet finishing etc.)",
        hi: "ODOP वस्त्र उत्पाद (वाराणसी साड़ी, भदोही कालीन आदि)",
      },
      {
        en: "Home linen (curtains, table cloth, sofa covers)",
        hi: "होम लिनन (पर्दे, मेज़पोश, सोफ़ा कवर)",
      },
      { en: "Jute/cotton carry bags", hi: "जूट/कॉटन कैरी बैग" },
      {
        en: "Mask/apron/hospital gown manufacturing",
        hi: "मास्क/एप्रन/हॉस्पिटल गाउन निर्माण",
      },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: {
      en: "Agriculture & Allied Sector",
      hi: "कृषि एवं संबद्ध क्षेत्र",
    },
    children: [
      {
        en: "Vegetable cultivation and group supply",
        hi: "सब्ज़ी उत्पादन एवं समूह आपूर्ति",
      },
      {
        en: "Flower cultivation (marigold, rose)",
        hi: "फूलों की खेती (गेंदा, गुलाब)",
      },
      { en: "Mushroom production", hi: "मशरूम उत्पादन" },
      {
        en: "Nursery (fruit/flower/vegetable saplings)",
        hi: "नर्सरी (फल/फूल/सब्ज़ी के पौधे)",
      },
      {
        en: "Beekeeping (honey production)",
        hi: "मधुमक्खी पालन (शहद उत्पादन)",
      },
      { en: "Organic manure/vermi-compost", hi: "जैविक खाद / वर्मी कम्पोस्ट" },
      { en: "Animal feed unit", hi: "पशु आहार इकाई" },
      {
        en: "Mini mill (flour/pulse grinding)",
        hi: "मिनी मिल (आटा/दाल पिसाई)",
      },
      {
        en: "Fruit–vegetable dehydration unit",
        hi: "फल–सब्ज़ी निर्जलीकरण इकाई",
      },
      { en: "Fish farming", hi: "मछली पालन" },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: {
      en: "Dairy & Animal Husbandry Sector",
      hi: "डेयरी एवं पशुपालन क्षेत्र",
    },
    children: [
      {
        en: "Dairy unit (2–10 cows/buffaloes)",
        hi: "डेयरी इकाई (2–10 गाय/भैंस)",
      },
      { en: "Milk collection centre", hi: "दूध संग्रह केंद्र" },
      {
        en: "Paneer/khoya/curd/ghee manufacturing",
        hi: "पनीर/खोया/दही/घी निर्माण",
      },
      { en: "Goat rearing", hi: "बकरी पालन" },
      { en: "Poultry unit (egg/broiler)", hi: "मुर्गी पालन (अंडा/ब्रॉयलर)" },
      {
        en: "Pig rearing (in specific areas)",
        hi: "सूअर पालन (विशिष्ट क्षेत्रों में)",
      },
      { en: "Fodder production", hi: "चारा उत्पादन" },
      {
        en: "Milk packaging and branding unit",
        hi: "दूध पैकेजिंग एवं ब्रांडिंग इकाई",
      },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: {
      en: "Beauty, Wellness & Personal Services",
      hi: "सौंदर्य, वेलनेस एवं व्यक्तिगत सेवाएँ",
    },
    children: [
      { en: "Beauty parlour", hi: "ब्यूटी पार्लर" },
      {
        en: "Mehndi (henna) training and services",
        hi: "मेहंदी प्रशिक्षण एवं सेवाएँ",
      },
      { en: "Spa / therapy unit", hi: "स्पा / थेरेपी इकाई" },
      {
        en: "Home-care services (home nursing, baby care training)",
        hi: "होम-केयर सेवाएँ (होम नर्सिंग, बेबी केयर)",
      },
      {
        en: "Mobile salon / village-based services",
        hi: "मोबाइल सैलून / ग्राम स्तरीय सेवाएँ",
      },
      { en: "Fitness group / yoga classes", hi: "फिटनेस समूह / योग कक्षाएँ" },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: {
      en: "Retail & Micro Trading Sector",
      hi: "खुदरा एवं सूक्ष्म व्यापार क्षेत्र",
    },
    children: [
      { en: "Grocery/provision store", hi: "किराना / परचून दुकान" },
      { en: "Stationery / general store", hi: "स्टेशनरी / जनरल स्टोर" },
      { en: "Group sale of vegetables/fruits", hi: "फल–सब्ज़ी समूह बिक्री" },
      { en: "Fast food cart", hi: "फास्ट फूड ठेला" },
      {
        en: "Mobile recharge shop / bill payment kiosk",
        hi: "मोबाइल रिचार्ज / बिल भुगतान केंद्र",
      },
      { en: "Jan Aushadhi/Medical Store", hi: "जन औषधि / मेडिकल स्टोर" },
      {
        en: "PET shop and disposable alternatives distribution",
        hi: "PET एवं डिस्पोज़ेबल विकल्पों का वितरण",
      },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: {
      en: "Cleaning & Hygiene Products Sector",
      hi: "सफाई एवं स्वच्छता उत्पाद क्षेत्र",
    },
    children: [
      {
        en: "Phenyl/detergent manufacturing",
        hi: "फिनाइल / डिटर्जेंट निर्माण",
      },
      { en: "Liquid handwash", hi: "लिक्विड हैंडवॉश" },
      { en: "Sanitizer", hi: "सैनिटाइज़र" },
      { en: "Incense sticks and dhoop sticks", hi: "अगरबत्ती एवं धूपबत्ती" },
      { en: "Napkin / sanitary pad unit", hi: "नैपकिन / सेनेटरी पैड इकाई" },
      {
        en: "Biodegradable plate and bowl manufacturing",
        hi: "बायोडिग्रेडेबल प्लेट एवं कटोरा निर्माण",
      },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: { en: "FMCG", hi: "तेज़ी से बिकने वाले उपभोक्ता उत्पाद (FMCG)" },
    children: [
      { en: "Handwash", hi: "हैंडवॉश" },
      { en: "Soap", hi: "साबुन" },
      { en: "Floor Cleaner", hi: "फ़्लोर क्लीनर" },
      { en: "Detergents", hi: "डिटर्जेंट" },
      { en: "Air fresheners", hi: "एयर फ्रेशनर" },
      { en: "Face wash & creams", hi: "फेस वॉश एवं क्रीम" },
      { en: "Shampoo & conditioner", hi: "शैम्पू एवं कंडीशनर" },
      { en: "Sponges", hi: "स्पंज" },
      { en: "Toothpaste & toothbrushes", hi: "टूथपेस्ट एवं टूथब्रश" },
      { en: "Broom", hi: "झाड़ू" },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: { en: "Transport", hi: "परिवहन" },
    children: [
      { en: "Loader", hi: "लोडर" },
      { en: "E-Rikshaw", hi: "ई-रिक्शा" },
      { en: "Taxi", hi: "टैक्सी" },
      { en: "Auto", hi: "ऑटो" },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: {
      en: "Packaging & Utility Products Sector",
      hi: "पैकेजिंग एवं उपयोगिता उत्पाद क्षेत्र",
    },
    children: [
      { en: "Paper bag unit", hi: "पेपर बैग इकाई" },
      { en: "Jute bag unit", hi: "जूट बैग इकाई" },
      { en: "Box manufacturing", hi: "डिब्बा निर्माण" },
      { en: "Recycled paper packaging unit", hi: "रीसायकल पेपर पैकेजिंग इकाई" },
      { en: "Food-grade packaging", hi: "फूड-ग्रेड पैकेजिंग" },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: { en: "Prerna Canteen", hi: "प्रेरणा कैंटीन" },
    children: [],
  },
  {
    parent: { en: "Digital & Service Sector", hi: "डिजिटल एवं सेवा क्षेत्र" },
    children: [
      {
        en: "Data entry / digital services",
        hi: "डेटा एंट्री / डिजिटल सेवाएँ",
      },
      {
        en: "CSC (Common Service Center) operations",
        hi: "CSC (कॉमन सर्विस सेंटर) संचालन",
      },
      {
        en: "Online product sales (e-commerce)",
        hi: "ऑनलाइन उत्पाद बिक्री (ई-कॉमर्स)",
      },
      { en: "SHG product branding", hi: "SHG उत्पाद ब्रांडिंग" },
      {
        en: "Social media management for local shops",
        hi: "स्थानीय दुकानों हेतु सोशल मीडिया प्रबंधन",
      },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: {
      en: "Solid Waste & Green Sector",
      hi: "ठोस अपशिष्ट एवं हरित क्षेत्र",
    },
    children: [
      { en: "Plastic waste sorting", hi: "प्लास्टिक कचरा छँटाई" },
      { en: "Fuel/briquettes from waste", hi: "कचरे से ईंधन / ब्रिकेट" },
      { en: "Composting unit", hi: "कम्पोस्टिंग इकाई" },
      { en: "Recycled paper products", hi: "रीसायकल पेपर उत्पाद" },
      {
        en: "E-waste collection micro centre",
        hi: "ई-कचरा संग्रह माइक्रो केंद्र",
      },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: {
      en: "Construction & Fabrication Micro Enterprises",
      hi: "निर्माण एवं फैब्रिकेशन सूक्ष्म उद्यम",
    },
    children: [
      {
        en: "Brick and tiles cleaning/polishing unit",
        hi: "ईंट एवं टाइल सफाई / पॉलिशिंग इकाई",
      },
      {
        en: "Interior decoration (fabric, flowers, décor)",
        hi: "इंटीरियर सजावट (कपड़ा, फूल, डेकोर)",
      },
      {
        en: "Painting/plumbing/carpentry group",
        hi: "पेंटिंग / प्लंबिंग / बढ़ईगीरी समूह",
      },
      { en: "POP artwork / wall decoration", hi: "POP आर्टवर्क / दीवार सजावट" },
      { en: "Others", hi: "अन्य" },
    ],
  },
  {
    parent: {
      en: "EDP | Entrepreneurship Development Programme",
      hi: "EDP | उद्यमिता विकास कार्यक्रम",
    },
    children: [],
  },
  {
    parent: { en: "Other", hi: "अन्य" },
    children: [{ en: "Others", hi: "अन्य" }],
  },
];

const ORG_TRADER_TYPES = [
  "Hotel",
  "Restaurant",
  "School",
  "College",
  "Kirana Store",
  "WholeSaler",
  "Retailer",
  "Govt Org",
  "Private Org",
  "E-Commerce",
  "Others",
];

const initialState = {
  basic_info: {
    clf_name: "",
    clf_code: "",
    vo_name: "",
    vo_code: "",
    district_id: "",
    block_id: "",
    panchayat_id: "",
    village_id: "",
  },

  selection_ent_prod: "enterprise",

  enterprise: {
    enterprise_name: "",
    entrepreneur_name: "",
    entrepreneur_contact: "",
    entrepreneur_picture: null,
    selected_parent: "",
    parent_other: "",
    prod_categories: [],
    child_other: "",
  },

  product: {
    product_name: "",
    selected_parent: "",
    parent_other: "",
    prod_categories: [],
    child_other: "",
  },

  selection_org_trader: "buyer_org",

  buyer_org: {
    buyer_org_name: "",
    org_address: "",
    org_contact: "",
    org_type: "",
    org_type_other: "",
  },

  trader: {
    trader_name: "",
    trader_contact: "",
    trader_type: "",
    trader_type_other: "",
  },

  mou: {
    mou_status: "",
    mou_date: "",
    mou_duration: "",
    mou_docs: [
      {
        doc_name: "",
        is_other: false,
        doc_file: null,
      },
    ],
  },

  sales: {
    est_monthly_sales: "",
    est_annual_sales: "",
    supply_frequency: "",
  },
};

export default function MOUFormCreate({
  selectedMember,
  clfName,
  clfCode,
  mouLevel,
}) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Cascading Location States
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);

  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingPanchayats, setLoadingPanchayats] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  const downloadMouTemplate = () => {
    const link = document.createElement("a");
    link.href = "/MOUForm/MOU_Template.docx";
    link.download = "MOU_Template.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Auto-fill CLF Name, Code, and Location details from props if available
  useEffect(() => {
    setForm((prev) => {
      const newBasicInfo = { ...prev.basic_info };

      if (clfName && clfName !== "-") {
        newBasicInfo.clf_name = clfName;
        newBasicInfo.clf_code = clfCode || "";
      }

      // Automatically map cascading location IDs from the selected member payload
      if (selectedMember) {
        newBasicInfo.district_id =
          selectedMember.district_id || newBasicInfo.district_id;
        newBasicInfo.block_id =
          selectedMember.block_id || newBasicInfo.block_id;
        newBasicInfo.panchayat_id =
          selectedMember.panchayat_id || newBasicInfo.panchayat_id;

        // Handles village_id if it eventually gets added to the payload
        newBasicInfo.village_id =
          selectedMember.village_id || newBasicInfo.village_id;
      }

      return { ...prev, basic_info: newBasicInfo };
    });
  }, [clfName, clfCode, selectedMember]);

  /* =======================================================
         CASCADING LOOKUPS (District -> Block -> GP -> Village)
    ======================================================= */
  useEffect(() => {
    LOOKUP_API.districts
      .list({ page_size: 100 })
      .then((r) => setDistricts(r?.data?.results || []))
      .catch((err) => console.error("Error fetching districts", err));
  }, []);

  useEffect(() => {
    if (!form.basic_info.district_id) return;
    setLoadingBlocks(true);
    LOOKUP_API.blocks
      .retrieve(form.basic_info.district_id, { page_size: 100 })
      .then((r) => setBlocks(r?.data?.results || []))
      .catch((err) => console.error("Error fetching blocks", err))
      .finally(() => setLoadingBlocks(false));
  }, [form.basic_info.district_id]);

  useEffect(() => {
    if (!form.basic_info.block_id) return;
    setLoadingPanchayats(true);
    LOOKUP_API.panchayats
      .retrieve(form.basic_info.block_id, { page_size: 100 })
      .then((r) => setPanchayats(r?.data?.results || []))
      .catch((err) => console.error("Error fetching panchayats", err))
      .finally(() => setLoadingPanchayats(false));
  }, [form.basic_info.block_id]);

  useEffect(() => {
    if (!form.basic_info.panchayat_id) return;
    setLoadingVillages(true);
    LOOKUP_API.villages
      .retrieve(form.basic_info.panchayat_id, { page_size: 100 })
      .then((r) => setVillages(r?.data?.results || []))
      .catch((err) => console.error("Error fetching villages", err))
      .finally(() => setLoadingVillages(false));
  }, [form.basic_info.panchayat_id]);

  /* =======================================================
         GENERIC HANDLERS
    ======================================================= */
  const handleSectionChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    // Clear field specific error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleRadioChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =======================================================
         BASIC INFO VALIDATION HANDLERS
    ======================================================= */
  const handleBasicInfoChange = (field, value, type) => {
    if (type === "alpha") {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        handleSectionChange("basic_info", field, value);
      }
    } else if (type === "number") {
      if (/^\d*$/.test(value)) {
        handleSectionChange("basic_info", field, value);
      }
    } else {
      handleSectionChange("basic_info", field, value);
    }
  };

  /* =======================================================
         CATEGORY TOGGLE (Single Entry Logic)
    ======================================================= */
  const toggleCategory = (section, parent, child) => {
    setForm((prev) => {
      const current = prev[section].prod_categories || [];
      const exists = current.some(
        (item) =>
          item.parent_category === parent && item.child_category === child,
      );

      let newCategories = [];
      if (exists) {
        newCategories = current.filter(
          (item) =>
            !(item.parent_category === parent && item.child_category === child),
        );
      } else {
        newCategories = [
          ...current,
          { parent_category: parent, child_category: child },
        ];
      }

      return {
        ...prev,
        [section]: {
          ...prev[section],
          prod_categories: newCategories,
        },
      };
    });
  };

  /* =======================================================
         MOU DOC HANDLERS
    ======================================================= */
  const updateDoc = (index, field, value) => {
    setForm((prev) => {
      const newDocs = [...prev.mou.mou_docs];
      newDocs[index] = { ...newDocs[index], [field]: value };
      return {
        ...prev,
        mou: { ...prev.mou, mou_docs: newDocs },
      };
    });
  };

  const addDoc = () => {
    setForm((prev) => ({
      ...prev,
      mou: {
        ...prev.mou,
        mou_docs: [
          ...prev.mou.mou_docs,
          {
            doc_name: "",
            is_other: false,
            doc_file: null,
          },
        ],
      },
    }));
  };

  const removeDoc = (index) => {
    setForm((prev) => ({
      ...prev,
      mou: {
        ...prev.mou,
        mou_docs: prev.mou.mou_docs.filter((_, i) => i !== index),
      },
    }));
  };

  /* =======================================================
         SUBMIT WITH SURGICAL FRONTEND VALIDATION & MAPPING
    ======================================================= */
  const handleSubmit = async () => {
    let newErrors = {};
    const phoneRegex = /^\d{10}$/;

    // 1. Phone Validations
    if (
      form.selection_ent_prod === "enterprise" &&
      form.enterprise.entrepreneur_contact
    ) {
      if (!phoneRegex.test(form.enterprise.entrepreneur_contact))
        newErrors.entrepreneur_contact =
          "Enter a valid 10-digit contact number.";
    }
    if (
      form.selection_org_trader === "buyer_org" &&
      form.buyer_org.org_contact
    ) {
      if (!phoneRegex.test(form.buyer_org.org_contact))
        newErrors.org_contact = "Enter a valid 10-digit contact number.";
    }
    if (form.selection_org_trader === "trader" && form.trader.trader_contact) {
      if (!phoneRegex.test(form.trader.trader_contact))
        newErrors.trader_contact = "Enter a valid 10-digit contact number.";
    }

    // 2. LokOS Code / Name Paired Validations
    const { clf_name, clf_code, vo_name, vo_code } = form.basic_info;
    if (Boolean(clf_name) !== Boolean(clf_code))
      newErrors.clf_group =
        "Both LokOS CLF Code and Name must be provided together.";
    if (Boolean(vo_name) !== Boolean(vo_code))
      newErrors.vo_group =
        "Both LokOS VO Code and Name must be provided together.";

    // 3. MOU name and Date Validation
    if (form.mou.mou_date) {
      const today = new Date().toISOString().split("T")[0];
      if (form.mou.mou_date > today)
        newErrors.mou_date = "MOU date cannot be a future date.";
    }
    form.mou.mou_docs.forEach((doc, index) => {
      if (doc.is_other && !doc.doc_name.trim()) {
        newErrors[`mou_doc_${index}`] = "Please enter a custom MOU type.";
      }
    });

    // 4. Sales Validation
    const monthly =
      form.sales.est_monthly_sales !== ""
        ? Number(form.sales.est_monthly_sales)
        : null;
    const annual =
      form.sales.est_annual_sales !== ""
        ? Number(form.sales.est_annual_sales)
        : null;
    if (monthly !== null && monthly < 0)
      newErrors.est_monthly_sales = "Sales cannot be negative.";
    if (annual !== null && annual < 0)
      newErrors.est_annual_sales = "Sales cannot be negative.";
    if (monthly !== null && annual !== null && annual < monthly)
      newErrors.sales_logic =
        "Estimated annual sales cannot be less than monthly sales.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert(
        "Please fix the validation errors highlighted below before submitting.",
      );
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // --- SURGICAL FIX: Safely resolve "Others" and format Enterprise Dictionary ---
      const resolveCategoryName = (catName, otherVal) => {
        return catName === "Other" || catName === "Others"
          ? otherVal?.trim() || "Others"
          : catName;
      };

      const formatEnterpriseDict = (sectionData) => {
        const dict = {};
        const rawCats = sectionData.prod_categories || [];
        rawCats.forEach((cat) => {
          const pCat = resolveCategoryName(
            cat.parent_category,
            sectionData.parent_other,
          );
          const cCat = resolveCategoryName(
            cat.child_category,
            sectionData.child_other,
          );
          if (pCat) {
            if (!dict[pCat]) dict[pCat] = [];
            if (cCat && !dict[pCat].includes(cCat)) dict[pCat].push(cCat);
          }
        });
        return Object.keys(dict).length > 0 ? JSON.stringify(dict) : null;
      };

      // Construct Exact Payload matching DB Expectations
      const jsonPayload = {
        basic_info: {
          ...form.basic_info,
          shg_name: selectedMember?.shg_name || "",
          shg_code: selectedMember?.shg_code || "",
        },
        selection_ent_prod: form.selection_ent_prod,
        enterprise:
          form.selection_ent_prod === "enterprise"
            ? {
                enterprise_name: form.enterprise.enterprise_name,
                entrepreneur_name: form.enterprise.entrepreneur_name,
                entrepreneur_contact: form.enterprise.entrepreneur_contact,
                entrepreneur_picture: null, // Avoid File serialization error
                enterprise_type: formatEnterpriseDict(form.enterprise), // Generates {"Parent":["Child"]}
              }
            : null,
        product:
          form.selection_ent_prod === "product"
            ? {
                product_name: form.product.product_name,
                prod_categories: form.product.prod_categories.map((c) => ({
                  parent_category: resolveCategoryName(
                    c.parent_category,
                    form.product.parent_other,
                  ),
                  child_category: resolveCategoryName(
                    c.child_category,
                    form.product.child_other,
                  ),
                })),
              }
            : null,
        selection_org_trader: form.selection_org_trader,
        buyer_org:
          form.selection_org_trader === "buyer_org"
            ? {
                ...form.buyer_org,
                org_type: resolveCategoryName(
                  form.buyer_org.org_type,
                  form.buyer_org.org_type_other,
                ),
              }
            : null,
        trader:
          form.selection_org_trader === "trader"
            ? {
                ...form.trader,
                trader_type: resolveCategoryName(
                  form.trader.trader_type,
                  form.trader.trader_type_other,
                ),
              }
            : null,
        mous: [
          {
            mou_level: mouLevel || "",
            mou_status: form.mou.mou_status,
            mou_date: form.mou.mou_date,
            mou_duration: form.mou.mou_duration,
            mou_docs: form.mou.mou_docs.map((d) => ({
              doc_name: d.doc_name,
              doc_file: null,
            })),
          },
        ],
        sales: [
          {
            est_monthly_sales: Number(form.sales.est_monthly_sales) || 0,
            est_annual_sales: Number(form.sales.est_annual_sales) || 0,
            supply_frequency: form.sales.supply_frequency,
          },
        ],
      };

      const formData = new FormData();
      console.log("JSON PAYLOAD BEFORE FILES", jsonPayload);
      formData.append("payload", JSON.stringify(jsonPayload));

      // Attach Files (Safe injection)
      if (
        form.selection_ent_prod === "enterprise" &&
        form.enterprise.entrepreneur_picture
      ) {
        formData.append(
          "entrepreneur_picture",
          form.enterprise.entrepreneur_picture,
        );
      }
      form.mou.mou_docs.forEach((doc, idx) => {
        if (doc.doc_file) formData.append(`mou_doc_${idx}`, doc.doc_file);
      });

      console.log("SENDING MULTIPART FORMDATA...");
      const res = await EPSAKHI_API.mouFormCreate(formData);
      console.log("SUCCESS", res?.data);

      alert("MOU Submitted Successfully");
      setForm(initialState);
    } catch (err) {
      console.log("ERROR RESPONSE", err?.response?.data);
      alert(
        JSON.stringify(err?.response?.data, null, 2) || "Submission Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const addr = selectedMember?.member_addresses?.[0] || null;

  /* Helper render functions for categories */
  const renderCategorySelection = (sectionName) => {
    const data = form[sectionName];
    const selectedParentData = ENTERPRISE_TYPE_TREE.find(
      (x) => x.parent.en === data.selected_parent,
    );
    const isParentOther = data.selected_parent === "Other";
    const hasChildOtherSelected = data.prod_categories.some(
      (c) => c.child_category === "Others",
    );

    return (
      <div className="subCard">
        <div className="label">Select Parent Category</div>
        <select
          className="selectInput"
          value={data.selected_parent}
          onChange={(e) => {
            handleSectionChange(sectionName, "selected_parent", e.target.value);
            handleSectionChange(sectionName, "prod_categories", []); // Reset children on parent change
          }}
        >
          <option value="">-- Select Category --</option>
          {ENTERPRISE_TYPE_TREE.map((parentItem, idx) => (
            <option key={idx} value={parentItem.parent.en}>
              {parentItem.parent.en} ({parentItem.parent.hi})
            </option>
          ))}
        </select>

        {isParentOther && (
          <div className="mt-14">
            <input
              className="input"
              placeholder="Specify Other Parent Category"
              value={data.parent_other}
              onChange={(e) =>
                handleSectionChange(sectionName, "parent_other", e.target.value)
              }
            />
            <input
              className="input"
              placeholder="Specify Child Category"
              value={data.child_other}
              onChange={(e) =>
                handleSectionChange(sectionName, "child_other", e.target.value)
              }
            />
          </div>
        )}

        {!!data.selected_parent && !isParentOther && (
          <div className="childWrap">
            <div className="childTitle">Child Categories</div>
            {selectedParentData?.children?.length ? (
              selectedParentData.children.map((child, cIndex) => (
                <label key={cIndex} className="checkboxRow">
                  <input
                    type="checkbox"
                    className="checkboxInput"
                    checked={data.prod_categories?.some(
                      (c) =>
                        c.parent_category === data.selected_parent &&
                        c.child_category === child.en,
                    )}
                    onChange={() =>
                      toggleCategory(
                        sectionName,
                        data.selected_parent,
                        child.en,
                      )
                    }
                  />
                  <span className="checkboxText">
                    {child.en}
                    <br />
                    <small>{child.hi}</small>
                  </span>
                </label>
              ))
            ) : (
              <div className="noChild">No Child Categories</div>
            )}

            {hasChildOtherSelected && (
              <div className="mt-14">
                <input
                  className="input"
                  placeholder="Specify Other Child Category"
                  value={data.child_other}
                  onChange={(e) =>
                    handleSectionChange(
                      sectionName,
                      "child_other",
                      e.target.value,
                    )
                  }
                />
              </div>
            )}
          </div>
        )}

        {!!data.prod_categories?.length && (
          <div className="selectedBox">
            <h4>Selected Categories</h4>
            {data.prod_categories.map((item, i) => (
              <div key={i} className="selectedItem">
                <span className="check-icon">✓</span> {item.parent_category}{" "}
                {" → "}{" "}
                {item.child_category === "Others"
                  ? data.child_other || "Others"
                  : item.child_category}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mou-form-root">
      <div className="mou-form-wrapper">
        {/* =======================================================
                   SECTION 1: BASIC INFO & BENEFICIARY PROFILE
            ======================================================= */}
        <div className="form-card highlight-card">
          <h3 className="sectionTitle">Basic Info & Beneficiary Profile</h3>

          {!!selectedMember && (
            <div className="detailGrid mb-24">
              <div className="detailBox">
                <span>District</span>
                <strong>
                  {districts.find(
                    (d) =>
                      String(d.district_id) ===
                      String(form.basic_info.district_id),
                  )?.district_name_en || "-"}
                </strong>
              </div>

              <div className="detailBox">
                <span>SHG Name</span>
                <strong>{selectedMember?.shg_name || "-"}</strong>
              </div>

              <div className="detailBox">
                <span>Block</span>
                <strong>
                  {blocks.find(
                    (b) =>
                      String(b.block_id) === String(form.basic_info.block_id),
                  )?.block_name_en || "-"}
                </strong>
              </div>

              <div className="detailBox">
                <span>CLF Name</span>
                <strong>
                  {clfName && clfName !== "-"
                    ? clfName
                    : form.basic_info.clf_name ||
                      "Not Found, Please Enter Manually"}
                </strong>
              </div>

              <div className="detailBox">
                <span>VO Name</span>
                <strong>
                  {form.basic_info.vo_name ||
                    "Not Found, Please Enter Manually"}
                </strong>
              </div>

              <div className="detailBox">
                <span>Panchayat</span>
                <strong>
                  {panchayats.find(
                    (p) =>
                      String(p.panchayat_id) ===
                      String(form.basic_info.panchayat_id),
                  )?.panchayat_name_en || "-"}
                </strong>
              </div>

              <div className="detailBox">
                <span>Village</span>
                <strong>
                  {villages.find(
                    (v) =>
                      String(v.village_id) ===
                      String(form.basic_info.village_id),
                  )?.village_name_english || "-"}
                </strong>
              </div>
            </div>
          )}

          <div className="grid2 mt-14">
            <div>
              <div className="label">CLF Name</div>
              <input
                className={`input ${errors.clf_group ? "error-border" : ""}`}
                placeholder="Enter CLF Name"
                value={form.basic_info.clf_name}
                onChange={(e) =>
                  handleBasicInfoChange("clf_name", e.target.value, "alpha")
                }
              />
            </div>
            <div>
              <div className="label">LokOS CLF Code</div>
              <input
                className={`input ${errors.clf_group ? "error-border" : ""}`}
                placeholder="Enter CLF Code"
                value={form.basic_info.clf_code}
                onChange={(e) =>
                  handleBasicInfoChange("clf_code", e.target.value, "number")
                }
              />
            </div>
            {errors.clf_group && (
              <span className="error-text" style={{ gridColumn: "span 2" }}>
                {errors.clf_group}
              </span>
            )}

            <div>
              <div className="label">VO Name</div>
              <input
                className={`input ${errors.vo_group ? "error-border" : ""}`}
                placeholder="Enter VO Name"
                value={form.basic_info.vo_name}
                onChange={(e) =>
                  handleBasicInfoChange("vo_name", e.target.value, "alpha")
                }
              />
            </div>
            <div>
              <div className="label">LokOS VO Code</div>
              <input
                className={`input ${errors.vo_group ? "error-border" : ""}`}
                placeholder="Enter VO Code"
                value={form.basic_info.vo_code}
                onChange={(e) =>
                  handleBasicInfoChange("vo_code", e.target.value, "number")
                }
              />
            </div>
            {errors.vo_group && (
              <span className="error-text" style={{ gridColumn: "span 2" }}>
                {errors.vo_group}
              </span>
            )}
          </div>

          <div className="grid2 mt-14">
            <div>
              <div className="label">District</div>
              <select
                className="selectInput"
                value={form.basic_info.district_id}
                onChange={(e) => {
                  handleSectionChange(
                    "basic_info",
                    "district_id",
                    e.target.value,
                  );
                  handleSectionChange("basic_info", "block_id", "");
                  handleSectionChange("basic_info", "panchayat_id", "");
                  handleSectionChange("basic_info", "village_id", "");
                }}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.district_id} value={d.district_id}>
                    {d.district_name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="label">
                Block {loadingBlocks && "(Loading...)"}
              </div>
              <select
                className="selectInput"
                value={form.basic_info.block_id}
                onChange={(e) => {
                  handleSectionChange("basic_info", "block_id", e.target.value);
                  handleSectionChange("basic_info", "panchayat_id", "");
                  handleSectionChange("basic_info", "village_id", "");
                }}
                disabled={!form.basic_info.district_id}
              >
                <option value="">Select Block</option>
                {blocks.map((b) => (
                  <option key={b.block_id} value={b.block_id}>
                    {b.block_name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="label">
                Panchayat {loadingPanchayats && "(Loading...)"}
              </div>
              <select
                className="selectInput"
                value={form.basic_info.panchayat_id}
                onChange={(e) => {
                  handleSectionChange(
                    "basic_info",
                    "panchayat_id",
                    e.target.value,
                  );
                  handleSectionChange("basic_info", "village_id", "");
                }}
                disabled={!form.basic_info.block_id}
              >
                <option value="">Select Panchayat</option>
                {panchayats.map((p) => (
                  <option key={p.panchayat_id} value={p.panchayat_id}>
                    {p.panchayat_name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="label">
                Village {loadingVillages && "(Loading...)"}
              </div>
              <select
                className="selectInput"
                value={form.basic_info.village_id}
                onChange={(e) =>
                  handleSectionChange(
                    "basic_info",
                    "village_id",
                    e.target.value,
                  )
                }
                disabled={!form.basic_info.panchayat_id}
              >
                <option value="">Select Village</option>
                {villages.map((v) => (
                  <option key={v.village_id} value={v.village_id}>
                    {v.village_name_english}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* =======================================================
                   SECTION 2: ENTERPRISE OR PRODUCT
            ======================================================= */}
        <div className="form-card">
          {/* <h3 className="sectionTitle">Enterprise / Product Details</h3> */}

          <div className="radio-group mb-24">
            <label
              className={`radio-label ${form.selection_ent_prod === "enterprise" ? "active-radio" : ""}`}
            >
              <input
                type="radio"
                name="ent_prod_selection"
                checked={form.selection_ent_prod === "enterprise"}
                onChange={() =>
                  handleRadioChange("selection_ent_prod", "enterprise")
                }
              />
              <h3>Enterprise Details</h3>
            </label>
            {/* <label
              className={`radio-label ${form.selection_ent_prod === "product" ? "active-radio" : ""}`}
            >
              <input
                type="radio"
                name="ent_prod_selection"
                checked={form.selection_ent_prod === "product"}
                onChange={() =>
                  handleRadioChange("selection_ent_prod", "product")
                }
              />
              Single Product Details
            </label> */}
          </div>

          {form.selection_ent_prod === "enterprise" && (
            <div className="fade-in">
              <div className="grid2">
                <input
                  className="input"
                  placeholder="Enterprise Name"
                  value={form.enterprise.enterprise_name}
                  onChange={(e) =>
                    handleSectionChange(
                      "enterprise",
                      "enterprise_name",
                      e.target.value,
                    )
                  }
                />
                <input
                  className="input"
                  placeholder="Entrepreneur Name"
                  value={form.enterprise.entrepreneur_name}
                  onChange={(e) =>
                    handleSectionChange(
                      "enterprise",
                      "entrepreneur_name",
                      e.target.value,
                    )
                  }
                />

                <div>
                  <input
                    className={`input ${errors.entrepreneur_contact ? "error-border" : ""}`}
                    placeholder="Entrepreneur Contact"
                    value={form.enterprise.entrepreneur_contact}
                    onChange={(e) =>
                      handleSectionChange(
                        "enterprise",
                        "entrepreneur_contact",
                        e.target.value,
                      )
                    }
                  />
                  {errors.entrepreneur_contact && (
                    <span className="error-text mt-1">
                      {errors.entrepreneur_contact}
                    </span>
                  )}
                </div>

                <div>
                  <div
                    className="label"
                    style={{ marginBottom: 0, marginTop: 4 }}
                  >
                    Entrepreneur Picture (Optional)
                  </div>
                  <input
                    className="input file-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      handleSectionChange(
                        "enterprise",
                        "entrepreneur_picture",
                        e.target.files[0] || null,
                      )
                    }
                  />
                </div>
              </div>

              <h4 className="subHeading" style={{ marginTop: 24 }}>
                Enterprise Category
              </h4>
              {renderCategorySelection("enterprise")}
            </div>
          )}

          {form.selection_ent_prod === "product" && (
            <div className="fade-in">
              <input
                className="input product-input"
                placeholder="Enter Single Product Name"
                value={form.product.product_name}
                onChange={(e) =>
                  handleSectionChange("product", "product_name", e.target.value)
                }
              />
              {renderCategorySelection("product")}
            </div>
          )}
        </div>

        {/* =======================================================
                   SECTION 3: BUYER ORG OR TRADER
            ======================================================= */}
        <div className="form-card">
          <h3
            className="sectionTitle"
            style={{
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "16px",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            SECOND Party Details
          </h3>

          <div className="radio-group mb-24">
            <label
              className={`radio-label ${form.selection_org_trader === "buyer_org" ? "active-radio" : ""}`}
            >
              <input
                type="radio"
                name="org_trader_selection"
                checked={form.selection_org_trader === "buyer_org"}
                onChange={() =>
                  handleRadioChange("selection_org_trader", "buyer_org")
                }
              />
              Buyer Organisation
            </label>
            <label
              className={`radio-label ${form.selection_org_trader === "trader" ? "active-radio" : ""}`}
            >
              <input
                type="radio"
                name="org_trader_selection"
                checked={form.selection_org_trader === "trader"}
                onChange={() =>
                  handleRadioChange("selection_org_trader", "trader")
                }
              />
              Trader (Optional)
            </label>
          </div>

          {form.selection_org_trader === "buyer_org" && (
            <div className="subCard fade-in">
              <div className="grid3">
                <input
                  className="input"
                  placeholder="Organisation Name"
                  value={form.buyer_org.buyer_org_name}
                  onChange={(e) =>
                    handleSectionChange(
                      "buyer_org",
                      "buyer_org_name",
                      e.target.value,
                    )
                  }
                />
                <input
                  className="input"
                  placeholder="Address"
                  value={form.buyer_org.org_address}
                  onChange={(e) =>
                    handleSectionChange(
                      "buyer_org",
                      "org_address",
                      e.target.value,
                    )
                  }
                />
                <div>
                  <input
                    className={`input ${errors.org_contact ? "error-border" : ""}`}
                    placeholder="Contact"
                    value={form.buyer_org.org_contact}
                    onChange={(e) =>
                      handleSectionChange(
                        "buyer_org",
                        "org_contact",
                        e.target.value,
                      )
                    }
                  />
                  {errors.org_contact && (
                    <span className="error-text mt-1">
                      {errors.org_contact}
                    </span>
                  )}
                </div>

                {/* Org Type Selection */}
                <div>
                  <select
                    className="selectInput"
                    value={form.buyer_org.org_type}
                    onChange={(e) =>
                      handleSectionChange(
                        "buyer_org",
                        "org_type",
                        e.target.value,
                      )
                    }
                  >
                    <option value="">-- Select Organisation Type --</option>
                    {ORG_TRADER_TYPES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {form.buyer_org.org_type === "Others" && (
                  <div style={{ gridColumn: "span 2" }}>
                    <input
                      className="input"
                      placeholder="Specify Other Organisation Type"
                      value={form.buyer_org.org_type_other}
                      onChange={(e) =>
                        handleSectionChange(
                          "buyer_org",
                          "org_type_other",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {form.selection_org_trader === "trader" && (
            <div className="subCard fade-in">
              <div className="grid3">
                <input
                  className="input"
                  placeholder="Trader Name"
                  value={form.trader.trader_name}
                  onChange={(e) =>
                    handleSectionChange("trader", "trader_name", e.target.value)
                  }
                />
                <div>
                  <input
                    className={`input ${errors.trader_contact ? "error-border" : ""}`}
                    placeholder="Trader Contact"
                    value={form.trader.trader_contact}
                    onChange={(e) =>
                      handleSectionChange(
                        "trader",
                        "trader_contact",
                        e.target.value,
                      )
                    }
                  />
                  {errors.trader_contact && (
                    <span className="error-text mt-1">
                      {errors.trader_contact}
                    </span>
                  )}
                </div>

                {/* Trader Type Selection */}
                <div>
                  <select
                    className="selectInput"
                    value={form.trader.trader_type}
                    onChange={(e) =>
                      handleSectionChange(
                        "trader",
                        "trader_type",
                        e.target.value,
                      )
                    }
                  >
                    <option value="">-- Select Trader Type --</option>
                    {ORG_TRADER_TYPES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {form.trader.trader_type === "Others" && (
                  <div style={{ gridColumn: "span 3" }}>
                    <input
                      className="input"
                      placeholder="Specify Other Trader Type"
                      value={form.trader.trader_type_other}
                      onChange={(e) =>
                        handleSectionChange(
                          "trader",
                          "trader_type_other",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* =======================================================
                   SECTION 4: MOU DETAILS
            ======================================================= */}
        <div className="form-card">
          <h3 className="sectionTitle">MOU Details</h3>
          <div className="subCard">
            <div className="grid3">
              <select
                className="selectInput"
                value={form.mou.mou_status}
                onChange={(e) =>
                  handleSectionChange("mou", "mou_status", e.target.value)
                }
              >
                <option value="">-- Select MOU Status --</option>
                <option value="New MOU">New MOU</option>
                <option value="Old MOU">Old MOU</option>
              </select>

              <div>
                <input
                  className={`input ${errors.mou_date ? "error-border" : ""}`}
                  type="date"
                  value={form.mou.mou_date}
                  onChange={(e) =>
                    handleSectionChange("mou", "mou_date", e.target.value)
                  }
                />
                {errors.mou_date && (
                  <span className="error-text mt-1">{errors.mou_date}</span>
                )}
              </div>

              <select
                className="selectInput"
                value={form.mou.mou_duration}
                onChange={(e) =>
                  handleSectionChange("mou", "mou_duration", e.target.value)
                }
              >
                <option value="">-- Select Duration --</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
                <option value="More than 1 Year">More than 1 Year</option>
              </select>
            </div>

            <h4 className="subHeading">MOU Type</h4>

            {form.mou.mou_docs.map((doc, dIndex) => (
              <div key={dIndex} className="form-card">
                <div className="docRow">
                  {/* COLUMN 1: MOU Type Dropdown & Conditional 'Other' Input */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <select
                      className="selectInput"
                      value={doc.is_other ? "Other" : doc.doc_name}
                      onChange={(e) => {
                        if (e.target.value === "Other") {
                          updateDoc(dIndex, "is_other", true);
                          updateDoc(dIndex, "doc_name", "");
                        } else {
                          updateDoc(dIndex, "is_other", false);
                          updateDoc(dIndex, "doc_name", e.target.value);
                        }
                      }}
                    >
                      <option value="">-- Select MOU Type --</option>
                      <option value="Product Purchase/Sale">
                        Product Purchase/Sale
                      </option>
                      <option value="Manpower">Manpower</option>
                      <option value="Training">Training</option>
                      <option value="Other">Other</option>
                    </select>

                    {doc.is_other && (
                      <input
                        className="input otherMouInput"
                        placeholder="Enter Custom MOU Type"
                        value={doc.doc_name}
                        onChange={(e) =>
                          updateDoc(dIndex, "doc_name", e.target.value)
                        }
                      />
                    )}
                  </div>

                  {/* COLUMN 2: Stacked Download Button and File Input */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <button
                      type="button"
                      className="smallBtn outlineBtn templateBtn"
                      style={{
                        margin: 0,
                        width: "fit-content",
                        padding: "8px 12px",
                        fontSize: "12px",
                      }}
                      onClick={downloadMouTemplate}
                    >
                      📄 Download Template
                    </button>
                    <input
                      className="input file-input"
                      type="file"
                      style={{ height: "auto", padding: "10px" }}
                      onChange={(e) =>
                        updateDoc(dIndex, "doc_file", e.target.files[0] || null)
                      }
                    />
                  </div>

                  {/* COLUMN 3: Delete Button */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      paddingTop: "2px",
                    }}
                  >
                    {form.mou.mou_docs.length > 1 && (
                      <button
                        type="button"
                        className="deleteDocBtn"
                        onClick={() => removeDoc(dIndex)}
                        title="Remove Document"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button className="smallBtn outlineBtn" onClick={addDoc}>
              + Add Document
            </button>
          </div>
        </div>

        {/* =======================================================
                   SECTION 5: SALES
            ======================================================= */}
        <div className="form-card">
          <h3 className="sectionTitle">Sales Projections</h3>
          {errors.sales_logic && (
            <div className="error-text mb-2">{errors.sales_logic}</div>
          )}

          <div className="subCard">
            <div className="grid3">
              <div>
                <input
                  className={`input ${errors.est_monthly_sales || errors.sales_logic ? "error-border" : ""}`}
                  type="number"
                  placeholder="Monthly Sales (₹)"
                  value={form.sales.est_monthly_sales}
                  onChange={(e) => {
                    const monthlyVal = e.target.value;
                    const annualVal = monthlyVal
                      ? String(Number(monthlyVal) * 12)
                      : "";

                    // SURGICAL FIX: Update both monthly and auto-calc annual simultaneously
                    setForm((prev) => ({
                      ...prev,
                      sales: {
                        ...prev.sales,
                        est_monthly_sales: monthlyVal,
                        est_annual_sales: annualVal,
                      },
                    }));

                    // Clear associated errors immediately on typing
                    if (
                      errors.est_monthly_sales ||
                      errors.sales_logic ||
                      errors.est_annual_sales
                    ) {
                      setErrors((prev) => ({
                        ...prev,
                        est_monthly_sales: null,
                        est_annual_sales: null,
                        sales_logic: null,
                      }));
                    }
                  }}
                />
                {errors.est_monthly_sales && (
                  <span className="error-text mt-1">
                    {errors.est_monthly_sales}
                  </span>
                )}
              </div>

              <div>
                <input
                  className={`input ${errors.est_annual_sales || errors.sales_logic ? "error-border" : ""}`}
                  type="number"
                  placeholder="Annual Sales (₹)"
                  value={form.sales.est_annual_sales}
                  onChange={(e) =>
                    handleSectionChange(
                      "sales",
                      "est_annual_sales",
                      e.target.value,
                    )
                  }
                />
                {errors.est_annual_sales && (
                  <span className="error-text mt-1">
                    {errors.est_annual_sales}
                  </span>
                )}
              </div>

              <select
                className="selectInput"
                value={form.sales.supply_frequency}
                onChange={(e) =>
                  handleSectionChange(
                    "sales",
                    "supply_frequency",
                    e.target.value,
                  )
                }
              >
                <option value="">-- Supply Frequency --</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Need Based">Need Based</option>
              </select>
            </div>
          </div>
        </div>

        {/* =======================================================
                   SUBMIT
            ======================================================= */}
        <button className="submitBtn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting Request..." : "Submit MOU Form"}
        </button>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .mou-form-root {
          width: 100%;
          background: transparent;
        }

        .mou-form-wrapper {
          width: 100%;
          margin: auto;
          animation: fadeIn 0.4s ease forwards;
        }

        .title {
          text-align: left;
          font-size: 26px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--epsms-red, #ea580c);
          display: inline-block;
        }

        .form-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid #e5e7eb;
          border-top: 4px solid var(--epsms-red, #ea580c);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .highlight-card {
          border-top: 4px solid var(--epsms-green, #16a34a);
          background: #fdfdfd;
        }

        .subCard {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          background: #fafafa;
          transition: all 0.2s ease;
        }
        
        .subCard:hover {
          border-color: #d1d5db;
          background: #ffffff;
        }

        .sectionTitle {
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .subHeading {
          margin-top: 20px;
          margin-bottom: 12px;
          color: #374151;
          font-size: 16px;
        }

        .radio-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          color: #4b5563;
          transition: all 0.2s;
        }

        .radio-label input[type="radio"] {
          accent-color: var(--epsms-red, #ea580c);
          width: 16px;
          height: 16px;
        }

        .active-radio {
          background: rgba(234, 88, 12, 0.05);
          border-color: var(--epsms-red, #ea580c);
          color: var(--epsms-red, #ea580c);
        }

        .grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .grid3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .input, .selectInput {
          width: 100%;
          height: 48px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0 14px;
          font-size: 14px;
          background: #ffffff;
          color: #111827;
          transition: all 0.2s ease;
        }

        .error-border {
          border-color: #dc2626 !important;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
        }

        .error-text {
          color: #dc2626;
          font-size: 12px;
          font-weight: 500;
          display: block;
        }
        
        .mt-1 { margin-top: 6px; }
        .mb-2 { margin-bottom: 12px; }

        .product-input {
          font-weight: 600;
          font-size: 16px;
          border-color: var(--epsms-red, #ea580c);
          margin-bottom: 20px;
        }

        .file-input {
          padding: 10px;
          color: #6b7280;
          background: #f9fafb;
        }

        .input:focus, .selectInput:focus {
          outline: none;
          border-color: var(--epsms-red, #ea580c);
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }

        .docRow {
          display: grid;
          grid-template-columns: 1.4fr 1fr auto;
          gap: 16px;
          margin-bottom: 12px;
          align-items: start;
        }

        .deleteDocBtn {
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 8px;
          background: #dc2626;
          color: #ffffff;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .deleteDocBtn:hover {
          background: #b91c1c;
          transform: scale(1.05);
        }        

        .smallBtn {
          margin-top: 10px;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.2s;
        }

        .outlineBtn {
          background: transparent;
          color: var(--epsms-red, #ea580c);
          border: 1px solid var(--epsms-red, #ea580c);
        }

        .outlineBtn:hover {
          background: rgba(234, 88, 12, 0.05);
        }

        .submitBtn {
          width: 100%;
          height: 56px;
          border: none;
          border-radius: 10px;
          background: var(--epsms-green, #16a34a);
          color: white;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);
          margin-top: 10px;
        }

        .submitBtn:hover:not(:disabled) {
          background: #15803d;
          transform: translateY(-2px);
        }
        
        .submitBtn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
        }

        .label {
          font-weight: 600;
          margin-bottom: 8px;
          color: #4b5563;
          font-size: 13px;
          text-transform: uppercase;
        }

        .childWrap {
          margin-top: 16px;
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          border: 1px dashed #cbd5e1;
        }

        .childTitle {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 14px;
          color: #334155;
        }

        .checkboxRow {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          align-items: flex-start;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        
        .checkboxRow:hover {
          background: #f1f5f9;
        }

        .checkboxInput {
          margin-top: 4px;
          accent-color: var(--epsms-red, #ea580c);
          width: 16px;
          height: 16px;
        }

        .checkboxText {
          line-height: 1.5;
          color: #1e293b;
          font-weight: 500;
        }

        .checkboxText small {
          color: #64748b;
          font-weight: 400;
        }

        .noChild {
          color: #94a3b8;
          font-style: italic;
        }

        .selectedBox {
          margin-top: 20px;
          background: rgba(22, 163, 74, 0.05);
          padding: 16px;
          border-radius: 8px;
          border: 1px solid rgba(22, 163, 74, 0.2);
        }
        
        .selectedBox h4 {
          margin: 0 0 12px 0;
          color: var(--epsms-green, #16a34a);
        }

        .selectedItem {
          margin-bottom: 8px;
          line-height: 1.5;
          font-weight: 500;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .check-icon {
          color: #ffffff;
          background: var(--epsms-green, #16a34a);
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }

        .detailGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .detailBox {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px 16px;
        }

        .detailBox span {
          display: block;
          color: #64748b;
          margin-bottom: 4px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .detailBox strong {
          color: #0f172a;
          font-size: 15px;
        }

        .docLeft {
          display: flex;
          flex-direction: column;
        }

        .templateBtn {
          margin-top: 8px;
          width: fit-content;
        }

        .file-input {
          align-self: start;
        }

        .mb-24 { margin-bottom: 24px; }
        .mt-14 { margin-top: 14px; }
        .fade-in { animation: fadeIn 0.4s ease forwards; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media(max-width: 768px) {
          .grid2,
          .grid3 {
            grid-template-columns: 1fr;
          }

          .docRow {
            grid-template-columns: 1fr;
          }
          .title {
            font-size: 22px;
          }
          .form-card {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
