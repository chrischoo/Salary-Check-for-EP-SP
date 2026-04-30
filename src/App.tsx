/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  Building2, 
  User, 
  Banknote,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  PASS_TYPES, 
  SECTORS, 
  getQualifyingSalary, 
  AGE_RANGE,
  SECTOR_BENCHMARKS
} from './constants';

export default function App() {
  const [age, setAge] = useState<number>(30);
  const [applicationYear, setApplicationYear] = useState<number>(2026);
  const [sector, setSector] = useState<string>(SECTORS.GENERAL);
  const [salary, setSalary] = useState<string>('5500');
  const [showResults, setShowResults] = useState(false);

  const numericSalary = parseFloat(salary) || 0;

  const results = useMemo(() => {
    const epThreshold = getQualifyingSalary('EP', age, sector, applicationYear);
    const sPassThreshold = getQualifyingSalary('S_PASS', age, sector, applicationYear);

    return {
      ep: {
        passType: PASS_TYPES.EP,
        threshold: epThreshold,
        eligible: numericSalary >= epThreshold,
        diff: numericSalary - epThreshold
      },
      sPass: {
        passType: PASS_TYPES.S_PASS,
        threshold: sPassThreshold,
        eligible: numericSalary >= sPassThreshold,
        diff: numericSalary - sPassThreshold
      }
    };
  }, [age, sector, numericSalary, applicationYear]);

  const handleCheck = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-100">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="font-bold tracking-tight text-lg">EP & S Pass Salary Calculator</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Info Panel */}
        <aside className="hidden lg:flex w-96 bg-slate-100 p-10 border-r border-slate-200 flex-col gap-8 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4 tracking-tight">Salary Check for EP and S Pass Eligibility</h1>
            <p className="text-slate-600 leading-relaxed text-sm">
              This tool provides a preliminary estimate based on current Ministry of Manpower (MOM) salary benchmarks and the COMPASS framework.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 group hover:border-blue-400 transition-colors">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-700 mb-2">Employment Pass (EP)</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                For PMETs. Qualifying salary starts at <span className="font-bold">$5,600 - $6,000</span> ($6,200 - $6,600 for Finance), increasing with age up to <span className="font-bold">$10,700 - $11,500</span> ($11,800 - $12,700 for Finance).
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 group hover:border-emerald-400 transition-colors">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">S Pass</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                For mid-level skilled staff. Qualifying salary starts at <span className="font-bold">$3,300 - $3,500</span> ($3,850 - $4,100 for Finance), increasing with age up to <span className="font-bold">$4,800 - $5,000</span> ($5,500 - $5,800 for Finance).
              </p>
            </div>
          </div>

          <div className="mt-8 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              This Salary Check tool is used to check against the salary range published for your target jobs on MyCareersFuture.
            </p>
          </div>

          <div className="mt-auto pt-8 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
            <Clock size={12} />
            <span>Updated based on 2026 and 2027 EP and S Pass Criteria</span>
          </div>
        </aside>

        {/* Main Calculator Area */}
        <main className="flex-1 bg-white overflow-y-auto p-6 md:p-12">
          <div className="max-w-2xl mx-auto space-y-10">
            
            <section className="space-y-8">
              {/* Application Year */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Intended Year of Application</label>
                <div className="flex gap-4">
                  {[2026, 2027].map((year) => (
                    <button
                      key={year}
                      onClick={() => setApplicationYear(year)}
                      className={`flex-1 py-3 rounded-lg border text-sm font-bold transition-all ${
                        applicationYear === year
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Qualifying salaries are set to increase in 2027 based on revised MOM benchmarks.
                </p>
              </div>

              {/* Age Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="text-sm font-bold text-slate-700 block">Candidate Age</label>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">At point of application</span>
                  </div>
                  <span className="text-2xl font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{age}</span>
                </div>
                <input 
                  type="range" 
                  min="23" 
                  max="60" 
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span>Entry Level (23)</span>
                  <span>Mid Career (40)</span>
                  <span>Senior (60+)</span>
                </div>
              </div>

              {/* Sector Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Employer Sector</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.values(SECTORS).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSector(s)}
                      className={`px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all ${
                        sector === s 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Monthly Fixed Salary (SGD)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-medium">$</span>
                  <input 
                    type="number" 
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 5500"
                    className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none text-2xl font-bold tracking-tight shadow-inner"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleCheck}
                className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:shadow-none"
              >
                Assess Eligibility
                <ArrowRight size={20} />
              </motion.button>
            </section>

            {/* Results Section */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 pt-10 border-t border-slate-100"
                >
                  <h2 className="text-xl font-bold tracking-tight text-slate-800 flex items-center justify-between font-sans">
                    Preliminary Results
                    <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded tracking-widest uppercase">Ref Year: {applicationYear}</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResultPanel data={results.ep} />
                    <ResultPanel data={results.sPass} />
                  </div>

                  {/* Criteria Explanation Section */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 rounded-lg text-white">
                        <Info size={20} />
                      </div>
                      <h3 className="font-bold text-lg tracking-tight text-slate-900">Understanding the Criteria</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-bold text-sm text-blue-700 uppercase tracking-widest">How Age & Sector Matter</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          MOM benchmarks increase with age because more senior candidates are expected to bring more experience and command higher salaries. The <span className="font-bold">Financial Services</span> sector has a higher threshold due to the sector's higher wage levels.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-sm text-emerald-700 uppercase tracking-widest">Beyond Salary (COMPASS)</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Salary is only the first step. EP applications are also scored on the <span className="font-bold">Points-Based Framework (COMPASS)</span>, considering qualifications, candidate diversity, and local employment support.
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                       <h4 className="font-bold text-sm text-slate-800 mb-3">Expected Ranges by Seniority</h4>
                       <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-white border border-slate-200 rounded-lg">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Junior</p>
                            <p className="text-sm font-bold text-slate-700">$4.4k - $6.5k</p>
                          </div>
                          <div className="p-3 bg-white border border-slate-200 rounded-lg">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Mid-Level</p>
                            <p className="text-sm font-bold text-slate-700">$6.5k - $12k</p>
                          </div>
                          <div className="p-3 bg-white border border-slate-200 rounded-lg">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Senior/Exec</p>
                            <p className="text-sm font-bold text-slate-700">&gt;$12k</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 text-[10px] px-8 py-4 flex justify-between uppercase tracking-[0.2em] font-medium shrink-0">
        <span>© {new Date().getFullYear()} NTU NBS GSCDO. Salary Check for EP/SP Eligibility</span>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
        </div>
      </footer>
    </div>
  );
}

function ResultPanel({ data }: { data: any }) {
  const isPass = data.eligible;
  const statusColor = isPass ? 'emerald' : 'rose';

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all ${
      isPass ? 'bg-emerald-50/20 border-emerald-500/20 shadow-emerald-100/50' : 'bg-rose-50/20 border-rose-500/20 shadow-rose-100/50'
    } shadow-lg`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{data.passType}</h4>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
            isPass ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            {isPass ? <CheckCircle2 size={12} strokeWidth={3} /> : <XCircle size={12} strokeWidth={3} />}
            {isPass ? 'Pass' : 'Below Minimum'}
          </div>
        </div>
        <div className={`text-right ${isPass ? 'text-emerald-700' : 'text-rose-700'}`}>
          <p className="text-[10px] font-bold uppercase opacity-60 font-sans">Assessment</p>
          <p className="font-black text-sm leading-tight uppercase tracking-tight max-w-[150px] ml-auto">
            {isPass ? 'Salary meets minimum criteria' : 'Salary does not meet minimum criteria'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Qualifying Threshold</span>
            <span className="text-sm font-black text-slate-900">${data.threshold.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${isPass ? 'bg-emerald-500' : 'bg-rose-500'}`} 
              style={{ width: `${Math.min(100, (data.threshold / 15000) * 100)}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
          {isPass 
            ? `Your salary is $${data.diff.toLocaleString()} above the minimum threshold for your age group and sector.`
            : `You are $${Math.abs(data.diff).toLocaleString()} short of the minimum $${data.threshold.toLocaleString()} qualifier.`}
        </p>
      </div>
    </div>
  );
}
