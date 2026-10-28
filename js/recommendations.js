/* ==========================================================================
   Smart Farmer Assistant - Module 4 & 5:
   Enhanced Crop Advisor, Side-by-Side Crop Comparison & Irrigation Planner
   Agronomic package of practices verified from ICAR, MPKV Rahuri & VNMKV Parbhani
   ========================================================================== */

// ==========================================================================
// CROP DATABASE: Verified Agronomic Guidelines & Extension Benchmarks
// ==========================================================================

const cropDatabase = [
  {
    id: "cropSoybean",
    name: { en: "Soybean (JS-335 / Phule Sangam)", mr: "सोयाबीन (फुले संगम / जेएस-३३५)", hi: "सोयाबीन (JS-335 / फुले संगम)" },
    icon: "🌱",
    suitableSoils: ["soilBlack", "soilRed"],
    suitableSeasons: ["seasonKharif"],
    suitableWater: ["waterRainfed", "waterBorewell", "waterCanal"],
    score: 95,
    sowingWindow: { en: "15 June - 10 July", mr: "१५ जून ते १० जुलै", hi: "15 जून से 10 जुलाई" },
    maturityDays: { en: "95 - 105 Days", mr: "९५ ते १०५ दिवस", hi: "95 से 105 दिन" },
    yieldPerAcre: { en: "10 - 12 Quintals / Acre", mr: "१० ते १२ क्विंटल / एकर", hi: "10 से 12 क्विंटल / एकड़" },
    estCostPerAcre: "₹ 14,000 - ₹ 17,000",
    whySuitable: {
      en: "Naturally fixes 30-40 kg atmospheric nitrogen per hectare; enriches soil for subsequent Rabi crops. Short duration fits two-crop cropping systems.",
      mr: "नैसर्गिकरीत्या हवेतील ३०-४० किलो नत्र जमिनीत स्थिर करते; यामुळे पुढील रब्बी पिकाला फायदा होतो. ९५-१०५ दिवसांचे पीक असल्याने दुबार पिकाचे नियोजन शक्य.",
      hi: "हवा से 30-40 किग्रा नाइट्रोजन प्रति हेक्टेयर स्थिर करता है, जिससे अगली रबी फसल की जमीन उपजाऊ बनती है। 95-105 दिन में तैयार होकर अगली फसल का समय देता है।"
    },
    risksAndLimitations: {
      en: "Highly sensitive to waterlogging (causes collar/root rot); prone to dry spells at pod-filling. Susceptible to Stem Fly and Spodoptera leaf-eating caterpillar.",
      mr: "शेतात पाणी साचल्यास मूळकूज व खोडकूज रोग होतो; दाणे भरताना पावसाचा खंड पडल्यास वजनात घट होते. खोडमाशी व लष्करी अळीचा संभाव्य धोका.",
      hi: "खेत में पानी भरने से जड़ सड़न का खतरा; दाना भरते समय सूखे से पैदावार पर असर। तना मक्खी व इल्ली का प्रकोप संभव।"
    },
    waterRequirement: {
      en: "450 - 500 mm. Needs 2-3 protective irrigations during dry spells, especially at flowering (35 days) and pod development (60 days).",
      mr: "४५० ते ५०० मिमी. पावसाचा खंड पडल्यास फुलोरा (३५ दिवस) व शेंगा भरणे (६० दिवस) या नाजूक अवस्थेत २-३ संरक्षित पाळ्या द्याव्यात.",
      hi: "450 से 500 मिमी। फूल आते समय (35 दिन) व फली बनते समय (60 दिन) 2-3 सुरक्षात्मक सिंचाइयां आवश्यक हैं।"
    },
    laborIntensity: {
      en: "Moderate. Mechanical threshers and seed drills reduce peak farm labor demand.",
      mr: "मध्यम. पेरणी यंत्र व मळणी यंत्र उपलब्ध असल्याने कमी मजुरांमध्ये काम होते.",
      hi: "मध्यम। बुआई व थ्रेशिंग मशीनों की उपलब्धता से श्रम लागत नियंत्रित रहती है।"
    },
    referenceUniv: {
      en: "MPKV Rahuri & VNMKV Parbhani Krishi Dainandini / ICAR-IISR Package of Practices",
      mr: "महात्मा फुले कृषी विद्यापीठ (राहुरी) व वसंतराव नाईक मराठवाडा कृषी विद्यापीठ (परभणी) शिफारस पुस्तिका",
      hi: "एमपीकेवी राहुरी व वीएनएमकेवी परभणी कृषि दैनंदिनी / आईसीएआर दिशा-निर्देश"
    }
  },
  {
    id: "cropCotton",
    name: { en: "Bt Cotton (Bollgard-II Varieties)", mr: "कापूस (बीट कॉटन - बोलगार्ड-२)", hi: "कपास (बीज बीटी कॉटन)" },
    icon: "☁️",
    suitableSoils: ["soilBlack"],
    suitableSeasons: ["seasonKharif"],
    suitableWater: ["waterBorewell", "waterCanal"],
    score: 92,
    sowingWindow: { en: "1 June - 25 June", mr: "१ जून ते २५ जून", hi: "1 जून से 25 जून" },
    maturityDays: { en: "150 - 180 Days", mr: "१५० ते १८० दिवस", hi: "150 से 180 दिन" },
    yieldPerAcre: { en: "12 - 15 Quintals / Acre", mr: "१२ ते १५ क्विंटल / एकर", hi: "12 से 15 क्विंटल / एकड़" },
    estCostPerAcre: "₹ 24,000 - ₹ 28,000",
    whySuitable: {
      en: "Major high-value commercial cash crop. Deep taproot system withstands moderate dry intervals in black cotton soils once vegetative frame is established.",
      mr: "उच्च आर्थिक परतावा देणारे नगदी पीक. खोल मुळांची रचना काळ्या कसदार जमिनीत ओलावा चांगल्या प्रकारे शोषून घेते.",
      hi: "प्रमुख व्यावसायिक नकदी फसल। गहरी जड़ें काली मिट्टी से गहराई से नमी सोखती हैं और पौधे को मजबूती देती हैं।"
    },
    risksAndLimitations: {
      en: "High production cost (seeds, plant protection); prolonged crop duration (up to 180 days). Critical risk of Pink Bollworm (बोंडअळी) and sucking pests (thrips, aphids).",
      mr: "बियाणे व औषधांचा अधिक खर्च; दीर्घ कालावधी (६ महिने). गुलाबी बोंडअळी व रसशोषक किडींचा (मावा, तुडतुडे) गंभीर प्रादुर्भाव होऊ शकतो.",
      hi: "अधिक लागत; 6 महीने की लंबी अवधि। गुलाबी सुंडी व रस चूसक कीटों का खतरा रहता है।"
    },
    waterRequirement: {
      en: "700 - 850 mm. Critical stages: Square initiation (45 days), flowering (75 days), and boll development (90-110 days).",
      mr: "७०० ते ८५० मिमी. पाते लागणे (४५ दिवस), फुले येणे (७५ दिवस) आणि बोंडे भरणे (९०-११० दिवस) या अवस्थांमध्ये नियमित ओलावा लागतो.",
      hi: "700 से 850 मिमी। फूल व टिंडे बनते समय नियमित सिंचाई या नमी आवश्यक है।"
    },
    laborIntensity: {
      en: "High. Multiple manual pickings and weedings require substantial manual farm labor.",
      mr: "खूप जास्त. कापूस वेचणी आणि खुरपणीसाठी अधिक मनुष्यबळ लागते.",
      hi: "बहुत अधिक। कई बार कपास की तुड़ाई और निराई के लिए अधिक मजदूरों की आवश्यकता होती है।"
    },
    referenceUniv: {
      en: "VNMKV Parbhani & ICAR-CICR Nagpur Package of Practices",
      mr: "वसंतराव नाईक मराठवाडा कृषी विद्यापीठ, परभणी व केंद्रीय कापूस संशोधन संस्था (ICAR-CICR)",
      hi: "वीएनएमकेवी परभणी व आईसीएआर-सीआईसीआर नागपुर पैकेज ऑफ प्रैक्टिसेज"
    }
  },
  {
    id: "cropWheat",
    name: { en: "Wheat (Lokwan / Phule Samadhan)", mr: "गहू (लोकवन / फुले समाधान)", hi: "गेहूँ (लोकवन / फुले समाधान)" },
    icon: "🌾",
    suitableSoils: ["soilBlack", "soilRed"],
    suitableSeasons: ["seasonRabi"],
    suitableWater: ["waterBorewell", "waterCanal"],
    score: 94,
    sowingWindow: { en: "1 November - 25 November", mr: "१ नोव्हेंबर ते २५ नोव्हेंबर", hi: "1 नवंबर से 25 नवंबर" },
    maturityDays: { en: "110 - 120 Days", mr: "११० ते १२० दिवस", hi: "110 से 120 दिन" },
    yieldPerAcre: { en: "18 - 22 Quintals / Acre", mr: "१८ ते २२ क्विंटल / एकर", hi: "18 से 22 क्विंटल / एकड़" },
    estCostPerAcre: "₹ 13,000 - ₹ 16,000",
    whySuitable: {
      en: "Assured staple grain with MSP price stability. Perfect rotation crop after Kharif soybean or groundnut; produces high-protein grain plus nutritious livestock dry fodder (भुसा).",
      mr: "शाश्वत भाव व हमीभाव असणारे मुख्य अन्नधान्य. खरीप सोयाबीन किंवा भुईमुगाच्या काढणीनंतर शेतात उत्कृष्ट बसते; पशुधनासाठी पौष्टिक भुसा मिळतो.",
      hi: "न्यूनतम समर्थन मूल्य (MSP) और सुरक्षित बाजार मांग। खरीफ सोयाबीन के बाद सबसे आदर्श फसल; मवेशियों के लिए पौष्टिक सूखा भूसा भी मिलता है।"
    },
    risksAndLimitations: {
      en: "Requires cold winter night temperatures (15-20°C); late sowing exposes grain to terminal heat stress in February causing shriveled grains. Vulnerable to Rust (तांबेरा).",
      mr: "थंड हवामान आवश्यक; उशिरा पेरणी केल्यास फेब्रुवारीतील उन्हामुळे दाणे भरड न होता बारीक चपटे राहतात. तांबेरा रोग व वाळवीचा धोका.",
      hi: "ठंड की जरूरत; देर से बुआई पर फरवरी की गर्मी से दाना सिकुड़ जाता है। गेरुआ (रस्ट) व दीमक का खतरा।"
    },
    waterRequirement: {
      en: "450 - 550 mm. Crown Root Initiation (CRI at 21 days), jointing (45 days), and flowering (65 days) are non-negotiable critical stages.",
      mr: "४५० ते ५५० मिमी. मुकुट मुळे फुटणे (२१ दिवस), कांडी अवस्था (४५ दिवस) आणि फुलोरा (६५ दिवस) या वेळेत पाणी देणे अत्यावश्यक असते.",
      hi: "450 से 550 मिमी। बुआई के 21 दिन बाद मुकुट जड़ बनते समय पहली सिंचाई सबसे महत्वपूर्ण है।"
    },
    laborIntensity: {
      en: "Low to Moderate. Mechanized harvesting via combine harvesters reduces labor dependency.",
      mr: "कमी ते मध्यम. कंबाईन हार्वेस्टर उपलब्ध असल्याने मजुरांची चिंता कमी भासते.",
      hi: "कम से मध्यम। कंबाइन हार्वेस्टर से कटाई आसानी से हो जाती है।"
    },
    referenceUniv: {
      en: "MPKV Rahuri Wheat Research Station, Niphad & ICAR-IIWBR",
      mr: "महात्मा फुले कृषी विद्यापीठ (गहू संशोधन केंद्र, निफाड) व ICAR-IIWBR",
      hi: "एमपीकेवी राहुरी गेहूं अनुसंधान केंद्र, निफाड व आईसीएआर-आईआईडब्ल्यूबीआर"
    }
  },
  {
    id: "cropChana",
    name: { en: "Gram / Chickpea (Phule Vikram / Digvijay)", mr: "हरभरा (फुले विक्रम / दिग्विजय)", hi: "चना (फुले विक्रम / दिग्विजय)" },
    icon: "🥣",
    suitableSoils: ["soilBlack", "soilRed", "soilSandy"],
    suitableSeasons: ["seasonRabi"],
    suitableWater: ["waterRainfed", "waterBorewell"],
    score: 91,
    sowingWindow: { en: "15 October - 15 November", mr: "१५ ऑक्टोबर ते १५ नोव्हेंबर", hi: "15 अक्टूबर से 15 नवंबर" },
    maturityDays: { en: "95 - 105 Days", mr: "९५ ते १०५ दिवस", hi: "95 से 105 दिन" },
    yieldPerAcre: { en: "8 - 11 Quintals / Acre", mr: "८ ते ११ क्विंटल / एकर", hi: "8 से 11 क्विंटल / एकड़" },
    estCostPerAcre: "₹ 9,000 - ₹ 12,000",
    whySuitable: {
      en: "Thrives on residual soil moisture in deep black soils; extremely low water budget. Enriches soil fertility and provides high protein grain.",
      mr: "काळ्या जमिनीत शिल्लक ओलाव्यावर विनापाणी सुद्धा उत्तम येते; सर्वात कमी पाण्याची गरज. जमिनीची सुपीकता वाढवणारे फायदेशीर पीक.",
      hi: "काली मिट्टी की बची हुई नमी पर भी अच्छी पैदावार देता है; सबसे कम पानी की आवश्यकता। जमीन की सेहत सुधारता है।"
    },
    risksAndLimitations: {
      en: "Severe susceptibility to Pod Borer (घाटे अळी - Helicoverpa armigera); cloudy weather at flowering causes severe flower drop. Over-irrigation causes excessive vegetative growth without pods.",
      mr: "घाटे अळीचा प्रादुर्भाव वेगाने होतो; फुलोऱ्याच्या वेळी ढगाळ हवामान झाल्यास फुलगळ होते. अवाजवी पाणी दिल्यास झाड माजते व घाटे कमी बसतात.",
      hi: "फली छेदक इल्ली का बड़ा खतरा; फूल आते समय बादल होने पर फूल झड़ते हैं। अधिक पानी से वानस्पतिक वृद्धि ज्यादा होती है।"
    },
    waterRequirement: {
      en: "250 - 350 mm. Maximum 1-2 light irrigations at branching (30-35 days) and pod development (60-65 days). Avoid irrigating during peak flowering.",
      mr: "२५० ते ३५० मिमी. संपूर्ण हंगामात फक्त १ ते २ हलक्या पाळ्या पुरेशा (फांद्या फुटताना व दाणे भरताना). पूर्ण फुलोऱ्यात पाणी देणे टाळावे.",
      hi: "250 से 350 मिमी। पूरे मौसम में केवल 1-2 हल्की सिंचाई (शाखाएं निकलते समय व दाना भरते समय) काफी हैं।"
    },
    laborIntensity: {
      en: "Low. Short plant stature, minimal weeding needed after early crop canopy develops.",
      mr: "अतिशय कमी. सुरुवातीच्या एका खुरपणीनंतर फारशी मजुरी लागत नाही.",
      hi: "कम। शुरुआती एक निराई के बाद ज्यादा मजदूरी नहीं लगती।"
    },
    referenceUniv: {
      en: "MPKV Rahuri Pulses Research Specialist & ICAR-IIPR",
      mr: "महात्मा फुले कृषी विद्यापीठ, राहुरी कडधान्य संशोधन विभाग व ICAR-IIPR",
      hi: "एमपीकेवी राहुरी दलहन विभाग व आईसीएआर-आईआईपीआर"
    }
  },
  {
    id: "cropOnion",
    name: { en: "Red Onion (Phule Samarth / N-53)", mr: "लाल कांदा (फुले समर्थ / एन-५३)", hi: "लाल प्याज (फुले समर्थ / N-53)" },
    icon: "🧅",
    suitableSoils: ["soilBlack", "soilRed"],
    suitableSeasons: ["seasonRabi", "seasonSummer", "seasonKharif"],
    suitableWater: ["waterBorewell", "waterCanal"],
    score: 89,
    sowingWindow: { en: "15 November - 25 December", mr: "१५ नोव्हेंबर ते २५ डिसेंबर", hi: "15 नवंबर से 25 दिसंबर" },
    maturityDays: { en: "115 - 130 Days", mr: "११५ ते १३० दिवस", hi: "115 से 130 दिन" },
    yieldPerAcre: { en: "100 - 130 Quintals / Acre", mr: "१०० ते १३० क्विंटल / एकर", hi: "100 से 130 क्विंटल / एकड़" },
    estCostPerAcre: "₹ 38,000 - ₹ 45,000",
    whySuitable: {
      en: "High revenue commercial cash crop. Suitable for multi-season cultivation with high per-acre monetary returns in well-drained soils.",
      mr: "उत्कृष्ट नफा मिळवून देणारे नगदी पीक. पाण्याचा उत्तम निचरा असणाऱ्या मध्यम जमिनीत एकरी १००-१३० क्विंटल उत्पादन क्षमता.",
      hi: "उत्कृष्ट नकदी फसल। अच्छी जल निकासी वाली जमीन में प्रति एकड़ 100-130 क्विंटल की बंपर पैदावार क्षमता।"
    },
    risksAndLimitations: {
      en: "High market price volatility. Perishable produce subject to storage rotting and sprouting. Highly prone to Thrips (फुलकिडे) and Purple Blotch (जांभळा करपा).",
      mr: "बाजारभावातील तीव्र चढ-उतार; साठवणुकीत घट व सडण्याचा धोका. फुलकिडे (थ्रिप्स) आणि जांभळा करपा रोगाचा तीव्र प्रादुर्भाव होऊ शकतो.",
      hi: "बाजार भाव में भारी उतार-चढ़ाव। भंडारण में सड़न का खतरा। थ्रिप्स व बैंगनी धब्बा (करपा) रोग का प्रकोप।"
    },
    waterRequirement: {
      en: "500 - 600 mm. Requires regular shallow irrigations (every 6-8 days in winter). Discontinue watering 15 days prior to harvest to prevent bulb rot.",
      mr: "५०० ते ६०० मिमी. हिवाळ्यात दर ६ ते ८ दिवसांनी हलके पाणी लागते. काढणीच्या १५ दिवस आधी पाणी पूर्ण बंद करणे आवश्यक.",
      hi: "500 से 600 मिमी। हर 6-8 दिन में हल्की सिंचाई चाहिए। खुदाई से 15 दिन पहले पानी पूरी तरह बंद करना जरूरी।"
    },
    laborIntensity: {
      en: "Very High. Nursery raising, manual transplanting, weeding, digging, and sorting require extensive farm labor.",
      mr: "खूप जास्त. रोपवाटिका, पुनर्लागवड, खुरपणी, काढणी व प्रतवारीसाठी मोठे मनुष्यबळ लागते.",
      hi: "बहुत अधिक। पौध तैयार करना, रोपाई, निराई, खुदाई और छंटाई में अत्यधिक मजदूरों की जरूरत होती है।"
    },
    referenceUniv: {
      en: "ICAR-DOGR (Directorate of Onion and Garlic Research), Pune & MPKV Rahuri",
      mr: "केंद्रीय कांदा व लसूण संशोधन संचालनालय (ICAR-DOGR), राजगुरुनगर व म.फु.कृ.वि. राहुरी",
      hi: "आईसीएआर-डीओजीआर राजगुरुनगर (पुणे) व एमपीकेवी राहुरी"
    }
  },
  {
    id: "cropGroundnut",
    name: { en: "Groundnut (TAG-24 / Phule Unnati)", mr: "भुईमूग (टीएजी-२४ / फुले उन्नती)", hi: "मूंगफली (TAG-24 / फुले उन्नती)" },
    icon: "🥜",
    suitableSoils: ["soilSandy", "soilRed"],
    suitableSeasons: ["seasonSummer", "seasonKharif"],
    suitableWater: ["waterBorewell", "waterCanal"],
    score: 88,
    sowingWindow: { en: "15 January - 15 February", mr: "१५ जानेवारी ते १५ फेब्रुवारी", hi: "15 जनवरी से 15 फरवरी" },
    maturityDays: { en: "105 - 115 Days", mr: "१०५ ते ११५ दिवस", hi: "105 से 115 दिन" },
    yieldPerAcre: { en: "12 - 15 Quintals / Acre", mr: "१२ ते १५ क्विंटल / एकर", hi: "12 से 15 क्विंटल / एकड़" },
    estCostPerAcre: "₹ 16,000 - ₹ 20,000",
    whySuitable: {
      en: "High-oil commercial crop producing nutritious green livestock fodder. Short maturity window; fits nicely in sandy-loam and light soils.",
      mr: "दुहेरी फायदा: दर्जेदार तेलबिया उत्पादन आणि दुभत्या जनावरांसाठी पौष्टिक हिरवा पाला. हलक्या व पोयटा जमिनीत उत्कृष्ट उत्पादन.",
      hi: "दोहरा लाभ: तेल व दाना उत्पादन और मवेशियों के लिए पौष्टिक हरा चारा। हल्की व दोमट जमीन में सबसे उपयुक्त।"
    },
    risksAndLimitations: {
      en: "Strictly requires friable, loose soil for peg penetration and easy pod harvesting. Sticky heavy black clay causes high pod loss during digging. Prone to Tikka disease.",
      mr: "माती भुसभुशीत असावी लागते; चिकणमातीच्या भारी जमिनीत आऱ्या जमिनीत जात नाहीत व काढणीच्या वेळी शेंगा तुटून जमिनीत राहतात. टिक्का रोगाचा धोका.",
      hi: "भुरभुरी व दोमट जमीन जरूरी; भारी काली मिट्टी में सुइयां जमीन में नहीं घुस पातीं और उखाड़ते समय दाने टूट जाते हैं। टिक्का रोग का खतरा।"
    },
    waterRequirement: {
      en: "450 - 550 mm. Peg formation (35-45 days) and pod development (65-80 days) are non-negotiable watering stages.",
      mr: "४५० ते ५५० मिमी. आऱ्या सुटताना (३५-४५ दिवस) आणि शेंगा भरताना (६५-८० दिवस) पाणी खंडित होता कामा नये.",
      hi: "450 से 550 मिमी। सुइयां जमीन में जाते समय और दाना भरते समय नमी अनिवार्य है।"
    },
    laborIntensity: {
      en: "Moderate to High. Digging and pod stripping require substantial labor unless mechanical pickers are used.",
      mr: "मध्यम ते जास्त. उपटणी आणि शेंगा तोडण्यासाठी मजुरांची आवश्यकता असते.",
      hi: "मध्यम से ज्यादा। उखाड़ने और फलियां तोड़ने में श्रम की आवश्यकता होती है।"
    },
    referenceUniv: {
      en: "ICAR-DGR Junagadh & MPKV Rahuri Oilseeds Research Scheme",
      mr: "महात्मा फुले कृषी विद्यापीठ (गळीतधान्य संशोधन विभाग) व ICAR-DGR",
      hi: "आईसीएआर-डीजीआर जूनागढ़ व एमपीकेवी राहुरी तिलहन विभाग"
    }
  },
  {
    id: "cropMaize",
    name: { en: "Maize / Corn (Pioneer / African Tall)", mr: "मका (पायोनियर / राजर्षी / आफ्रिकन टॉल)", hi: "मक्का (पायोनियर / संकर किस्में)" },
    icon: "🌽",
    suitableSoils: ["soilBlack", "soilRed"],
    suitableSeasons: ["seasonKharif", "seasonRabi", "seasonSummer"],
    suitableWater: ["waterBorewell", "waterCanal"],
    score: 87,
    sowingWindow: { en: "15 June - 15 July", mr: "१५ जून ते १५ जुलै", hi: "15 जून से 15 जुलाई" },
    maturityDays: { en: "95 - 110 Days", mr: "९५ ते ११० दिवस", hi: "95 से 110 दिन" },
    yieldPerAcre: { en: "25 - 32 Quintals / Acre", mr: "२५ ते ३२ क्विंटल / एकर", hi: "25 से 32 क्विंटल / एकड़" },
    estCostPerAcre: "₹ 14,000 - ₹ 17,000",
    whySuitable: {
      en: "Highest grain yield per acre among cereals. High industrial poultry feed and starch factory demand. Exceptional green silage fodder for dairy cows.",
      mr: "अन्नधान्यांमध्ये एकरी सर्वाधिक उत्पादन (२५-३० क्विंटल). पोल्ट्री फीड व स्टार्च कारखान्यांकडून नियमित मागणी; दुग्धव्यवसायासाठी उत्कृष्ट सायलेज चारा.",
      hi: "अनाजों में प्रति एकड़ सबसे अधिक पैदावार। पोल्ट्री फीड व स्टार्च फैक्ट्रियों से निरंतर मांग; दुधारू पशुओं के लिए बेहतरीन साइलेज चारा।"
    },
    risksAndLimitations: {
      en: "Extreme vulnerability to Fall Armyworm (लष्करी अळी - Spodoptera frugiperda) requiring rigorous pheromone trapping and timely spraying. Heavy nitrogen feeder.",
      mr: "अमेरिकन लष्करी अळीचा (Fall Armyworm) तीव्र धोका; वेळीच नियंत्रण न केल्यास पीक उद्ध्वस्त होते. जमिनीतील नत्राची भरपूर उचल करणारे पीक.",
      hi: "फॉल आर्मीवॉर्म (अमेरिकन सैनिक कीट) का भारी खतरा; समय पर कीटनाशक न देने पर फसल चौपट हो जाती है। खाद की ज्यादा जरूरत।"
    },
    waterRequirement: {
      en: "500 - 600 mm. Tasseling (चोय येणे at 45-50 days) and silking/grain formation (कणीस भरणे at 65-75 days) are critical moisture stages.",
      mr: "५०० ते ६०० मिमी. तुरा बाहेर पडणे (४५-५० दिवस) आणि कणसात दाणे भरणे (६५-७५ दिवस) या अवस्थेत पाणी अजिबात तुटू देऊ नये.",
      hi: "500 से 600 मिमी। मंजर निकलने (45-50 दिन) और भुट्टे में दाना भरते समय पानी की कमी नहीं होनी चाहिए।"
    },
    laborIntensity: {
      en: "Moderate. Mechanical corn shellers and harvesters widely available.",
      mr: "मध्यम. मका मळणी यंत्र सहज उपलब्ध असल्याने मजूर खर्च नियंत्रणात राहतो.",
      hi: "मध्यम। मक्का थ्रेशर और कटाई उपकरण आसानी से मिल जाते हैं।"
    },
    referenceUniv: {
      en: "ICAR-IIMR (Indian Institute of Maize Research) & MPKV Rahuri",
      mr: "भारतीय मका संशोधन संस्था (ICAR-IIMR) व म.फु.कृ.वि. राहुरी",
      hi: "आईसीएआर-आईआईएमआर व एमपीकेवी राहुरी"
    }
  },
  {
    id: "cropTur",
    name: { en: "Pigeon Pea / Tur (BDN-711 / Phule Rajeshwari)", mr: "तूर (बीडीएन-७११ / फुले राजेश्वरी)", hi: "अरहर / तूर (BDN-711 / फुले राजेश्वरी)" },
    icon: "🌾",
    suitableSoils: ["soilBlack", "soilRed"],
    suitableSeasons: ["seasonKharif"],
    suitableWater: ["waterRainfed", "waterBorewell"],
    score: 86,
    sowingWindow: { en: "15 June - 10 July", mr: "१५ जून ते १० जुलै", hi: "15 जून से 10 जुलाई" },
    maturityDays: { en: "150 - 170 Days", mr: "१५० ते १७० दिवस", hi: "150 से 170 दिन" },
    yieldPerAcre: { en: "7 - 10 Quintals / Acre", mr: "७ ते १० क्विंटल / एकर", hi: "7 से 10 क्विंटल / एकड़" },
    estCostPerAcre: "₹ 11,000 - ₹ 14,000",
    whySuitable: {
      en: "Deep taproot (breaks hard subsoils); exceptional drought tolerance once rooted. Valuable high-protein pulse; excellent intercrop with soybean or cotton.",
      mr: "खोल मुळांमुळे कठीण जमिनीची मशागत होते; एकदा वाढल्यावर दुष्काळाचा प्रतिकार करते. सोयाबीन किंवा कापसात आंतरपीक म्हणून अत्यंत फायदेशीर.",
      hi: "गहरी जड़ें कठोर मिट्टी को तोड़ती हैं; सूखा सहने की अद्भुत क्षमता। सोयाबीन व कपास में अंतरवर्ती (इंटरक्रॉप) फसल के रूप में सबसे मुफीद।"
    },
    risksAndLimitations: {
      en: "Prolonged growing season (up to 6 months); highly susceptible to Pod Borer (हेलिकोव्हर्पा) and Pod Fly during flowering and pod development; wilt in poorly drained fields.",
      mr: "दीर्घ कालावधी (६ महिने); फुलोरा व शेंगा भरताना शेंगमाशी व शेंगा पोखरणारी अळीचा मोठा प्रादुर्भाव होतो; निचरा नसलेल्या शेतात मर रोगाचा धोका.",
      hi: "लंबी अवधि (6 महीने); फली मक्खी व फली छेदक इल्ली का भारी खतरा; पानी जमा होने पर उकठा (मुरझान) रोग का खतरा।"
    },
    waterRequirement: {
      en: "350 - 450 mm. Naturally rainfed, but 1-2 protective irrigations at flower initiation and pod filling increase yield by 35%.",
      mr: "३५० ते ४५० मिमी. मुख्यत्वे पावसावर येणारे पीक; फुलोरा व दाणे भरताना केवळ १ किंवा २ संरक्षित पाळ्या दिल्यास उत्पादनात ३५% वाढ होते.",
      hi: "350 से 450 मिमी। बारिश आधारित फसल; फली बनते समय सिर्फ 1-2 सुरक्षात्मक सिंचाई देने से पैदावार 35% बढ़ जाती है।"
    },
    laborIntensity: {
      en: "Moderate. Minimal early weeding needed; harvest is manual.",
      mr: "मध्यम. सुरुवातीला कमी मजुरी; काढणी व झोडणीसाठी मजुरांची गरज भासते.",
      hi: "मध्यम। शुरुआत में कम निराई; कटाई व गहाई के समय श्रम की आवश्यकता होती है।"
    },
    referenceUniv: {
      en: "VNMKV Parbhani Pulses Research Scheme & ICAR-IIPR",
      mr: "वसंतराव नाईक मराठवाडा कृषी विद्यापीठ, परभणी कडधान्य संशोधन योजना व ICAR-IIPR",
      hi: "वीएनएमकेवी परभणी दलहन अनुसंधान व आईसीएआर-आईआईपीआर"
    }
  }
];

// ==========================================================================
// CROP RECOMMENDATION GENERATOR
// ==========================================================================

function handleCropRecommendation(event) {
  if (event) event.preventDefault();
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  const soil = document.getElementById("ai-soil-type") ? document.getElementById("ai-soil-type").value : "soilBlack";
  const season = document.getElementById("ai-season") ? document.getElementById("ai-season").value : "seasonKharif";
  const water = document.getElementById("ai-water-source") ? document.getElementById("ai-water-source").value : "waterBorewell";
  const acres = parseFloat(document.getElementById("ai-land-size") ? document.getElementById("ai-land-size").value : 2) || 1;

  const resultsContainer = document.getElementById("ai-recommendations-output");
  if (!resultsContainer) return;

  resultsContainer.innerHTML = "";

  // Dynamic agronomic scoring algorithm
  const scoredCrops = cropDatabase.map(crop => {
    let matchScore = 70;
    if (crop.suitableSoils.includes(soil)) matchScore += 12;
    if (crop.suitableSeasons.includes(season)) matchScore += 14;
    if (crop.suitableWater.includes(water)) matchScore += 10;
    if (matchScore > 98) matchScore = 98;
    return { ...crop, dynamicScore: matchScore };
  });

  // Sort by highest match score
  scoredCrops.sort((a, b) => b.dynamicScore - a.dynamicScore);

  // Take top 4 suitable recommendations
  const topCrops = scoredCrops.slice(0, 4);

  topCrops.forEach(item => {
    const card = document.createElement("div");
    card.className = "recommendation-card";

    const cropTitle = item.name[lang] || item.name.en;
    const sowWindow = item.sowingWindow[lang] || item.sowingWindow.en;
    const duration = item.maturityDays[lang] || item.maturityDays.en;
    const yieldText = item.yieldPerAcre[lang] || item.yieldPerAcre.en;
    const whyText = item.whySuitable[lang] || item.whySuitable.en;
    const riskText = item.risksAndLimitations[lang] || item.risksAndLimitations.en;
    const univText = item.referenceUniv[lang] || item.referenceUniv.en;

    card.innerHTML = `
      <div class="rec-header">
        <div class="rec-crop-name">${item.icon} ${cropTitle}</div>
        <span class="rec-badge-score">${dict.matchScore}: ${item.dynamicScore}%</span>
      </div>

      <div class="rec-details-grid">
        <div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${dict.sowingWindow}:</span>
          <div><strong>📅 ${sowWindow}</strong></div>
        </div>
        <div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${dict.maturityPeriod}:</span>
          <div><strong>⏱️ ${duration}</strong></div>
        </div>
        <div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${dict.expectedYield}:</span>
          <div><strong>🌾 ${yieldText}</strong></div>
        </div>
        <div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${dict.estimatedCost}:</span>
          <div><strong>💰 ${item.estCostPerAcre}</strong></div>
        </div>
      </div>

      <!-- Why Suitable Agronomic Explanation -->
      <div class="rec-reason-box">
        <strong style="color: var(--primary-dark); display: block; margin-bottom: 3px;">
          ✅ ${dict.whySuitableTitle}:
        </strong>
        <p style="margin: 0; color: var(--text-main); line-height: 1.45;">
          ${whyText}
        </p>
      </div>

      <!-- Risks, Pests & Limitations -->
      <div class="rec-risk-box">
        <strong style="color: #B78103; display: block; margin-bottom: 3px;">
          ⚠️ ${dict.risksLimitationsTitle}:
        </strong>
        <p style="margin: 0; color: #5D4037; line-height: 1.45;">
          ${riskText}
        </p>
      </div>

      <!-- Verifiable University Reference -->
      <div style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span class="rec-univ-box">
          🏛️ ${univText}
        </span>
      </div>
    `;
    resultsContainer.appendChild(card);
  });

  // Notice box: KVK Soil testing & Benchmark disclaimer
  const noticeBox = document.createElement("div");
  noticeBox.className = "notice-box";
  noticeBox.innerHTML = `
    <span style="font-size: 1.3rem;">ℹ️</span>
    <div>
      <strong>${dict.kvkTestingNotice}</strong>
      <div style="font-size: 0.82rem; margin-top: 3px; opacity: 0.9;">
        ${dict.noGuaranteesNotice}
      </div>
    </div>
  `;
  resultsContainer.appendChild(noticeBox);

  if (typeof showToast === "function") {
    showToast(lang === "mr" ? "पीक शिफारसी तयार केल्या!" : (lang === "hi" ? "फसल सिफारिशें तैयार हैं!" : "Crop recommendations ready!"));
  }
}

// ==========================================================================
// SIDE-BY-SIDE CROP COMPARISON TOOL
// ==========================================================================

function initCropComparisonSelectors() {
  const lang = window.currentLanguage || "en";
  const selectA = document.getElementById("compare-crop-a");
  const selectB = document.getElementById("compare-crop-b");

  if (!selectA || !selectB) return;

  const currentValA = selectA.value || "cropSoybean";
  const currentValB = selectB.value || "cropCotton";

  selectA.innerHTML = "";
  selectB.innerHTML = "";

  cropDatabase.forEach((c, index) => {
    const optA = document.createElement("option");
    optA.value = c.id;
    optA.textContent = `${c.icon} ${c.name[lang] || c.name.en}`;
    if (c.id === currentValA) optA.selected = true;
    selectA.appendChild(optA);

    const optB = document.createElement("option");
    optB.value = c.id;
    optB.textContent = `${c.icon} ${c.name[lang] || c.name.en}`;
    if (c.id === currentValB) optB.selected = true;
    selectB.appendChild(optB);
  });

  // Perform initial comparison render
  handleCropComparison();
}

function handleCropComparison(event) {
  if (event) event.preventDefault();
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  const selectA = document.getElementById("compare-crop-a");
  const selectB = document.getElementById("compare-crop-b");
  const outputContainer = document.getElementById("crop-comparison-output");

  if (!selectA || !selectB || !outputContainer) return;

  const cropAId = selectA.value;
  const cropBId = selectB.value;

  const cropA = cropDatabase.find(c => c.id === cropAId) || cropDatabase[0];
  const cropB = cropDatabase.find(c => c.id === cropBId) || cropDatabase[1];

  outputContainer.innerHTML = `
    <div class="crop-compare-grid">
      <!-- Crop A Column -->
      <div class="crop-compare-card">
        <div class="compare-card-header">
          <span style="font-size: 2.2rem;">${cropA.icon}</span>
          <div>
            <h4 style="font-size: 1.25rem; color: var(--primary-dark); margin: 0;">
              ${cropA.name[lang] || cropA.name.en}
            </h4>
            <span class="badge badge-success" style="margin-top: 4px;">${cropA.sowingWindow[lang] || cropA.sowingWindow.en}</span>
          </div>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">⏱️ ${dict.maturityPeriod}</span>
          <span class="compare-stat-value">${cropA.maturityDays[lang] || cropA.maturityDays.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">💧 ${dict.waterReqLabel}</span>
          <span class="compare-stat-value">${cropA.waterRequirement[lang] || cropA.waterRequirement.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">🌾 ${dict.expectedYield} (Benchmark)</span>
          <span class="compare-stat-value">${cropA.yieldPerAcre[lang] || cropA.yieldPerAcre.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">💰 ${dict.estimatedCost}</span>
          <span class="compare-stat-value">${cropA.estCostPerAcre}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">👨‍🌾 ${dict.laborIntensityLabel}</span>
          <span class="compare-stat-value">${cropA.laborIntensity[lang] || cropA.laborIntensity.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">✅ ${dict.whySuitableTitle}</span>
          <span class="compare-stat-value" style="color: var(--primary-dark);">${cropA.whySuitable[lang] || cropA.whySuitable.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label" style="color: #C62828;">⚠️ ${dict.risksLimitationsTitle}</span>
          <span class="compare-stat-value" style="color: #5D4037;">${cropA.risksAndLimitations[lang] || cropA.risksAndLimitations.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">🏛️ ${dict.agriUnivRef}</span>
          <span class="compare-stat-value" style="font-size: 0.82rem; color: var(--text-muted);">${cropA.referenceUniv[lang] || cropA.referenceUniv.en}</span>
        </div>
      </div>

      <!-- Crop B Column -->
      <div class="crop-compare-card">
        <div class="compare-card-header">
          <span style="font-size: 2.2rem;">${cropB.icon}</span>
          <div>
            <h4 style="font-size: 1.25rem; color: var(--primary-dark); margin: 0;">
              ${cropB.name[lang] || cropB.name.en}
            </h4>
            <span class="badge badge-success" style="margin-top: 4px;">${cropB.sowingWindow[lang] || cropB.sowingWindow.en}</span>
          </div>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">⏱️ ${dict.maturityPeriod}</span>
          <span class="compare-stat-value">${cropB.maturityDays[lang] || cropB.maturityDays.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">💧 ${dict.waterReqLabel}</span>
          <span class="compare-stat-value">${cropB.waterRequirement[lang] || cropB.waterRequirement.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">🌾 ${dict.expectedYield} (Benchmark)</span>
          <span class="compare-stat-value">${cropB.yieldPerAcre[lang] || cropB.yieldPerAcre.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">💰 ${dict.estimatedCost}</span>
          <span class="compare-stat-value">${cropB.estCostPerAcre}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">👨‍🌾 ${dict.laborIntensityLabel}</span>
          <span class="compare-stat-value">${cropB.laborIntensity[lang] || cropB.laborIntensity.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">✅ ${dict.whySuitableTitle}</span>
          <span class="compare-stat-value" style="color: var(--primary-dark);">${cropB.whySuitable[lang] || cropB.whySuitable.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label" style="color: #C62828;">⚠️ ${dict.risksLimitationsTitle}</span>
          <span class="compare-stat-value" style="color: #5D4037;">${cropB.risksAndLimitations[lang] || cropB.risksAndLimitations.en}</span>
        </div>

        <div class="compare-stat-row">
          <span class="compare-stat-label">🏛️ ${dict.agriUnivRef}</span>
          <span class="compare-stat-value" style="font-size: 0.82rem; color: var(--text-muted);">${cropB.referenceUniv[lang] || cropB.referenceUniv.en}</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// MODULE 5: WEATHER-AWARE IRRIGATION & PERSISTENT IRRIGATION LOG
// ==========================================================================

function getIrrigationApiBase() {
  const base = (typeof window !== "undefined" && typeof window.getApiBase === "function")
    ? window.getApiBase()
    : "http://127.0.0.1:8000";
  return `${base}/api/irrigation`;
}
const API_IRR_BASE = {
  toString: getIrrigationApiBase,
  valueOf: getIrrigationApiBase
};
const STORAGE_KEY_PENDING_IRR = "smart_farmer_pending_irrigation_logs";
const STORAGE_KEY_CACHED_IRR = "smart_farmer_cached_irrigation_logs";

// Demo historical irrigation records when backend is initially offline
const fallbackDemoIrrigationLogs = [
  {
    id: "demo_101",
    crop_name: "Soybean",
    irrigation_date: "2026-10-25",
    duration_hours: 3.5,
    water_quantity_liters: 14000,
    irrigation_method: "methodDrip",
    notes: "Flowering stage first protective watering",
    isOffline: false
  },
  {
    id: "demo_102",
    crop_name: "Onion",
    irrigation_date: "2026-10-21",
    duration_hours: 2.0,
    water_quantity_liters: 8500,
    irrigation_method: "methodSprinkler",
    notes: "Bed preparation and nursery transplanting",
    isOffline: false
  }
];

// 1. Weather-Aware 48-Hour Rainfall & Irrigation Advisory
function updateWeatherAwareIrrigationAlert() {
  const container = document.getElementById("irrigation-weather-alert-container");
  if (!container) return;

  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  const cachedStr = localStorage.getItem("smart_farmer_weather_cache");
  if (!cachedStr) {
    container.innerHTML = `
      <div class="irr-advisory-card info">
        <div class="irr-advisory-icon">ℹ️</div>
        <div class="irr-advisory-content">
          <h4>${dict.rainAlertUnavailableTitle}</h4>
          <p>${dict.rainAlertUnavailableDesc}</p>
          <div class="irr-advisory-meta">
            <span>💡 ${dict.decisionSupportNote}</span>
          </div>
        </div>
      </div>
    `;
    return;
  }

  let weatherData = null;
  try {
    const parsed = JSON.parse(cachedStr);
    weatherData = parsed.data;
  } catch (e) {
    console.error("Failed to parse weather cache:", e);
  }

  if (!weatherData) return;

  let rainSum48h = 0;
  let periodDates = "";

  // Exact next 48 hours calculation via hourly data where available
  if (weatherData.hourly && Array.isArray(weatherData.hourly.precipitation) && Array.isArray(weatherData.hourly.time)) {
    const nowIso = new Date().toISOString();
    let startIndex = weatherData.hourly.time.findIndex(t => t >= nowIso.slice(0, 13));
    if (startIndex === -1) startIndex = 0;
    const endIndex = Math.min(startIndex + 48, weatherData.hourly.precipitation.length);

    let sum = 0;
    for (let i = startIndex; i < endIndex; i++) {
      sum += (Number(weatherData.hourly.precipitation[i]) || 0);
    }
    rainSum48h = sum;

    const startDate = new Date(weatherData.hourly.time[startIndex]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const endDate = new Date(weatherData.hourly.time[endIndex - 1]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    periodDates = `${startDate} - ${endDate}`;
  } else if (weatherData.daily && Array.isArray(weatherData.daily.precipitation_sum)) {
    // Fallback to daily Day 0 + Day 1
    const p0 = Number(weatherData.daily.precipitation_sum[0]) || 0;
    const p1 = Number(weatherData.daily.precipitation_sum[1]) || 0;
    rainSum48h = p0 + p1;

    const d0 = weatherData.daily.time && weatherData.daily.time[0] ? weatherData.daily.time[0] : "";
    const d1 = weatherData.daily.time && weatherData.daily.time[1] ? weatherData.daily.time[1] : "";
    periodDates = `${d0}, ${d1}`;
  }

  const rainFormatted = rainSum48h.toFixed(1);

  if (rainSum48h > 10.0) {
    const desc = dict.rainAlertHighDesc.replace("{rain}", rainFormatted).replace("{dates}", periodDates);
    container.innerHTML = `
      <div class="irr-advisory-card warning">
        <div class="irr-advisory-icon">🌧️</div>
        <div class="irr-advisory-content">
          <h4>${dict.rainAlertHighTitle}</h4>
          <p>${desc}</p>
          <div class="irr-advisory-meta">
            <span><strong>${dict.forecastPeriodLabel}:</strong> 48 ${lang === "mr" ? "तास" : (lang === "hi" ? "घंटे" : "Hours")} (${periodDates})</span>
            <span><strong>${dict.forecastRainLabel}:</strong> ${rainFormatted} mm</span>
            <span style="display: block; width: 100%; margin-top: 4px;">💡 ${dict.decisionSupportNote}</span>
          </div>
        </div>
      </div>
    `;
  } else {
    const desc = dict.rainAlertLowDesc.replace("{rain}", rainFormatted).replace("{dates}", periodDates);
    container.innerHTML = `
      <div class="irr-advisory-card success">
        <div class="irr-advisory-icon">🌤️</div>
        <div class="irr-advisory-content">
          <h4>${dict.rainAlertLowTitle}</h4>
          <p>${desc}</p>
          <div class="irr-advisory-meta">
            <span><strong>${dict.forecastPeriodLabel}:</strong> 48 ${lang === "mr" ? "तास" : (lang === "hi" ? "घंटे" : "Hours")} (${periodDates})</span>
            <span><strong>${dict.forecastRainLabel}:</strong> ${rainFormatted} mm</span>
            <span style="display: block; width: 100%; margin-top: 4px;">💡 ${dict.decisionSupportNote}</span>
          </div>
        </div>
      </div>
    `;
  }
}

// 2. Smart Irrigation Planner: Schedule Calculation
function handleIrrigationCalculation(event) {
  if (event) event.preventDefault();
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  const crop = document.getElementById("irr-crop-select") ? document.getElementById("irr-crop-select").value : "cropSoybean";
  const stage = document.getElementById("irr-stage-select") ? document.getElementById("irr-stage-select").value : "stageFlowering";
  const method = document.getElementById("irr-method-select") ? document.getElementById("irr-method-select").value : "methodDrip";

  const resultContainer = document.getElementById("irrigation-result-card");
  if (!resultContainer) return;

  let hours = 2.5;
  let intervalDays = 3;
  let statusText = lang === "mr" ? "मध्यम ओलावा" : (lang === "hi" ? "मध्यम नमी" : "Moderate Moisture");

  if (stage === "stageFlowering") {
    hours = (method === "methodDrip") ? 3.5 : (method === "methodSprinkler" ? 4.5 : 6);
    intervalDays = 2;
    statusText = lang === "mr" ? "नाजूक अवस्था (जास्त पाण्याची गरज)" : (lang === "hi" ? "संवेदनशील अवस्था (अधिक पानी की आवश्यकता)" : "Critical Stage (Higher water need)");
  } else if (stage === "stageSeedling") {
    hours = (method === "methodDrip") ? 1.5 : (method === "methodSprinkler" ? 2 : 3);
    intervalDays = 4;
    statusText = lang === "mr" ? "हलके पाणी पुरेसे" : (lang === "hi" ? "हल्की सिंचाई पर्याप्त" : "Light watering sufficient");
  } else if (stage === "stageMaturity") {
    hours = (method === "methodDrip") ? 1 : (method === "methodSprinkler" ? 1.5 : 2);
    intervalDays = 6;
    statusText = lang === "mr" ? "पाणी कमी करा (काढणी जवळ)" : (lang === "hi" ? "सिंचाई कम करें (कटाई नजदीक)" : "Reduce watering (Harvest approaching)");
  }

  resultContainer.innerHTML = `
    <div class="moisture-meter-box">
      <h4 style="color: var(--primary-dark); font-size: 1.15rem; margin-bottom: 6px;">
        💧 ${dict.recommendedWater}
      </h4>
      <div style="font-size: 2.2rem; font-weight: 800; color: var(--info-blue); margin: 6px 0;">
        ${hours} ${lang === "mr" ? "तास" : (lang === "hi" ? "घंटे" : "Hours")}
      </div>
      <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 12px;">
        ${dict.nextWateringIn}: <strong>${intervalDays} ${lang === "mr" ? "दिवसांनी" : (lang === "hi" ? "दिन बाद" : "Days")}</strong>
      </p>

      <button type="button" class="btn btn-secondary btn-sm" onclick="prefillIrrigationLogFromSchedule('${crop}', ${hours}, '${method}')">
        ${dict.logThisScheduleBtn}
      </button>
    </div>

    <div style="background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; margin-top: 12px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <span><strong>${dict.cropStageLabel}:</strong></span>
        <span class="badge badge-info">${statusText}</span>
      </div>
      <div style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
        💡 ${dict.dripTip}
      </div>
    </div>
  `;

  // Update Dashboard Upcoming Task dynamically
  updateDashboardUpcomingIrrigationTask(crop, hours, intervalDays);
}

// Pre-fill Irrigation Log form with calculated schedule
function prefillIrrigationLogFromSchedule(cropId, hours, methodId) {
  const cropSelect = document.getElementById("irr-log-crop");
  const durationInput = document.getElementById("irr-log-duration");
  const methodSelect = document.getElementById("irr-log-method");
  const dateInput = document.getElementById("irr-log-date");

  if (durationInput) durationInput.value = hours;
  if (methodSelect && methodId) methodSelect.value = methodId;
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }

  const mapCrop = {
    cropSoybean: "Soybean",
    cropCotton: "Bt Cotton",
    cropWheat: "Wheat",
    cropOnion: "Onion",
    cropSugarcane: "Sugarcane",
    cropMaize: "Maize",
    cropTur: "Tur / Arhar",
    cropGroundnut: "Groundnut"
  };
  if (cropSelect && mapCrop[cropId]) {
    cropSelect.value = mapCrop[cropId];
  }

  const formElem = document.getElementById("add-irrigation-log-form");
  if (formElem) {
    formElem.scrollIntoView({ behavior: "smooth", block: "center" });
    formElem.style.borderColor = "var(--primary-green)";
    setTimeout(() => { formElem.style.borderColor = "var(--border-light)"; }, 1500);
  }

  const lang = window.currentLanguage || "en";
  showToast(lang === "mr" ? "वेळापत्रक सिंचन नोंद फॉर्ममध्ये भरले!" : (lang === "hi" ? "शेड्यूल सिंचाई फॉर्म में भर दिया गया!" : "Schedule loaded into irrigation form!"));
}

// Synchronize Dashboard Upcoming Task preview
function updateDashboardUpcomingIrrigationTask(cropId, hours, intervalDays) {
  const titleElem = document.getElementById("dash-irr-task-title");
  const subElem = document.getElementById("dash-irr-task-sub");
  if (!titleElem || !subElem) return;

  const lang = window.currentLanguage || "en";
  const mapCropName = {
    cropSoybean: { en: "Soybean", mr: "सोयाबीन", hi: "सोयाबीन" },
    cropCotton: { en: "Cotton", mr: "कापूस", hi: "कपास" },
    cropWheat: { en: "Wheat", mr: "गहू", hi: "गेहूँ" },
    cropOnion: { en: "Onion", mr: "कांदा", hi: "प्याज" },
    cropSugarcane: { en: "Sugarcane", mr: "ऊस", hi: "गन्ना" },
    cropMaize: { en: "Maize", mr: "मका", hi: "मक्का" },
    cropTur: { en: "Tur", mr: "तूर", hi: "अरहर" },
    cropGroundnut: { en: "Groundnut", mr: "भुईमूग", hi: "मूंगफली" }
  };

  const cropName = mapCropName[cropId] ? (mapCropName[cropId][lang] || mapCropName[cropId].en) : "Crop";
  
  if (lang === "mr") {
    titleElem.textContent = `${cropName} सिंचन नियोजन (${hours} तास)`;
    subElem.textContent = `${intervalDays} दिवसांनी पाणी देणे नियोजित आहे`;
  } else if (lang === "hi") {
    titleElem.textContent = `${cropName} सिंचाई योजना (${hours} घंटे)`;
    subElem.textContent = `${intervalDays} दिन बाद सिंचाई प्रस्तावित है`;
  } else {
    titleElem.textContent = `${cropName} Irrigation Schedule (${hours} hrs)`;
    subElem.textContent = `Watering scheduled in ${intervalDays} days`;
  }
}

// 3. Persistent Irrigation Log: Fetching, Queuing & Rendering
function getPendingIrrigationLogs() {
  const stored = localStorage.getItem(STORAGE_KEY_PENDING_IRR);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading pending irrigation logs:", e);
    }
  }
  return [];
}

function savePendingIrrigationLogs(list) {
  localStorage.setItem(STORAGE_KEY_PENDING_IRR, JSON.stringify(list));
}

async function loadIrrigationLogs() {
  const container = document.getElementById("irrigation-logs-table-container");
  const syncContainer = document.getElementById("irr-sync-action-container");
  if (!container) return;

  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  const pendingList = getPendingIrrigationLogs().map(item => ({ ...item, isOffline: true }));
  let serverList = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const headers = window.AuthManager ? window.AuthManager.getAuthHeaders() : { "Content-Type": "application/json" };
    const response = await fetch(API_IRR_BASE, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      serverList = await response.json();
      localStorage.setItem(STORAGE_KEY_CACHED_IRR, JSON.stringify(serverList));
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (err) {
    // Offline fallback to cached records
    const cached = localStorage.getItem(STORAGE_KEY_CACHED_IRR);
    if (cached) {
      try {
        serverList = JSON.parse(cached);
      } catch (e) {
        serverList = [...fallbackDemoIrrigationLogs];
      }
    } else {
      serverList = [...fallbackDemoIrrigationLogs];
    }
  }

  // Combined records (pending offline items first, then confirmed server items)
  const combined = [...pendingList, ...serverList.map(s => ({ ...s, isOffline: false }))];

  // Show/Hide Sync action button
  if (syncContainer) {
    syncContainer.style.display = pendingList.length > 0 ? "block" : "none";
  }

  if (combined.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted);">
        <p>${dict.noIrrigationRecords}</p>
      </div>
    `;
    return;
  }

  let tableHtml = `
    <div class="irr-log-table-wrapper">
      <table class="irr-log-table">
        <thead>
          <tr>
            <th>${dict.irrigationDateLabel}</th>
            <th>${dict.cropNameLabel}</th>
            <th>${dict.durationHoursLabel}</th>
            <th>${dict.irrigationMethodLabel}</th>
            <th>${dict.waterQuantityLabel}</th>
            <th>${dict.irrigationNotesLabel}</th>
            <th>Status</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
  `;

  combined.forEach(record => {
    const isOffline = record.isOffline === true;
    const badgeHtml = isOffline
      ? `<span class="badge-offline">🟠 ${dict.statusPendingBadge}</span>`
      : `<span class="badge-cloud">🟢 ${dict.statusConfirmedBadge}</span>`;

    const methodKey = record.irrigation_method || "methodDrip";
    const methodText = dict[methodKey] || methodKey;
    const waterText = record.water_quantity_liters ? `${record.water_quantity_liters.toLocaleString("en-IN")} L` : "-";
    const notesText = record.notes || "-";

    tableHtml += `
      <tr>
        <td><strong>📅 ${record.irrigation_date}</strong></td>
        <td>🌱 ${record.crop_name}</td>
        <td>⚡ ${record.duration_hours} ${lang === "mr" ? "तास" : (lang === "hi" ? "घंटे" : "hrs")}</td>
        <td>${methodText}</td>
        <td>${waterText}</td>
        <td style="color: var(--text-muted); font-size: 0.88rem;">${notesText}</td>
        <td>${badgeHtml}</td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-secondary btn-sm" onclick="openIrrigationEditModal('${record.id}', '${record.crop_name}', '${record.irrigation_date}', ${record.duration_hours}, ${record.water_quantity_liters || 0}, '${(record.notes || '').replace(/'/g, "\\'")}', ${isOffline})" title="Edit" style="padding: 4px 8px; margin-right: 4px;">
            ✏️
          </button>
          <button class="btn btn-secondary btn-sm" onclick="handleDeleteIrrigationLog('${record.id}', ${isOffline})" title="Delete" style="padding: 4px 8px; color: var(--danger-red);">
            🗑️
          </button>
        </td>
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHtml;
}

// 4. Handle Add Irrigation Log
async function handleAddIrrigationLog(event) {
  if (event) event.preventDefault();
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  const submitBtn = document.getElementById("irr-log-submit-btn");
  const crop = document.getElementById("irr-log-crop").value;
  const date = document.getElementById("irr-log-date").value;
  const duration = parseFloat(document.getElementById("irr-log-duration").value);
  const method = document.getElementById("irr-log-method").value;
  const quantityInput = document.getElementById("irr-log-quantity").value;
  const quantity = quantityInput ? parseFloat(quantityInput) : null;
  const notes = document.getElementById("irr-log-notes").value;

  if (isNaN(duration) || duration <= 0 || duration > 24) {
    alert(lang === "mr" ? "कृपया वैध कालावधी (०.१ ते २४ तास) प्रविष्ट करा." : "Please enter a valid duration between 0.1 and 24 hours.");
    return;
  }

  // Prevent duplicate submissions by disabling button
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `⏳ <span>${dict.savingBtn}</span>`;
  }

  const payload = {
    crop_name: crop,
    irrigation_date: date || new Date().toISOString().split("T")[0],
    duration_hours: duration,
    water_quantity_liters: quantity,
    irrigation_method: method,
    notes: notes || null
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const headers = window.AuthManager ? window.AuthManager.getAuthHeaders() : { "Content-Type": "application/json" };
    const response = await fetch(API_IRR_BASE, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      showToast(dict.irrSaveSuccess);
      document.getElementById("irr-log-duration").value = "";
      document.getElementById("irr-log-quantity").value = "";
      document.getElementById("irr-log-notes").value = "";
      await loadIrrigationLogs();
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (err) {
    console.warn("Backend unavailable, saving irrigation record offline:", err);
    // Queue offline
    const pending = getPendingIrrigationLogs();
    const offlineRecord = {
      ...payload,
      id: `offline_${Date.now()}`
    };
    pending.unshift(offlineRecord);
    savePendingIrrigationLogs(pending);

    showToast(dict.irrSaveOffline);
    document.getElementById("irr-log-duration").value = "";
    document.getElementById("irr-log-quantity").value = "";
    document.getElementById("irr-log-notes").value = "";
    await loadIrrigationLogs();
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `💾 <span>${dict.saveIrrigationBtn}</span>`;
    }
  }
}

// 5. Synchronize Pending Offline Records to Server
let isSyncingIrrigation = false;

async function syncPendingIrrigationLogs() {
  if (isSyncingIrrigation) return;
  isSyncingIrrigation = true;

  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;
  const pending = getPendingIrrigationLogs();
  if (pending.length === 0) {
    isSyncingIrrigation = false;
    return;
  }

  const syncBtn = document.getElementById("btn-sync-offline-irr");
  if (syncBtn) {
    syncBtn.disabled = true;
    syncBtn.textContent = "⏳ Syncing...";
  }

  let remaining = [];
  let syncedCount = 0;

  try {
    for (const item of pending) {
      try {
        const cleanPayload = {
          crop_name: item.crop_name,
          irrigation_date: item.irrigation_date,
          duration_hours: item.duration_hours,
          water_quantity_liters: item.water_quantity_liters,
          irrigation_method: item.irrigation_method,
          notes: item.notes
        };

        const headers = window.AuthManager ? window.AuthManager.getAuthHeaders() : { "Content-Type": "application/json" };
        const response = await fetch(API_IRR_BASE, {
          method: "POST",
          headers,
          body: JSON.stringify(cleanPayload)
        });

        if (response.ok) {
          syncedCount++;
        } else {
          remaining.push(item);
        }
      } catch (e) {
        remaining.push(item);
      }
    }

    savePendingIrrigationLogs(remaining);
    await loadIrrigationLogs();

    if (syncedCount > 0) {
      showToast(dict.irrSyncSuccess);
    } else {
      showToast("Backend server currently unreachable. Records kept safe offline.");
    }
  } finally {
    isSyncingIrrigation = false;
    if (syncBtn) {
      syncBtn.disabled = false;
      syncBtn.textContent = `🔄 ${dict.syncPendingBtn}`;
    }
  }
}

// 6. Edit & Modal Controls
function openIrrigationEditModal(id, cropName, date, duration, quantity, notes, isOffline) {
  const modal = document.getElementById("irr-edit-modal-backdrop");
  if (!modal) return;

  document.getElementById("edit-irr-id").value = id;
  document.getElementById("edit-irr-id").dataset.isOffline = isOffline ? "true" : "false";
  document.getElementById("edit-irr-crop").value = cropName;
  document.getElementById("edit-irr-date").value = date;
  document.getElementById("edit-irr-duration").value = duration;
  document.getElementById("edit-irr-quantity").value = quantity || "";
  document.getElementById("edit-irr-notes").value = notes || "";

  modal.classList.add("active");
}

function closeIrrigationEditModal() {
  const modal = document.getElementById("irr-edit-modal-backdrop");
  if (modal) modal.classList.remove("active");
}

async function handleUpdateIrrigationLog(event) {
  if (event) event.preventDefault();
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  const idElem = document.getElementById("edit-irr-id");
  const id = idElem.value;
  const isOffline = idElem.dataset.isOffline === "true";

  const date = document.getElementById("edit-irr-date").value;
  const duration = parseFloat(document.getElementById("edit-irr-duration").value);
  const quantityInput = document.getElementById("edit-irr-quantity").value;
  const quantity = quantityInput ? parseFloat(quantityInput) : null;
  const notes = document.getElementById("edit-irr-notes").value;

  if (isNaN(duration) || duration <= 0 || duration > 24) {
    alert("Please enter a valid duration between 0.1 and 24 hours.");
    return;
  }

  const updatePayload = {
    irrigation_date: date,
    duration_hours: duration,
    water_quantity_liters: quantity,
    notes: notes || null
  };

  if (!isOffline) {
    try {
      const headers = window.AuthManager ? window.AuthManager.getAuthHeaders() : { "Content-Type": "application/json" };
      const response = await fetch(`${API_IRR_BASE}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatePayload)
      });
      if (response.ok) {
        closeIrrigationEditModal();
        showToast(dict.irrUpdateSuccess);
        await loadIrrigationLogs();
        return;
      }
    } catch (e) {
      console.warn("Backend update failed, updating local copy:", e);
    }
  }

  // If offline item or server unavailable
  let pending = getPendingIrrigationLogs();
  pending = pending.map(item => item.id === id ? { ...item, ...updatePayload } : item);
  savePendingIrrigationLogs(pending);

  closeIrrigationEditModal();
  showToast(dict.irrUpdateSuccess);
  await loadIrrigationLogs();
}

// 7. Delete Irrigation Log
async function handleDeleteIrrigationLog(id, isOffline) {
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  if (!confirm(dict.deleteConfirmIrr)) return;

  if (!isOffline) {
    try {
      const headers = window.AuthManager ? window.AuthManager.getAuthHeaders() : {};
      const response = await fetch(`${API_IRR_BASE}/${id}`, { method: "DELETE", headers });
      if (response.ok) {
        showToast(dict.irrDeleteSuccess);
        await loadIrrigationLogs();
        return;
      }
    } catch (e) {
      console.warn("Backend delete failed, removing local cached record:", e);
    }
  }

  // Remove from pending offline
  let pending = getPendingIrrigationLogs();
  pending = pending.filter(item => item.id !== id);
  savePendingIrrigationLogs(pending);

  // Remove from cached
  let cachedStr = localStorage.getItem(STORAGE_KEY_CACHED_IRR);
  if (cachedStr) {
    try {
      let cached = JSON.parse(cachedStr);
      cached = cached.filter(item => String(item.id) !== String(id));
      localStorage.setItem(STORAGE_KEY_CACHED_IRR, JSON.stringify(cached));
    } catch (e) {}
  }

  showToast(dict.irrDeleteSuccess);
  await loadIrrigationLogs();
}

// Global hooks for app.js and HTML bindings
window.handleCropRecommendation = handleCropRecommendation;
window.handleCropComparison = handleCropComparison;
window.initCropComparisonSelectors = initCropComparisonSelectors;
window.handleIrrigationCalculation = handleIrrigationCalculation;
window.updateWeatherAwareIrrigationAlert = updateWeatherAwareIrrigationAlert;
window.loadIrrigationLogs = loadIrrigationLogs;
window.syncPendingIrrigationLogs = syncPendingIrrigationLogs;
window.prefillIrrigationLogFromSchedule = prefillIrrigationLogFromSchedule;
window.openIrrigationEditModal = openIrrigationEditModal;
window.closeIrrigationEditModal = closeIrrigationEditModal;
window.handleDeleteIrrigationLog = handleDeleteIrrigationLog;

// Attach event listeners for Crop Advisor, Irrigation Planner & Log
document.addEventListener("DOMContentLoaded", () => {
  const cropAiForm = document.getElementById("ai-crop-form");
  if (cropAiForm) {
    cropAiForm.addEventListener("submit", handleCropRecommendation);
  }

  const irrForm = document.getElementById("irrigation-form");
  if (irrForm) {
    irrForm.addEventListener("submit", handleIrrigationCalculation);
  }

  const compareBtn = document.getElementById("compare-crops-btn");
  if (compareBtn) {
    compareBtn.addEventListener("click", handleCropComparison);
  }

  const selectA = document.getElementById("compare-crop-a");
  const selectB = document.getElementById("compare-crop-b");
  if (selectA) selectA.addEventListener("change", handleCropComparison);
  if (selectB) selectB.addEventListener("change", handleCropComparison);

  // Irrigation Log Form
  const addIrrForm = document.getElementById("add-irrigation-log-form");
  if (addIrrForm) {
    addIrrForm.addEventListener("submit", handleAddIrrigationLog);
    // Pre-fill today's date
    const dateInput = document.getElementById("irr-log-date");
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }
  }

  // Irrigation Edit Modal Form
  const editIrrForm = document.getElementById("irr-edit-form");
  if (editIrrForm) {
    editIrrForm.addEventListener("submit", handleUpdateIrrigationLog);
  }

  // Initialize initial recommendations, comparison dropdowns, irrigation schedule & logs
  handleCropRecommendation();
  initCropComparisonSelectors();
  handleIrrigationCalculation();
  updateWeatherAwareIrrigationAlert();
  loadIrrigationLogs();
});
