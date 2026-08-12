export interface StanceSource {
  url: string;
  title: string;
  publisher: string;
}

export interface Politician {
  id: string;
  name: string;
  party: string;
  ballotLetters: string;
  seats: string;
  biography: string;
  partyWebsite: string;
  imageUrl: string;
  facts: string[];
  intelligence: Record<string, string>;
  stances: Record<string, string>;
  stanceSources: Record<string, StanceSource>;
  quote: string;
}

export const ISSUE_DEFINITIONS: Record<string, string> = {
  "Free Market Priority": "Eliminating government price controls and reducing social welfare budgets to prioritise a competitive, de-regulated economy.",
  "Two-State Separation": "Establishing a sovereign Palestinian state alongside Israel based on the 1967 borders with mutually agreed land swaps.",
  "Judicial Override": "Passing a \"Basic Law\" that allows a simple Knesset majority (61 members) to re-enact laws struck down by the Supreme Court.",
  "Universal Enlistment": "Rescinding all legal exemptions for Haredi (Ultra-Orthodox) yeshiva students, making military or national service mandatory for all 18-year-old citizens.",
  "State Commission (Oct 7)": "Establishing a State Commission of Inquiry—headed by a Supreme Court Justice—to investigate the political and military failures of October 7th.",
  "Shabbat Public Transit": "Authorizing and funding public transportation and the operation of essential businesses on Saturdays in secular-majority municipalities.",
  "West Bank Annexation": "Formally applying Israeli sovereignty (annexation) over Area C of the West Bank, effectively ending the possibility of a future Palestinian state in that territory.",
  "Rabbinical Court Power": "Granting Orthodox Rabbinical courts the legal authority to act as enforceable arbitrators in civil and financial disputes.",
  "Basic Law: Equality": "Amending the constitutional framework to include an explicit \"Right to Equality\" clause for all citizens, regardless of religion or ethnicity."
};

export const ISSUE_ENDPOINTS: Record<string, { left: string; right: string }> = {
  "Free Market Priority": { left: "Social spending / labor", right: "Free market / deregulation" },
  "Two-State Separation": { left: "Two states / withdrawal", right: "Sovereignty / annexation" },
  "Judicial Override": { left: "Court can strike laws", right: "Knesset can override" },
  "Universal Enlistment": { left: "Universal draft", right: "Preserve exemptions" },
  "State Commission (Oct 7)": { left: "Independent judicial inquiry", right: "Government / internal review" },
  "Shabbat Public Transit": { left: "Civil / municipal transit", right: "Preserve Shabbat status quo" },
  "West Bank Annexation": { left: "Freeze / withdrawal", right: "Full annexation / sovereignty" },
  "Rabbinical Court Power": { left: "Civil arbitration only", right: "Expand Rabbinical authority" },
  "Basic Law: Equality": { left: "Constitutional equality for all", right: "Jewish national priority" }
};

export const AI_DISCLAIMER = {
  short: "Information on PoliDash is compiled and summarized from official party manifestos, public candidate statements, and official party websites using unbiased AI summarization.",
  full: "Disclaimer: Information presented on PoliDash is compiled and summarized from official party manifestos, public candidate statements, and official party websites using unbiased AI summarization.",
  rightOfReply: "Candidates or party representatives wishing to update or correct listed information can submit requests via the Right of Reply protocol."
};

export const politicians: Politician[] = [
  {
    "id": "benjamin-netanyahu",
    "name": "Benjamin Netanyahu",
    "imageUrl": "assets/politicians/benjamin-netanyahu.avif",
    "quote": "Security is the foundation of our existence, and we will never compromise on it.",
    "party": "Likud",
    "ballotLetters": "מחל",
    "seats": "32",
    "biography": "Benjamin Netanyahu is the longest-serving Prime Minister in Israel's history. Before entering politics, he served as an officer in the Sayeret Matkal special forces unit. He earned degrees from MIT and worked as a corporate consultant in the United States. He served as Israel’s Ambassador to the United Nations in the 1980s before assuming leadership of the Likud party in 1993. He has served multiple terms as Prime Minister (1996–1999, 2009–2021, and 2022–present).",
    "partyWebsite": "https://www.likud.org.il/",
    "facts": [
      "Economic Policy: As Finance Minister in the early 2000s, he implemented extensive free-market policies, privatizing state assets and reducing public sector spending.",
      "Diplomatic Strategy: He is a primary architect of the Abraham Accords, which established diplomatic relations with several Arab states separate from the Palestinian diplomatic track.",
      "Legal Status: He is the first sitting Israeli Prime Minister to be indicted; his ongoing trial on charges of bribery, fraud, and breach of trust has been a central factor in recent coalition formations."
    ],
    "intelligence": {
      "Gaza & Security": "Supports sustained military application to eliminate security threats; emphasises Israeli security control over Gaza.",
      "Cost of Living": "Focuses on reducing regulations, opening markets to imports, and minimising government intervention.",
      "Judicial Reform": "Led the coalition that introduced legislation to alter the balance of power, arguing the judiciary has assumed executive authority.",
      "Haredi Draft": "Demonstrates willingness to support legislative exemptions for ultra-Orthodox yeshiva students to maintain coalition agreements.",
      "Religion & Public Space": "Maintains the existing integration of orthodox religious institutions and state functions.",
      "Arab-Israeli Integration": "Emphasises the Jewish national identity of the state, notably through the 2018 Nation-State Law.",
      "Palestinian Statehood": "Opposes the creation of a sovereign Palestinian state, citing national security concerns.",
      "Internal Cohesion": "Utilises political messaging focused on mobilising core constituencies and emphasising ideological distinctions.",
      "Settlements": "Supports the expansion and continued funding of Israeli settlements in the West Bank.",
      "Foreign Relations": "Prioritises independent Israeli action regarding security while maintaining defensive alliances with the United States."
    },
    "stances": {
      "Free Market Priority": "Support",
      "Two-State Separation": "Oppose",
      "Judicial Override": "Ambiguous",
      "Universal Enlistment": "Support",
      "State Commission (Oct 7)": "Ambiguous",
      "Shabbat Public Transit": "Oppose",
      "West Bank Annexation": "Support",
      "Rabbinical Court Power": "Support",
      "Basic Law: Equality": "Ambiguous"
    },
    "stanceSources": {
      "Free Market Priority": { url: "https://www.likud.org.il/", title: "Likud Official Platform & Free Market Agenda", publisher: "likud.org.il" },
      "Two-State Separation": { url: "https://www.timesofisrael.com/netanyahu-secures-key-edits-to-trump-plan-to-slow-and-limit-israels-withdrawal-from-gaza/", title: "Netanyahu opposes Palestinian State, outlines Gaza posture", publisher: "Times of Israel" },
      "Judicial Override": { url: "https://www.ynetnews.com/article/sy61v8ybfe", title: "Levin & Netanyahu Judicial Reform Strategy", publisher: "Ynet" },
      "Universal Enlistment": { url: "https://www.timesofisrael.com/as-coalition-collapses-around-him-netanyahu-revives-haredi-draft-exemption-bill/", title: "Netanyahu revives Haredi Draft arrangements with coalition", publisher: "Times of Israel" },
      "West Bank Annexation": { url: "https://www.timesofisrael.com/2-west-bank-annexation-bills-get-initial-nod-with-mks-rebelling-against-pm-as-vance-visits/", title: "West Bank Annexation Bills & Likud Stance", publisher: "Times of Israel" },
      "Basic Law: Equality": { url: "https://www.timesofisrael.com/for-netanyahu-all-israelis-are-equal-but-some-are-more-equal-than-others/", title: "Nation-State Law & Citizenship Framework", publisher: "Times of Israel" }
    }
  },
  {
    "id": "naftali-bennett",
    "name": "Naftali Bennett",
    "imageUrl": "assets/politicians/naftali-bennett.avif",
    "quote": "A government of unity is not a compromise; it is a strategic necessity for the future of Zionism.",
    "party": "Together",
    "ballotLetters": "פה",
    "seats": "N/A",
    "biography": "Bennett served as a company commander in the Maglan special forces unit. He later co-founded and sold multiple international technology companies, including Cyota and Soluto. Entering politics as Netanyahu's Chief of Staff, he subsequently led the Jewish Home party. In 2021, he formed a rotation government consisting of right-wing, centrist, left-wing, and Arab parties, serving as Prime Minister. He recently re-entered politics with the \"Together\" faction.",
    "partyWebsite": "https://en.wikipedia.org/wiki/Naftali_Bennett",
    "facts": [
      "Religious Demographics: He was Israel's first religiously observant Prime Minister.",
      "Coalition Formation: He led a coalition that included parties from across the entire Israeli political spectrum, including an Arab-Islamist party.",
      "Private Sector Background: He built a career as a technology entrepreneur before entering public service."
    ],
    "intelligence": {
      "Gaza & Security": "Supports a preemptive security doctrine and continuous tactical pressure against regional threats.",
      "Cost of Living": "Supports policies that decrease labor union influence, break up monopolies, and lower taxes.",
      "Judicial Reform": "Opposes the 2023 legislative overhaul; supports gradual judicial adjustments based on broad political consensus.",
      "Haredi Draft": "Supports policies aimed at integrating the ultra-Orthodox population into the workforce and the military.",
      "Religion & Public Space": "Identifies as Modern Orthodox; opposes state religious coercion and supports dialogue between demographic sectors.",
      "Arab-Israeli Integration": "Supports economic investment in Arab municipalities while maintaining strict Zionist national policies.",
      "Palestinian Statehood": "Opposes a Palestinian state; previously published plans to annex Area C of the West Bank.",
      "Internal Cohesion": "Campaigns on a platform emphasizing political unity and consensus-building.",
      "Settlements": "Ideologically supports the settlement movement, though he suspended annexation plans during his tenure as Prime Minister to maintain his coalition.",
      "Foreign Relations": "Focuses on expanding international trade while maintaining alliances with Western nations."
    },
    "stances": {
      "Free Market Priority": "Support",
      "Two-State Separation": "Oppose",
      "Judicial Override": "Ambiguous",
      "Universal Enlistment": "Support",
      "State Commission (Oct 7)": "Support",
      "Shabbat Public Transit": "Ambiguous",
      "West Bank Annexation": "Support",
      "Rabbinical Court Power": "Ambiguous",
      "Basic Law: Equality": "Ambiguous"
    },
    "stanceSources": {
      "Free Market Priority": { url: "https://en.wikipedia.org/wiki/Naftali_Bennett", title: "Bennett Economic Platform & High-Tech Deregulation", publisher: "Wikipedia / Official Public Record" },
      "Two-State Separation": { url: "https://www.timesofisrael.com/bennett-says-no-palestinian-state-under-his-watch/", title: "Bennett reaffirmation on Palestinian Statehood", publisher: "Times of Israel" },
      "Universal Enlistment": { url: "https://www.ynetnews.com/article/sy61v8ybfe", title: "Together Platform on Equal Civic Burden", publisher: "Ynet" }
    }
  },
  {
    "id": "benny-gantz",
    "name": "Benny Gantz",
    "imageUrl": "assets/politicians/benny-gantz.avif",
    "quote": "Our duty is to put the state above all partisan interests and restore national stability.",
    "party": "Blue & White",
    "ballotLetters": "כן",
    "seats": "12",
    "biography": "Benny Gantz served in the Israel Defence Forces for nearly four decades, reaching the position of Chief of General Staff (2011–2015). He entered politics in 2019, forming the Blue and White alliance. Gantz has served as Minister of Defence and Alternate Prime Minister. He joined an emergency war cabinet following the October 2023 attacks, later resigning over strategic disagreements regarding the conduct of the war.",
    "partyWebsite": "https://kachollavan.org.il/",
    "facts": [
      "Military Background: His political profile is heavily based on his tenure as the highest-ranking officer in the IDF.",
      "Political Doctrine: His platform is centred on the concept of Mamlachtiyut (Stateliness), which prioritises state institutions over partisan interests.",
      "Unity Governments: He has entered into multiple coalition agreements with Benjamin Netanyahu during national crises, a move that has drawn criticism from his political base."
    ],
    "intelligence": {
      "Gaza & Security": "Supports military action combined with the establishment of long-term strategic plans and regional alliances for governance.",
      "Cost of Living": "Supports a mixed economy, combining free-market principles with state investment in public services.",
      "Judicial Reform": "Opposes the 2023 judicial legislation; supports the existing independence and authority of the Supreme Court.",
      "Haredi Draft": "Proposes an \"Equality in the Burden\" model requiring all citizens to perform either military or recognised civil service.",
      "Religion & Public Space": "Supports a tolerant interpretation of Jewish identity and opposes orthodox monopolies on civil institutions like marriage.",
      "Arab-Israeli Integration": "Supports civic equality and increased law enforcement to address organised crime in Arab municipalities.",
      "Palestinian Statehood": "Emphasises political separation and reducing conflict, while maintaining Israeli security control in the Jordan Valley.",
      "Internal Cohesion": "Identifies societal division as a primary strategic vulnerability and campaigns on reducing political polarization.",
      "Settlements": "Supports the maintenance of major settlement blocs while avoiding the expansion of isolated outposts.",
      "Foreign Relations": "Prioritises the strategic alliance with the United States and supports normalisation agreements with moderate regional states."
    },
    "stances": {
      "Free Market Priority": "Ambiguous",
      "Two-State Separation": "Ambiguous",
      "Judicial Override": "Oppose",
      "Universal Enlistment": "Support",
      "State Commission (Oct 7)": "Support",
      "Shabbat Public Transit": "Support",
      "West Bank Annexation": "Ambiguous",
      "Rabbinical Court Power": "Oppose",
      "Basic Law: Equality": "Support"
    },
    "stanceSources": {
      "Judicial Override": { url: "https://kachollavan.org.il/", title: "Blue & White Judicial Independence Declaration", publisher: "kachollavan.org.il" },
      "Universal Enlistment": { url: "https://www.timesofisrael.com/gantz-unveils-outline-for-universal-conscription-service-model/", title: "Gantz Outline for Universal Conscription Model", publisher: "Times of Israel" }
    }
  },
  {
    "id": "gadi-eisenkot",
    "name": "Gadi Eisenkot",
    "imageUrl": "assets/politicians/gadi-eisenkot.avif",
    "quote": "Integrity and strategic clarity are the only way to navigate the challenges Israel faces.",
    "party": "Yashar!",
    "ballotLetters": "ישר",
    "seats": "N/A",
    "biography": "Gadi Eisenkot served as the IDF Chief of General Staff from 2015 to 2019. He authored military doctrines focused on deterrence and infrastructure targeting. He entered politics with the National Unity party and served in the emergency war cabinet in 2023. He recently launched a new political movement, \"Yashar!,\" focused on systemic governance reform.",
    "partyWebsite": "https://yasharwitheisenkot.com/",
    "facts": [
      "Personal Bereavement: He lost his youngest son and his nephew during combat operations in the 2023 Gaza War.",
      "Military Pragmatism: He is noted for his direct communication regarding the limitations of military power and the necessity of strategic planning.",
      "Constitutional Reform: His political platform explicitly calls for formalising the separation of powers through a broad, consensus-based Israeli Constitution."
    ],
    "intelligence": {
      "Gaza & Security": "Advocates for a security doctrine focused on restoring deterrence and securing borders rather than long-term territorial occupation.",
      "Cost of Living": "Supports a free-market economy combined with state subsidies for geographic periphery regions.",
      "Judicial Reform": "Opposes the 2023 judicial legislation. Advocates for a Basic Law defining the legislative process to stabilise the balance of powers.",
      "Haredi Draft": "Supports mandatory military or civil service for all demographic sectors.",
      "Religion & Public Space": "Supports policies based on the Declaration of Independence, protecting freedom of religion and freedom from religious coercion.",
      "Arab-Israeli Integration": "Pledges civil equality for minority citizens and focuses on economic integration.",
      "Palestinian Statehood": "Prioritises maintaining a Jewish demographic majority through separation from Palestinian populations over territorial expansion.",
      "Internal Cohesion": "Centres his political platform on societal healing and unity following the events of 2023.",
      "Settlements": "Supports maintaining strategic borders but opposes settlement activities that complicate diplomatic standing or demographic balances.",
      "Foreign Relations": "Focuses on aligning Israel's security strategy with Western alliances."
    },
    "stances": {
      "Free Market Priority": "Ambiguous",
      "Two-State Separation": "Ambiguous",
      "Judicial Override": "Oppose",
      "Universal Enlistment": "Support",
      "State Commission (Oct 7)": "Support",
      "Shabbat Public Transit": "Ambiguous",
      "West Bank Annexation": "Ambiguous",
      "Rabbinical Court Power": "Ambiguous",
      "Basic Law: Equality": "Support"
    },
    "stanceSources": {
      "State Commission (Oct 7)": { url: "https://yasharwitheisenkot.com/", title: "Yashar Platform: Systemic Governance & Commission of Inquiry", publisher: "yasharwitheisenkot.com" },
      "Universal Enlistment": { url: "https://www.ynetnews.com/article/sy61v8ybfe", title: "Eisenkot Security & Draft Principles", publisher: "Ynet" }
    }
  },
  {
    "id": "yair-golan",
    "name": "Yair Golan",
    "imageUrl": "assets/politicians/yair-golan.avif",
    "quote": "A democratic and social Israel is a strong Israel.",
    "party": "The Democrats",
    "ballotLetters": "מרצ",
    "seats": "4",
    "biography": "Yair Golan is a retired IDF Major General who served as Deputy Chief of the General Staff. He entered politics with the Meretz party and served as Deputy Minister of Economy. In 2024, he was elected leader of the Labour Party and facilitated a merger with Meretz, creating a unified faction called \"The Democrats.\"",
    "partyWebsite": "https://democrats.org.il/",
    "facts": [
      "October 7 Actions: During the 2023 attacks, he independently traveled to the conflict zone and assisted in the evacuation of civilians.",
      "Public Statements: He generated public debate following a 2016 speech where he drew comparisons between concerning societal trends in Israel and historical trends in Europe.",
      "Party Merger: He executed the organisational merger of Israel's two primary left-wing Zionist parties into a single political entity."
    ],
    "intelligence": {
      "Gaza & Security": "Argues that military operations must be accompanied by diplomatic agreements; supports prioritising hostage negotiations.",
      "Cost of Living": "Identifies as a social democrat; supports government economic intervention, labour unions, and funding for the public sector.",
      "Judicial Reform": "Opposes the 2023 judicial legislation; supports the preservation of the Supreme Court's existing authority and independence.",
      "Haredi Draft": "Supports the immediate cessation of sector-wide military exemptions and the implementation of a universal draft.",
      "Religion & Public Space": "Supports the separation of religion and state, including the institution of civil marriage and the operation of public transportation on the Sabbath.",
      "Arab-Israeli Integration": "Supports the full integration of Arab citizens into national political leadership and public administration.",
      "Palestinian Statehood": "Supports a negotiated two-state framework to ensure a Jewish demographic majority and end military administration in the West Bank.",
      "Internal Cohesion": "Campaigns against right-wing political factions and focuses on traditional socialist-Zionist principles.",
      "Settlements": "Opposes settlement expansion, describing it as an obstacle to diplomatic agreements and security.",
      "Foreign Relations": "Supports alignment with Western democratic norms and proactive participation in diplomatic peace processes."
    },
    "stances": {
      "Free Market Priority": "Oppose",
      "Two-State Separation": "Support",
      "Judicial Override": "Oppose",
      "Universal Enlistment": "Support",
      "State Commission (Oct 7)": "Support",
      "Shabbat Public Transit": "Support",
      "West Bank Annexation": "Oppose",
      "Rabbinical Court Power": "Oppose",
      "Basic Law: Equality": "Support"
    },
    "stanceSources": {
      "Two-State Separation": { url: "https://democrats.org.il/", title: "The Democrats Party Manifesto & Two-State Security Model", publisher: "democrats.org.il" },
      "Shabbat Public Transit": { url: "https://www.themarker.com/news/education/2026-07-27/ty-article/.premium/0000019f-a43e-d5e4-afff-affe26ff0000", title: "Public Transport & Civil Rights Platform", publisher: "TheMarker" }
    }
  },
  {
    "id": "aryeh-deri",
    "name": "Aryeh Deri",
    "imageUrl": "assets/politicians/aryeh-deri.avif",
    "quote": "We must preserve the tradition of our fathers and care for those who have been left behind.",
    "party": "Shas",
    "ballotLetters": "שס",
    "seats": "11",
    "biography": "Aryeh Deri serves as the chairman of Shas, a party founded in 1984. He has held multiple ministerial roles, including Minister of the Interior. In 2021, he resigned from the Knesset following a plea bargain regarding tax offenses, but returned to the government in 2022. Following a Supreme Court ruling in early 2023, he relinquished his ministerial posts but remained a Knesset member and the leader of the party.",
    "partyWebsite": "https://en.wikipedia.org/wiki/Shas",
    "facts": [
      "Constituency Focus: He leads a party explicitly founded to represent the interests of Sephardic and Mizrahi Haredi Jews.",
      "Educational Infrastructure: His party established and operates its own government-funded religious education system, Ma'Ayan HaHinuch HaTorani.",
      "Legislative Priorities: Under his leadership, the party advocates for the increased influence of Halakha (Jewish religious law) within Israeli society."
    ],
    "intelligence": {
      "Gaza & Security": "Defers to the defence establishment on operational matters while prioritising coalition stability.",
      "Cost of Living": "Supports social welfare policies and government assistance targeted at lower-income populations.",
      "Judicial Reform": "Supports legislative changes to the judicial system and the reduction of judicial oversight.",
      "Haredi Draft": "Opposes the mandatory conscription of Haredi men into national service.",
      "Religion & Public Space": "Advocates for maintaining orthodox traditions and Jewish religious law in the public sphere.",
      "Arab-Israeli Integration": "Prioritises Jewish religious and cultural heritage and the socioeconomic advancement of the Sephardic population.",
      "Palestinian Statehood": "Historically maintained a moderate stance, but shifted to oppose settlement freezes and support the Greater Jerusalem plan.",
      "Internal Cohesion": "Focuses on addressing economic and social disparities affecting the Sephardic population.",
      "Settlements": "Supports the consolidation of Israeli settlement interests in the West Bank.",
      "Foreign Relations": "Focuses on protecting religious institutions and interests within diplomatic frameworks."
    },
    "stances": {
      "Free Market Priority": "Oppose",
      "Two-State Separation": "Oppose",
      "Judicial Override": "Support",
      "Universal Enlistment": "Oppose",
      "State Commission (Oct 7)": "Ambiguous",
      "Shabbat Public Transit": "Oppose",
      "West Bank Annexation": "Support",
      "Rabbinical Court Power": "Support",
      "Basic Law: Equality": "Ambiguous"
    },
    "stanceSources": {
      "Universal Enlistment": { url: "https://www.timesofisrael.com/as-coalition-collapses-around-him-netanyahu-revives-haredi-draft-exemption-bill/", title: "Shas Conscription Exemption Position", publisher: "Times of Israel" },
      "Rabbinical Court Power": { url: "https://en.wikipedia.org/wiki/Shas", title: "Shas Rabbinical Jurisdiction Platform", publisher: "Wikipedia" }
    }
  },
  {
    "id": "mansour-abbas",
    "name": "Mansour Abbas",
    "imageUrl": "assets/politicians/mansour-abbas.avif",
    "quote": "Pragmatic partnership is the only way to secure the civic rights and future of our community.",
    "party": "Ra'am",
    "ballotLetters": "עם",
    "seats": "5",
    "biography": "Mansour Abbas is the chairman of the United Arab List, which operates as the political wing of the Southern Branch of the Islamic Movement in Israel. He holds a degree in dentistry from the Hebrew University of Jerusalem. In 2021, he led his party to become the first independent Arab party to join an Israeli governing coalition, signing an agreement with Yair Lapid and Naftali Bennett.",
    "partyWebsite": "https://en.wikipedia.org/wiki/United_Arab_List",
    "facts": [
      "Policy Shift: He directed his party to focus on full political involvement in domestic Israeli politics to secure municipal funding, rather than remaining strictly in the opposition.",
      "Sectoral Funding: His 2021 coalition agreement included guarantees for extensive state investment to improve infrastructure, housing, and crime reduction in Arab towns.",
      "Voter Base: His primary constituency consists of religious or nationalist Israeli Arabs, and the party holds particular popularity among the Negev Bedouin."
    ],
    "intelligence": {
      "Gaza & Security": "Prioritises domestic civic issues over military or foreign policy involvement.",
      "Cost of Living": "Advocates for increased state funding for infrastructure, housing, and employment in Arab municipalities.",
      "Judicial Reform": "Aligns with maintaining minority protections within the judicial system.",
      "Haredi Draft": "Focuses on Arab civic issues rather than national military conscription debates.",
      "Religion & Public Space": "Represents an Islamist and socially conservative platform.",
      "Arab-Israeli Integration": "Emphasises pragmatic political participation to secure state funding and improve daily services for the Arab sector.",
      "Palestinian Statehood": "Supports the two-state framework and the creation of a Palestinian state with East Jerusalem as its capital.",
      "Internal Cohesion": "Focuses on addressing high crime rates within Arab communities.",
      "Settlements": "Opposes settlement expansion, aligning with the two-state framework.",
      "Foreign Relations": "Prioritises domestic budgets over international diplomatic positioning."
    },
    "stances": {
      "Free Market Priority": "Ambiguous",
      "Two-State Separation": "Support",
      "Judicial Override": "Oppose",
      "Universal Enlistment": "Oppose",
      "State Commission (Oct 7)": "Ambiguous",
      "Shabbat Public Transit": "Ambiguous",
      "West Bank Annexation": "Oppose",
      "Rabbinical Court Power": "Ambiguous",
      "Basic Law: Equality": "Ambiguous"
    },
    "stanceSources": {
      "Two-State Separation": { url: "https://en.wikipedia.org/wiki/United_Arab_List", title: "Ra'am Platform on Civic Integration & Palestinian Rights", publisher: "Wikipedia" }
    }
  },
  {
    "id": "yair-lapid",
    "name": "Yair Lapid",
    "imageUrl": "assets/politicians/yair-lapid.avif",
    "quote": "We are fighting for the soul of Israeli democracy and a sane, liberal future for our children.",
    "party": "Together",
    "ballotLetters": "פה",
    "seats": "24",
    "biography": "Yair Lapid is the leader of Yesh Atid. Prior to entering politics, he worked as an author, television presenter, and news anchor. He entered politics in 2012, subsequently serving as Minister of Finance. He later served as Prime Minister of Israel during the 36th government rotation agreement. He recently led Yesh Atid to join Naftali Bennett's 'Together' faction.",
    "partyWebsite": "https://yeshatid.org.il/",
    "facts": [
      "Governance Reform: He advocates for reducing the size of the government, proposing a statutory limit of 18 ministers.",
      "Constitutional Policy: He supports the drafting of a formal Israeli constitution that includes term limits and basic laws regarding legislation and the judiciary.",
      "Educational Core: He promotes legislation requiring all state-funded educational institutions to teach a full core curriculum (Liba), linking compliance to state funding."
    ],
    "intelligence": {
      "Gaza & Security": "Supports the establishment of a state commission of inquiry regarding the events of October 7.",
      "Cost of Living": "Proposes establishing a dedicated government ministry focused exclusively on addressing the cost of living.",
      "Judicial Reform": "Opposes the recent judicial legislation and pledges to cancel the judicial overhaul laws.",
      "Haredi Draft": "Supports universal conscription, proposing that individuals who do not enlist will be ineligible for state funding.",
      "Religion & Public Space": "Supports the implementation of civil marriage and the operation of public transportation on the Sabbath in secular municipalities.",
      "Arab-Israeli Integration": "Emphasises civic equality and the requirement of core educational standards across all sectors.",
      "Palestinian Statehood": "Traditionally supports a two-state framework contingent on security guarantees for Israel.",
      "Internal Cohesion": "Promotes a national programme to address organised crime through coordinated efforts between the police and government branches.",
      "Settlements": "Differentiates between maintaining major settlement blocs and limiting isolated outposts.",
      "Foreign Relations": "Advocates for unifying public diplomacy efforts and coordinating with diaspora Jewry to improve Israel's international standing."
    },
    "stances": {
      "Free Market Priority": "Ambiguous",
      "Two-State Separation": "Ambiguous",
      "Judicial Override": "Oppose",
      "Universal Enlistment": "Support",
      "State Commission (Oct 7)": "Support",
      "Shabbat Public Transit": "Support",
      "West Bank Annexation": "Oppose",
      "Rabbinical Court Power": "Ambiguous",
      "Basic Law: Equality": "Support"
    },
    "stanceSources": {
      "State Commission (Oct 7)": { url: "https://yeshatid.org.il/", title: "Yesh Atid Demand for State Commission of Inquiry", publisher: "yeshatid.org.il" },
      "Shabbat Public Transit": { url: "https://www.themarker.com/news/education/2026-07-27/ty-article/.premium/0000019f-a43e-d5e4-afff-affe26ff0000", title: "Lapid Secular Rights & Public Transport Policy", publisher: "TheMarker" }
    }
  },
  {
    "id": "yoaz-hendel",
    "name": "Yoaz Hendel",
    "imageUrl": "assets/politicians/yoaz-hendel.avif",
    "quote": "Universal service and national responsibility are the foundation of a resilient society.",
    "party": "Zionist Home",
    "ballotLetters": "ז",
    "seats": "N/A",
    "biography": "Yoaz Hendel is the leader of Zionist Home (The Reservists / Miluimnikim), a political party re-established with Chili Tropper. He previously served as Minister of Communications. Prior to his political career, he served as a military officer in naval special operations, and later worked as a journalist, author, and historian.",
    "partyWebsite": "https://www.themiluimnikim.org.il/?1",
    "facts": [
      "Party Foundation: He founded the party to explicitly promote Zionist values, including settlement, immigrant absorption, and homeland defence.",
      "Universal Service: His platform centres on the requirement of mandatory military or national service for every citizen.",
      "Systemic Reform: He proposes altering the electoral system and balancing the branches of government through the promotion of a formalised constitution."
    ],
    "intelligence": {
      "Gaza & Security": "Emphasises homeland defence and recognising the sacrifices required for national security.",
      "Cost of Living": "Focuses on structural governance reform as a prerequisite for economic stability.",
      "Judicial Reform": "Supports balancing the branches of government and creating a formal constitution to resolve structural disputes.",
      "Haredi Draft": "Supports mandatory military or national service for all citizens across all demographic sectors.",
      "Religion & Public Space": "Focuses on broad national unity over sectoral religious legislation.",
      "Arab-Israeli Integration": "Emphasises universal national service as a foundational requirement for civic participation.",
      "Palestinian Statehood": "Traditionally holds right-leaning views regarding territorial retention.",
      "Internal Cohesion": "Prioritises national unity, respectful public discourse, and respect for political opponents.",
      "Settlements": "Promotes the value of settlement as a core Zionist principle.",
      "Foreign Relations": "Focuses on immigrant absorption and strengthening Zionist identity globally."
    },
    "stances": {
      "Free Market Priority": "Ambiguous",
      "Two-State Separation": "Ambiguous",
      "Judicial Override": "Ambiguous",
      "Universal Enlistment": "Support",
      "State Commission (Oct 7)": "Support",
      "Shabbat Public Transit": "Ambiguous",
      "West Bank Annexation": "Ambiguous",
      "Rabbinical Court Power": "Ambiguous",
      "Basic Law: Equality": "Ambiguous"
    },
    "stanceSources": {
      "Universal Enlistment": { url: "https://www.themiluimnikim.org.il/?1", title: "Zionist Home Reservists Conscription Platform", publisher: "themiluimnikim.org.il" }
    }
  },
  {
    "id": "ayman-odeh",
    "name": "Ayman Odeh",
    "imageUrl": "assets/politicians/ayman-odeh.avif",
    "quote": "Equality, dignity, and a shared future for Jews and Arabs are the only path to true peace.",
    "party": "Hadash-Ta'al",
    "ballotLetters": "ום",
    "seats": "5",
    "biography": "Ayman Odeh is the leader of Hadash (The Democratic Front for Peace and Equality). He is a lawyer from Haifa and has served as a member of the Knesset since 2015. He advocates for Jewish-Arab political partnership and civil rights, leading a joint list with Ahmad Tibi.",
    "partyWebsite": "https://hadash.org.il/",
    "facts": [
      "Bi-National Movement: He leads a party that operates explicitly as a joint Jewish-Arab movement focused on diplomatic and social campaigns.",
      "Economic Policy: His platform advocates for the cancellation of privatisations related to government companies, natural resources, and public services.",
      "Minority Recognition: His party supports the formal recognition of the Arab-Palestinian population in Israel as a national minority with equal civil and national rights."
    ],
    "intelligence": {
      "Gaza & Security": "Advocates for the demilitarization of the Middle East, including the removal of nuclear weapons, and opposes the blockade of Gaza.",
      "Cost of Living": "Supports raising the minimum wage to 60% of the average wage, increasing child allowances, and implementing a public housing plan.",
      "Judicial Reform": "Supports the adoption of a democratic constitution to protect human rights, social rights, and ensure a secular state.",
      "Haredi Draft": "Opposes mandatory military service and supports the demilitarization of society.",
      "Religion & Public Space": "Advocates for a secular state, the institution of civil marriage, and the eradication of discrimination based on gender or sexual orientation.",
      "Arab-Israeli Integration": "Demands the repeal of the Nation-State Law and the enforcement of laws prohibiting racism and discrimination.",
      "Palestinian Statehood": "Supports an independent Palestinian state with East Jerusalem as its capital, based on the June 1967 borders.",
      "Internal Cohesion": "Focuses on Jewish-Arab partnership and class-based economic policies.",
      "Settlements": "Calls for a complete withdrawal from all territories occupied in 1967 and the evacuation of all settlements.",
      "Foreign Relations": "Opposes U.S. regional policies and agreements perceived as circumventing Palestinian national rights."
    },
    "stances": {
      "Free Market Priority": "Oppose",
      "Two-State Separation": "Support",
      "Judicial Override": "Oppose",
      "Universal Enlistment": "Oppose",
      "State Commission (Oct 7)": "Ambiguous",
      "Shabbat Public Transit": "Support",
      "West Bank Annexation": "Oppose",
      "Rabbinical Court Power": "Oppose",
      "Basic Law: Equality": "Support"
    },
    "stanceSources": {
      "Basic Law: Equality": { url: "https://hadash.org.il/", title: "Hadash Platform on Equality and Democratic Constitution", publisher: "hadash.org.il" }
    }
  },
  {
    "id": "yitzhak-goldknopf",
    "name": "Yitzhak Goldknopf",
    "imageUrl": "assets/politicians/yitzhak-goldknopf.avif",
    "quote": "The Torah is the light that has guided our people through every storm in our long history.",
    "party": "United Torah Judaism",
    "ballotLetters": "ג",
    "seats": "7",
    "biography": "Yitzhak Goldknopf represents the Hasidic Agudat Yisrael faction and leads the United Torah Judaism list. Before entering the Knesset in 2022, he managed a large network of Haredi kindergartens and daycare centres. He succeeded Yaakov Litzman as the faction's primary representative.",
    "partyWebsite": "https://en.wikipedia.org/wiki/United_Torah_Judaism",
    "facts": [
      "Alliance Structure: He leads a list that functions as an alliance between the Hasidic Agudat Yisrael and the Lithuanian Degel HaTorah.",
      "Leadership Protocol: His party's leadership decisions and policies are directed by a Council of Torah Sages.",
      "Government Participation: The party historically avoided taking full ministerial positions for ideological reasons until recent years, previously preferring deputy minister roles."
    ],
    "intelligence": {
      "Gaza & Security": "Generally defers to the defence establishment while prioritising the safety of the Jewish people and religious institutions.",
      "Cost of Living": "Supports social-democratic economic policies due to the lower socioeconomic status of its voter base.",
      "Judicial Reform": "Supports limiting judicial intervention in religious and legislative affairs.",
      "Haredi Draft": "Strongly opposes the mandatory conscription of yeshiva students into the military.",
      "Religion & Public Space": "Advocates for a Halakhic state and supports religious and social conservatism.",
      "Arab-Israeli Integration": "Focuses on maintaining the Jewish character of the state.",
      "Palestinian Statehood": "Generally aligns with the political right on territorial issues, prioritising coalition stability and religious funding over diplomatic concessions.",
      "Internal Cohesion": "Prioritises the autonomy of the Haredi educational system and religious lifestyle.",
      "Settlements": "Has signed agreements with religious-Zionist groups to oppose withdrawals from Israeli territories in exchange for political support.",
      "Foreign Relations": "Focuses on the preservation of global Jewish religious institutions."
    },
    "stances": {
      "Free Market Priority": "Oppose",
      "Two-State Separation": "Oppose",
      "Judicial Override": "Support",
      "Universal Enlistment": "Oppose",
      "State Commission (Oct 7)": "Ambiguous",
      "Shabbat Public Transit": "Oppose",
      "West Bank Annexation": "Support",
      "Rabbinical Court Power": "Support",
      "Basic Law: Equality": "Oppose"
    },
    "stanceSources": {
      "Universal Enlistment": { url: "https://www.timesofisrael.com/as-coalition-collapses-around-him-netanyahu-revives-haredi-draft-exemption-bill/", title: "UTJ Torah Conscription Exemption Mandate", publisher: "Times of Israel" }
    }
  },
  {
    "id": "itamar-ben-gvir",
    "name": "Itamar Ben Gvir",
    "imageUrl": "assets/politicians/itamar-ben-gvir.avif",
    "quote": "Unapologetic national pride and total security are the keys to a strong Jewish state.",
    "party": "Otzma Yehudit",
    "ballotLetters": "ט",
    "seats": "6",
    "biography": "Itamar Ben Gvir is the leader of Otzma Yehudit (Jewish Power). He is a lawyer who often represented right-wing activists before entering national politics. He entered the Knesset during the 24th legislative term and has maintained significant public visibility through activism.",
    "partyWebsite": "https://ozma-yeudit.co.il/",
    "facts": [
      "Territorial Policy: His party advocates for the application of Israeli sovereignty over Judea, Samaria, and Binyamin.",
      "Educational Focus: He supports strengthening Jewish identity and tradition within state institutions and the educational system.",
      "Systemic Change: The party aims to enact substantial reforms in government systems to reinforce the Jewish character of the state."
    ],
    "intelligence": {
      "Gaza & Security": "Supports an uncompromising approach to national defence and military action.",
      "Cost of Living": "Advocates for mutual responsibility and addressing the hardships of lower-income citizens in the periphery and cities.",
      "Judicial Reform": "Supports systemic reforms to limit judicial oversight and strengthen national governance.",
      "Haredi Draft": "Focuses on Jewish identity and military security, supporting national service while maintaining alliances with religious parties.",
      "Religion & Public Space": "Supports strengthening Jewish tradition within state institutions.",
      "Arab-Israeli Integration": "Emphasises state loyalty as a condition for civic participation and opposes narratives perceived to compromise the state's Jewish character.",
      "Palestinian Statehood": "Opposes a Palestinian state and supports full Israeli sovereignty over all territories.",
      "Internal Cohesion": "Focuses on national pride, Zionism, and unapologetic Jewish identity.",
      "Settlements": "Actively supports the expansion of settlements and the Greater Israel concept.",
      "Foreign Relations": "Prioritises national sovereignty over international diplomatic pressures."
    },
    "stances": {
      "Free Market Priority": "Ambiguous",
      "Two-State Separation": "Oppose",
      "Judicial Override": "Support",
      "Universal Enlistment": "Ambiguous",
      "State Commission (Oct 7)": "Ambiguous",
      "Shabbat Public Transit": "Oppose",
      "West Bank Annexation": "Support",
      "Rabbinical Court Power": "Support",
      "Basic Law: Equality": "Ambiguous"
    },
    "stanceSources": {
      "West Bank Annexation": { url: "https://ozma-yeudit.co.il/", title: "Otzma Yehudit Official Platform on Sovereignty", publisher: "ozma-yeudit.co.il" },
      "Judicial Override": { url: "https://www.ynetnews.com/article/sy61v8ybfe", title: "Otzma Judicial Override Bills", publisher: "Ynet" }
    }
  },
  {
    "id": "avigdor-lieberman",
    "name": "Avigdor Lieberman",
    "imageUrl": "assets/politicians/avigdor-lieberman.avif",
    "quote": "Secular rights are human rights; we will do exactly what we promised our voters.",
    "party": "Yisrael Beiteinu",
    "ballotLetters": "ל",
    "seats": "6",
    "biography": "Avigdor Lieberman is the founder and leader of Yisrael Beiteinu (Israel Our Home). He immigrated to Israel from the Soviet Union in 1978. He has served in numerous senior ministerial roles, including Minister of Defence, Minister of Foreign Affairs, and Minister of Finance. Initially drawing his primary political support from Russian-speaking immigrants, he has since expanded his base to focus on secular, right-wing voters.",
    "partyWebsite": "https://beytenu.org.il/",
    "facts": [
      "Political Focus: His platform uniquely combines a hawkish, right-leaning approach to national security with a strictly secular approach to domestic civic issues.",
      "Coalition Dynamics: He previously resigned from the position of Defence Minister over disagreements regarding ceasefire agreements in Gaza, and later refused to join a right-wing coalition due to disagreements over military conscription for the Haredi sector.",
      "Territorial Proposals: He is the author of the \"Lieberman Plan,\" which proposes a demographic and territorial exchange transferring certain Arab-majority towns in Israel to the Palestinian Authority in exchange for Israeli annexation of major settlement blocs in the West Bank."
    ],
    "intelligence": {
      "Gaza & Security": "Supports a preemptive military doctrine; opposes containment policies and advocates for decisive operational outcomes against regional threats.",
      "Cost of Living": "Supports free-market policies, the privatisation of state assets (ports, airports), and the cancellation of exclusive importer statuses to increase competition.",
      "Judicial Reform": "Opposes the use of an override clause. Supports the establishment of a formal constitution, a constitutional court, and limiting the Prime Minister to two terms.",
      "Haredi Draft": "Demands universal military or national service and proposes conditioning state funding for educational institutions on the implementation of a full core curriculum.",
      "Religion & Public Space": "Supports the complete separation of religion and state, the institution of civil marriage, and the operation of public transportation on the Sabbath.",
      "Arab-Israeli Integration": "Conditions civic equality on national loyalty and service; supports legislation to penalise institutions or individuals perceived as acting against the state's principles.",
      "Palestinian Statehood": "Focuses on regional territorial exchanges rather than the traditional two-state framework, aiming to maximise Jewish demographic majority.",
      "Internal Cohesion": "Centres his domestic platform on reducing the political influence of religious parties and promoting secular civil rights.",
      "Settlements": "Supports the retention and strengthening of major settlement blocs within the framework of potential territorial exchanges.",
      "Foreign Relations": "Supports alignment with Western alliances and emphasises military deterrence as the primary tool for diplomatic stability."
    },
    "stances": {
      "Free Market Priority": "Support",
      "Two-State Separation": "Oppose",
      "Judicial Override": "Oppose",
      "Universal Enlistment": "Support",
      "State Commission (Oct 7)": "Support",
      "Shabbat Public Transit": "Support",
      "West Bank Annexation": "Ambiguous",
      "Rabbinical Court Power": "Oppose",
      "Basic Law: Equality": "Ambiguous"
    },
    "stanceSources": {
      "Universal Enlistment": { url: "https://beytenu.org.il/", title: "Yisrael Beiteinu Draft Law & Secular Rights", publisher: "beytenu.org.il" }
    }
  },
  {
    "id": "sami-abu-shehadeh",
    "name": "Sami Abu Shehadeh",
    "imageUrl": "assets/politicians/sami-abu-shehadeh.avif",
    "quote": "A state of all its citizens is the only truly democratic vision for this land.",
    "party": "Balad",
    "ballotLetters": "ד",
    "seats": "N/A",
    "biography": "Sami Abu Shehadeh is a historian, educator, and political leader from Jaffa. Prior to entering national politics, he served as a member of the Tel Aviv-Yafo City Council. He entered the Knesset in 2019 as part of the Joint List alliance. In 2021, he was elected as the chairman of the Balad party.",
    "partyWebsite": "https://en.wikipedia.org/wiki/Balad_(political_party)",
    "facts": [
      "State Definition: His party explicitly rejects the definition of Israel as a Jewish state, advocating instead for its transformation into a \"state of all its citizens.\"",
      "Minority Status: His platform demands the formal recognition of Arab-Palestinian citizens of Israel as a national minority with rights to cultural and educational autonomy.",
      "Electoral Independence: In the 2022 elections, he led Balad to run as an independent list separate from the other Arab political factions, focusing on a distinct Palestinian nationalist platform."
    ],
    "intelligence": {
      "Gaza & Security": "Opposes military operations and the blockade of Gaza; advocates for the demilitarization of the region.",
      "Cost of Living": "Focuses on state investment and addressing economic disparities and infrastructure deficits affecting Arab municipalities.",
      "Judicial Reform": "Views the existing judicial system as systematically inequitable toward minority populations, while opposing the 2023 right-wing legislative changes.",
      "Haredi Draft": "Opposes the militarization of civilian life and does not support mandatory conscription policies.",
      "Religion & Public Space": "Supports a secular, democratic state structure with equal civic rights independent of religious affiliation.",
      "Arab-Israeli Integration": "Demands full national and civic equality, the repeal of the Nation-State Law, and the recognition of Palestinian historical narratives.",
      "Palestinian Statehood": "Supports the creation of an independent Palestinian state and the right of return, alongside the restructuring of Israel's civic framework.",
      "Internal Cohesion": "Focuses on solidifying Palestinian national identity among Arab citizens and addressing systemic inequality.",
      "Settlements": "Demands a complete Israeli withdrawal from all territories captured in 1967 and the evacuation of all settlements.",
      "Foreign Relations": "Aligns with Palestinian national interests and international human rights frameworks over Western military alliances."
    },
    "stances": {
      "Free Market Priority": "Oppose",
      "Two-State Separation": "Support",
      "Judicial Override": "Ambiguous",
      "Universal Enlistment": "Oppose",
      "State Commission (Oct 7)": "Ambiguous",
      "Shabbat Public Transit": "Support",
      "West Bank Annexation": "Oppose",
      "Rabbinical Court Power": "Oppose",
      "Basic Law: Equality": "Support"
    },
    "stanceSources": {
      "Basic Law: Equality": { url: "https://en.wikipedia.org/wiki/Balad_(political_party)", title: "Balad Platform: State of All Its Citizens", publisher: "Wikipedia" }
    }
  },
  {
    "id": "bezalel-smotrich",
    "name": "Bezalel Smotrich",
    "imageUrl": "assets/politicians/bezalel-smotrich.avif",
    "quote": "Settling the land and strengthening our Jewish identity is our historical mission and national duty.",
    "party": "Religious Zionist",
    "ballotLetters": "טב",
    "seats": "7",
    "biography": "Bezalel Smotrich is the leader of the Religious Zionist Party. He is a lawyer and a co-founder of the Regavim organisation, an NGO focused on monitoring and taking legal action regarding land use and construction in Israel and the West Bank. He entered the Knesset in 2015 as part of the Jewish Home party before eventually forming and leading his own independent Religious Zionist faction.",
    "partyWebsite": "https://zionutdatit.org.il/en/about/",
    "facts": [
      "Territorial Sovereignty: His political platform explicitly focuses on the application of full Israeli sovereignty over Judea and Samaria (the West Bank) and the dismantling of Palestinian infrastructure in Area C.",
      "Judicial Overhaul: He is a primary architect and advocate of comprehensive plans to restructure the Israeli judicial system, proposing legislation to limit judicial review and protect the executive branch from certain legal interventions.",
      "Economic Policy: Despite his socially conservative platform, he is a staunch advocate for free-market economics, focusing on deregulation, reducing the power of professional trade unions, and minimising public sector bureaucracy."
    ],
    "intelligence": {
      "Gaza & Security": "Supports an uncompromising military approach; advocates for the death penalty for terrorism offences and the withholding of funds from the Palestinian Authority.",
      "Cost of Living": "Supports free-market policies, decreasing business regulation, and limiting the influence of labour unions to increase economic competition.",
      "Judicial Reform": "Actively supports comprehensive systemic reforms, including limiting the Supreme Court's ability to cancel government decisions based on \"unreasonableness.\"",
      "Haredi Draft": "Focuses heavily on the national-religious sector's model of combining military service with Torah study (Yeshivot Hesder), while generally maintaining political alliances with Haredi parties regarding religious exemptions.",
      "Religion & Public Space": "Advocates for strengthening the Orthodox Jewish character of the state, including enforcing Shabbat observance laws in the public sphere and promoting traditional family structures.",
      "Arab-Israeli Integration": "Prioritises Jewish demographic majorities in regions like the Galilee and Negev; supports strict enforcement against unauthorised construction in minority communities.",
      "Palestinian Statehood": "Actively opposes the creation of a Palestinian state and focuses on policies designed to prevent Palestinian territorial contiguity.",
      "Internal Cohesion": "Centres political messaging on religious-Zionist ideology, Jewish heritage, and prioritising national sovereignty above all else.",
      "Settlements": "Actively promotes the expansion of settlements and the formal governmental legalisation of unauthorised outposts (\"young settlements\").",
      "Foreign Relations": "Prioritises the expansion of Jewish settlements and national sovereignty over international diplomatic pressures or international agreements."
    },
    "stances": {
      "Free Market Priority": "Support",
      "Two-State Separation": "Oppose",
      "Judicial Override": "Support",
      "Universal Enlistment": "Ambiguous",
      "State Commission (Oct 7)": "Ambiguous",
      "Shabbat Public Transit": "Oppose",
      "West Bank Annexation": "Support",
      "Rabbinical Court Power": "Support",
      "Basic Law: Equality": "Ambiguous"
    },
    "stanceSources": {
      "West Bank Annexation": { url: "https://zionutdatit.org.il/en/about/", title: "Religious Zionist Platform on Sovereignty & Settlements", publisher: "zionutdatit.org.il" }
    }
  }
];

export interface PollData {
  id: string;
  name: string;
  date: string;
  source: string;
  seats: Record<string, number>;
}

export const ELECTION_POLLS: PollData[] = [
  {
    id: "ch12_aug26",
    name: "Channel 12 (Midgam)",
    date: "6 August 2026",
    source: "Channel 12 News",
    seats: {
      "Likud": 24,
      "Together": 12,
      "Yashar!": 22,
      "The Democrats": 10,
      "Yisrael Beiteinu": 9,
      "Otzma Yehudit": 8,
      "Shas": 8,
      "United Torah Judaism": 8,
      "Hadash-Ta'al": 6,
      "Ra'am": 5,
      "Religious Zionist": 5
    }
  },
  {
    id: "kan11_aug26",
    name: "Kan 11 (Kantar)",
    date: "4 August 2026",
    source: "Kan 11 News",
    seats: {
      "Likud": 25,
      "Yashar!": 21,
      "Together": 13,
      "The Democrats": 10,
      "Yisrael Beiteinu": 9,
      "Shas": 8,
      "United Torah Judaism": 8,
      "Otzma Yehudit": 8,
      "Hadash-Ta'al": 6,
      "Ra'am": 5,
      "Religious Zionist": 4
    }
  },
  {
    id: "ch14_aug26",
    name: "Channel 14 (Direct Polls)",
    date: "2 August 2026",
    source: "Channel 14",
    seats: {
      "Likud": 27,
      "Yashar!": 20,
      "Together": 11,
      "Shas": 9,
      "Otzma Yehudit": 9,
      "Yisrael Beiteinu": 9,
      "The Democrats": 9,
      "United Torah Judaism": 8,
      "Hadash-Ta'al": 6,
      "Religious Zionist": 5,
      "Ra'am": 4
    }
  }
];
