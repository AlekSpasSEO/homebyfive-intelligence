const siteRoot = document.body.dataset.root || '.';
const currentPage = document.body.dataset.page || 'home';
const headerTarget = document.querySelector('[data-site-header]');
const footerTarget = document.querySelector('[data-site-footer]');
const navigationItems = [
  ['product', 'Product', 'product/'],
  ['audience', 'Who it is for', 'who-its-for/'],
  ['pricing', 'Pricing', 'pricing/'],
  ['insights', 'Insights', 'insights/'],
  ['about', 'Why Home by Five', 'about/'],
];

if (headerTarget) {
  headerTarget.outerHTML = '<header class="site-header"><div class="container nav-wrap"><a class="logo" href="' + siteRoot + '/" aria-label="Home by Five home"><span class="logo-mark" aria-hidden="true">h5</span>home by five</a><button class="nav-toggle" data-nav-toggle aria-label="Open navigation" aria-expanded="false">☰</button><nav class="site-nav" data-navigation aria-label="Primary navigation">' + navigationItems.map(([id, label, path]) => '<a href="' + siteRoot + '/' + path + '"' + (currentPage === id ? ' aria-current="page"' : '') + '>' + label + '</a>').join('') + '<a class="nav-cta" href="' + siteRoot + '/demo/">See the demo</a></nav></div></header>';
}

if (footerTarget) {
  footerTarget.outerHTML = '<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><a class="logo" href="' + siteRoot + '/"><span class="logo-mark" aria-hidden="true">h5</span>home by five</a><p>Marketing intelligence for multi-location service businesses. Clear numbers, explicit decisions, and the right amount of support.</p></div><div class="footer-col"><h3>Product</h3><a href="' + siteRoot + '/product/">How it works</a><a href="' + siteRoot + '/demo/">Interactive demo</a><a href="' + siteRoot + '/pricing/">Pricing</a></div><div class="footer-col"><h3>Company</h3><a href="' + siteRoot + '/about/">Why Home by Five</a><a href="' + siteRoot + '/who-its-for/">Who it is for</a><a href="' + siteRoot + '/insights/">Insights</a></div><div class="footer-col"><h3>Choose</h3><a href="' + siteRoot + '/start/?plan=numbers">Numbers & Decisions</a><a href="' + siteRoot + '/start/?plan=strategy">Add Strategy</a><a href="' + siteRoot + '/start/?plan=human">Add Human Touch</a></div></div><div class="footer-bottom"><span>© 2026 Home by Five</span><span>Make the decision. Finish the day.</span></div></div></footer>';
}

const navigationToggle = document.querySelector('[data-nav-toggle]');
const navigation = document.querySelector('[data-navigation]');

navigationToggle?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  navigationToggle.setAttribute('aria-expanded', String(open));
});

document.addEventListener('click', event => {
  if (!navigation?.classList.contains('open')) return;
  if (event.target.closest('[data-navigation], [data-nav-toggle]')) return;
  navigation.classList.remove('open');
  navigationToggle.setAttribute('aria-expanded', 'false');
});

const planDefinitions = {
  numbers: {
    name: 'Numbers & Decisions',
    price: '$100',
    summary: 'A trusted performance view and a ranked answer about what needs attention.',
    features: ['Network, location, and channel scorecards', 'Revenue-based performance and source gaps', 'Prioritized decision queue', 'Monthly decision summary'],
  },
  strategy: {
    name: 'Numbers, Decisions & Strategy',
    price: '$500',
    summary: 'The decision system plus a practical strategy for what to test, change, or protect.',
    features: ['Everything in Numbers & Decisions', 'Prioritized monthly strategy', 'Location and channel opportunity plans', 'Experiment and measurement guidance'],
  },
  human: {
    name: 'Numbers, Decisions, Strategy & Human Touch',
    price: '$1,000',
    summary: 'The complete system with a human strategist helping you interpret and act on the evidence.',
    features: ['Everything in Strategy', 'A human strategist in the loop', 'Live decision reviews', 'Custom analysis and written follow-through'],
  },
};

const planButtons = [...document.querySelectorAll('[data-plan-choice]')];
const planInput = document.querySelector('[name="plan"]');
const summaryName = document.querySelector('[data-summary-name]');
const summaryPrice = document.querySelector('[data-summary-price]');
const summaryDescription = document.querySelector('[data-summary-description]');
const summaryFeatures = document.querySelector('[data-summary-features]');

function selectPlan(planId) {
  const plan = planDefinitions[planId] || planDefinitions.strategy;
  if (planInput) planInput.value = planId;
  planButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.planChoice === planId)));
  if (summaryName) summaryName.textContent = plan.name;
  if (summaryPrice) summaryPrice.textContent = plan.price;
  if (summaryDescription) summaryDescription.textContent = plan.summary;
  if (summaryFeatures) summaryFeatures.innerHTML = plan.features.map(feature => '<li>' + feature + '</li>').join('');
}

if (planButtons.length) {
  const requestedPlan = new URLSearchParams(window.location.search).get('plan');
  selectPlan(planDefinitions[requestedPlan] ? requestedPlan : 'strategy');
  planButtons.forEach(button => button.addEventListener('click', () => selectPlan(button.dataset.planChoice)));
}

const requestForm = document.querySelector('[data-plan-form]');
requestForm?.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(requestForm);
  const plan = planDefinitions[form.get('plan')] || planDefinitions.strategy;
  const request = [
    'Home by Five subscription request',
    '',
    'Plan: ' + plan.name + ' (' + plan.price + '/month)',
    'Name: ' + form.get('name'),
    'Company: ' + form.get('company'),
    'Work email: ' + form.get('email'),
    'Locations: ' + form.get('locations'),
    'Main question: ' + (form.get('question') || 'Not provided'),
  ].join('\n');
  const result = document.querySelector('[data-form-result]');
  result.hidden = false;
  result.querySelector('pre').textContent = request;
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  result.querySelector('button').onclick = async () => {
    await navigator.clipboard.writeText(request);
    result.querySelector('button').textContent = 'Copied';
  };
});
