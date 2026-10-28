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
    agent: string;
    becomeAgent: string;
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
    platformFeeLabel: string;
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
  agentPortal: {
    partnerBadge: string;
    title: string;
    subtitle: string;
    manageLeads: string;
    myCommissions: string;
    referralBoxTitle: string;
    agentCode: string;
    referralHint: string;
    copyLink: string;
    copied: string;
    totalLeads: string;
    totalLeadsSub: string;
    activeLeads: string;
    activeLeadsSub: string;
    pendingCommission: string;
    pendingCommissionSub: string;
    approvedCommission: string;
    approvedCommissionSub: string;
    pipelineCardTitle: string;
    pipelineCardDesc: string;
    commissionCardTitle: string;
    commissionCardDesc: string;
    agreementTitle: string;
    agreementSubtitle: string;
    agreementTerm1: string;
    agreementTerm2: string;
    agreementTerm3: string;
    agreementTerm4: string;
    agreementBtn: string;
    agreementProcessing: string;
    accountNotActive: string;
    accountNotActiveDesc: string;
    applyNow: string;
    loadingDashboard: string;
    statusLabel: string;
    tierLabel: string;
  };
  agentLeads: {
    title: string;
    subtitle: string;
    addManualBtn: string;
    backToDashboard: string;
    filterAll: string;
    filterNew: string;
    filterContacted: string;
    filterQuoted: string;
    filterWon: string;
    filterLost: string;
    exclusiveLock: string;
    expiresIn: string;
    daysUnit: string;
    expired: string;
    nextFollowUp: string;
    noFollowUp: string;
    makeProposal: string;
    copyCheckoutLink: string;
    tripLinked: string;
    activitiesTimeline: string;
    addNotePlaceholder: string;
    saveNote: string;
    savingNote: string;
    emptyLeads: string;
    modalAddTitle: string;
    modalAddSubtitle: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    countryLabel: string;
    reqLabel: string;
    followUpLabel: string;
    cancelBtn: string;
    createLeadBtn: string;
    submitting: string;
    closeBtn: string;
    copiedAlert: string;
    sourceWebsite: string;
    sourceManual: string;
  };
  agentCommissions: {
    title: string;
    subtitle: string;
    backToDashboard: string;
    openPipeline: string;
    totalEarned: string;
    totalEarnedSub: string;
    readyPayout: string;
    readyPayoutSub: string;
    pendingReview: string;
    pendingReviewSub: string;
    bookingId: string;
    customer: string;
    tripName: string;
    tripTotal: string;
    commissionAmount: string;
    status: string;
    date: string;
    payoutRef: string;
    emptyCommissions: string;
    statusPending: string;
    statusApproved: string;
    statusPaid: string;
    statusVoid: string;
  };
  becomeAgent: {
    badge: string;
    title: string;
    subtitle: string;
    benefit1Title: string;
    benefit1Desc: string;
    benefit2Title: string;
    benefit2Desc: string;
    benefit3Title: string;
    benefit3Desc: string;
    formTitle: string;
    formSubtitle: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    phoneLabel: string;
    countryLabel: string;
    companyLabel: string;
    channelsLabel: string;
    channelsPlaceholder: string;
    payoutMethodLabel: string;
    payoutWise: string;
    payoutBank: string;
    payoutPaypal: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successDesc: string;
    loginPrompt: string;
    loginBtn: string;
    alreadyPartner: string;
  };
  authLogin: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    submitBtn: string;
    loggingIn: string;
    demoTitle: string;
    demoAgent: string;
    demoAdmin: string;
    demoCS: string;
    demoFinance: string;
    demoCustomer: string;
    quickDemoNote: string;
    registerAgentLink: string;
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
      agent: "Agent Portal",
      becomeAgent: "Become an Agent",
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
        "Group transport is calculated per group from the actual route distance. One all-inclusive price, with no extra charges after checkout.",
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
      marginLabel: "Platform Fee",
      platformFeeLabel: "Platform Fee",
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
    agentPortal: {
      partnerBadge: "Itinerary ID Official Partner",
      title: "Partner Portal",
      subtitle: "Manage your traveler leads, share your 60-day protected referral links, create custom itineraries, and monitor commissions.",
      manageLeads: "Manage Leads",
      myCommissions: "My Commissions",
      referralBoxTitle: "Official Referral Link (30-day Cookie & 60-day Lock)",
      agentCode: "Agent Code",
      referralHint: "All bookings from this link are automatically credited to your account",
      copyLink: "Copy Link",
      copied: "Copied!",
      totalLeads: "Total Leads",
      totalLeadsSub: "Registered travelers",
      activeLeads: "Active Pipeline",
      activeLeadsSub: "New / Contacted / Quoted",
      pendingCommission: "Pending Commission",
      pendingCommissionSub: "Trips in progress or awaiting completion",
      approvedCommission: "Approved Commission",
      approvedCommissionSub: "Completed trips ready for payout",
      pipelineCardTitle: "Lead Pipeline Management",
      pipelineCardDesc: "Manually input leads from WhatsApp/WeChat chats, log follow-up tasks, and click 'Create Proposal' to customize itineraries and generate checkout links.",
      commissionCardTitle: "Commission Transparency & History",
      commissionCardDesc: "Review transparent commission breakdowns from every customer booking, verification approval milestones, and transfer payout history.",
      agreementTitle: "Partner Cooperation Agreement (v1.0)",
      agreementSubtitle: "Please review and accept before managing leads and receiving commissions",
      agreementTerm1: "1. Sales & Payments: The Agent acts as an official partner. Customers pay 100% directly to Itinerary ID via Midtrans secure payment gateway. Agents are strictly prohibited from collecting client payments directly.",
      agreementTerm2: "2. Commissions: Commissions are calculated from the transparent server Commission Reserve and are eligible for payout after the tour is completed.",
      agreementTerm3: "3. Lead Protection: Leads acquired via link or manual entry are exclusively protected for 60 days. Agents must maintain active follow-ups within 14 days to prevent stale reassignment.",
      agreementTerm4: "4. Cancellation & Refunds: If a traveler cancels their booking resulting in a refund under policy terms, the associated commission for that booking is voided.",
      agreementBtn: "I Have Read & Agree to the Terms (v1.0)",
      agreementProcessing: "Processing agreement...",
      accountNotActive: "Account Not Yet Activated as Partner",
      accountNotActiveDesc: "Your account is not registered yet or is pending Admin approval as an official partner agent.",
      applyNow: "Apply for Partnership Now",
      loadingDashboard: "Loading partner dashboard...",
      statusLabel: "Status",
      tierLabel: "Tier",
    },
    agentLeads: {
      title: "Traveler Leads & Pipeline",
      subtitle: "Track potential travelers, create custom itinerary proposals, and copy direct checkout links.",
      addManualBtn: "+ Add Manual Lead",
      backToDashboard: "← Back to Agent Dashboard",
      filterAll: "All Leads",
      filterNew: "New",
      filterContacted: "Contacted",
      filterQuoted: "Quoted",
      filterWon: "Closed Won (Booked)",
      filterLost: "Lost",
      exclusiveLock: "Exclusive 60-Day Lock",
      expiresIn: "Expires in",
      daysUnit: "days",
      expired: "Expired",
      nextFollowUp: "Next Follow-up",
      noFollowUp: "No follow-up scheduled",
      makeProposal: "Create Itinerary Proposal",
      copyCheckoutLink: "Copy Direct Checkout Link",
      tripLinked: "Proposal Trips Created",
      activitiesTimeline: "Communication & Activity History",
      addNotePlaceholder: "Write a note about this customer (e.g. wants 4-star hotel in Bromo, budget 500 USD, traveling in May)...",
      saveNote: "Save Note",
      savingNote: "Saving...",
      emptyLeads: "No leads found in this filter.",
      modalAddTitle: "Add Manual Traveler Lead",
      modalAddSubtitle: "Input inquiries from WeChat, WhatsApp, or phone inquiries directly into your pipeline.",
      nameLabel: "Customer Full Name *",
      emailLabel: "Email Address *",
      phoneLabel: "WhatsApp / WeChat / Phone",
      countryLabel: "Country / Region",
      reqLabel: "Initial Requirements & Trip Notes",
      followUpLabel: "Next Scheduled Follow-up Date",
      cancelBtn: "Cancel",
      createLeadBtn: "Save & Lock Lead",
      submitting: "Saving...",
      closeBtn: "Close",
      copiedAlert: "Checkout link copied to clipboard!",
      sourceWebsite: "Website Referral",
      sourceManual: "Manual Lead",
    },
    agentCommissions: {
      title: "Commission History & Payouts",
      subtitle: "Commissions are recorded automatically upon booking completion and disbursed after the trip concludes.",
      backToDashboard: "← Back to Agent Dashboard",
      openPipeline: "Open Lead Pipeline",
      totalEarned: "Total Paid Out",
      totalEarnedSub: "Transferred by finance",
      readyPayout: "Approved (Ready for Payout)",
      readyPayoutSub: "Completed and verified",
      pendingReview: "Pending Tour Completion",
      pendingReviewSub: "Trips in progress",
      bookingId: "Booking Ref",
      customer: "Customer",
      tripName: "Itinerary Name",
      tripTotal: "Booking Amount",
      commissionAmount: "Your Commission",
      status: "Status",
      date: "Date",
      payoutRef: "Payout Ref / Receipt",
      emptyCommissions: "No commission records yet. Share your referral link or make proposals to start earning!",
      statusPending: "Pending Completion",
      statusApproved: "Approved (Payable)",
      statusPaid: "Paid Out",
      statusVoid: "Void (Refunded)",
    },
    becomeAgent: {
      badge: "Itinerary ID Official Partner & Agent Program",
      title: "Join As An Official Partner Agent",
      subtitle: "Earn competitive commissions on East Java custom tours (Bromo, Ijen, Tumpak Sewu) with 60-day lead protection, automated transparent pricing, and multilingual itineraries.",
      benefit1Title: "60-Day Exclusive Lead Protection",
      benefit1Desc: "Travelers entering through your referral link or manual input are exclusively locked to your account for 60 days.",
      benefit2Title: "Automated Real-Time Pricing",
      benefit2Desc: "Instant quotes generated with precise distance-based rates, vehicle fleet options, and hotel grades.",
      benefit3Title: "Guaranteed Commission Payouts",
      benefit3Desc: "Commissions are safely reserved and paid upon tour completion via Wise, Bank Transfer, or PayPal.",
      formTitle: "Partner Application Form",
      formSubtitle: "Submit your details for rapid review by our partnerships team.",
      nameLabel: "Your Full Name *",
      emailLabel: "Business Email (for login) *",
      passwordLabel: "Account Password *",
      phoneLabel: "WhatsApp / WeChat / Phone *",
      countryLabel: "Country / Region *",
      companyLabel: "Agency / Company / Brand Name *",
      channelsLabel: "Primary Marketing Channels",
      channelsPlaceholder: "e.g. WeChat groups, Red/Xiaohongshu, inbound travel agency, study abroad community...",
      payoutMethodLabel: "Preferred Payout Method",
      payoutWise: "Wise International Transfer",
      payoutBank: "Direct Bank Wire Transfer",
      payoutPaypal: "PayPal / Other International",
      submitBtn: "Submit Partner Application",
      submittingBtn: "Submitting application...",
      successTitle: "Application Submitted Successfully!",
      successDesc: "Thank you for applying to the Itinerary ID Partner Program. Our team will review your application within 24 hours.",
      loginPrompt: "Once approved, you can log in immediately using your registered email and password.",
      loginBtn: "Go to Login Page",
      alreadyPartner: "Already have a partner account? Sign In",
    },
    authLogin: {
      title: "Sign In to Itinerary ID",
      subtitle: "Access your customer portal or internal management system.",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      submitBtn: "Sign In",
      loggingIn: "Signing in...",
      demoTitle: "Quick Demo Accounts (1-Click Fill)",
      demoAgent: "Agent Partner (Shanghai Silk Road)",
      demoAdmin: "Super Admin",
      demoCS: "Customer Support (CS)",
      demoFinance: "Finance Manager",
      demoCustomer: "Customer User",
      quickDemoNote: "Click any button above to auto-fill credentials for testing.",
      registerAgentLink: "Want to become an official agent partner? Apply here",
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
      agent: "分销代理门户",
      becomeAgent: "申请合作代理",
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
      card1Desc: "团队交通按实际路线距离统一计算。全包一口价，结账后无任何隐形附加费。",
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
      marginLabel: "平台服务费",
      platformFeeLabel: "平台服务费",
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
    agentPortal: {
      partnerBadge: "Itinerary ID 官方签约合作伙伴",
      title: "代理分销门户",
      subtitle: "管理您的游客线索、获取专属推广链接（60天独家锁定）、创建定制行程报价并追踪佣金结算。",
      manageLeads: "线索管理",
      myCommissions: "我的佣金",
      referralBoxTitle: "专属推荐链接（30天Cookie追踪 & 60天独占锁定）",
      agentCode: "代理邀请码",
      referralHint: "所有通过此专属链接成交的预订均会自动计入您的佣金账户",
      copyLink: "复制链接",
      copied: "已复制！",
      totalLeads: "累计登记游客",
      totalLeadsSub: "通过专属链接或手动录入的客户",
      activeLeads: "跟进中意向客户",
      activeLeadsSub: "新登记 / 已沟通 / 方案报价中",
      pendingCommission: "待履约佣金 (Pending)",
      pendingCommissionSub: "行程执行中或等待完成核验",
      approvedCommission: "可提现佣金 (Approved)",
      approvedCommissionSub: "行程圆满结束并通过服务审核",
      pipelineCardTitle: "客户线索与商机管理",
      pipelineCardDesc: "手动录入来自微信或日常咨询的意向客户，设置跟进日程，一键点击“创建报价方案”即可快速生成多语种定制行程与专属结账链接。",
      commissionCardTitle: "分销佣金明细与提现",
      commissionCardDesc: "查看每一笔客户预订的透明佣金明细、行程结束后的结算核验进度，以及银行/Wise/支付宝账户的打款转账凭证。",
      agreementTitle: "代理合作协议与分销条款 (v1.0)",
      agreementSubtitle: "在管理客户线索与申请佣金结算前，请阅读并确认以下合规条款",
      agreementTerm1: "1. 销售与资金合规：代理商为官方签约推广伙伴。客户行程全款100%直接支付至Itinerary ID官方对公/网关账户。严禁代理商私自截留或代收团费。",
      agreementTerm2: "2. 佣金结算规则：佣金金额严格依据平台系统设定的预留佣金比例自动计算，并在整趟行程完满结束、服务履约确认后进行核准备付。",
      agreementTerm3: "3. 客户独家保护期：录入或引流的游客线索享有60天独家保护期。代理人需在14天内保持有效跟进，避免客户因逾期未跟进而失效。",
      agreementTerm4: "4. 取消与退款政策：若客户依据退改政策申请取消行程并获得退款，该笔订单对应的佣金将同步取消作废。",
      agreementBtn: "我已阅读并完全同意《代理商合作协议》(v1.0)",
      agreementProcessing: "正在签署并激活中...",
      accountNotActive: "当前账号尚未激活代理资质",
      accountNotActiveDesc: "您的账号尚未申请或正在等待系统管理员审核批准开通官方签约代理权限。",
      applyNow: "立即申请签约代理商",
      loadingDashboard: "正在加载代理商控制台...",
      statusLabel: "账号状态",
      tierLabel: "代理等级",
    },
    agentLeads: {
      title: "游客线索与商机跟进",
      subtitle: "实时追踪意向游客需求，一键生成定制行程报价方案，并复制专属结账链接。",
      addManualBtn: "+ 手动录入新客户",
      backToDashboard: "← 返回代理控制台",
      filterAll: "全部客户",
      filterNew: "新录入",
      filterContacted: "已沟通",
      filterQuoted: "已报价",
      filterWon: "已成交预订",
      filterLost: "已流失",
      exclusiveLock: "60天独家保护锁定",
      expiresIn: "保护期剩余",
      daysUnit: "天",
      expired: "已过保护期",
      nextFollowUp: "下次跟进计划",
      noFollowUp: "未排期跟进时间",
      makeProposal: "创建定制报价方案",
      copyCheckoutLink: "复制在线付款链接",
      tripLinked: "已关联行程方案",
      activitiesTimeline: "沟通跟进与活动记录",
      addNotePlaceholder: "添加客户需求备注（例如：希望入住布罗莫4星酒店，预算500美元，计划5月出行）...",
      saveNote: "保存跟进记录",
      savingNote: "保存中...",
      emptyLeads: "当前筛选条件下暂无客户线索。",
      modalAddTitle: "手动录入意向客户",
      modalAddSubtitle: "将来自微信、WhatsApp、电话或展会的意向客户直接录入您的销售线索库。",
      nameLabel: "客户姓名 *",
      emailLabel: "电子邮箱 *",
      phoneLabel: "微信号 / 电话 / WhatsApp",
      countryLabel: "客源国家 / 地区",
      reqLabel: "出行需求与特殊要求",
      followUpLabel: "计划下次跟进日期",
      cancelBtn: "取消",
      createLeadBtn: "保存并锁定线索",
      submitting: "保存中...",
      closeBtn: "关闭",
      copiedAlert: "在线付款链接已复制到剪贴板！",
      sourceWebsite: "专属链接引流",
      sourceManual: "手动录入",
    },
    agentCommissions: {
      title: "佣金明细与提现记录",
      subtitle: "客户预订付款后佣金自动入账，行程圆满完成后即可申请提现或由财务统一发放。",
      backToDashboard: "← 返回代理控制台",
      openPipeline: "打开客户线索管线",
      totalEarned: "已提现到账佣金",
      totalEarnedSub: "财务已转账打款",
      readyPayout: "可提现佣金 (Approved)",
      readyPayoutSub: "行程完成并通过核验",
      pendingReview: "待核准佣金 (Pending)",
      pendingReviewSub: "行程未结束或履约中",
      bookingId: "订单编号",
      customer: "游客信息",
      tripName: "预订行程",
      tripTotal: "订单总金额",
      commissionAmount: "您的佣金",
      status: "佣金状态",
      date: "预订日期",
      payoutRef: "打款转账单号 / 凭单",
      emptyCommissions: "暂无佣金记录。通过分享专属链接或为客户定制行程，即刻开启分销收益！",
      statusPending: "等待行程完成",
      statusApproved: "已审核 (待打款)",
      statusPaid: "已打款到账",
      statusVoid: "已作废 (客户退款)",
    },
    becomeAgent: {
      badge: "Itinerary ID 官方签约合作伙伴与分销体系",
      title: "申请成为官方签约分销代理商",
      subtitle: "享受具有竞争力的东爪哇火山定制游（布罗莫、宜珍、千层瀑布）分销佣金。尊享60天客户独家锁定、实时自动报价与双语/多语种行程支持。",
      benefit1Title: "60天客户独家锁定保护",
      benefit1Desc: "通过您的专属推广链接引流或手动录入的客户享有60天排他性保护，杜绝跳单与重复撞单。",
      benefit2Title: "实时透明报价与一键成案",
      benefit2Desc: "无需等待人工计算。根据用车、酒店与门票一键生成中英文方案，在线直连安全支付网关。",
      benefit3Title: "保障性佣金结算与多币种提现",
      benefit3Desc: "系统透明预留佣金，行程顺利结束后由财务准时结算，支持Wise、国际电汇、银联或对公转账。",
      formTitle: "填写合作伙伴入驻申请",
      formSubtitle: "提交后系统管理员将快速审核，为您开通代理权限与生成专属邀请码。",
      nameLabel: "您的姓名 / 负责人姓名 *",
      emailLabel: "业务电子邮箱 (用于登录) *",
      passwordLabel: "登录密码 *",
      phoneLabel: "微信号 / WhatsApp / 联系电话 *",
      countryLabel: "所在国家 / 地区 *",
      companyLabel: "旅行社 / 机构 / 团队名称 *",
      channelsLabel: "主要客源推广渠道",
      channelsPlaceholder: "例如：小红书定制游博主、微信私域社群、入境游组团社、海外留学生俱乐部等...",
      payoutMethodLabel: "首选结算收款方式",
      payoutWise: "Wise 国际外汇转账",
      payoutBank: "银行电汇 (Bank Transfer)",
      payoutPaypal: "PayPal / 其他外汇方式",
      submitBtn: "提交代理合作申请",
      submittingBtn: "正在提交申请...",
      successTitle: "申请提交成功！",
      successDesc: "感谢您申请成为 Itinerary ID 官方签约代理商。系统已收到您的入驻资料，我们将在24小时内完成资质审核。",
      loginPrompt: "审核通过后，您即可直接使用注册的邮箱和密码登录代理控制台。",
      loginBtn: "前往登录界面",
      alreadyPartner: "已有签约代理账号？直接登录",
    },
    authLogin: {
      title: "登录 Itinerary ID 平台",
      subtitle: "访问游客个人中心或内部业务管理系统。",
      emailLabel: "电子邮箱",
      passwordLabel: "登录密码",
      submitBtn: "立即登录",
      loggingIn: "正在登录...",
      demoTitle: "快速测试账号 (一键填充)",
      demoAgent: "分销代理商 (Shanghai Silk Road)",
      demoAdmin: "超级管理员 (Admin)",
      demoCS: "客服专员 (Customer Support)",
      demoFinance: "财务主管 (Finance)",
      demoCustomer: "游客用户 (Customer)",
      quickDemoNote: "点击上方快捷按钮可自动填充测试账号与密码。",
      registerAgentLink: "想成为官方合作代理商？立即申请入驻",
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
      agent: "Portal Agen",
      becomeAgent: "Daftar Mitra Agen",
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
      card1Desc: "Transport dihitung per grup berdasarkan jarak rute aktual. Satu harga all-inclusive, tanpa biaya tambahan setelah checkout.",
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
      marginLabel: "Biaya Platform",
      platformFeeLabel: "Biaya Platform",
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
    agentPortal: {
      partnerBadge: "Mitra Resmi Itinerary ID",
      title: "Portal Kemitraan",
      subtitle: "Kelola lead wisatawan Anda, bagikan link referral dengan proteksi 60 hari, buat penawaran trip, dan pantau komisi Anda.",
      manageLeads: "Kelola Leads",
      myCommissions: "Komisi Saya",
      referralBoxTitle: "Link Referral Resmi Anda (Cookie 30 Hari & Kunci 60 Hari)",
      agentCode: "Kode Agen",
      referralHint: "Semua booking dari link ini otomatis diatribusikan ke akun Anda",
      copyLink: "Salin Link",
      copied: "Tersalin!",
      totalLeads: "Total Lead Masuk",
      totalLeadsSub: "Wisatawan yang terdaftar",
      activeLeads: "Lead Aktif (Pipeline)",
      activeLeadsSub: "Tahap new / contacted / quoted",
      pendingCommission: "Komisi Menunggu (Pending)",
      pendingCommissionSub: "Trip belum selesai",
      approvedCommission: "Komisi Siap Cair (Approved)",
      approvedCommissionSub: "Trip selesai & lolos verifikasi",
      pipelineCardTitle: "Manajemen Pipeline Lead",
      pipelineCardDesc: "Input manual lead dari percakapan WhatsApp/WeChat, catat jadwal follow-up berikutnya, dan klik “Buat Penawaran” untuk merancang trip dan mengirimkan link checkout.",
      commissionCardTitle: "Transparansi & Riwayat Komisi",
      commissionCardDesc: "Lihat daftar komisi dari setiap booking wisatawan Anda, status approval setelah trip terlaksana, serta riwayat pembayaran payout ke rekening/Wise Anda.",
      agreementTitle: "Perjanjian Kemitraan Agen (v1.0)",
      agreementSubtitle: "Wajib disetujui sebelum mengelola pipeline & menerima komisi",
      agreementTerm1: "1. Penjualan & Pembayaran: Agen bertindak sebagai mitra promosi dan penghubung resmi. Pelanggan membayar 100% langsung ke rekening Itinerary ID via Midtrans. Agen tidak diperbolehkan menerima pembayaran pelanggan secara langsung.",
      agreementTerm2: "2. Komisi: Komisi dihitung dari Cadangan Komisi platform server dan dibayarkan setelah trip selesai dilaksanakan secara penuh.",
      agreementTerm3: "3. Kunci Lead: Lead yang masuk melalui link atau manual terkunci 60 hari. Agen wajib melakukan follow up aktif dalam 14 hari agar lead tidak menjadi stale.",
      agreementTerm4: "4. Kebijakan Pembatalan: Pembatalan booking oleh pelanggan yang mengakibatkan refund akan membatalkan (void) hak komisi atas booking tersebut.",
      agreementBtn: "Saya Membaca & Menyetujui Perjanjian Agen (v1.0)",
      agreementProcessing: "Memproses Persetujuan...",
      accountNotActive: "Akun Belum Aktif Sebagai Mitra",
      accountNotActiveDesc: "Akun Anda belum terdaftar atau masih menunggu persetujuan Admin sebagai mitra agen resmi.",
      applyNow: "Daftar Kemitraan Sekarang",
      loadingDashboard: "Memuat dasbor agen...",
      statusLabel: "Status",
      tierLabel: "Tier",
    },
    agentLeads: {
      title: "Pipeline Lead Wisatawan",
      subtitle: "Pantau calon wisatawan, buat penawaran trip kustom, dan salin link checkout langsung.",
      addManualBtn: "+ Tambah Lead Manual",
      backToDashboard: "← Kembali ke Dashboard Agen",
      filterAll: "Semua Lead",
      filterNew: "Baru",
      filterContacted: "Dihubungi",
      filterQuoted: "Diberi Penawaran",
      filterWon: "Berhasil Closing",
      filterLost: "Batal / Hilang",
      exclusiveLock: "Terkunci Eksklusif 60 Hari",
      expiresIn: "Berakhir dalam",
      daysUnit: "hari",
      expired: "Kadaluarsa",
      nextFollowUp: "Follow Up Berikutnya",
      noFollowUp: "Belum dijadwalkan",
      makeProposal: "Buat Penawaran Trip",
      copyCheckoutLink: "Salin Link Checkout Wisatawan",
      tripLinked: "Trip Penawaran Terhubung",
      activitiesTimeline: "Catatan & Riwayat Aktivitas",
      addNotePlaceholder: "Tulis catatan perkembangan lead ini (misal: minta hotel bintang 4 di Bromo, budget $500, pergi bulan Mei)...",
      saveNote: "Simpan Catatan",
      savingNote: "Menyimpan...",
      emptyLeads: "Belum ada lead dalam kategori ini.",
      modalAddTitle: "Tambah Lead Wisatawan Manual",
      modalAddSubtitle: "Catat calon customer dari obrolan WhatsApp, WeChat, atau telepon langsung ke pipeline Anda.",
      nameLabel: "Nama Lengkap Calon Wisatawan *",
      emailLabel: "Email Calon Wisatawan *",
      phoneLabel: "Nomor WhatsApp / HP / WeChat Calon Wisatawan",
      countryLabel: "Negara Asal Calon Wisatawan",
      reqLabel: "Kebutuhan Wisata / Catatan Khusus",
      followUpLabel: "Rencana Tanggal Follow-up Berikutnya",
      cancelBtn: "Batal",
      createLeadBtn: "Simpan & Kunci Lead",
      submitting: "Menyimpan...",
      closeBtn: "Tutup",
      copiedAlert: "Link checkout disalin ke clipboard!",
      sourceWebsite: "Web Referral",
      sourceManual: "Manual Lead",
    },
    agentCommissions: {
      title: "Riwayat Komisi & Payout",
      subtitle: "Komisi terdata otomatis dari setiap booking lunas dan dicairkan setelah trip selesai dilaksanakan.",
      backToDashboard: "← Kembali ke Dashboard Agen",
      openPipeline: "Buka Pipeline Lead",
      totalEarned: "Total Komisi Telah Dicairkan",
      totalEarnedSub: "Telah ditransfer finance",
      readyPayout: "Komisi Disetujui (Siap Dicairkan)",
      readyPayoutSub: "Trip selesai & lolos verifikasi",
      pendingReview: "Komisi Menunggu (Trip Berjalan)",
      pendingReviewSub: "Trip belum selesai",
      bookingId: "ID Booking",
      customer: "Pelanggan",
      tripName: "Nama Trip",
      tripTotal: "Nilai Booking",
      commissionAmount: "Komisi Anda",
      status: "Status Komisi",
      date: "Tanggal",
      payoutRef: "No Referensi / Bukti Transfer",
      emptyCommissions: "Belum ada catatan komisi. Bagikan link referral atau buat penawaran untuk mulai mendapatkan komisi!",
      statusPending: "Menunggu Trip Selesai",
      statusApproved: "Disetujui (Siap Dicairkan)",
      statusPaid: "Telah Dicairkan",
      statusVoid: "Batal / Refund",
    },
    becomeAgent: {
      badge: "Itinerary ID Official Partner & Agent Program",
      title: "Bergabung Sebagai Mitra Agen Resmi",
      subtitle: "Dapatkan komisi kompetitif dari paket wisata kustom Jawa Timur (Bromo, Ijen, Tumpak Sewu) dengan proteksi lead 60 hari, pricing transparan otomatis, dan itinerary multi-bahasa.",
      benefit1Title: "Proteksi Eksklusif Lead 60 Hari",
      benefit1Desc: "Wisatawan yang mendaftar melalui link referral Anda atau diinput manual terkunci eksklusif selama 60 hari.",
      benefit2Title: "Hitung Biaya Otomatis Real-Time",
      benefit2Desc: "Penawaran harga akurat seketika berdasarkan jarak km rute, pilihan armada mobil, dan kelas hotel.",
      benefit3Title: "Kepastian Pencairan Komisi",
      benefit3Desc: "Komisi dicadangkan aman oleh sistem dan dicairkan segera setelah trip selesai via Wise, Bank Transfer, atau PayPal.",
      formTitle: "Formulir Pendaftaran Mitra",
      formSubtitle: "Isi data berikut untuk verifikasi dan pembukaan akun agen resmi Anda.",
      nameLabel: "Nama Lengkap Anda / Penanggung Jawab *",
      emailLabel: "Email Bisnis (untuk login) *",
      passwordLabel: "Kata Sandi Akun *",
      phoneLabel: "Nomor WhatsApp / WeChat / Telepon *",
      countryLabel: "Negara / Domisili *",
      companyLabel: "Nama Travel Agent / Perusahaan / Brand *",
      channelsLabel: "Saluran Promosi Utama",
      channelsPlaceholder: "Contoh: Grup WeChat turis China, Xiaohongshu/Red, Travel Agent inbound, Komunitas mahasiswa...",
      payoutMethodLabel: "Metode Pencairan Komisi Pilihan",
      payoutWise: "Wise (Transfer Internasional)",
      payoutBank: "Transfer Bank Langsung (IDR / USD Wire)",
      payoutPaypal: "PayPal / Valas Lainnya",
      submitBtn: "Kirim Formulir Pendaftaran Mitra",
      submittingBtn: "Mengirim Formulir...",
      successTitle: "Pendaftaran Berhasil Dikirim!",
      successDesc: "Terima kasih telah mendaftar sebagai mitra resmi Itinerary ID. Tim kami akan memverifikasi permohonan Anda dalam 24 jam.",
      loginPrompt: "Setelah disetujui, Anda dapat langsung masuk menggunakan email dan kata sandi yang Anda daftarkan.",
      loginBtn: "Ke Halaman Masuk (Login)",
      alreadyPartner: "Sudah punya akun mitra? Masuk Sekarang",
    },
    authLogin: {
      title: "Masuk ke Akun Itinerary ID",
      subtitle: "Akses portal pelanggan atau sistem manajemen operasional internal.",
      emailLabel: "Alamat Email",
      passwordLabel: "Kata Sandi",
      submitBtn: "Masuk ke Akun",
      loggingIn: "Memproses Masuk...",
      demoTitle: "Akun Uji Coba Cepat (1-Klik Isi)",
      demoAgent: "Mitra Agen (Shanghai Silk Road)",
      demoAdmin: "Super Admin",
      demoCS: "Customer Support (CS)",
      demoFinance: "Finance Manager",
      demoCustomer: "Pelanggan Wisatawan",
      quickDemoNote: "Klik salah satu tombol peran di atas untuk otomatis mengisi email & kata sandi demo.",
      registerAgentLink: "Ingin menjadi mitra agen resmi? Daftar di sini",
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

