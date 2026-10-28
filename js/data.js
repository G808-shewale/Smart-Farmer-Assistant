/* ==========================================================================
   Smart Farmer Assistant - Demonstration Data (Demo / Sample Data)
   Note: All figures and recommendations are realistic agricultural samples
         clearly marked for demonstration.
   ========================================================================== */

const demoData = {
  // Pre-populated Sample Transactions for Tracker
  initialTransactions: [
    {
      id: "tx-1",
      type: "expense",
      categoryKey: "catSeeds",
      description: "Certified Soybean Seeds (JS-335) - 3 Bags",
      amount: 4800,
      date: "2026-10-15"
    },
    {
      id: "tx-2",
      type: "expense",
      categoryKey: "catFertilizer",
      description: "DAP (18:46:0) Fertilizer & Potash",
      amount: 3200,
      date: "2026-10-18"
    },
    {
      id: "tx-3",
      type: "expense",
      categoryKey: "catLabor",
      description: "Tractor deep ploughing (Rotavator) 2 Acres",
      amount: 2400,
      date: "2026-10-20"
    },
    {
      id: "tx-4",
      type: "income",
      categoryKey: "catCropSale",
      description: "Sold 14 Quintals Onion at Nashik APMC",
      amount: 29400,
      date: "2026-10-24"
    },
    {
      id: "tx-5",
      type: "income",
      categoryKey: "catSubsidy",
      description: "DBT Drip Irrigation Subsidy Credited",
      amount: 12500,
      date: "2026-10-26"
    }
  ],

  // Demonstration Regions for Weather
  weatherRegions: {
    pune: {
      name: { en: "Pune, Maharashtra", mr: "पुणे, महाराष्ट्र", hi: "पुणे, महाराष्ट्र" },
      temp: "29°C",
      condition: { en: "Clear & Sunny", mr: "निरभ्र व सूर्यप्रकाश", hi: "साफ व धूप" },
      humidity: "42%",
      rainProb: "5%",
      wind: "11 km/h",
      sprayAdvice: "sprayGood",
      forecast: [
        { day: { en: "Today", mr: "आज", hi: "आज" }, temp: "29°C", icon: "☀️", rain: "0%" },
        { day: { en: "Thu", mr: "गुरु", hi: "गुरु" }, temp: "30°C", icon: "🌤️", rain: "5%" },
        { day: { en: "Fri", mr: "शुक्र", hi: "शुक्र" }, temp: "28°C", icon: "⛅", rain: "10%" },
        { day: { en: "Sat", mr: "शनि", hi: "शनि" }, temp: "27°C", icon: "🌧️", rain: "40%" },
        { day: { en: "Sun", mr: "रवि", hi: "रवि" }, temp: "28°C", icon: "⛅", rain: "15%" }
      ]
    },
    nashik: {
      name: { en: "Nashik, Maharashtra", mr: "नाशिक, महाराष्ट्र", hi: "नासिक, महाराष्ट्र" },
      temp: "27°C",
      condition: { en: "Pleasant & Breezy", mr: "आल्हाददायक व मंद वारा", hi: "सुहावना व मंद हवा" },
      humidity: "50%",
      rainProb: "10%",
      wind: "14 km/h",
      sprayAdvice: "sprayGood",
      forecast: [
        { day: { en: "Today", mr: "आज", hi: "आज" }, temp: "27°C", icon: "🌤️", rain: "10%" },
        { day: { en: "Thu", mr: "गुरु", hi: "गुरु" }, temp: "27°C", icon: "⛅", rain: "15%" },
        { day: { en: "Fri", mr: "शुक्र", hi: "शुक्र" }, temp: "26°C", icon: "🌦️", rain: "35%" },
        { day: { en: "Sat", mr: "शनि", hi: "शनि" }, temp: "25°C", icon: "🌧️", rain: "55%" },
        { day: { en: "Sun", mr: "रवि", hi: "रवि" }, temp: "27°C", icon: "🌤️", rain: "10%" }
      ]
    },
    nagpur: {
      name: { en: "Nagpur (Vidarbha)", mr: "नागपूर (विदर्भ)", hi: "नागपुर (विदर्भ)" },
      temp: "32°C",
      condition: { en: "Warm & Dry", mr: "उष्ण व कोरडे", hi: "गर्म व सूखा" },
      humidity: "35%",
      rainProb: "0%",
      wind: "8 km/h",
      sprayAdvice: "sprayGood",
      forecast: [
        { day: { en: "Today", mr: "आज", hi: "आज" }, temp: "32°C", icon: "☀️", rain: "0%" },
        { day: { en: "Thu", mr: "गुरु", hi: "गुरु" }, temp: "33°C", icon: "☀️", rain: "0%" },
        { day: { en: "Fri", mr: "शुक्र", hi: "शुक्र" }, temp: "32°C", icon: "🌤️", rain: "5%" },
        { day: { en: "Sat", mr: "शनि", hi: "शनि" }, temp: "31°C", icon: "🌤️", rain: "5%" },
        { day: { en: "Sun", mr: "रवि", hi: "रवि" }, temp: "30°C", icon: "⛅", rain: "10%" }
      ]
    },
    indore: {
      name: { en: "Indore (Malwa)", mr: "इंदूर (माळवा)", hi: "इंदौर (मालवा)" },
      temp: "30°C",
      condition: { en: "Mild Sunny", mr: "सुर्यप्रकाशित", hi: "हल्की धूप" },
      humidity: "38%",
      rainProb: "0%",
      wind: "10 km/h",
      sprayAdvice: "sprayGood",
      forecast: [
        { day: { en: "Today", mr: "आज", hi: "आज" }, temp: "30°C", icon: "☀️", rain: "0%" },
        { day: { en: "Thu", mr: "गुरु", hi: "गुरु" }, temp: "31°C", icon: "☀️", rain: "0%" },
        { day: { en: "Fri", mr: "शुक्र", hi: "शुक्र" }, temp: "29°C", icon: "🌤️", rain: "5%" },
        { day: { en: "Sat", mr: "शनि", hi: "शनि" }, temp: "29°C", icon: "⛅", rain: "10%" },
        { day: { en: "Sun", mr: "रवि", hi: "रवि" }, temp: "28°C", icon: "⛅", rain: "15%" }
      ]
    }
  },

  // Crop Information Encyclopedia
  cropsEncyclopedia: [
    {
      id: "crop-soybean",
      category: "pulses",
      name: { en: "Soybean", mr: "सोयाबीन", hi: "सोयाबीन" },
      icon: "🌱",
      season: { en: "Kharif (June - October)", mr: "खरीप (जून - ऑक्टोबर)", hi: "खरीफ (जून - अक्टूबर)" },
      soil: { en: "Well-drained Black Cotton Soil", mr: "पाण्याचा उत्तम निचरा होणारी काळी माती", hi: "उत्तम जल निकासी वाली काली मिट्टी" },
      duration: { en: "90 - 105 Days", mr: "९० ते १०५ दिवस", hi: "90 से 105 दिन" },
      seedRate: { en: "25 - 30 kg / Acre", mr: "२५ ते ३० किलो / एकर", hi: "25 से 30 किग्रा / एकड़" },
      pestAdvice: {
        en: "Stem borer & Spodoptera caterpillar. Spray Neem oil (1500 ppm) or Chlorantraniliprole 18.5% SC.",
        mr: "खोडकिडा व तंबाखूवरील लष्करी अळी. ५% निंबोळी अर्क किंवा कोराजनची फवारणी करावी.",
        hi: "तना छेदक व इल्ली का प्रकोप। नीम तेल (1500 ppm) या कोराजन का छिड़काव करें।"
      },
      tips: {
        en: "Maintain 45 cm row spacing. Avoid waterlogging during flowering.",
        mr: "दोन ओळीत ४५ सेमी अंतर ठेवावे. फुलोऱ्याच्या अवस्थेत शेतात पाणी साचू देऊ नये.",
        hi: "पंक्तियों में 45 सेमी दूरी रखें। फूल आते समय खेत में पानी न भरने दें।"
      }
    },
    {
      id: "crop-cotton",
      category: "cash",
      name: { en: "Bt Cotton", mr: "कापूस (Bt Cotton)", hi: "कपास (Bt Cotton)" },
      icon: "☁️",
      season: { en: "Kharif (June - January)", mr: "खरीप (जून - जानेवारी)", hi: "खरीफ (जून - जनवरी)" },
      soil: { en: "Deep Black fertile soil", mr: "खोल, कसदार काळी रेगूर माती", hi: "गहरी उपजाऊ काली मिट्टी" },
      duration: { en: "150 - 180 Days", mr: "१५० ते १८० दिवस", hi: "150 से 180 दिन" },
      seedRate: { en: "2 Packets (900g) / Acre", mr: "२ पाकिटे (९०० ग्रॅम) / एकर", hi: "2 पैकेट (900 ग्राम) / एकड़" },
      pestAdvice: {
        en: "Pink Bollworm & Whitefly. Install 5 pheromone traps per acre. Spray Acephate or Profenofos as per dose.",
        mr: "गुलाबी बोंडअळी व पांढरी माशी. एकरी ५ कामगंध सापळे लावा. गरज भासल्यास प्रोफेनोफॉस फवारणी करा.",
        hi: "गुलाबी सुंडी व सफेद मक्खी। प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं। उचित कीटनाशक का प्रयोग करें।"
      },
      tips: {
        en: "Topping (cutting main shoot tip) at 85 days boosts boll formation significantly.",
        mr: "८५ दिवसांनंतर कापसाचा शेंडा खुडल्यास बोंडांची संख्या व वजन मोठ्या प्रमाणात वाढते.",
        hi: "85 दिन बाद मुख्य शाखा की चोटी तोड़ने से टिंडों की संख्या और वजन बढ़ता है।"
      }
    },
    {
      id: "crop-onion",
      category: "cash",
      name: { en: "Red Onion", mr: "लाल कांदा", hi: "लाल प्याज" },
      icon: "🧅",
      season: { en: "Rabi & Kharif (Late Kharif)", mr: "रांगडा व उन्हाळी / रब्बी", hi: "रबी व खरीफ" },
      soil: { en: "Sandy Loam to Clay Loam", mr: "मध्यम ते भारी पोयटा माती", hi: "बलुई दोमट या मध्यम मिट्टी" },
      duration: { en: "110 - 125 Days", mr: "११० ते १२५ दिवस", hi: "110 से 125 दिन" },
      seedRate: { en: "3 - 4 kg / Acre (Nursery)", mr: "३ ते ४ किलो / एकर (रोपवाटिका)", hi: "3 से 4 किग्रा / एकड़ (नर्सरी)" },
      pestAdvice: {
        en: "Purple blotch & Thrips. Spray Mancozeb + Fipronil with a sticker/spreader agent.",
        mr: "जांभळा करपा व फुलकिडे (थ्रिप्स). मॅन्कोझेब व फिप्रोनिलसोबत स्टिकर मिसळून फवारणी करा.",
        hi: "बैंगनी धब्बा रोग व थ्रिप्स। मैंकोजेब व फिप्रोनिल में स्टीकर मिलाकर छिड़काव करें।"
      },
      tips: {
        en: "Stop irrigation 10-15 days prior to harvest to prevent bulb rot during storage.",
        mr: "कांदा काढणीच्या १० ते १५ दिवस आधी पाणी देणे पूर्णपणे बंद करा, साठवणूक क्षमता वाढते.",
        hi: "खुदाई से 10-15 दिन पहले सिंचाई बंद कर दें ताकि भंडारण में प्याज सड़े नहीं।"
      }
    },
    {
      id: "crop-wheat",
      category: "cereals",
      name: { en: "Wheat (Sharbati / Lokwan)", mr: "गहू (लोकवन / शरबती)", hi: "गेहूँ (लोकवन / शरबती)" },
      icon: "🌾",
      season: { en: "Rabi (November - March)", mr: "रब्बी (नोव्हेंबर - मार्च)", hi: "रबी (नवंबर - मार्च)" },
      soil: { en: "Loamy & Heavy Black Soil", mr: "मध्यम ते भारी काळी जमीन", hi: "दोमट व भारी काली मिट्टी" },
      duration: { en: "110 - 120 Days", mr: "११० ते १२० दिवस", hi: "110 से 120 दिन" },
      seedRate: { en: "40 - 45 kg / Acre", mr: "४० ते ४५ किलो / एकर", hi: "40 से 45 किग्रा / एकड़" },
      pestAdvice: {
        en: "Rust & Termites. Seed treatment with Trichoderma & Chlorpyrifos before sowing.",
        mr: "तांबेरा रोग व वाळवी. पेरणीपूर्वी ट्रायकोडर्मा व योग्य बुरशीनाशकाची बीजप्रक्रिया करा.",
        hi: "गेरुआ (रस्ट) व दीमक। बुआई से पूर्व बीज शोधन अनिवार्य रूप से करें।"
      },
      tips: {
        en: "Crown Root Initiation (CRI) at 21 days is the most critical irrigation stage.",
        mr: "मुकुट मुळे फुटण्याची अवस्था (२१ दिवस) ही पाणी देण्याची सर्वात महत्त्वाची वेळ आहे.",
        hi: "बुआई के 21 दिन बाद पहली सिंचाई (सीआरआई अवस्था) अत्यंत जरूरी है।"
      }
    },
    {
      id: "crop-chickpea",
      category: "pulses",
      name: { en: "Gram / Chickpea (Chana)", mr: "हरभरा (चना - विजय/दिग्विजय)", hi: "चना (हरभरा - विजय)" },
      icon: "🥣",
      season: { en: "Rabi (October - February)", mr: "रब्बी (ऑक्टोबर - फेब्रुवारी)", hi: "रबी (अक्टूबर - फरवरी)" },
      soil: { en: "Medium to heavy well-drained soil", mr: "मध्यम ते भारी निचऱ्याची जमीन", hi: "मध्यम से भारी मिट्टी" },
      duration: { en: "95 - 110 Days", mr: "९५ ते ११० दिवस", hi: "95 से 110 दिन" },
      seedRate: { en: "30 - 35 kg / Acre", mr: "३० ते ३५ किलो / एकर", hi: "30 से 35 किग्रा / एकड़" },
      pestAdvice: {
        en: "Pod Borer (Helicoverpa). Install 'T' perches for insect-eating birds. Spray Emamectin Benzoate.",
        mr: "घाटे अळी. शेतात पक्षिथांबे ('T' आकाराचे) उभारावेत. इमामेक्टिन बेन्झोएट फवारणी करा.",
        hi: "फली छेदक (इल्ली)। पक्षी बैठने के लिए 'T' खूंटे लगाएं। इमामेक्टिन का छिड़काव करें।"
      },
      tips: {
        en: "Nipping branch tops at 30 days increases branch count and yields by 20%.",
        mr: "३० दिवसांनी हरभऱ्याचे शेंडे खुडल्यास (फांद्या फुटून) उत्पादनात २०% वाढ होते.",
        hi: "30 दिन बाद चने की ऊपर की खूंटाई करने से अधिक शाखाएं और 20% अधिक पैदावार मिलती है।"
      }
    },
    {
      id: "crop-sugarcane",
      category: "cash",
      name: { en: "Sugarcane (Co 86032)", mr: "ऊस (को. ८६०३२)", hi: "गन्ना (को. 86032)" },
      icon: "🎋",
      season: { en: "Adsali / Pre-seasonal / Suru", mr: "अडसाली / पूर्वहंगामी / सुरू", hi: "अदसाली / बसंतकालीन" },
      soil: { en: "Deep fertile clay loam", mr: "खोल सुपीक काळी जमीन", hi: "गहरी उपजाऊ दोमट मिट्टी" },
      duration: { en: "12 - 14 Months", mr: "१२ ते १४ महिने", hi: "12 से 14 महीने" },
      seedRate: { en: "8,000 - 10,000 Two-eye buds / Acre", mr: "८,००० ते १०,००० दोन डोळ्यांची कांड्या", hi: "8,000 से 10,000 दो आंख वाले टुकड़े" },
      pestAdvice: {
        en: "Early shoot borer & Woolly aphid. Treat sets with bio-fungicide and apply Trichogramma cards.",
        mr: "खोडकीड व पांढरी माशी. बेणे प्रक्रिया करा व ट्रायकोकार्ड शेतात वापरा.",
        hi: "कंसुआ व सफेद मक्खी। बीज उपचार करें और जैविक नियंत्रण अपनाएं।"
      },
      tips: {
        en: "Drip fertigation saves 40% water and 30% fertilizer while increasing sugar recovery.",
        mr: "ठिबक सिंचनातून विद्राव्य खते दिल्यास ४०% पाणी बचत आणि उसाचे एकरी उत्पादन १०० टनांवर जाते.",
        hi: "ड्रिप से खाद देने पर 40% पानी बचता है और पैदावार में भारी बढ़ोतरी होती है।"
      }
    }
  ],

  // APMC Mandi Market Prices (Sample Demo Rates)
  mandiPrices: [
    {
      mandi: { en: "Nashik APMC", mr: "नाशिक बाजार समिती", hi: "नासिक मंडी" },
      commodity: { en: "Red Onion", mr: "लाल कांदा", hi: "लाल प्याज" },
      minPrice: 1650,
      modalPrice: 2250,
      maxPrice: 2600,
      trend: "+8%",
      trendType: "bullish",
      adviceKey: "adviceSell"
    },
    {
      mandi: { en: "Latur APMC", mr: "लातूर बाजार समिती", hi: "लातूर मंडी" },
      commodity: { en: "Soybean (Yellow)", mr: "पिवळी सोयाबीन", hi: "पीली सोयाबीन" },
      minPrice: 4200,
      modalPrice: 4680,
      maxPrice: 4850,
      trend: "+3%",
      trendType: "bullish",
      adviceKey: "adviceSell"
    },
    {
      mandi: { en: "Akola APMC", mr: "अकोला बाजार समिती", hi: "अकोला मंडी" },
      commodity: { en: "Bt Cotton (Medium Staple)", mr: "कापूस (मध्यम धागा)", hi: "कपास (मध्यम स्टेपल)" },
      minPrice: 6900,
      modalPrice: 7350,
      maxPrice: 7600,
      trend: "-2%",
      trendType: "bearish",
      adviceKey: "adviceHold"
    },
    {
      mandi: { en: "Indore APMC", mr: "इंदूर बाजार समिती", hi: "इंदौर मंडी" },
      commodity: { en: "Wheat (Lokwan)", mr: "गहू (लोकवन)", hi: "गेहूँ (लोकवन)" },
      minPrice: 2450,
      modalPrice: 2780,
      maxPrice: 3100,
      trend: "+4%",
      trendType: "bullish",
      adviceKey: "adviceSell"
    },
    {
      mandi: { en: "Jalgaon APMC", mr: "जळगाव बाजार समिती", hi: "जलगांव मंडी" },
      commodity: { en: "Maize / Corn", mr: "मका", hi: "मक्का" },
      minPrice: 1850,
      modalPrice: 2120,
      maxPrice: 2280,
      trend: "-4%",
      trendType: "bearish",
      adviceKey: "adviceHold"
    },
    {
      mandi: { en: "Ahmednagar APMC", mr: "अहमदनगर बाजार समिती", hi: "अहमदनगर मंडी" },
      commodity: { en: "Gram / Chana", mr: "हरभरा (चना)", hi: "चना (हरभरा)" },
      minPrice: 5100,
      modalPrice: 5540,
      maxPrice: 5800,
      trend: "+2%",
      trendType: "bullish",
      adviceKey: "adviceSell"
    }
  ]
};
