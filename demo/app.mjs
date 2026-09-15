import { windows, resolveWindow, channelViews, economicsIds, getDataset, summarize, metricsFor, opportunityFor, filterLocations, attentionItems, trendFor, actionDefinitions } from './data.mjs';

const state = { range: 'month', period: windows.month[0].id, comparison: 'previous', channel: 'all', selected: null, query: '', filter: 'all', sort: 'opportunity', metric: 'revenue', expanded: null };
const element = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const number = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
const percent = value => value == null ? '—' : new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(value);
const compact = value => Math.abs(value) >= 1e6 ? '$' + (value / 1e6).toFixed(2) + 'M' : Math.abs(value) >= 1000 ? '$' + (value / 1000).toFixed(Math.abs(value) < 10000 ? 1 : 0) + 'k' : money(value);
const signed = value => value == null ? '—' : (value >= 0 ? '+' : '−') + percent(Math.abs(value));
const points = value => value == null ? '—' : (value >= 0 ? '+' : '−') + (Math.abs(value) * 100).toFixed(1) + ' pp';
const direction = value => value == null ? 'neutral' : value >= 0 ? 'positive' : 'negative';
const estimateRange = (low, high) => compact(low) + '–' + compact(high);
const pill = action => '<span class="action-pill action-' + action + '">' + actionDefinitions[action].label + '</span>';
const channelFor = channelId => channelViews.find(channel => channel.id === channelId);
const metricName = metric => ({ revenue: 'Revenue', spend: 'Marketing spend', roi: 'ROI' })[metric];
const metricValue = (metric, value) => value == null ? '—' : metric === 'roi' ? percent(value) : compact(value);
let locations = [];
let scope = [];
let visible = [];
let totals;
let network;
let reportingWindow;
let findings = [];

function syncControls() {
  element('period').innerHTML = windows[state.range].map(option => '<option value="' + option.id + '">' + option.label + '</option>').join('');
  element('period').value = state.period;
  element('comparison').value = state.comparison;
  element('location-select').innerHTML = '<option value="all">All locations</option>' + [...locations].sort((first, second) => first.city.localeCompare(second.city)).map(location => '<option value="' + location.id + '">' + location.city + '</option>').join('');
  element('location-select').value = state.selected || 'all';
  element('channel-select').innerHTML = channelViews.map(channel => '<option value="' + channel.id + '">' + channel.name + '</option>').join('');
  element('channel-select').value = state.channel;
  element('search').value = state.query;
  element('sort').value = state.sort;
  document.querySelectorAll('[data-range]').forEach(button => button.setAttribute('aria-pressed', button.dataset.range === state.range));
}

function renderHeading() {
  const channel = channelFor(state.channel);
  const location = locations.find(item => item.id === state.selected);
  element('page-subtitle').textContent = location ? location.city + ' · Location performance' : 'Network overview';
  element('scope-heading').innerHTML = (location ? '<button class="crumb" data-location="all">← All locations</button><span class="crumb-divider">/</span>' : '') +
    '<h2 id="view-heading" tabindex="-1">' + (location ? location.city : 'All locations') + (state.channel !== 'all' ? ' · ' + escapeHtml(channel.name) : '') + '</h2>' +
    (state.channel !== 'all' ? '<button class="crumb" data-channel="all">Clear channel ×</button><p>' + escapeHtml(channel.description) + '</p>' : '');
  element('window-description').textContent = reportingWindow.label + ' compared with ' + reportingWindow.previousLabel + ' · ' + (state.comparison === 'year' ? 'Year over year' : 'Previous complete period') + ' · USD';
  document.title = 'Atlas Home Services · ' + (location?.city || 'Network overview') + (state.channel !== 'all' ? ' · ' + channel.name : '');
}

function renderKpis() {
  const comparison = state.comparison === 'year' ? 'vs. same period last year' : 'vs. previous period';
  const cards = [
    { id: 'revenue', icon: '$', value: totals.revenue, delta: signed(totals.growth), change: totals.growth, note: state.channel === 'all' ? 'All recorded revenue' : 'Revenue linked to this channel' },
    { id: 'spend', icon: '↗', value: totals.spend, delta: signed(totals.spendGrowth), change: null, note: 'Advertising + allocated marketing costs' },
    { id: 'roi', icon: '%', value: totals.roi, delta: points(totals.roiChange), change: totals.roiChange, note: totals.roi === null ? 'Withheld: source coverage below 50%' : '(Revenue − spend) ÷ spend · not profit ROI' },
  ];
  element('kpis').innerHTML = cards.map(card => '<button class="kpi-card" data-metric="' + card.id + '" aria-pressed="' + (state.metric === card.id) + '" aria-label="Show ' + metricName(card.id) + ' trend"><span class="kpi-label"><span class="metric-icon" aria-hidden="true">' + card.icon + '</span>' + metricName(card.id) + '</span><strong class="kpi-value" title="' + (card.id === 'roi' ? percent(card.value) : money(card.value)) + '">' + metricValue(card.id, card.value) + '</strong><span class="kpi-sub"><span class="delta ' + direction(card.change) + '">' + card.delta + '</span>' + comparison + '</span><span class="kpi-note">' + card.note + '</span></button>').join('');
}

function renderTrend() {
  const series = trendFor(scope, state.channel, reportingWindow);
  const metric = state.metric;
  element('trend-heading').innerHTML = '<div><h2 id="trend-title">' + metricName(metric) + ' trend</h2><div class="trend-summary"><strong>' + metricValue(metric, totals[metric]) + '</strong><span class="small-muted">this ' + (state.range === 'month' ? 'month' : state.range === 'quarter' ? 'quarter' : 'half-year') + '</span><span class="delta ' + (metric === 'spend' ? 'neutral' : direction(metric === 'roi' ? totals.roiChange : totals.growth)) + '">' + (metric === 'roi' ? points(totals.roiChange) : signed(metric === 'spend' ? totals.spendGrowth : totals.growth)) + '</span></div></div><div class="legend"><span><i></i>' + reportingWindow.label + '</span><span><i class="comparison-line"></i>' + reportingWindow.previousLabel + '</span></div>';
  const values = series.flatMap(point => [point.current?.[metric], point.previous?.[metric]]).filter(value => value != null);
  if (!values.length) {
    element('trend-chart').innerHTML = '<div class="empty-state"><strong>ROI needs a more complete source match</strong><p>Review Revenue and Marketing Spend while source coverage is below 50%.</p></div>';
  } else {
    const maximum = Math.max(...values, 1) * 1.08;
    const minimum = Math.min(...values, 0) * 1.08;
    const chartHeight = 210;
    const positionY = value => chartHeight - (value - minimum) / (maximum - minimum) * chartHeight;
    const positionX = index => 5 + index / Math.max(1, series.length - 1) * 990;
    const pathFor = key => {
      let connected = false;
      return series.map((point, index) => {
        const value = point[key]?.[metric];
        if (value == null) { connected = false; return ''; }
        const prefix = connected ? 'L' : 'M';
        connected = true;
        return prefix + positionX(index).toFixed(2) + ',' + positionY(value).toFixed(2);
      }).join(' ');
    };
    const grid = Array.from({ length: 4 }, (unused, index) => '<line x1="0" x2="1000" y1="' + index * 70 + '" y2="' + index * 70 + '" class="chart-grid"/>').join('');
    const dots = series.map((point, index) => point.current?.[metric] == null ? '' : '<circle cx="' + positionX(index) + '" cy="' + positionY(point.current[metric]) + '" r="3" fill="#8e79df" vector-effect="non-scaling-stroke"><title>' + escapeHtml(point.label + ': ' + metricValue(metric, point.current[metric])) + '</title></circle>').join('');
    const yAxis = Array.from({ length: 4 }, (unused, index) => '<span style="top:' + index / 3 * 100 + '%">' + metricValue(metric, maximum - index / 3 * (maximum - minimum)) + '</span>').join('');
    const indices = reportingWindow.months === 1 ? [0, 7, 14, 21, series.length - 1] : series.map((unused, index) => index);
    const xAxis = indices.map(index => '<span style="left:' + index / (series.length - 1) * 100 + '%">' + (reportingWindow.months === 1 ? index + 1 : series[index].label.split(' ')[0]) + '</span>').join('');
    element('trend-chart').innerHTML = '<div class="trend-chart-wrap"><div class="chart-y-axis">' + yAxis + '</div><div class="chart-plot"><svg class="trend-svg" viewBox="0 -8 1000 226" preserveAspectRatio="none" role="img" aria-label="' + metricName(metric) + ' in the selected period compared with the previous window. Exact values are available below.">' + grid + '<path d="' + pathFor('previous') + '" fill="none" stroke="#c7bbdf" stroke-width="1.8" stroke-dasharray="5 5" vector-effect="non-scaling-stroke"/><path d="' + pathFor('current') + '" fill="none" stroke="#8e79df" stroke-width="2.1" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>' + dots + '</svg><div class="chart-x-axis">' + xAxis + '</div></div></div><p class="chart-caption">' + (reportingWindow.months === 1 ? 'Illustrative daily activity · aligned by day of month; unmatched days are blank.' : 'Monthly totals · compared with the corresponding month in the comparison window.') + (metric === 'roi' ? ' Period ROI is calculated from totals, not averaged from plotted values.' : '') + '</p>';
  }
  element('trend-table').innerHTML = '<table><thead><tr><th>Selected period</th><th>' + metricName(metric) + '</th><th>Comparison period</th><th>' + metricName(metric) + '</th></tr></thead><tbody>' + series.map(point => '<tr><td>' + (point.current ? escapeHtml(point.label) : 'No corresponding day') + '</td><td>' + (point.current?.[metric] == null ? '—' : metric === 'roi' ? percent(point.current.roi) : money(point.current[metric])) + '</td><td>' + (point.previous ? escapeHtml(point.previousLabel) : 'No corresponding day') + '</td><td>' + (point.previous?.[metric] == null ? '—' : metric === 'roi' ? percent(point.previous.roi) : money(point.previous[metric])) + '</td></tr>').join('') + '</tbody></table>';
}

function renderOpportunity() {
  const candidates = scope.map(location => ({ location, ...opportunityFor(location, state.channel) })).filter(item => item.high > 0).sort((first, second) => second.high - first.high);
  const low = candidates.reduce((sum, item) => sum + item.low, 0);
  const high = candidates.reduce((sum, item) => sum + item.high, 0);
  const bars = candidates.slice(0, 5).map(item => ({ id: item.location.id, label: item.location.city, low: item.low, high: item.high }));
  if (candidates.length > 5) bars.push({ label: 'Other ' + (candidates.length - 5) + ' locations', low: candidates.slice(5).reduce((sum, item) => sum + item.low, 0), high: candidates.slice(5).reduce((sum, item) => sum + item.high, 0) });
  const maximum = Math.max(1, ...bars.map(item => item.high));
  const graph = bars.map(item => '<div class="opportunity-bar-row">' + (item.id ? '<button data-location="' + item.id + '">' + item.label + '</button>' : '<span>' + item.label + '</span>') + '<div class="range-track" role="img" aria-label="' + escapeHtml(item.label + ': ' + money(item.low) + ' to ' + money(item.high) + ' per month') + '"><span class="range-high" style="width:' + item.high / maximum * 100 + '%"></span><span class="range-low" style="width:' + item.low / maximum * 100 + '%"></span></div><strong>' + estimateRange(item.low, item.high) + '</strong></div>').join('');
  const example = candidates[0];
  const sample = example?.location.latest;
  const exampleText = example ? '<details class="opportunity-assumptions"><summary>See an example: ' + example.location.city + '</summary><p>' + number(sample.incrementalLeadCapacity) + ' additional qualified leads × 40–70% capture × ' + percent(sample.conversion) + ' booking conversion × ' + money(sample.ticket) + ' average job value. Capped at ' + number(sample.spareJobs) + ' additional jobs.</p><p>' + (state.channel === 'all' ? 'This produces ' : 'The selected channel receives a ' + percent(example.share) + ' modeled demand allocation of this scenario: ') + money(example.low) + '–' + money(example.high) + ' per month.</p></details>' : '';
  element('monthly-opportunity').innerHTML = '<div class="opportunity-layout"><div class="opportunity-main"><h2 id="monthly-title">Monthly revenue opportunity</h2><div class="opportunity-number">' + (high ? estimateRange(low, high) : 'Not modeled') + (high ? ' <small>/ month</small>' : '') + '</div><p class="opportunity-context">Additional revenue scenario · ' + reportingWindow.latestMonth + ' inputs · ' + (state.channel === 'all' ? candidates.length + ' eligible growth ' + (candidates.length === 1 ? 'market' : 'markets') : escapeHtml(channelFor(state.channel).name)) + '</p>' + (high ? '<div class="opportunity-bars">' + graph + '</div><div class="range-legend"><span><i></i>40% capture scenario</span><span><i class="light"></i>Up to 70% capture</span></div>' : '<div class="no-opportunity">No expansion scenario meets the current demo rules in this view. Review the finding below before estimating additional revenue.</div>') + '</div><aside class="opportunity-explainer"><div class="eyebrow">What this means</div><h3>Revenue we could add by capturing more qualified demand.</h3><p>Not guaranteed growth, profit, or a forecast. This is a monthly run-rate scenario based on the final month of your selection — it is not multiplied by the quarter or six-month window.</p><div class="formula-box">Additional qualified leads × 40–70% capture<br>× booking conversion × average job value<small>Capped by spare delivery capacity at each location.</small></div>' + (state.channel !== 'all' ? '<p>This channel receives a modeled share of the same opportunity; channel views do not add extra upside.</p>' : '<p>Only markets with sufficient source quality, healthy conversion and a visibility gap qualify. Potential minus presence is never converted directly into dollars.</p>') + exampleText + '</aside></div>';
}

function renderFilters() {
  element('filters').innerHTML = [['all', 'All locations'], ['growth', 'Growth'], ['attention', 'Attention'], ['gaps', 'Data gaps']].map(([id, label]) => '<button class="filter-button" data-filter="' + id + '" aria-pressed="' + (state.filter === id) + '">' + label + '<span>' + (id === 'all' ? locations.length : locations.filter(location => actionDefinitions[location.action].group === id).length) + '</span></button>').join('');
}

function renderLocations() {
  const selected = locations.find(location => location.id === state.selected);
  visible = selected ? [selected] : filterLocations(locations, state.query, state.filter, state.sort, state.channel);
  element('network-table').hidden = !!selected;
  element('location-detail').hidden = !selected;
  element('locations-heading').textContent = selected ? selected.city + ' · Location performance' : 'Location performance';
  element('location-total').textContent = selected ? selected.region : locations.length;
  element('location-caption').textContent = selected ? 'Location-wide booking health and score components.' : 'Select a city for its full view. Potential = market attractiveness; presence = our visibility (both /100).';
  if (selected) {
    const scoreCard = (key, label) => '<article class="score-detail"><h3>' + label + '</h3><strong class="score-value">' + selected[key].toFixed(0) + '<span class="small-muted"> /100</span></strong>' + selected.scores[key].map(component => '<div class="score-component"><span>' + component.label + '<b>' + component.value.toFixed(0) + '</b></span><div class="score-meter"><i style="width:' + component.value + '%"></i></div><small>' + percent(component.weight) + ' weight</small></div>').join('') + '</article>';
    element('location-detail').innerHTML = '<div class="location-summary"><div class="summary-top"><h3>' + selected.city + ', ' + selected.region + '</h3>' + pill(selected.action) + '</div><div class="operational-grid"><div><span>Qualified leads</span><strong>' + number(selected.leads) + '</strong></div><div><span>Completed bookings</span><strong>' + number(selected.bookings) + '</strong></div><div><span>Booking conversion</span><strong>' + percent(selected.conversion) + '</strong></div></div><p class="location-note">All-channel operational totals for ' + reportingWindow.label + '. Network booking conversion: ' + percent(network.conversion) + '. The three KPIs above follow your channel selection.</p><div class="score-detail-grid">' + scoreCard('potential', 'Potential · market attractiveness') + scoreCard('presence', 'Presence · our visibility') + '</div><p class="location-note">Fictional normalized components, as of ' + reportingWindow.latestMonth + '. Scores remain location-wide even in a channel view. Presence is not market share.</p><button class="inline-button" data-location="all">← Back to all locations</button></div>';
  } else {
    element('location-rows').innerHTML = visible.map(location => {
      const metrics = summarize([location], state.channel);
      return '<tr><td><button class="location-button" data-location="' + location.id + '">' + escapeHtml(location.city) + '<span class="region">' + location.region + '</span></button></td><td title="' + money(metrics.revenue) + '">' + compact(metrics.revenue) + '</td><td class="' + direction(metrics.growth) + '">' + signed(metrics.growth) + '</td><td title="' + money(metrics.spend) + '">' + compact(metrics.spend) + '</td><td title="' + (metrics.roi === null ? 'Source coverage below 50%' : 'Revenue-based ROI, not profit') + '">' + percent(metrics.roi) + '</td><td class="score-cell">' + location.potential.toFixed(0) + '</td><td class="score-cell">' + location.presence.toFixed(0) + '</td><td>' + pill(location.action) + '</td></tr>';
    }).join('');
    element('empty-state').hidden = visible.length > 0;
    element('result-count').textContent = 'Showing ' + visible.length + ' of ' + locations.length + ' locations';
  }
  renderFilters();
  renderPlot();
}

function renderAttention() {
  findings = attentionItems(scope, network);
  element('attention-list').innerHTML = findings.map((item, index) => '<details class="attention-item" data-finding="' + item.location.id + '"' + (state.expanded === item.location.id ? ' open' : '') + '><summary><div class="attention-city"><span>0' + (index + 1) + ' · ' + item.location.city + '</span>' + pill(item.location.action) + '</div><h3>' + escapeHtml(item.headline) + '</h3><p class="teaser">' + (item.location.action === 'diagnose' ? percent(item.location.conversion) + ' booking conversion' : item.location.action === 'verify' ? percent(item.location.coverage) + ' source-match coverage' : 'Potential ' + item.location.potential.toFixed(0) + ' · Presence ' + item.location.presence.toFixed(0)) + '</p><span class="expand-hint">Evidence & reasoning <span class="expand-symbol" aria-hidden="true">+</span></span></summary><div class="attention-evidence"><p>' + escapeHtml(item.finding) + '</p><div class="rule-box"><strong>Why it was flagged</strong><br>' + escapeHtml(item.rule) + '</div><ul>' + item.evidence.map(evidence => '<li>' + escapeHtml(evidence) + '</li>').join('') + '</ul><p><strong>What to do next</strong><br>' + escapeHtml(item.recommendation) + '</p><p class="small-muted">This is a transparent demo rule, not proof of a cause or a guaranteed outcome. It uses location-wide signals, not channel-specific conversion.</p>' + (state.selected ? '' : '<button class="small-button" data-location="' + item.location.id + '">View ' + item.location.city + ' performance ↗</button>') + '</div></details>').join('');
}

function renderPlot() {
  const colors = { growth: '#a18adf', attention: '#dab198', established: '#afbdcb', gaps: '#d3a3b8' };
  element('opportunity-plot').innerHTML = '<span class="quadrant top-left">Improve visibility</span><span class="quadrant top-right">Protect position</span><span class="quadrant bottom-left">Validate demand first</span><span class="quadrant bottom-right">Prioritize efficiency</span>' + visible.map(location => {
    const revenue = metricsFor([location], state.channel).revenue;
    const size = Math.max(11, Math.min(27, 9 + Math.sqrt(revenue / reportingWindow.months) / 40));
    const label = location.city + ': potential ' + location.potential.toFixed(0) + '/100, presence ' + location.presence.toFixed(0) + '/100, revenue ' + money(revenue);
    return '<button class="plot-dot" data-location="' + location.id + '" style="--presence:' + location.presence + '%;--potential:' + location.potential + '%;--size:' + size + 'px;--dot-color:' + colors[actionDefinitions[location.action].group] + '" title="' + escapeHtml(label) + '" aria-label="' + escapeHtml(label) + '">' + (visible.length === 1 || ['phoenix', 'houston', 'denver'].includes(location.id) ? '<span class="dot-label">' + location.city + '</span>' : '') + '</button>';
  }).join('') + (!visible.length ? '<p class="empty-state">No locations match the table filters.</p>' : '');
  element('plot-count').textContent = visible.length + (visible.length === 1 ? ' location' : ' locations');
}

function renderChannels() {
  element('channel-caption').textContent = (state.selected ? scope[0].city : 'All 24 locations') + ' · ' + reportingWindow.label + ' · Select a channel for its full view.';
  element('channels').innerHTML = economicsIds.map(id => {
    const channel = channelFor(id);
    const metrics = metricsFor(scope, id);
    return '<button class="channel-card" data-channel="' + id + '" aria-pressed="' + (state.channel === id) + '"><div class="channel-name">' + escapeHtml(channel.name) + '<span aria-hidden="true">↗</span></div><div class="channel-revenue">' + compact(metrics.revenue) + '</div><div class="channel-sub">Revenue</div><div class="channel-values"><span>Spend <strong>' + compact(metrics.spend) + '</strong></span><span>ROI <strong>' + percent(metrics.roi) + '</strong></span></div></button>';
  }).join('');
  const selected = channelFor(state.channel);
  element('channel-detail').innerHTML = state.channel === 'all' ? '' : '<div class="channel-detail-box"><h3>' + escapeHtml(selected.name) + ' performance</h3><p>' + escapeHtml(selected.description) + ' Your KPIs, trend, opportunity allocation and location revenue now show this channel.</p>' + (selected.ids.length > 1 ? '<div class="subchannel-buttons">' + selected.ids.map(id => {
    const channel = channelFor(id);
    return '<button class="small-button" data-channel="' + id + '">' + escapeHtml(channel.name) + ' ↗</button>';
  }).join('') + '</div>' : '<p>Cost basis: ' + escapeHtml(selected.cost) + '.</p>') + '<button class="inline-button" data-channel="all">← Return to all-channel performance</button></div>';
  const full = metricsFor(scope);
  element('channel-note').textContent = compact(full.unresolved) + ' of recorded revenue has an unresolved source and remains in All channels only. The six categories are mutually exclusive; Paid and Social group filters overlap. ROI is revenue-based, not profit; matching a source does not establish causation.';
}

function renderDashboard() {
  reportingWindow = resolveWindow(state.range, state.period, state.comparison);
  locations = getDataset(state.range, state.period, state.comparison);
  scope = state.selected ? locations.filter(location => location.id === state.selected) : locations;
  network = summarize(locations);
  totals = summarize(scope, state.channel);
  syncControls();
  renderHeading();
  renderKpis();
  renderTrend();
  renderOpportunity();
  renderLocations();
  renderAttention();
  renderChannels();
}

function focusView() {
  element('view-heading').focus({ preventScroll: true });
  element('scope-heading').scrollIntoView({ behavior: 'instant', block: 'start' });
}

function openLocation(id) {
  if (id !== 'all' && !locations.some(location => location.id === id)) throw new Error('Unknown location.');
  state.selected = id === 'all' ? null : id;
  state.expanded = null;
  renderDashboard();
  focusView();
  element('announcer').textContent = id === 'all' ? 'Full network view restored.' : scope[0].city + ' performance view opened. All dashboard sections updated.';
}

function openChannel(id) {
  if (!channelFor(id)) throw new Error('Unknown channel.');
  state.channel = id;
  renderDashboard();
  focusView();
  element('announcer').textContent = channelFor(id).name + ' performance view opened.';
}

document.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.location) { openLocation(target.dataset.location); return; }
  if (target.dataset.channel) { openChannel(target.dataset.channel); return; }
  if (target.dataset.range) {
    state.range = target.dataset.range;
    state.period = windows[state.range][0].id;
    state.expanded = null;
    renderDashboard();
    element('announcer').textContent = reportingWindow.label + ' compared with ' + reportingWindow.previousLabel;
  }
  if (target.dataset.metric) {
    state.metric = target.dataset.metric;
    renderKpis(); renderTrend();
    document.querySelector('[data-metric="' + state.metric + '"]').focus({ preventScroll: true });
  }
  if (target.dataset.filter) {
    state.filter = target.dataset.filter; renderLocations();
    document.querySelector('[data-filter="' + state.filter + '"]').focus({ preventScroll: true });
  }
  if (target.hasAttribute('data-methodology')) element('methodology-dialog').showModal();
  if (target.hasAttribute('data-close')) element('methodology-dialog').close();
});

document.addEventListener('toggle', event => {
  if (!event.target.matches?.('details[data-finding]')) return;
  if (event.target.open) state.expanded = event.target.dataset.finding;
  else if (state.expanded === event.target.dataset.finding) state.expanded = null;
}, true);

element('period').addEventListener('change', event => { state.period = event.target.value; state.expanded = null; renderDashboard(); });
element('comparison').addEventListener('change', event => { state.comparison = event.target.value; state.expanded = null; renderDashboard(); });
element('location-select').addEventListener('change', event => openLocation(event.target.value));
element('channel-select').addEventListener('change', event => openChannel(event.target.value));
element('search').addEventListener('input', event => { state.query = event.target.value; renderLocations(); });
element('sort').addEventListener('change', event => { state.sort = event.target.value; renderLocations(); });
element('clear-filters').addEventListener('click', () => { state.query = ''; state.filter = 'all'; element('search').value = ''; renderLocations(); element('search').focus(); });

function assertInput(input, allowed) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !allowed.includes(key))) throw new Error('Invalid input fields.');
}

function configureView(input) {
  assertInput(input, ['range', 'period', 'comparison', 'channel', 'query', 'filter', 'sort', 'metric']);
  const candidate = { ...state, ...input };
  if (input.range !== undefined && input.period === undefined && input.range !== state.range) candidate.period = windows[input.range]?.[0]?.id;
  resolveWindow(candidate.range, candidate.period, candidate.comparison);
  if (!channelFor(candidate.channel)) throw new Error('Unknown channel.');
  if (typeof candidate.query !== 'string' || candidate.query.length > 100) throw new Error('Invalid query.');
  if (!['all', 'growth', 'attention', 'gaps'].includes(candidate.filter)) throw new Error('Invalid filter.');
  if (!['opportunity', 'revenue', 'growth', 'potential', 'name'].includes(candidate.sort)) throw new Error('Invalid sort.');
  if (!['revenue', 'spend', 'roi'].includes(candidate.metric)) throw new Error('Invalid metric.');
  Object.assign(state, candidate, { expanded: null });
  renderDashboard();
  return snapshot();
}

function snapshot() {
  const ranges = scope.map(location => opportunityFor(location, state.channel));
  return {
    demo: true, ...state, window: { current: reportingWindow.label, previous: reportingWindow.previousLabel, months: reportingWindow.months },
    scopeCount: scope.length, visibleCount: visible.length,
    metrics: { revenue: totals.revenue, spend: totals.spend, roi: totals.roi, revenueChange: totals.growth, roiChangePercentagePoints: totals.roiChange == null ? null : totals.roiChange * 100 },
    opportunity: { low: ranges.reduce((sum, item) => sum + item.low, 0), high: ranges.reduce((sum, item) => sum + item.high, 0), basis: reportingWindow.latestMonth, unit: 'additional revenue per month' },
    locations: visible.map(location => ({ id: location.id, city: location.city, action: location.action })),
    findings: findings.map(item => ({ locationId: item.location.id, headline: item.headline, rule: item.rule })),
  };
}

function registerAgentTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const tools = [
    { name: 'read_network_view', description: 'Read the active network or full-page location/channel view, KPI totals, comparison windows and monthly opportunity basis.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute(input) { assertInput(input, []); return snapshot(); } },
    { name: 'set_network_view', description: 'Configure calendar window, comparison, channel, chart metric and table filters. Omit period when changing range to use its latest complete period. Period IDs are integer month ordinals (year × 12 + zero-based month). Keeps the selected location.', inputSchema: { type: 'object', properties: { range: { type: 'string', enum: ['month', 'quarter', 'half'] }, period: { type: 'string', enum: [...new Set(Object.values(windows).flat().map(option => option.id))] }, comparison: { type: 'string', enum: ['previous', 'year'] }, channel: { type: 'string', enum: channelViews.map(channel => channel.id) }, query: { type: 'string', maxLength: 100 }, filter: { type: 'string', enum: ['all', 'growth', 'attention', 'gaps'] }, sort: { type: 'string', enum: ['opportunity', 'revenue', 'growth', 'potential', 'name'] }, metric: { type: 'string', enum: ['revenue', 'spend', 'roi'] } }, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: configureView },
    { name: 'open_location_details', description: 'Navigate the entire dashboard to a location, not a popup. Use all to return to the network. Keeps the active channel and reporting window.', inputSchema: { type: 'object', properties: { locationId: { type: 'string' } }, required: ['locationId'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute(input) { assertInput(input, ['locationId']); openLocation(input.locationId); return snapshot(); } },
    { name: 'open_channel_view', description: 'Open a full channel performance view within the current location or network scope. All sections use the same channel.', inputSchema: { type: 'object', properties: { channelId: { type: 'string', enum: channelViews.map(channel => channel.id) } }, required: ['channelId'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute(input) { assertInput(input, ['channelId']); openChannel(input.channelId); return snapshot(); } },
    { name: 'expand_attention_finding', description: 'Expand a currently available attention card in place to show evidence, exact rule and next action without navigating away.', inputSchema: { type: 'object', properties: { locationId: { type: 'string' } }, required: ['locationId'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute(input) { assertInput(input, ['locationId']); const finding = findings.find(item => item.location.id === input.locationId); if (!finding) throw new Error('No attention finding for that location in the current view.'); state.expanded = input.locationId; renderAttention(); return { locationId: input.locationId, expanded: true, headline: finding.headline, rule: finding.rule, evidence: finding.evidence, recommendation: finding.recommendation }; } },
  ];
  for (const tool of tools) {
    try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(error => console.warn('Optional agent tool unavailable:', error)); }
    catch (error) { console.warn('Optional agent tool unavailable:', error); }
  }
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}

try { renderDashboard(); registerAgentTools(); }
catch (error) { element('kpis').innerHTML = '<p role="alert">The demo could not load. Refresh the page to try again.</p>'; console.error('Demo initialization failed:', error); }
