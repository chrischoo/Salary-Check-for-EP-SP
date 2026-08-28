// MOM Salary Benchmarks (Approximated based on 2024/2025/2026/2027 criteria)
// These benchmarks increase with age up to 45.

const AGE_RANGE = { MIN: 23, MAX: 45 };

const PASS_TYPES = {
  EP: 'Employment Pass',
  S_PASS: 'S Pass',
};

const SECTORS = {
  GENERAL: 'All Other Sectors',
  FINANCIAL: 'Financial Services',
};

// Official MOM Minimum Qualifying Salaries (Projected for 2026/2027)
const SALARY_BENCHMARKS = {
  2026: {
    EP: {
      [SECTORS.GENERAL]: { min: 5600, max: 10700 },
      [SECTORS.FINANCIAL]: { min: 6200, max: 11800 },
    },
    S_PASS: {
      [SECTORS.GENERAL]: { min: 3300, max: 4800 },
      [SECTORS.FINANCIAL]: { min: 3800, max: 5650 },
    },
  },
  2027: {
    EP: {
      [SECTORS.GENERAL]: { min: 6000, max: 11500 },
      [SECTORS.FINANCIAL]: { min: 6600, max: 12700 },
    },
    S_PASS: {
      [SECTORS.GENERAL]: { min: 3600, max: 5100 },
      [SECTORS.FINANCIAL]: { min: 4000, max: 5650 },
    },
  },
};

function getQualifyingSalary(passType, age, sector, year) {
  const yearData = SALARY_BENCHMARKS[year] || SALARY_BENCHMARKS[2026];
  const passData = yearData[passType];
  const sectorData = passData[sector] || passData[SECTORS.GENERAL];

  const baseSalary = sectorData.min;
  const ceilingSalary = sectorData.max;

  if (age <= AGE_RANGE.MIN) return baseSalary;
  if (age >= AGE_RANGE.MAX) return ceilingSalary;

  const percentage = (age - AGE_RANGE.MIN) / (AGE_RANGE.MAX - AGE_RANGE.MIN);
  return Math.round(baseSalary + (ceilingSalary - baseSalary) * percentage);
}

// State
const state = {
  age: 30,
  applicationYear: 2026,
  sector: SECTORS.GENERAL,
  salary: '5500',
};

const els = {
  yearToggle: document.getElementById('yearToggle'),
  ageSlider: document.getElementById('ageSlider'),
  ageValue: document.getElementById('ageValue'),
  sectorGrid: document.getElementById('sectorGrid'),
  salaryInput: document.getElementById('salaryInput'),
  assessBtn: document.getElementById('assessBtn'),
  resultsSection: document.getElementById('resultsSection'),
  resultsGrid: document.getElementById('resultsGrid'),
  refYearBadge: document.getElementById('refYearBadge'),
};

function renderYearToggle() {
  els.yearToggle.querySelectorAll('.year-btn').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.year) === state.applicationYear);
  });
}

function renderSectorGrid() {
  els.sectorGrid.querySelectorAll('.sector-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.sector === state.sector);
  });
}

function resultPanelHtml(data) {
  const isPass = data.eligible;
  const status = isPass ? 'pass' : 'fail';
  const barWidth = Math.min(100, Math.max(0, (data.salary / data.threshold) * 100));
  const detail = isPass
    ? `Your salary is $${data.diff.toLocaleString()} above the minimum threshold for your age group and sector.`
    : `You are $${Math.abs(data.diff).toLocaleString()} short of the minimum $${data.threshold.toLocaleString()} qualifier.`;
  const checkIcon = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const crossIcon = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  return `
    <div class="result-panel ${status}">
      <div class="result-panel-top">
        <div>
          <h4 class="result-panel-type">${data.passType}</h4>
          <div class="result-badge ${status}">
            ${isPass ? checkIcon : crossIcon}
            ${isPass ? 'Pass' : 'Below Minimum'}
          </div>
        </div>
        <div class="result-assessment ${status}">
          <p class="result-assessment-label">Assessment</p>
          <p class="result-assessment-value">${isPass ? 'Salary meets minimum criteria' : 'Salary does not meet minimum criteria'}</p>
        </div>
      </div>
      <div class="result-threshold-box">
        <div class="result-threshold-row">
          <span class="result-threshold-label">Qualifying Threshold</span>
          <span class="result-threshold-value">$${data.threshold.toLocaleString()}</span>
        </div>
        <div class="result-bar-track">
          <div class="result-bar-fill ${status}" style="width: ${barWidth}%"></div>
        </div>
      </div>
      <p class="result-detail">${detail}</p>
    </div>
  `;
}

function computeResults() {
  const numericSalary = parseFloat(state.salary) || 0;
  const epThreshold = getQualifyingSalary('EP', state.age, state.sector, state.applicationYear);
  const sPassThreshold = getQualifyingSalary('S_PASS', state.age, state.sector, state.applicationYear);

  return {
    ep: {
      passType: PASS_TYPES.EP,
      threshold: epThreshold,
      salary: numericSalary,
      eligible: numericSalary >= epThreshold,
      diff: numericSalary - epThreshold,
    },
    sPass: {
      passType: PASS_TYPES.S_PASS,
      threshold: sPassThreshold,
      salary: numericSalary,
      eligible: numericSalary >= sPassThreshold,
      diff: numericSalary - sPassThreshold,
    },
  };
}

function renderResults() {
  const results = computeResults();
  els.refYearBadge.textContent = `Ref Year: ${state.applicationYear}`;
  els.resultsGrid.innerHTML = resultPanelHtml(results.ep) + resultPanelHtml(results.sPass);
}

// Event listeners
els.yearToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.year-btn');
  if (!btn) return;
  state.applicationYear = Number(btn.dataset.year);
  renderYearToggle();
  if (!els.resultsSection.hidden) renderResults();
});

els.ageSlider.addEventListener('input', (e) => {
  state.age = parseInt(e.target.value, 10);
  els.ageValue.textContent = state.age;
  if (!els.resultsSection.hidden) renderResults();
});

els.sectorGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.sector-btn');
  if (!btn) return;
  state.sector = btn.dataset.sector;
  renderSectorGrid();
  if (!els.resultsSection.hidden) renderResults();
});

els.salaryInput.addEventListener('input', (e) => {
  state.salary = e.target.value;
  if (!els.resultsSection.hidden) renderResults();
});

els.assessBtn.addEventListener('click', () => {
  renderResults();
  els.resultsSection.hidden = false;
});

// Init
renderYearToggle();
renderSectorGrid();
