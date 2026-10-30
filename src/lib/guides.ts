export type GuideSection = { heading: string; paragraphs: string[]; list?: string[] };
export type Guide = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  keywords: string[];
  updated: string; // ISO date
  readingMinutes: number;
  takeaways: string[];
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  related: string[];
  /** Optional referral call-to-action, rendered with a disclosure. */
  referral?: { heading: string; intro: string; benefits: { title: string; detail: string }[]; note: string };
};

const BTC_GUIDE = { label: "Bitcoin developer guide: mining", url: "https://bitcoin.org/en/developer-guide#mining" };
const WHITEPAPER = { label: "Bitcoin whitepaper", url: "https://bitcoin.org/bitcoin.pdf" };
const CHAIN = { label: "Bitcoin developer guide: block chain", url: "https://developer.bitcoin.org/devguide/block_chain.html" };

export const guides: Guide[] = [
  {
    slug: "bitcoin-mining-difficulty-explained",
    title: "How Bitcoin Mining Difficulty Works",
    description:
      "Bitcoin mining difficulty explained in plain English: what it is, why it adjusts every 2,016 blocks, and how it changes what a miner earns.",
    summary: "What difficulty is, why it adjusts about every two weeks, and why it matters for your mining returns.",
    keywords: ["mining difficulty", "difficulty adjustment", "2016 blocks", "block time", "hashrate", "target"],
    updated: "2026-10-20",
    readingMinutes: 5,
    takeaways: [
      "Difficulty is how hard it is to find a valid block hash. The network adjusts it so blocks keep arriving about every 10 minutes.",
      "It is recalculated every 2,016 blocks, roughly every two weeks.",
      "When more hashrate joins, difficulty rises and each miner's share of rewards shrinks.",
    ],
    sections: [
      {
        heading: "What mining difficulty means",
        paragraphs: [
          "Bitcoin miners repeatedly hash a block header with SHA-256 looking for a result that is below a network target. A lower target means fewer valid answers, so more attempts are needed. Difficulty is simply a measure of how low that target is.",
          "The rule exists to keep the system steady. The network aims for one block roughly every 10 minutes, no matter how many miners are competing.",
        ],
      },
      {
        heading: "How the adjustment works",
        paragraphs: [
          "Every 2,016 blocks, which is about two weeks, the network looks at how long those blocks actually took. If they arrived faster than 10 minutes on average, difficulty goes up. If they were slower, it goes down.",
          "There is a safety limit on each change. At a single adjustment, difficulty can rise by as much as 300% or fall by as much as 75%, so it cannot swing without bounds.",
        ],
      },
      {
        heading: "Why difficulty matters to a miner",
        paragraphs: [
          "Your chance of finding a block is your share of total network hashrate. When new, more efficient machines join, total hashrate climbs, difficulty follows, and the same hashrate earns a smaller slice of the same daily rewards.",
          "That is why a mining estimate is a snapshot. The same miner can earn less next month with no change to the miner itself. Use the calculator on this site and test a network that is 10% or 25% larger to see the effect.",
        ],
      },
      {
        heading: "Difficulty is not the price",
        paragraphs: [
          "Difficulty and the Bitcoin price move independently. Difficulty reacts to hashrate. Price reacts to the market. Your net result depends on both, plus fees and platform costs.",
        ],
      },
    ],
    faq: [
      { q: "How often does Bitcoin difficulty change?", a: "Every 2,016 blocks, which is about every two weeks." },
      { q: "Does higher difficulty mean fewer bitcoin overall?", a: "No. The block reward schedule does not change. Higher difficulty means the rewards are shared across more total hashrate." },
      { q: "Can difficulty go down?", a: "Yes. If blocks arrive slower than 10 minutes on average, the next adjustment lowers it." },
    ],
    sources: [BTC_GUIDE, CHAIN, WHITEPAPER],
    related: ["understanding-hashrate-and-w-th", "how-to-calculate-bitcoin-mining-profitability"],
  },
  {
    slug: "what-are-gomining-digital-miners",
    title: "What Are GoMining Digital Miners?",
    description:
      "What GoMining digital miners are, how TH and W/TH work, how daily rewards and maintenance fees are handled, and the risks to understand first.",
    summary: "A plain-English look at digital miners: what you own, how rewards arrive, and what to check before buying.",
    keywords: ["GoMining", "digital miners", "NFT miner", "TH", "W/TH", "cloud mining", "hashrate"],
    updated: "2026-10-20",
    readingMinutes: 6,
    takeaways: [
      "A digital miner is an NFT that represents a share of hashrate hosted in GoMining's data centres.",
      "Each miner has a size in TH and an efficiency in W/TH.",
      "Daily maintenance is charged against rewards, so net results vary and can be low or negative.",
    ],
    sections: [
      {
        heading: "What a digital miner is",
        paragraphs: [
          "GoMining sells digital miners. Each is an NFT that represents a share of Bitcoin mining hashrate hosted in GoMining's data centres. You do not host or power any hardware yourself.",
          "Each miner has two key numbers: its size in TH, which is its hashrate, and its efficiency in W/TH, which is how much power it uses per unit of hashrate.",
        ],
      },
      {
        heading: "How you earn",
        paragraphs: [
          "Miners earn Bitcoin rewards based on their share of the network, and the balance is credited daily. The amount moves with network hashrate, difficulty and the Bitcoin price, so it is never fixed.",
        ],
      },
      {
        heading: "What maintenance is",
        paragraphs: [
          "Maintenance covers the running costs and has two parts: electricity, which depends on the miner's power and efficiency, and a service fee, which depends on the miner's size. It is taken from rewards, in Bitcoin by default.",
          "Platform discounts can reduce it, such as paying part of the fee in the GOMINING token. See the maintenance guide for the full breakdown.",
        ],
      },
      {
        heading: "What to check before you buy",
        paragraphs: ["Work through the numbers yourself rather than relying on a headline figure."],
        list: [
          "Use the GoMining tab of the calculator with your own TH, W/TH and discount.",
          "Look at the break-even Bitcoin price, not just the best case.",
          "Remember that estimates change with price, difficulty, fees and platform costs.",
          "Only commit money you can afford to lose. Mining carries risk and results vary.",
        ],
      },
    ],
    faq: [
      { q: "Do I need to run any hardware?", a: "No. The miner is a digital asset and the mining is hosted by the platform." },
      { q: "Can a digital miner lose money?", a: "Yes. If maintenance is higher than the value of rewards, the net result is negative." },
      { q: "What do TH and W/TH mean?", a: "TH is the miner's hashrate. W/TH is the power it uses per TH. Lower W/TH is more efficient." },
    ],
    sources: [{ label: "Forklog: what is a digital miner", url: "https://forklog.com/en/what-is-a-digital-miner-and-how-can-you-mine-bitcoin-with-nfts/" }, BTC_GUIDE],
    related: ["how-mining-maintenance-fees-work", "understanding-hashrate-and-w-th"],
  },
  {
    slug: "solo-mining-vs-mining-pools",
    title: "Solo Mining vs Mining Pools",
    description: "Solo mining versus mining pools: how each works, how payouts differ, and which suits a small miner. Plain English, no hype.",
    summary: "Why a small miner almost never finds a block alone, and how pools turn luck into steady payouts.",
    keywords: ["solo mining", "mining pool", "pool payouts", "block reward", "variance", "hashrate"],
    updated: "2026-10-20",
    readingMinutes: 5,
    takeaways: [
      "Solo mining pays the whole block reward, but only when you find a block yourself.",
      "A pool combines many miners and shares each reward in proportion to the work contributed.",
      "Pools smooth the income. They do not create extra Bitcoin.",
    ],
    sections: [
      {
        heading: "Solo mining",
        paragraphs: [
          "A solo miner keeps the full block reward, which is the subsidy plus fees, if they find a valid block. Your chance on any block is your share of the total network hashrate.",
          "For a small miner, that share is tiny, so a block could take an extremely long time or never come. The expected value is the same as in a pool, but the variance is huge.",
        ],
      },
      {
        heading: "Mining pools",
        paragraphs: [
          "A pool joins many miners together. When anyone in the pool finds a block, the reward is split in proportion to the work each miner contributed. This gives small payments on a steady schedule instead of rare jackpots.",
          "Pools usually charge a fee and have their own payout rules, so compare them before joining.",
        ],
      },
      {
        heading: "Which one fits",
        paragraphs: [
          "Most miners use pools for predictable income. Solo mining is closer to a lottery ticket. Neither changes the underlying economics, which are driven by price, difficulty, fees and your costs.",
          "Hosted options, including GoMining digital miners, handle the pool side for you, so the thing you control is the size and efficiency of the miner you hold.",
        ],
      },
    ],
    faq: [
      { q: "Is solo mining more profitable?", a: "Not on average. The expected return is the same, but a pool makes it far more predictable." },
      { q: "Can I solo mine Bitcoin with a GPU?", a: "Not practically. ASICs are far more efficient at SHA-256, so GPU mining Bitcoin is not practical today." },
      { q: "Do pools earn more bitcoin in total?", a: "No. A pool shares the same rewards in smaller, steadier amounts." },
    ],
    sources: [BTC_GUIDE, WHITEPAPER],
    related: ["bitcoin-mining-difficulty-explained", "understanding-hashrate-and-w-th"],
  },
  {
    slug: "understanding-hashrate-and-w-th",
    title: "Understanding Hashrate and W/TH",
    description: "What hashrate and W/TH mean in Bitcoin mining, how to read them on a miner, and why efficiency drives your running costs.",
    summary: "Hashrate is your speed, W/TH is your power bill. Here is how to read both.",
    keywords: ["hashrate", "TH/s", "EH/s", "W/TH", "mining efficiency", "ASIC"],
    updated: "2026-10-20",
    readingMinutes: 4,
    takeaways: [
      "Hashrate is the number of hash attempts per second. 1 TH/s is one trillion hashes per second.",
      "W/TH is watts per terahash. Lower is more efficient.",
      "Power use per day in kWh is TH x W/TH x 24 / 1000.",
    ],
    sections: [
      {
        heading: "Hashrate",
        paragraphs: [
          "Hashrate counts how many hash attempts a miner makes each second. The units climb in steps of a thousand: TH/s, PH/s, then EH/s for the whole network.",
          "Your reward share is your TH divided by the network total. 1 EH/s equals 1,000,000 TH/s.",
        ],
      },
      {
        heading: "Efficiency in W/TH",
        paragraphs: [
          "W/TH is the power a machine draws for each TH it produces. A machine at 15 W/TH uses less electricity than one at 20 W/TH for the same hashrate.",
          "Specialised ASIC chips are why efficiency has improved so much, and why they replaced GPUs for Bitcoin.",
        ],
      },
      {
        heading: "Turning W/TH into a daily cost",
        paragraphs: [
          "Multiply TH by W/TH for watts, then by 24 hours and divide by 1,000 for kWh per day. Multiply by your electricity price to get the daily cost.",
          "Example: 8 TH at 20 W/TH uses 3.84 kWh a day. At $0.05 per kWh that is $0.192 a day, and at 12 W/TH it falls to $0.1152.",
        ],
      },
    ],
    faq: [
      { q: "Is higher hashrate always better?", a: "More hashrate earns a bigger share, but it also costs more to run. Efficiency decides how much of the reward is left." },
      { q: "What is a good W/TH?", a: "Lower is better. Compare miners on W/TH alongside price and fees." },
      { q: "How big is the network?", a: "It changes constantly. The calculator pulls the current figure when it can." },
    ],
    sources: [BTC_GUIDE, { label: "Blockstream glossary: halving", url: "https://help.blockstream.com/education/glossary/halving" }],
    related: ["how-mining-maintenance-fees-work", "how-to-calculate-bitcoin-mining-profitability"],
  },
  {
    slug: "how-mining-maintenance-fees-work",
    title: "How Mining Maintenance Fees Work",
    description: "How mining maintenance fees work: electricity and service parts, why they are charged per day, and how discounts reduce them.",
    summary: "The two parts of a maintenance fee, how to calculate them, and how discounts change the total.",
    keywords: ["maintenance fee", "GoMining maintenance", "electricity cost", "service fee", "GOMINING discount"],
    updated: "2026-10-20",
    readingMinutes: 5,
    takeaways: [
      "Maintenance has two parts: electricity, which depends on power and efficiency, and a service fee, which depends on size.",
      "It is charged daily and comes out of rewards, so a falling Bitcoin price makes it weigh more.",
      "Discounts reduce the total, for example paying part of it in the GOMINING token.",
    ],
    sections: [
      {
        heading: "Why maintenance exists",
        paragraphs: [
          "Mining machines need power, cooling, space and staff. Hosted mining passes those costs on as a maintenance fee so you do not run anything yourself.",
        ],
      },
      {
        heading: "The two parts",
        paragraphs: [
          "Electricity scales with TH x W/TH, because a more efficient machine uses less power per TH. The service fee scales with TH only.",
          "In my own GoMining account export, the service fee worked out to $0.0089 per TH per day before discounts and electricity to $0.05 per kWh. GoMining can change its rates, so check your own account.",
        ],
        list: [
          "Electricity per day = TH x W/TH x 24 / 1000 x price per kWh",
          "Service per day = TH x service rate",
          "Maintenance = (electricity + service) x (1 minus discount)",
        ],
      },
      {
        heading: "Discounts",
        paragraphs: [
          "Maintenance is deducted in Bitcoin by default. Paying in the GOMINING token can earn a discount of up to 20%. Other discounts exist, such as a level discount, and they add together. In my export they combined to between about 4% and 26% depending on the day.",
        ],
      },
      {
        heading: "Why it matters when price falls",
        paragraphs: [
          "Maintenance is a dollar cost, while rewards are paid in Bitcoin. If the price falls, the same Bitcoin covers less of the bill. The calculator shows a break-even price so you can see where that line sits.",
        ],
      },
    ],
    faq: [
      { q: "Can maintenance be paid in GOMINING?", a: "Yes. Paying in the token can give a discount of up to 20%." },
      { q: "Do all miners pay the same?", a: "No. Electricity depends on efficiency and size, and the service fee depends on size." },
      { q: "Do the rates change?", a: "They can. Always check the current rates in your account." },
    ],
    sources: [{ label: "Forklog: what is a digital miner", url: "https://forklog.com/en/what-is-a-digital-miner-and-how-can-you-mine-bitcoin-with-nfts/" }],
    related: ["what-are-gomining-digital-miners", "how-to-calculate-bitcoin-mining-profitability"],
  },
  {
    slug: "how-to-calculate-bitcoin-mining-profitability",
    title: "How to Calculate Bitcoin Mining Profitability",
    description: "Step by step: how to estimate Bitcoin mining profit from hashrate, efficiency, electricity, fees, difficulty and BTC price, with a worked example.",
    summary: "A step-by-step method and a worked example, plus the break-even price that shows your real risk.",
    keywords: ["mining profitability", "mining calculator", "break-even price", "BTC per day", "mining revenue"],
    updated: "2026-10-20",
    readingMinutes: 7,
    takeaways: [
      "Revenue = your share of the network x daily block rewards x BTC price.",
      "Profit = revenue minus maintenance or electricity and fees.",
      "Always find the break-even Bitcoin price, then test a lower price and higher difficulty.",
    ],
    sections: [
      {
        heading: "Step 1: your share of the network",
        paragraphs: [
          "Divide your hashrate by the network hashrate, using the same units. 100 TH on a 1,000 EH/s network is 100 / 1,000,000,000 = 0.0000001, or one ten-millionth.",
        ],
      },
      {
        heading: "Step 2: daily rewards",
        paragraphs: [
          "There are about 144 blocks a day. Each pays the 3.125 BTC subsidy plus fees, which vary. Multiply your share by 144 x (3.125 + average fees). With 0.1 BTC average fees in the example, 100 TH earns about 0.0000464 BTC a day.",
        ],
      },
      {
        heading: "Step 3: convert to dollars",
        paragraphs: ["Multiply daily BTC by the Bitcoin price to get revenue."],
      },
      {
        heading: "Step 4: subtract costs",
        paragraphs: [
          "Electricity is TH x W/TH x 24 / 1000 x price per kWh. Add any service or platform fee, then apply any discount. Profit is revenue minus those costs.",
        ],
      },
      {
        heading: "Step 5: find the break-even price",
        paragraphs: [
          "Divide daily cost by daily BTC. That is the Bitcoin price at which you earn nothing. If it is close to today's price, a small drop turns the result negative.",
        ],
      },
      {
        heading: "Step 6: stress test",
        paragraphs: [
          "Estimates change with Bitcoin prices, mining difficulty, fees and platform costs. Rerun with the price 15% to 30% lower and the network 10% to 25% larger. The calculator's table does this for you.",
        ],
      },
    ],
    faq: [
      { q: "Is mining profitable?", a: "It depends on your costs, the price and the network at the time. It can be negative, and nothing here is a promise of return." },
      { q: "Why does my estimate differ from my real results?", a: "Fees, difficulty, price and platform costs change daily, and an estimate only uses a snapshot." },
      { q: "Does the calculator include taxes?", a: "No. Check the rules where you live." },
    ],
    sources: [BTC_GUIDE, { label: "Blockstream glossary: halving", url: "https://help.blockstream.com/education/glossary/halving" }],
    related: ["bitcoin-mining-difficulty-explained", "how-mining-maintenance-fees-work"],
  },
  {
    slug: "gomining-quickstart",
    title: "GoMining Quickstart Guide for Beginners",
    description:
      "A plain-English quickstart to GoMining: what it is, how to get started, what to check before buying, and the bonuses a referral link gives new users.",
    summary: "What GoMining is, the steps to get started, the risks to weigh first, and what a referral link adds for new users.",
    keywords: ["gomining", "gomining quickstart", "gomining referral", "gomining referral code", "gomining bonus", "digital miner", "Platinum+", "getting started"],
    updated: "2026-10-30",
    readingMinutes: 5,
    takeaways: [
      "GoMining sells Digital Miners: tokenised shares of Bitcoin mining power measured in TH, with a maintenance fee that is part of the cost.",
      "Learn the basics first (TH, W/TH, fees, difficulty) and run your own numbers before you spend anything. Returns are not guaranteed and can be negative.",
      "New users who sign up with a referral link can get a 5% TH bonus on a first miner, TH for card spending, and one month of Platinum+. Terms are GoMining's and can change.",
    ],
    sections: [
      {
        heading: "What GoMining is",
        paragraphs: [
          "GoMining is a platform where you buy Digital Miners, tokenised ownership of Bitcoin mining capacity measured in terahash (TH). A miner earns a share of Bitcoin mining rewards, and you pay a maintenance fee for the electricity and service that keeps it running.",
          "It is not the same as owning and running your own hardware, and it is not a savings account. What you earn depends on Bitcoin's price, network difficulty and the fees you pay.",
        ],
      },
      {
        heading: "Before you start: learn the four numbers",
        paragraphs: ["Four ideas explain most of what you will see in the app. Each has its own guide on this site."],
        list: [
          "TH (terahash) is the size of your mining power, and W/TH is how much electricity each TH uses.",
          "The maintenance fee is charged against your rewards, so a higher fee leaves less for you.",
          "Difficulty rises as more miners join the network, which shrinks each miner's share.",
          "Break-even price is the Bitcoin price at which you earn nothing after fees.",
        ],
      },
      {
        heading: "Getting started, step by step",
        paragraphs: ["The exact screens change, so follow what GoMining shows you. The order below is the sensible one."],
        list: [
          "Create your account from a referral link so the new-user bonuses can be attached, and enter the code if you are asked.",
          "Check which products are available where you live. GoMining says products and features are subject to eligibility, its terms and regional availability.",
          "Read the miner's TH, W/TH and maintenance fee on the listing, then run them through the mining calculator on this site.",
          "Start small. Only use money you could afford to lose, because the price of Bitcoin can fall and fees continue either way.",
          "Complete any verification the platform asks for, and keep your login and recovery details secure.",
        ],
      },
      {
        heading: "What a referral link gives new users",
        paragraphs: [
          "GoMining's referral page lists what a referred friend receives. Each bonus has a time window that starts at registration, so use the link when you first sign up. GoMining describes referral rewards as a promo mechanic whose sizes and terms may change, so check its Referral Program page and Terms of Use for the current terms.",
        ],
        list: [
          "5% bonus in TH on your first miner, within 30 days after registration, up to 25 TH.",
          "20 dollars in TH for the first 100 dollars spent using the GoMining card, within 90 days after registration.",
          "1 month of Platinum+, within 30 days after registration.",
        ],
      },
      {
        heading: "Risks to keep in mind",
        paragraphs: [
          "Mining returns move with Bitcoin's price, difficulty and fees, and can be lower than your costs. Bonus TH adds mining power, but it does not remove those risks. Nothing on this page is financial advice or a promise of return.",
        ],
      },
    ],
    faq: [
      { q: "Do I have to use a referral link?", a: "No. A link is optional, but the new-user bonuses are tied to signing up with one, and the time windows start at registration." },
      { q: "Does the referral link cost me anything extra?", a: "GoMining does not list a charge for using a link. Normal product prices and maintenance fees still apply." },
      { q: "Is GoMining guaranteed to be profitable?", a: "No. Returns depend on Bitcoin's price, difficulty and fees, and can be negative." },
      { q: "What do you get from the referral?", a: "I am a GoMining referrer, so I may earn rewards when people sign up through my link. That is why this is disclosed, and why you should compare it with your own research." },
    ],
    sources: [
      { label: "GoMining: Become a True GoMining Partner (referral program, 16 Jul 2026)", url: "https://gomining.com/blog/gomining-partner" },
      { label: "GoMining: Updated 5+5+5 Referral Program (earlier version)", url: "https://gomining.com/blog/updated-5-5-5-referral-program" },
      { label: "GoMining referral page: new-user bonus terms (as shown to the site owner on 30 Oct 2026)", url: "https://gomining.com/" },
    ],
    related: ["what-are-gomining-digital-miners", "understanding-hashrate-and-w-th", "how-mining-maintenance-fees-work", "how-to-calculate-bitcoin-mining-profitability"],
    referral: {
      heading: "Start with my GoMining referral",
      intro: "Sign up through my link to get the new-user bonuses below.",
      benefits: [
        { title: "5% bonus TH on your first miner", detail: "Within 30 days after registration, up to 25 TH." },
        { title: "TH for card spending", detail: "20 dollars in TH for the first 100 dollars spent using the card, within 90 days after registration." },
        { title: "1 month of Platinum+", detail: "Within 30 days after registration." },
      ],
      note: "Referral link disclosure: I earn rewards from GoMining if you join through it. Bonuses and terms are GoMining's, may change, and depend on eligibility and region. Not financial advice.",
    },
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);

/** Plain text of a whole guide, used for search. */
export function guideText(g: Guide): string {
  return [g.title, g.summary, g.keywords.join(" "), ...g.takeaways,
    ...g.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])]),
    ...g.faq.flatMap((f) => [f.q, f.a])].join(" ").toLowerCase();
}

/** Every term must appear somewhere in the guide. Empty query returns everything. */
export function searchGuides(query: string): Guide[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return guides;
  return guides
    .map((g) => ({ g, hay: guideText(g), title: g.title.toLowerCase() }))
    .filter(({ hay }) => terms.every((t) => hay.includes(t)))
    .sort((a, b) => Number(terms.some((t) => b.title.includes(t))) - Number(terms.some((t) => a.title.includes(t))))
    .map(({ g }) => g);
}
