const anchorMonth = 2026 * 12 + 7;
const monthName = month => new Date(Date.UTC(Math.floor(month / 12), month % 12, 1)).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
export const periodOptions = Array.from({ length: 12 }, (unused, index) => ({ id: String(anchorMonth - index), label: monthName(anchorMonth - index), end: anchorMonth - index, months: 1 }));
export const windows = { month: periodOptions, quarter: [24317, 24314, 24311, 24308].map(end => ({ id: String(end), end, months: 3, label: `Q${Math.floor(end % 12 / 3) + 1} ${Math.floor(end / 12)}` })), half: [24317, 24311, 24305].map(end => ({ id: String(end), end, months: 6, label: `${end % 12 === 5 ? 'Jan–Jun' : 'Jul–Dec'} ${Math.floor(end / 12)}` })) };

export const channelDefinitions = [
  { id: 'serp', name: 'Organic · SERP', cost: 'SEO content & technical costs', color: '#8470e8' },
  { id: 'maps', name: 'Organic · Maps', cost: 'Local SEO & listings costs', color: '#af9ef2' },
  { id: 'google', name: 'Google Ads', cost: 'Ad spend & management', color: '#7287d3' },
  { id: 'socialads', name: 'Social Ads', cost: 'Ad spend, creative & management', color: '#c285b6' },
  { id: 'community', name: 'Community', cost: 'Organic social & community management', color: '#57a499' },
  { id: 'llm', name: 'LLM', cost: 'AI-search content & monitoring', color: '#9b88cf' },
  { id: 'direct', name: 'Other Direct & Referral', cost: 'Brand & referral-program costs', color: '#9295a6' },
];

export const channelViews = [
  { id: 'all', name: 'All channels', ids: channelDefinitions.map(channel => channel.id), description: 'Complete revenue and marketing investment, including revenue with an unresolved source.' },
  { id: 'organic', name: 'Organic (SERP, Maps)', ids: ['serp', 'maps'], description: 'Unpaid search results and local Maps discovery. Costs include SEO work, content and listings, not ad spend.' },
  { id: 'paid', name: 'Paid · all', ids: ['google', 'socialads'], description: 'Google Ads and Social Ads together, including media, creative and management costs.' },
  { id: 'social', name: 'Social · all', ids: ['socialads', 'community'], description: 'Paid social plus unpaid community and social activity. This overlaps Paid through Social Ads; do not add the two groups together.' },
  ...channelDefinitions.map(channel => ({ ...channel, ids: [channel.id], description: ({ serp: 'Revenue linked to unpaid search-result visits; investment includes SEO content and technical work.', maps: 'Revenue linked to local Maps discovery; investment includes local SEO and listings work.', google: 'Revenue linked to Google advertising; investment includes media spend and campaign management.', socialads: 'Revenue linked to paid social campaigns; investment includes media, creative and management.', community: 'Revenue linked to unpaid social, community participation and partnerships. This is separate from Social Ads.', llm: 'Revenue linked to AI-assistant referrals in this demo. Source matching does not prove that an AI recommendation caused a booking.', direct: 'Revenue linked to known direct visits, referrals and other identified sources. Unresolved revenue is not silently assigned here.' })[channel.id] })),
];

export const economicsIds = ['organic', 'google', 'socialads', 'community', 'llm', 'direct'];

export const actionDefinitions = {
  attack: { label: 'Attack', group: 'growth', description: 'Acquisition headroom with strong conversion.' },
  grow: { label: 'Grow', group: 'growth', description: 'Expand acquisition in measured steps.' },
  diagnose: { label: 'Diagnose', group: 'attention', description: 'Investigate conversion before adding spend.' },
  defend: { label: 'Defend', group: 'established', description: 'Protect a strong position in a valuable market.' },
  harvest: { label: 'Harvest', group: 'established', description: 'Favor efficiency in an established market.' },
  watch: { label: 'Watch', group: 'attention', description: 'Monitor signals before committing more budget.' },
  verify: { label: 'Verify data', group: 'gaps', description: 'Resolve attribution gaps before judging channels.' },
};

const roster = [
  ['Phoenix', 'AZ', 324, 0.38, 1070, 29500, 91, 36, 0.19, 0.81, 520, 155],
  ['Tampa', 'FL', 282, 0.33, 1040, 30200, 85, 53, 0.14, 0.79, 390, 120],
  ['Dallas', 'TX', 306, 0.19, 1120, 56800, 94, 65, -0.09, 0.78, 280, 45],
  ['Denver', 'CO', 261, 0.32, 1210, 41300, 54, 84, 0.02, 0.88, 105, 60],
  ['Austin', 'TX', 342, 0.35, 1180, 43600, 86, 82, 0.11, 0.85, 180, 65],
  ['Miami', 'FL', 250, 0.35, 1140, 28100, 89, 39, 0.17, 0.76, 460, 130],
  ['Charlotte', 'NC', 247, 0.31, 1090, 25700, 78, 51, 0.13, 0.83, 320, 95],
  ['Nashville', 'TN', 269, 0.34, 1110, 30900, 80, 57, 0.12, 0.81, 310, 100],
  ['Atlanta', 'GA', 298, 0.21, 1130, 48700, 88, 62, -0.06, 0.74, 250, 40],
  ['Orlando', 'FL', 208, 0.27, 1020, 24900, 65, 69, 0.03, 0.80, 175, 55],
  ['Seattle', 'WA', 292, 0.33, 1360, 47500, 87, 89, 0.08, 0.86, 140, 60],
  ['Portland', 'OR', 211, 0.31, 1170, 29600, 57, 79, 0.01, 0.85, 90, 40],
  ['Raleigh', 'NC', 222, 0.33, 1090, 23100, 76, 49, 0.16, 0.82, 310, 100],
  ['San Diego', 'CA', 306, 0.36, 1320, 46200, 84, 81, 0.09, 0.88, 150, 65],
  ['Columbus', 'OH', 192, 0.28, 990, 23700, 62, 57, 0.04, 0.75, 130, 50],
  ['Las Vegas', 'NV', 226, 0.32, 1130, 27000, 81, 34, 0.18, 0.78, 375, 110],
  ['Houston', 'TX', 329, 0.20, 1070, 53400, 92, 68, -0.04, 0.79, 270, 45],
  ['Minneapolis', 'MN', 253, 0.32, 1180, 30500, 74, 59, 0.07, 0.84, 225, 75],
  ['Indianapolis', 'IN', 184, 0.27, 990, 21900, 60, 51, 0.02, 0.72, 145, 55],
  ['Salt Lake City', 'UT', 217, 0.34, 1190, 25400, 79, 41, 0.15, 0.83, 310, 100],
  ['Sacramento', 'CA', 228, 0.30, 1170, 34600, 72, 63, 0.05, 0.36, 220, 75],
  ['Kansas City', 'MO', 202, 0.31, 1050, 24800, 58, 75, 0.03, 0.86, 100, 45],
  ['Richmond', 'VA', 207, 0.32, 1120, 22600, 71, 47, 0.10, 0.81, 260, 85],
  ['Jacksonville', 'FL', 218, 0.29, 1020, 27800, 70, 55, 0.04, 0.43, 210, 70],
];

function partition(total, weights) {
  const sum = weights.reduce((accumulator, value) => accumulator + value, 0);
  const parts = weights.map(weight => Math.floor(total * weight / sum));
  parts[parts.length - 1] += total - parts.reduce((accumulator, value) => accumulator + value, 0);
  return parts;
}

function makeRecord(entry, position, month) {
  const [city, region, baseBookings, conversion, ticket, baseSpend, potential, presence, growth, coverage, headroom, capacity] = entry;
  const step = month - anchorMonth;
  const season = 1 + 0.07 * Math.sin((month % 12) * Math.PI / 6);
  const anchorSeason = 1 + 0.07 * Math.sin(7 * Math.PI / 6);
  const bookings = Math.max(1, Math.round(baseBookings * Math.pow(1 + growth / 3, step) * season / anchorSeason));
  const leads = Math.round(bookings / conversion);
  const revenue = bookings * ticket;
  const spend = Math.round(baseSpend * Math.pow(1 + (growth > 0 ? growth * 0.12 : 0.008), step));
  const attributedRevenue = Math.round(revenue * coverage);
  const weights = [28 + position % 6, 22 + position % 3, 29, 7 + position % 4, 5, 3 + position % 3, 11];
  const revenueParts = partition(attributedRevenue, weights);
  const spendParts = partition(spend, [16, 12, 48, 12, 5, 3, 4]);
  const record = {
    id: city.toLowerCase().replaceAll(' ', '-'), city, region, month, bookings, leads, ticket, revenue, spend,
    attributedRevenue, unassignedRevenue: revenue - attributedRevenue,
    coverage: attributedRevenue / revenue, conversion: bookings / leads,
    potential, presence: Math.max(12, Math.min(95, presence + step * (growth > 0 ? 0.7 : -0.3))),
    incrementalLeadCapacity: Math.round(headroom * Math.pow(1.015, step)), spareJobs: capacity,
  };
  record.action = getAction(record);
  const eligible = actionDefinitions[record.action].group === 'growth';
  const estimate = capture => eligible ? Math.floor(Math.min(record.incrementalLeadCapacity * capture * record.conversion, capacity) * ticket) : 0;
  record.opportunityLow = estimate(0.4);
  record.opportunityHigh = estimate(0.7);
  const lowParts = partition(record.opportunityLow, weights);
  const highParts = partition(record.opportunityHigh, weights);
  record.channels = channelDefinitions.map((channel, index) => ({
    ...channel, revenue: revenueParts[index], spend: spendParts[index],
    opportunityLow: lowParts[index], opportunityHigh: highParts[index],
    demandShare: weights[index] / weights.reduce((sum, weight) => sum + weight, 0),
  }));
  record.scores = {
    potential: [
      { label: 'Local service demand', value: potential + 4, weight: 0.5 },
      { label: 'Serviceable households', value: potential - 4, weight: 0.3 },
      { label: 'Competitive headroom', value: potential - 4, weight: 0.2 },
    ],
    presence: [
      { label: 'Search-result visibility', value: record.presence + 4, weight: 0.45 },
      { label: 'Maps visibility', value: record.presence - 4, weight: 0.35 },
      { label: 'Brand recognition', value: record.presence - 2, weight: 0.2 },
    ],
  };
  return record;
}

function getAction(location) {
  if (location.coverage < 0.5) return 'verify';
  if (location.conversion < 0.23) return 'diagnose';
  if (location.potential >= 75 && location.presence < 45 && location.conversion >= 0.29) return 'attack';
  if (location.potential >= 75 && location.presence >= 72) return 'defend';
  if (location.potential < 62 && location.presence >= 65) return 'harvest';
  if (location.potential >= 65 && location.presence < 65 && location.conversion >= 0.29) return 'grow';
  return 'watch';
}

export function resolveWindow(range = 'month', period = windows[range]?.[0]?.id, comparison = 'previous') {
  const selected = windows[range]?.find(option => option.id === period);
  if (!selected || !['previous', 'year'].includes(comparison)) throw new Error('Invalid reporting window.');
  const shift = comparison === 'year' ? 12 : selected.months;
  const start = selected.end - selected.months + 1;
  const previousEnd = selected.end - shift;
  const labelFor = (first, last) => first === last ? monthName(last) : `${monthName(first)} – ${monthName(last)}`;
  return { ...selected, start, previousStart: start - shift, previousEnd, label: labelFor(start, selected.end), previousLabel: labelFor(start - shift, previousEnd), latestMonth: monthName(selected.end) };
}

function aggregateRecords(records) {
  const last = records.at(-1);
  const sum = field => records.reduce((total, record) => total + record[field], 0);
  const revenue = sum('revenue');
  const attributedRevenue = sum('attributedRevenue');
  const channels = channelDefinitions.map(channel => ({
    ...last.channels.find(item => item.id === channel.id),
    revenue: records.reduce((total, record) => total + record.channels.find(item => item.id === channel.id).revenue, 0),
    spend: records.reduce((total, record) => total + record.channels.find(item => item.id === channel.id).spend, 0),
  }));
  return { ...last, revenue, spend: sum('spend'), bookings: sum('bookings'), leads: sum('leads'), attributedRevenue, unassignedRevenue: revenue - attributedRevenue, coverage: attributedRevenue / revenue, conversion: sum('bookings') / sum('leads'), channels };
}

export function getDataset(range = 'month', period = windows[range][0].id, comparison = 'previous') {
  const window = resolveWindow(range, period, comparison);
  return roster.map((entry, position) => {
    const records = Array.from({ length: window.months }, (unused, offset) => makeRecord(entry, position, window.start + offset));
    const priorRecords = Array.from({ length: window.months }, (unused, offset) => makeRecord(entry, position, window.previousStart + offset));
    const current = aggregateRecords(records);
    const previous = aggregateRecords(priorRecords);
    return { ...current, previous, latest: records.at(-1), records, priorRecords, action: getAction(current), gap: current.potential - current.presence, growth: current.revenue / previous.revenue - 1 };
  });
}

export function metricsFor(locations, channelId = 'all', previous = false) {
  const view = channelViews.find(channel => channel.id === channelId);
  if (!view) throw new Error('Unknown channel.');
  let revenue = 0;
  let spend = 0;
  let unresolved = 0;
  let matched = 0;
  let allRevenue = 0;
  for (const location of locations) {
    const record = previous ? location.previous : location;
    unresolved += record.unassignedRevenue;
    matched += record.attributedRevenue;
    allRevenue += record.revenue;
    if (channelId === 'all') { revenue += record.revenue; spend += record.spend; }
    else for (const channel of record.channels.filter(item => view.ids.includes(item.id))) { revenue += channel.revenue; spend += channel.spend; }
  }
  const coverage = allRevenue ? matched / allRevenue : null;
  return { revenue, spend, roi: spend && (channelId === 'all' || coverage >= 0.5) ? (revenue - spend) / spend : null, unresolved, coverage };
}

export function summarize(locations, channelId = 'all') {
  const current = metricsFor(locations, channelId);
  const previous = metricsFor(locations, channelId, true);
  const sum = field => locations.reduce((total, location) => total + location[field], 0);
  return { ...current, previous, count: locations.length, growth: previous.revenue ? current.revenue / previous.revenue - 1 : null, spendGrowth: previous.spend ? current.spend / previous.spend - 1 : null, roiChange: current.roi !== null && previous.roi !== null ? current.roi - previous.roi : null, bookings: sum('bookings'), leads: sum('leads'), conversion: sum('leads') ? sum('bookings') / sum('leads') : null };
}

export function opportunityFor(location, channelId = 'all') {
  const latest = location.latest;
  if (channelId === 'all') return { low: latest.opportunityLow, high: latest.opportunityHigh, share: 1 };
  const ids = channelViews.find(channel => channel.id === channelId)?.ids;
  if (!ids) throw new Error('Unknown channel.');
  const channels = latest.channels.filter(channel => ids.includes(channel.id));
  return { low: channels.reduce((sum, channel) => sum + channel.opportunityLow, 0), high: channels.reduce((sum, channel) => sum + channel.opportunityHigh, 0), share: channels.reduce((sum, channel) => sum + channel.demandShare, 0) };
}

export function filterLocations(locations, query = '', filter = 'all', sort = 'opportunity', channelId = 'all') {
  const needle = query.trim().toLowerCase();
  return locations.filter(location => `${location.city} ${location.region}`.toLowerCase().includes(needle) && (filter === 'all' || actionDefinitions[location.action].group === filter)).sort((first, second) => {
    if (sort === 'name') return first.city.localeCompare(second.city);
    if (sort === 'potential') return second.potential - first.potential;
    if (sort === 'revenue') return metricsFor([second], channelId).revenue - metricsFor([first], channelId).revenue;
    if (sort === 'growth') return summarize([second], channelId).growth - summarize([first], channelId).growth;
    return opportunityFor(second, channelId).high - opportunityFor(first, channelId).high || second.gap - first.gap;
  });
}

export function insightFor(location, network) {
  const copy = {
    attack: ['An undercaptured market', 'Strong demand and healthy booking conversion make this a candidate for a measured acquisition test.', 'Potential ≥75, presence <45 and conversion ≥29%, after passing the source-quality check.', 'Test local and organic acquisition; watch incremental bookings and delivery capacity.'],
    grow: ['Room for measured growth', 'Healthy conversion and room to improve visibility support a controlled acquisition test.', 'Potential ≥65, presence <65 and conversion ≥29%, without triggering a higher-priority rule.', 'Expand acquisition in small steps. Validate incremental bookings before a larger budget change.'],
    diagnose: ['Fix conversion before adding spend', 'Fewer than 23% of leads turn into bookings. More traffic may amplify a booking bottleneck.', 'Booking conversion <23%, after passing the source-quality check.', 'Review call handling, response times and unbooked leads. This signal does not establish the cause.'],
    defend: ['Protect a strong market', 'High demand and established visibility make protecting this position a priority.', 'Potential ≥75 and presence ≥72, with no source-quality or conversion alert.', 'Maintain reviews, service quality and local visibility. Watch competitor gains.'],
    harvest: ['Prioritize efficiency', 'Established visibility in a smaller demand opportunity favors efficiency over broad expansion.', 'Potential <62 and presence ≥65, with no higher-priority alert.', 'Protect existing demand and test cost efficiencies before adding spend.'],
    watch: ['Keep this market in view', 'The signals do not currently meet a stronger action rule.', 'No growth, established-market, conversion or source-quality threshold matched.', 'Monitor demand, booking conversion and costs through another complete period.'],
    verify: ['Check source matching', 'Less than half of revenue has a reliable channel match in this fictional dataset.', 'Source-match coverage <50%. This check takes priority over every other rule.', 'Reconcile booking and payment source identifiers before comparing channel ROI.'],
  };
  const [headline, finding, rule, recommendation] = copy[location.action];
  return { headline, finding, rule, recommendation, evidence: [
    `Market potential ${location.potential.toFixed(0)}/100; visibility ${location.presence.toFixed(0)}/100. These are location-wide demo scores.`,
    `${(location.conversion * 100).toFixed(1)}% of leads became bookings; network reference ${(network.conversion * 100).toFixed(1)}% for the same window.`,
    `${(location.coverage * 100).toFixed(1)}% of revenue has a source match. Channel ROI is withheld below 50%.`,
  ] };
}

export function attentionItems(locations, network) {
  if (locations.length === 1) return [{ location: locations[0], ...insightFor(locations[0], network) }];
  return ['attack', 'diagnose', 'verify'].map(action => locations.filter(location => location.action === action).sort((first, second) => action === 'verify' ? first.coverage - second.coverage : second.opportunityHigh - first.opportunityHigh || second.revenue - first.revenue)[0]).filter(Boolean).map(location => ({ location, ...insightFor(location, network) }));
}

export function trendFor(locations, channelId, window) {
  const monthly = (recordsKey, offset) => metricsFor(locations.map(location => location[recordsKey][offset]), channelId);
  if (window.months > 1) return Array.from({ length: window.months }, (unused, offset) => ({
    label: monthName(window.start + offset), previousLabel: monthName(window.previousStart + offset),
    current: monthly('records', offset), previous: monthly('priorRecords', offset),
  }));
  const daily = (recordsKey, month) => {
    const days = new Date(Date.UTC(Math.floor(month / 12), month % 12 + 1, 0)).getUTCDate();
    const total = monthly(recordsKey, 0);
    const weights = Array.from({ length: days }, (unused, index) => 1 + 0.2 * Math.sin((index + month) * 1.8) + (index % 7 < 5 ? 0.15 : -0.15));
    const revenue = partition(total.revenue, weights);
    const spend = partition(total.spend, weights.map(weight => 0.8 + weight * 0.2));
    return revenue.map((value, index) => ({ revenue: value, spend: spend[index], roi: total.roi === null ? null : (value - spend[index]) / spend[index] }));
  };
  const current = daily('records', window.start);
  const previous = daily('priorRecords', window.previousStart);
  return Array.from({ length: Math.max(current.length, previous.length) }, (unused, index) => ({
    label: `${monthName(window.start)} · day ${index + 1}`, previousLabel: `${monthName(window.previousStart)} · day ${index + 1}`,
    current: current[index] || null, previous: previous[index] || null,
  }));
}
