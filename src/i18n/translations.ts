export type Locale = "en" | "zh" | "id";

export interface Translations {
  nav: {
    home: string;
    builder: string;
    myTrips: string;
    inquiry: string;
    admin: string;
    cs: string;
    guide: string;
    finance: string;
    login: string;
    logout: string;
  };
  hero: {
    badge: string;
    title1: string;
    titleHighlight: string;
    subtitle: string;
    ctaBuilder: string;
    ctaInquiry: string;
    guaranteeRefund: string;
    guaranteeAllInclusive: string;
    guaranteeFleet: string;
  };
  features: {
    whyChoose: string;
    whyChooseSub: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  destinations: {
    sectionTitle: string;
    sectionSubtitle: string;
    planNow: string;
    addToTrip: string;
  };
  inquiry: {
    badge: string;
    title: string;
    desc: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    countryLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    sendAnother: string;
  };
  builder: {
    badge: string;
    title: string;
    subtitle: string;
    detailsTitle: string;
    paxLabel: string;
    paxSolo: string;
    paxDuo: string;
    paxPrivate: string;
    paxGroup: string;
    dateLabel: string;
    durationLabel: string;
    duration1D: string;
    duration2D1N: string;
    duration3D2N: string;
    duration4D3N: string;
    duration5D4N: string;
    pickupLabel: string;
    dropoffLabel: string;
    vehicleTitle: string;
    vehicleNote: string;
    recommended: string;
    capacity: string;
    hotelTitle: string;
    hotelDayTrip: string;
    hotelNights: string;
    dayPrefix: string;
    dayThemeLabel: string;
    resetDayBtn: string;
    chooseDestinations: string;
    selectedCount: string;
    clickToToggle: string;
    ticketFree: string;
    activitiesTitle: string;
    activitiesSub: string;
    perPerson: string;
    mealsTitle: string;
    mealsSub: string;
    pricingTitle: string;
    calculating: string;
    formulaLabel: string;
    distanceLabel: string;
    transportLabel: string;
    hotelLabel: string;
    noHotel: string;
    ticketsLabel: string;
    freeOrIncluded: string;
    mealsLabel: string;
    mealsNone: string;
    guideLabel: string;
    guideOptionTitle: string;
    guideOptionSub: string;
    withGuideTitle: string;
    withGuideDesc: string;
    withoutGuideTitle: string;
    withoutGuideDesc: string;
    noGuidePrice: string;
    recommendedBadge: string;
    withoutGuideSummary: string;
    subtotalLabel: string;
    marginLabel: string;
    totalLabel: string;
    perPersonLabel: string;
    foreignCurrencyEstimate: string;
    refundBadgeTitle: string;
    refundBadgeDesc: string;
    checkoutBtn: string;
    processingTrip: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    contactDetailsTitle: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    paymentMethodTitle: string;
    paymentHighlight: string;
    paymentDesc: string;
    pciBadge: string;
    summaryTitle: string;
    tripPlanTitle: string;
    participants: string;
    fleet: string;
    pickup: string;
    dropoff: string;
    transport: string;
    hotel: string;
    tickets: string;
    guide: string;
    totalPayment: string;
    cancellationAlertTitle: string;
    cancellationAlertDesc: string;
    payBtn: string;
    connectingGateway: string;
  };
  voucher: {
    successBadge: string;
    successTitle: string;
    successDesc: string;
    officialVoucher: string;
    bookingNo: string;
    printBtn: string;
    newTripBtn: string;
    booker: string;
    fleetPax: string;
    pickupPoint: string;
    totalCost: string;
    paidStatus: string;
    timelineTitle: string;
    hotlineTitle: string;
    hotlineDesc: string;
    callHotline: string;
  };
}

export const translations: Record<Locale, Translations> = {
  // English (Default)
  en: {
    nav: {
      home: "Home",
      builder: "Custom Itinerary Builder",
      myTrips: "My Itineraries",
      inquiry: "Trip Inquiry",
      admin: "Admin Panel",
      cs: "CS Inbox",
      guide: "Guide Portal",
      finance: "Finance Portal",
      login: "Login",
      logout: "Logout",
    },
    hero: {
      badge: "East Java Custom Tour & Travel Platform",
      title1: "Design Your Dream Itinerary,",
      titleHighlight: "Real-Time Transparent Pricing.",
      subtitle:
        "Customize Bromo, Ijen Crater, and Tumpak Sewu according to your travel dates and pace. Instant fair calculation based on route distance (rate per km), chosen fleet, hotel class, and entrance tickets.",
      ctaBuilder: "Start Custom Itinerary Builder",
      ctaInquiry: "Custom Consultation / Inquiry",
      guaranteeRefund: "100% Full Refund Guarantee (≥ 48h)",
      guaranteeAllInclusive: "Fuel, Toll & Driver Fully Included",
      guaranteeFleet: "Verified Fleet (Avanza, Hiace, Alphard)",
    },
    features: {
      whyChoose: "Why Choose Itinerary ID?",
      whyChooseSub: "Professional Indonesian travel standard eliminating hidden fees and surprises on the road.",
      card1Title: "Transparent Distance-Based Rate",
      card1Desc:
        "Group transport calculated directly by actual route distance (rate per km). No hidden route markups; fair cost whether traveling solo or in large groups.",
      card2Title: "Freedom of Fleet Choice",
      card2Desc:
        "Select from reliable Avanza/Innova, spacious Toyota Hiace Commuters, up to executive VIP Alphard/Lexus. All air-conditioned and driven by licensed tourism drivers.",
      card3Title: "Clear Cancellation Policy",
      card3Desc:
        "100% upfront payment via Midtrans (international cards & local transfers). Cancellations made at least 48 hours before pickup are eligible for a full 100% refund.",
    },
    destinations: {
      sectionTitle: "Top East Java Destinations",
      sectionSubtitle: "Combine these world-famous wonders into your single customized itinerary.",
      planNow: "Plan Itinerary",
      addToTrip: "+ Add to Trip",
    },
    inquiry: {
      badge: "Specialized Group & Custom Requests",
      title: "Have a Custom Request or Large Tour Group?",
      desc: "Our dedicated Customer Support team is ready to assist you with tailored routes, special hotel requests, or private group budgets within 24 hours.",
      nameLabel: "Full Name *",
      emailLabel: "Email Address *",
      phoneLabel: "WhatsApp / Phone Number",
      countryLabel: "Country of Residence",
      messageLabel: "Trip Details / Special Requests",
      messagePlaceholder: "Tell us about your trip (number of people, expected dates, hotel preferences, or special destinations)...",
      submitBtn: "Send Inquiry to Customer Support",
      submitting: "Sending Inquiry...",
      successTitle: "Inquiry Sent Successfully!",
      successDesc: "Thank you. Your inquiry has been delivered directly to our CS team. We will reach out to you via WhatsApp or Email shortly.",
      sendAnother: "Send another request",
    },
    builder: {
      badge: "Step 1: Customize Your Journey",
      title: "Custom Itinerary Builder",
      subtitle: "Organize destinations per day, select your preferred fleet, and inspect itemized costs in real-time.",
      detailsTitle: "Travel Dates, Group Size & Pickup Location",
      paxLabel: "Number of Travelers (Pax)",
      paxSolo: "1 Person (Solo)",
      paxDuo: "2 Persons (Duo)",
      paxPrivate: "Persons (Private)",
      paxGroup: "Persons (Group)",
      dateLabel: "Departure Date",
      durationLabel: "Trip Duration (Days)",
      duration1D: "1 Day (Sunrise Day Trip)",
      duration2D1N: "2 Days 1 Night (2D1N)",
      duration3D2N: "3 Days 2 Nights (3D2N - Most Popular)",
      duration4D3N: "4 Days 3 Nights (4D3N)",
      duration5D4N: "5 Days 4 Nights (5D4N)",
      pickupLabel: "Pickup Point (Arrival)",
      dropoffLabel: "Drop-off Point (Departure)",
      vehicleTitle: "Select Vehicle Type",
      vehicleNote: "Includes: Vehicle + Licensed Driver + Fuel + Highway Tolls",
      recommended: "Recommended",
      capacity: "Capacity",
      hotelTitle: "Accommodation Class",
      hotelDayTrip: "Day trip without accommodation",
      hotelNights: "Nights • Auto Rooms by Pax",
      dayPrefix: "Day",
      dayThemeLabel: "Theme / Title for Day",
      resetDayBtn: "Reset Today's Selection",
      chooseDestinations: "Choose Destinations for Day",
      selectedCount: "Selected",
      clickToToggle: "Click card to select / unselect",
      ticketFree: "Free / Transit Point",
      activitiesTitle: "Optional Activities & Equipment:",
      activitiesSub: "Calculated per person / group",
      perPerson: "/ person",
      mealsTitle: "Lunch / Dinner Meal Packages (Optional):",
      mealsSub: "Calculated per person",
      pricingTitle: "Real-Time Pricing Breakdown",
      calculating: "Calculating...",
      formulaLabel: "PRD §19 Formula",
      distanceLabel: "Estimated Route Distance:",
      transportLabel: "Group Transport",
      hotelLabel: "Hotel Accommodation:",
      noHotel: "No hotel selected",
      ticketsLabel: "Tickets & POI Entrance:",
      freeOrIncluded: "Included / Rp 0",
      mealsLabel: "Meal Packages:",
      mealsNone: "None selected (Rp 0)",
      guideLabel: "Professional Tour Guide:",
      guideOptionTitle: "Tour Guide Service Option",
      guideOptionSub: "Choose whether you would like a dedicated licensed company tour guide",
      withGuideTitle: "With Company Tour Guide",
      withGuideDesc: "Licensed bilingual guide, deep local storytelling, photography support, and seamless on-ground coordination.",
      withoutGuideTitle: "Without Tour Guide (Driver Only)",
      withoutGuideDesc: "Self-guided trip. Our professional tourist driver takes care of transport and road navigation safely.",
      noGuidePrice: "Free / Rp 0",
      recommendedBadge: "Recommended",
      withoutGuideSummary: "Driver Only (Rp 0)",
      subtotalLabel: "Trip Subtotal:",
      marginLabel: "Operational Markup",
      totalLabel: "Total Trip Price:",
      perPersonLabel: "Price Per Person",
      foreignCurrencyEstimate: "Foreign Currency Equivalent:",
      refundBadgeTitle: "100% Full Refund Guarantee",
      refundBadgeDesc: "Full 100% refund guaranteed if cancelled ≥ 48 hours prior to pickup via Midtrans.",
      checkoutBtn: "Proceed to Review & Checkout",
      processingTrip: "Processing Trip Details...",
    },
    checkout: {
      title: "Review Trip & Complete Payment",
      subtitle: "Final step before your itinerary booking is confirmed and guide/driver assigned.",
      contactDetailsTitle: "Contact & Primary Traveler Details",
      fullName: "Full Name *",
      email: "Email Address (for Itinerary Voucher) *",
      phone: "WhatsApp / Mobile Number *",
      country: "Country of Residence",
      paymentMethodTitle: "Online Payment via Midtrans",
      paymentHighlight: "100% Full Upfront Payment (No Hidden Surcharges on the Road)",
      paymentDesc:
        "Supports International Credit Cards (Visa, MasterCard, JCB, Amex), Indonesian Bank Transfers (BCA, Mandiri, BNI, BRI), and E-Wallets (GoPay, QRIS).",
      pciBadge: "Encrypted with top PCI-DSS Level 1 security standards by Midtrans Payment Gateway.",
      summaryTitle: "Your Itinerary Summary",
      tripPlanTitle: "Trip Plan:",
      participants: "Travelers:",
      fleet: "Fleet:",
      pickup: "Pickup:",
      dropoff: "Drop-off:",
      transport: "Transport:",
      hotel: "Hotel Accommodation:",
      tickets: "POI Tickets & Activities:",
      guide: "Tour Guide:",
      totalPayment: "Total Payment:",
      cancellationAlertTitle: "Cancellation & Refund Terms",
      cancellationAlertDesc:
        "Cancellations requested ≥ 48 hours prior to scheduled pickup are entitled to a 100% Full Refund. Cancellations within 48 hours are non-refundable.",
      payBtn: "Pay Now via Midtrans",
      connectingGateway: "Connecting to Midtrans Gateway...",
    },
    voucher: {
      successBadge: "Payment Confirmed & Settled",
      successTitle: "Itinerary Booking Confirmed!",
      successDesc:
        "Thank you! Your travel booking is CONFIRMED. Your official voucher and day-by-day itinerary schedule are ready below.",
      officialVoucher: "Official Travel Voucher",
      bookingNo: "Booking Ref:",
      printBtn: "Print / Save PDF",
      newTripBtn: "Plan New Trip",
      booker: "Lead Traveler:",
      fleetPax: "Pax & Vehicle:",
      pickupPoint: "Pickup Location:",
      totalCost: "Total Amount:",
      paidStatus: "Paid in Full (Midtrans)",
      timelineTitle: "Detailed Day-by-Day Schedule",
      hotlineTitle: "Customer Operations & Dispatch Center",
      hotlineDesc: "Your assigned guide and driver will contact your WhatsApp 24 hours prior to departure.",
      callHotline: "Contact Travel Hotline",
    },
  },

  // Chinese / Mandarin (简体中文)
  zh: {
    nav: {
      home: "首页",
      builder: "定制行程规划器",
      myTrips: "我的行程",
      inquiry: "行程咨询",
      admin: "管理后台",
      cs: "客服工单",
      guide: "导游工作台",
      finance: "财务结算",
      login: "登录",
      logout: "退出登录",
    },
    hero: {
      badge: "印尼东爪哇火山专业定制旅游平台",
      title1: "定制您的梦想行程，",
      titleHighlight: "实时透明精准计费。",
      subtitle:
        "随心规划布罗莫火山、宜珍火山蓝火及千层瀑布。系统依据实际路线里程（公里单价）、所选车型、酒店等级与门票实时自动计算，绝无隐形消费。",
      ctaBuilder: "开始定制我的行程",
      ctaInquiry: "定制咨询 / 提交需求",
      guaranteeRefund: "出发前48小时全额无损退款保证",
      guaranteeAllInclusive: "全包车费、油费、过路费与专职司机",
      guaranteeFleet: "正规商务车队（Avanza、海狮Hiace、埃尔法Alphard）",
    },
    features: {
      whyChoose: "为什么选择 Itinerary ID？",
      whyChooseSub: "印尼高标准专业接待服务，消除行程途中的不确定性与乱收费。",
      card1Title: "按公里里程透明计费",
      card1Desc: "包车费用按整车与实际行驶里程计算（标准单价/公里）。从单人独行到大型包团，费用计算一目了然、公平合理。",
      card2Title: "多种精品车型自选",
      card2Desc: "丰田Avanza/Innova、宽敞舒适的丰田海狮Hiace，到奢华商务埃尔法Alphard。全车配备强劲冷气与资深印尼旅游专职司机。",
      card3Title: "清晰明了的退改保障",
      card3Desc: "支持Midtrans全额在线安全支付（支持国际信用卡与银联）。接机时间前48小时以上申请取消，保证100%全额原路退款。",
    },
    destinations: {
      sectionTitle: "东爪哇热门核心景点",
      sectionSubtitle: "将这些享誉世界的自然奇观组合进您的独家旅行计划中。",
      planNow: "立即规划",
      addToTrip: "+ 加入行程",
    },
    inquiry: {
      badge: "专属定制与团队出行咨询",
      title: "需要专属定制路线或团队出行？",
      desc: "我们的专属中文客服团队将在24小时内为您量身定制特殊路线、特色酒店预订或独立成团预算建议。",
      nameLabel: "您的姓名 *",
      emailLabel: "电子邮箱 *",
      phoneLabel: "微信 / WhatsApp / 电话",
      countryLabel: "居住国家 / 地区",
      messageLabel: "行程需求与留言",
      messagePlaceholder: "请告诉我们您的出行计划（人数、大致出行日期、酒店星级偏好或特殊需求）...",
      submitBtn: "提交咨询给客服团队",
      submitting: "正在提交中...",
      successTitle: "需求提交成功！",
      successDesc: "感谢您的咨询。需求已送达专属客服团队，我们将在短时间内通过微信、邮箱或WhatsApp与您联系。",
      sendAnother: "提交其他咨询",
    },
    builder: {
      badge: "第一步：定制您的旅程",
      title: "定制行程规划器",
      subtitle: "按天自由编排景点路线，选择满意车型，并在右侧实时查看每一项费用的透明明细。",
      detailsTitle: "出行时间、人数及接送机地点",
      paxLabel: "出行人数 (Pax)",
      paxSolo: "1 人 (单人自由行)",
      paxDuo: "2 人 (双人情侣/好友)",
      paxPrivate: "人 (精品私家小团)",
      paxGroup: "人 (独立大团队)",
      dateLabel: "出发日期",
      durationLabel: "行程天数",
      duration1D: "1 天 (布罗莫日出特快)",
      duration2D1N: "2 天 1 晚 (2D1N)",
      duration3D2N: "3 天 2 晚 (3D2N - 经典火山环线)",
      duration4D3N: "4 天 3 晚 (4D3N)",
      duration5D4N: "5 天 4 晚 (5D4N 深度游)",
      pickupLabel: "接机/接人地点 (Pickup)",
      dropoffLabel: "送达/离境地点 (Drop-off)",
      vehicleTitle: "选择出行车辆类型",
      vehicleNote: "费用已含：专属车辆 + 专职司机 + 全程油费 + 高速过路费",
      recommended: "智能推荐",
      capacity: "载客容量",
      hotelTitle: "住宿酒店等级",
      hotelDayTrip: "单日不过夜行程",
      hotelNights: "晚 • 依人数智能分配房间",
      dayPrefix: "第",
      dayThemeLabel: "当天日程主题",
      resetDayBtn: "清空本日所选景点",
      chooseDestinations: "选择当日目的地与景点",
      selectedCount: "项已选",
      clickToToggle: "点击卡片即可添加或取消",
      ticketFree: "免费 / 交通中转站",
      activitiesTitle: "附加体验活动与防护装备（可选）：",
      activitiesSub: "按人或按组自动计入",
      perPerson: "/ 人",
      mealsTitle: "午餐 / 晚餐餐饮套餐（可选）：",
      mealsSub: "按人数统一计算",
      pricingTitle: "实时费用明细表",
      calculating: "正在计算中...",
      formulaLabel: "PRD §19 官方公式",
      distanceLabel: "预计总行驶里程:",
      transportLabel: "全车地面交通费",
      hotelLabel: "全程酒店住宿费:",
      noHotel: "不含酒店住宿",
      ticketsLabel: "景点门票与体验活动:",
      freeOrIncluded: "已包含 / 0元",
      mealsLabel: "餐饮套餐包:",
      mealsNone: "未选择 (0元)",
      guideLabel: "专业持证导游费:",
      guideOptionTitle: "专业导游服务选项",
      guideOptionSub: "选择您是否需要官方认证的专业陪同导游服务",
      withGuideTitle: "使用公司专业导游",
      withGuideDesc: "官方认证双语导游、景点文化深度讲解、专属拍照协助与全程贴心协调。",
      withoutGuideTitle: "无需导游（仅专业司机）",
      withoutGuideDesc: "自由行体验。专业旅游司机全程负责安全驾驶与路线接送，行程更灵活自如。",
      noGuidePrice: "免费 / 0 费用",
      recommendedBadge: "推荐",
      withoutGuideSummary: "仅司机无需导游 (0元)",
      subtotalLabel: "基础成本小计:",
      marginLabel: "运营服务费率",
      totalLabel: "行程全款总价:",
      perPersonLabel: "人均参考单价",
      foreignCurrencyEstimate: "外币参考折算 (人民币 / 美元):",
      refundBadgeTitle: "100%全额无损退款保障",
      refundBadgeDesc: "接机前48小时及以上提出取消，享有Midtrans平台100%全额无损原路退款。",
      checkoutBtn: "核对明细并前往付款",
      processingTrip: "正在生成行程订单...",
    },
    checkout: {
      title: "核对订单并完成付款",
      subtitle: "最后一步：付款完成后系统将立即出具出行凭证，并为您安排导游与专车。",
      contactDetailsTitle: "预订人与出行联系信息",
      fullName: "预订人全名 *",
      email: "电子邮箱 (用于接收电子行程凭单) *",
      phone: "微信 / 手机号 / WhatsApp *",
      country: "常住国家或地区",
      paymentMethodTitle: "Midtrans 在线支付网关",
      paymentHighlight: "100% 全额在线预付（行程全程无任何现场强制加价）",
      paymentDesc: "支持国际信用卡（Visa、万事达MasterCard、JCB、运通Amex）、印尼本地银行转账及电子钱包。",
      pciBadge: "交易通过 Midtrans 支付网关提供 PCI-DSS Level 1 银行级最高加密安全保障。",
      summaryTitle: "您的行程概览",
      tripPlanTitle: "行程方案:",
      participants: "出行人数:",
      fleet: "指定车型:",
      pickup: "接机地点:",
      dropoff: "送达地点:",
      transport: "地面交通包车:",
      hotel: "酒店住宿:",
      tickets: "门票与活动:",
      guide: "导游服务:",
      totalPayment: "实付总金额:",
      cancellationAlertTitle: "取消与退款政策说明",
      cancellationAlertDesc:
        "在预定接机时间前48小时（含）以上提出取消，可享受100%全额无损退款；不足48小时取消则不予退款。",
      payBtn: "立即在线支付",
      connectingGateway: "正在调起安全支付网关...",
    },
    voucher: {
      successBadge: "付款成功 • 订单已确认",
      successTitle: "行程订单确认成功！",
      successDesc: "感谢您的预订。您的行程状态为 CONFIRMED。出团凭证与每日详细日程已为您生成如下。",
      officialVoucher: "官方出团凭据 (Travel Voucher)",
      bookingNo: "订单编号:",
      printBtn: "打印 / 保存PDF",
      newTripBtn: "制定新行程",
      booker: "出行代表人:",
      fleetPax: "人数与车型:",
      pickupPoint: "指定接机点:",
      totalCost: "支付金额:",
      paidStatus: "已付全款 (Midtrans)",
      timelineTitle: "逐日详细行程路线安排",
      hotlineTitle: "出行业务调度与接机保障中心",
      hotlineDesc: "您的专属导游与司机将在出发前24小时主动通过微信或WhatsApp与您取得联系。",
      callHotline: "联系紧急服务热线",
    },
  },

  // Indonesian (Bahasa Indonesia)
  id: {
    nav: {
      home: "Beranda",
      builder: "Penyusun Itinerary Custom",
      myTrips: "Itinerary Saya",
      inquiry: "Inquiry Trip",
      admin: "Panel Admin",
      cs: "Inbox CS",
      guide: "Portal Guide",
      finance: "Portal Finance",
      login: "Masuk",
      logout: "Keluar",
    },
    hero: {
      badge: "Platform Rencana Perjalanan Custom No. 1 Jawa Timur",
      title1: "Susun Itinerary Impian,",
      titleHighlight: "Hitung Biaya Transparan Real-Time.",
      subtitle:
        "Pilih rute Bromo, Kawah Ijen, hingga Tumpak Sewu sesuai tanggal dan ritme Anda. Sistem menghitung tarif akurat berbasis jarak km, armada pilihan, kelas hotel, dan tiket masuk tanpa biaya tersembunyi.",
      ctaBuilder: "Mulai Rancang Custom Itinerary",
      ctaInquiry: "Konsultasi / Kirim Inquiry",
      guaranteeRefund: "Garansi 100% Refund (≥ 48 Jam)",
      guaranteeAllInclusive: "BBM, Tol & Sopir Sudah Termasuk",
      guaranteeFleet: "Armada Resmi (Avanza, Hiace, Alphard)",
    },
    features: {
      whyChoose: "Mengapa Memilih Itinerary ID?",
      whyChooseSub: "Standar profesional yang menghilangkan keraguan dan kejutan harga di lapangan.",
      card1Title: "Tarif Transparan Berbasis Jarak",
      card1Desc: "Transport dihitung per grup berdasarkan jarak rute aktual (rate per km). Tidak ada markup rute tersembunyi; solo hingga rombongan besar mendapatkan perhitungan yang adil.",
      card2Title: "Bebas Pilih Jenis Kendaraan",
      card2Desc: "Pilih dari Avanza/Innova, Toyota Hiace Commuter yang lapang, hingga Alphard/Lexus VIP. Semua kendaraan ber-AC dingin dan dikemudikan driver berpengalaman.",
      card3Title: "Kebijakan Pembatalan Jelas",
      card3Desc: "Pembayaran lunas 100% di muka via Midtrans. Pembatalan hingga 48 jam sebelum penjemputan dijamin pengembalian dana penuh tanpa potongan.",
    },
    destinations: {
      sectionTitle: "Destinasi Favorit Jawa Timur",
      sectionSubtitle: "Kombinasikan destinasi-destinasi ikonik ini dalam satu rangkaian perjalanan.",
      planNow: "Rancang Sekarang",
      addToTrip: "+ Tambah ke Trip",
    },
    inquiry: {
      badge: "Layanan Konsultasi Trip Khusus",
      title: "Punya Permintaan Khusus atau Grup Wisata?",
      desc: "Tim Customer Support kami siap membantu merancang rute khusus, akomodasi spesifik, atau penyesuaian anggaran grup Anda dalam waktu kurang dari 24 jam.",
      nameLabel: "Nama Lengkap *",
      emailLabel: "Alamat Email *",
      phoneLabel: "WhatsApp / No. Telepon",
      countryLabel: "Negara Asal",
      messageLabel: "Detail Rencana / Pertanyaan",
      messagePlaceholder: "Ceritakan rencana perjalanan Anda (jumlah peserta, perkiraan tanggal, preferensi kamar hotel, atau destinasi yang ingin dikunjungi)...",
      submitBtn: "Kirimkan ke Customer Support",
      submitting: "Mengirim Inquiry...",
      successTitle: "Inquiry Berhasil Terkirim!",
      successDesc: "Terima kasih. Permintaan Anda telah masuk ke inbox Customer Support kami. Tim kami akan segera menghubungi Anda.",
      sendAnother: "Kirim permintaan lainnya",
    },
    builder: {
      badge: "Langkah 1: Kustomisasi Trip Anda",
      title: "Custom Itinerary Builder",
      subtitle: "Atur destinasi per hari, pilih armada kendaraan, dan periksa estimasi biaya transparan real-time.",
      detailsTitle: "Detail Waktu, Peserta & Titik Penjemputan",
      paxLabel: "Jumlah Peserta (Pax)",
      paxSolo: "1 Orang (Solo)",
      paxDuo: "2 Orang (Duo)",
      paxPrivate: "Orang (Private)",
      paxGroup: "Orang (Group)",
      dateLabel: "Tanggal Berangkat",
      durationLabel: "Durasi Trip (Hari)",
      duration1D: "1 Hari (Sunrise Day Trip)",
      duration2D1N: "2 Hari 1 Malam (2D1N)",
      duration3D2N: "3 Hari 2 Malam (3D2N - Populer)",
      duration4D3N: "4 Hari 3 Malam (4D3N)",
      duration5D4N: "5 Hari 4 Malam (5D4N)",
      pickupLabel: "Titik Penjemputan (Pickup)",
      dropoffLabel: "Titik Pengantaran (Drop-off)",
      vehicleTitle: "Pilih Jenis Armada Kendaraan",
      vehicleNote: "Termasuk: Mobil + Driver + BBM + Tol",
      recommended: "Rekomendasi",
      capacity: "Kapasitas",
      hotelTitle: "Kelas Akomodasi Hotel",
      hotelDayTrip: "Day trip tanpa inap",
      hotelNights: "Malam • Auto Kamar Sesuai Pax",
      dayPrefix: "Hari ke-",
      dayThemeLabel: "Judul / Tema Hari",
      resetDayBtn: "Reset Pilihan Hari Ini",
      chooseDestinations: "Pilih Destinasi untuk Hari ke-",
      selectedCount: "Terpilih",
      clickToToggle: "Klik untuk memilih / membatalkan",
      ticketFree: "Gratis / Transit",
      activitiesTitle: "Aktivitas Tambahan & Alat (Opsional):",
      activitiesSub: "Dihitung per grup / orang",
      perPerson: "/ orang",
      mealsTitle: "Paket Makan Siang / Malam (Opsional):",
      mealsSub: "Dihitung per orang",
      pricingTitle: "Rincian Biaya Real-Time",
      calculating: "Menghitung...",
      formulaLabel: "PRD §19 Formula",
      distanceLabel: "Estimasi Total Jarak Rute:",
      transportLabel: "Transportasi Grup",
      hotelLabel: "Hotel:",
      noHotel: "Tanpa penginapan",
      ticketsLabel: "Tiket POI & Aktivitas:",
      freeOrIncluded: "Termasuk / Rp 0",
      mealsLabel: "Paket Makan:",
      mealsNone: "Belum dipilih (Rp 0)",
      guideLabel: "Pemandu/Guide:",
      guideOptionTitle: "Layanan Pemandu Wisata (Tour Guide)",
      guideOptionSub: "Pilihan pendampingan pemandu wisata berlisensi resmi dari perusahaan",
      withGuideTitle: "Gunakan Tour Guide Perusahaan",
      withGuideDesc: "Pemandu wisata resmi, penjelasan sejarah/spot terbaik, bantuan foto dokumentasi, dan koordinasi tiket di lokasi.",
      withoutGuideTitle: "Tanpa Tour Guide (Hanya Driver)",
      withoutGuideDesc: "Liburan santai mandiri. Driver wisata berpengalaman kami siap mengantar antar tujuan dengan aman dan nyaman.",
      noGuidePrice: "Hemat / Rp 0",
      recommendedBadge: "Direkomendasikan",
      withoutGuideSummary: "Tanpa Guide (Hanya Driver - Rp 0)",
      subtotalLabel: "Subtotal Biaya:",
      marginLabel: "Markup Operasional",
      totalLabel: "Total Biaya Trip:",
      perPersonLabel: "Per Orang",
      foreignCurrencyEstimate: "Perkiraan Valuta Asing:",
      refundBadgeTitle: "100% Full Refund Guarantee",
      refundBadgeDesc: "Pembatalan hingga 48 jam sebelum penjemputan dijamin pengembalian dana 100% penuh via Midtrans.",
      checkoutBtn: "Lanjut ke Review & Checkout",
      processingTrip: "Memproses Rencana Trip...",
    },
    checkout: {
      title: "Review Pesanan & Pembayaran Lunas",
      subtitle: "Langkah terakhir sebelum pesanan terkonfirmasi dan penugasan guide/driver diterbitkan.",
      contactDetailsTitle: "Data Kontak & Penanggung Jawab Perjalanan",
      fullName: "Nama Lengkap Pemesan *",
      email: "Email (untuk Tiket & Voucher) *",
      phone: "Nomor WhatsApp / HP *",
      country: "Negara Asal",
      paymentMethodTitle: "Metode Pembayaran Online Midtrans",
      paymentHighlight: "100% Lunas di Muka (Tanpa Biaya Tambahan di Lapangan)",
      paymentDesc: "Mendukung Kartu Kredit Internasional, Bank Transfer / Virtual Account, serta E-Wallet.",
      pciBadge: "Data transaksi dienkripsi dengan standar keamanan tertinggi PCI-DSS Level 1 oleh Midtrans.",
      summaryTitle: "Ringkasan Itinerary Anda",
      tripPlanTitle: "Judul Rencana:",
      participants: "Peserta:",
      fleet: "Armada:",
      pickup: "Jemput:",
      dropoff: "Antar:",
      transport: "Transportasi:",
      hotel: "Hotel & Akomodasi:",
      tickets: "Tiket POI & Aktivitas:",
      guide: "Pemandu Wisata (Guide):",
      totalPayment: "Total Pembayaran:",
      cancellationAlertTitle: "Ketentuan Pembatalan & Pengembalian Dana",
      cancellationAlertDesc:
        "Pembatalan yang diajukan ≥ 48 jam sebelum jadwal penjemputan berhak atas 100% Full Refund. Pembatalan < 48 jam tidak dapat dikembalikan.",
      payBtn: "Bayar Sekarang",
      connectingGateway: "Menghubungkan Gateway Midtrans...",
    },
    voucher: {
      successBadge: "Pembayaran Lunas & Terkonfirmasi",
      successTitle: "Pesanan Itinerary Berhasil!",
      successDesc: "Terima kasih. Pesanan Anda telah tercatat dengan status CONFIRMED. Dokumen itinerary siap diakses.",
      officialVoucher: "Official Travel Voucher",
      bookingNo: "No. Booking:",
      printBtn: "Cetak / Simpan PDF",
      newTripBtn: "Buat Trip Baru",
      booker: "Pemesan:",
      fleetPax: "Peserta & Armada:",
      pickupPoint: "Titik Penjemputan:",
      totalCost: "Total Biaya:",
      paidStatus: "Lunas (Midtrans)",
      timelineTitle: "Jadwal Perjalanan Rinci (Day-by-Day)",
      hotlineTitle: "Pusat Informasi & Penjemputan Operasional",
      hotlineDesc: "Tim operasional dan guide Anda akan menghubungi WhatsApp Anda 24 jam sebelum keberangkatan.",
      callHotline: "Hubungi Hotline Travel",
    },
  },
};

export const itemTranslations: Record<string, { en: string; zh: string; id: string }> = {
  // Destinations
  "Gunung Bromo Sunrise & Sea of Sand": {
    en: "Mount Bromo Sunrise & Sea of Sand",
    zh: "布罗莫火山日出与沙海",
    id: "Gunung Bromo Sunrise & Sea of Sand",
  },
  "Kawah Ijen Blue Fire & Acid Crater": {
    en: "Ijen Crater Blue Fire & Acid Lake",
    zh: "宜珍火山蓝色火焰与酸性火山口湖",
    id: "Kawah Ijen Blue Fire & Acid Crater",
  },
  "Air Terjun Tumpak Sewu & Goa Tetes": {
    en: "Tumpak Sewu Waterfall & Tetes Cave",
    zh: "千层瀑布 (赛武瀑布) 与滴水洞",
    id: "Air Terjun Tumpak Sewu & Goa Tetes",
  },
  "Air Terjun Madakaripura": {
    en: "Madakaripura Waterfall",
    zh: "玛达卡利普拉壮丽瀑布",
    id: "Air Terjun Madakaripura",
  },
  "Surabaya City Tour & Heritage": {
    en: "Surabaya Heritage & City Tour",
    zh: "泗水城市历史与文化巡礼",
    id: "Surabaya City Tour & Heritage",
  },
  "Jatim Park 2 & 3 Batu Malang": {
    en: "Jatim Park 2 & 3 Theme Park Batu",
    zh: "巴图 Jatim Park 2 & 3 亲子乐园",
    id: "Jatim Park 2 & 3 Batu Malang",
  },
  "Taman Nasional Baluran (Little Africa)": {
    en: "Baluran National Park (Little Africa)",
    zh: "巴鲁兰国家公园 (爪哇小非洲)",
    id: "Taman Nasional Baluran (Little Africa)",
  },
  "Pantai Sukamade (Turtle Conservation)": {
    en: "Sukamade Turtle Conservation Beach",
    zh: "苏卡玛德海龟保育沙滩",
    id: "Pantai Sukamade (Turtle Conservation)",
  },
  "Pelabuhan Ketapang Banyuwangi (Transit Bali)": {
    en: "Ketapang Ferry Port (Transit to Bali)",
    zh: "外南梦客运码头 (直通巴厘岛)",
    id: "Pelabuhan Ketapang Banyuwangi (Transit Bali)",
  },
  // Vehicles
  "Toyota Avanza / Xenia": {
    en: "Toyota Avanza / Xenia (Compact MPV)",
    zh: "丰田 Avanza / 紧凑型商务车",
    id: "Toyota Avanza / Xenia",
  },
  "Toyota Innova Reborn / Zenix": {
    en: "Toyota Innova Reborn / Zenix (Comfort MPV)",
    zh: "丰田 Innova 舒适型中级商务车",
    id: "Toyota Innova Reborn / Zenix",
  },
  "Toyota Hiace Commuter / Premio": {
    en: "Toyota Hiace Commuter / Premio (Minibus)",
    zh: "丰田海狮 Hiace 宽敞商务旅行中巴",
    id: "Toyota Hiace Commuter / Premio",
  },
  "Toyota Alphard / Vellfire VIP": {
    en: "Toyota Alphard / Vellfire VIP (Luxury Van)",
    zh: "丰田埃尔法 Alphard 奢华VIP头等舱",
    id: "Toyota Alphard / Vellfire VIP",
  },
  // Activities
  "Bromo 4x4 Jeep Sunrise Tour": {
    en: "Bromo 4x4 Jeep Sunrise Adventure",
    zh: "布罗莫 4x4 四驱吉普车日出探索",
    id: "Bromo 4x4 Jeep Sunrise Tour",
  },
  "Ijen Gas Mask & Headlamp Rental": {
    en: "Ijen Gas Mask & Headlamp Rental",
    zh: "宜珍专业防毒面具与强光头灯租赁",
    id: "Ijen Gas Mask & Headlamp Rental",
  },
  "Tumpak Sewu Local Trekking Guide": {
    en: "Tumpak Sewu Local River Trekking Guide",
    zh: "千层瀑布专业涉水向导陪同",
    id: "Tumpak Sewu Local Trekking Guide",
  },
  "Horse Riding at Bromo Sea of Sand": {
    en: "Horse Riding across Bromo Sea of Sand",
    zh: "布罗莫沙海特色骑马体验",
    id: "Horse Riding at Bromo Sea of Sand",
  },
  // Meals
  "Standard Lunch / Dinner Box": {
    en: "Standard Lunch / Dinner Box (Local Indonesian)",
    zh: "标准印尼风味便当午餐/晚餐",
    id: "Standard Lunch / Dinner Box",
  },
  "Buffet / Restaurant Dining Package": {
    en: "Buffet / Restaurant Dining Package",
    zh: "正宗印尼餐厅精选风味合餐/自助",
    id: "Buffet / Restaurant Dining Package",
  },
};

export function localizeItem(name: string, locale: Locale): string {
  if (!name) return "";
  const match = itemTranslations[name.trim()];
  if (match && match[locale]) {
    return match[locale];
  }
  return name;
}

