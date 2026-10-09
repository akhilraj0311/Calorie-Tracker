import React, { useState } from 'react';
import { WEEKLY_DATA } from '../data/mockData';
import { UserProfile } from '../types/nutrition';

interface WeeklyInsightsScreenProps {
  userProfile: UserProfile;
}

export const WeeklyInsightsScreen: React.FC<WeeklyInsightsScreenProps> = ({ userProfile }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [hoveredCalorieDay, setHoveredCalorieDay] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const weekLabels = [
    'Oct 14 – Oct 20, 2024',
    'Oct 07 – Oct 13, 2024',
    'Sep 30 – Oct 06, 2024',
  ];

  const currentWeekLabel = weekLabels[weekOffset] || 'Oct 14 – Oct 20, 2024';

  const handleExportClick = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setShowReportModal(true);
      setTimeout(() => setExportComplete(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-28 pt-2 space-y-4">
      {/* Week Selector Header */}
      <div className="flex flex-col items-center justify-center pt-1 text-center">
        <div className="inline-flex items-center gap-3 bg-[#f2f3ff] px-4 py-1.5 rounded-full shadow-sm border border-[#e2e7ff]">
          <button
            aria-label="Previous week"
            onClick={() => setWeekOffset((prev) => Math.min(weekLabels.length - 1, prev + 1))}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#6c7a71] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors active:scale-90"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <span className="font-headline-sm text-[15px] text-[#131b2e] font-semibold tracking-tight">
            {currentWeekLabel}
          </span>
          <button
            aria-label="Next week"
            onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
            disabled={weekOffset === 0}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors active:scale-90 ${
              weekOffset === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'text-[#6c7a71] hover:text-[#131b2e] hover:bg-[#eaedff]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <p className="font-label-sm text-[11px] text-[#3c4a42] font-medium">
            7 of 7 Days Recorded • Complete Cycle
          </p>
        </div>
      </div>

      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Calories Avg */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e7ff] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#6ffbbe]/20 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#6c7a71] font-semibold">
                Calories Avg
              </span>
              <span className="material-symbols-outlined text-[#006c49] text-[18px]">
                local_fire_department
              </span>
            </div>
            <div className="font-headline-lg text-[24px] text-[#131b2e] font-bold tracking-tight">
              2,042
            </div>
            <div className="font-label-sm text-[11px] text-[#3c4a42]">kcal / day</div>
          </div>
          <div className="mt-3 pt-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#006c49] text-[11px] font-semibold">
              <span>97% Compliant</span>
            </div>
          </div>
        </div>

        {/* Protein Avg */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e7ff] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#ffddb8]/30 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#6c7a71] font-semibold">
                Protein Avg
              </span>
              <span className="material-symbols-outlined text-[#e29100] text-[18px]">
                fitness_center
              </span>
            </div>
            <div className="font-headline-lg text-[24px] text-[#131b2e] font-bold tracking-tight">
              132<span className="font-headline-sm text-[16px] font-semibold text-[#3c4a42] ml-0.5">g</span>
            </div>
            <div className="font-label-sm text-[11px] text-[#3c4a42]">per day</div>
          </div>
          <div className="mt-3 pt-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#855300] font-semibold text-[11px]">
              <span>+8g vs target</span>
            </div>
          </div>
        </div>

        {/* Hydration */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e7ff] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#acedff]/40 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#6c7a71] font-semibold">
                Hydration
              </span>
              <span className="material-symbols-outlined text-[#00687a] text-[18px]">
                water_drop
              </span>
            </div>
            <div className="font-headline-lg text-[24px] text-[#131b2e] font-bold tracking-tight">
              2.5<span className="font-headline-sm text-[16px] font-semibold text-[#3c4a42] ml-0.5">L</span>
            </div>
            <div className="font-label-sm text-[11px] text-[#3c4a42]">daily mean</div>
          </div>
          <div className="mt-3 pt-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#00687a] font-semibold text-[11px]">
              <span>83% of 3.0L goal</span>
            </div>
          </div>
        </div>

        {/* Adherence */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e7ff] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#6ffbbe]/30 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#6c7a71] font-semibold">
                Adherence
              </span>
              <span className="material-symbols-outlined text-[#006c49] text-[18px]">
                verified
              </span>
            </div>
            <div className="font-headline-lg text-[24px] text-[#006c49] font-bold tracking-tight">
              94%
            </div>
            <div className="font-label-sm text-[11px] text-[#3c4a42]">weekly score</div>
          </div>
          <div className="mt-3 pt-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#005236] font-semibold text-[11px]">
              <span>Optimal Level</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calorie & Metabolic Compliance Bar Chart */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e7ff] flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-headline-sm text-[15px] text-[#131b2e] font-bold tracking-tight">
              Calorie &amp; Metabolic Compliance
            </h2>
            <p className="font-body-sm text-[12px] text-[#3c4a42]">
              Daily caloric intake relative to 2,100 kcal target
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
              <span className="font-label-sm text-[11px] text-[#3c4a42]">Target</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e29100]"></span>
              <span className="font-label-sm text-[11px] text-[#3c4a42]">+Surplus</span>
            </div>
          </div>
        </div>

        {/* The Graphic Bar Canvas */}
        <div className="relative w-full pt-6 pb-2">
          <div className="relative h-44 w-full flex items-end justify-between px-1">
            {/* Target 2,100 dashed reference line */}
            <div className="absolute inset-x-0 top-[28%] flex items-center pointer-events-none z-10">
              <div
                className="w-full h-[1.5px] bg-[#bbcabf]/60"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #6c7a71 40%, rgba(255, 255, 255, 0) 0%)',
                  backgroundPosition: 'top',
                  backgroundSize: '8px 1px',
                  backgroundRepeat: 'repeat-x',
                }}
              />
              <span className="absolute right-0 -top-3.5 bg-white px-1.5 py-0.5 rounded font-label-sm text-[10px] text-[#6c7a71] font-semibold tracking-wider border border-[#e2e7ff]">
                GOAL 2,100
              </span>
            </div>

            {/* Daily Bars */}
            {WEEKLY_DATA.map((item) => {
              const isSurplus = item.calories > item.target;
              const barHeightPx = Math.round((item.calories / 2400) * 150);
              const isWed = item.day === 'Wed';

              return (
                <div
                  key={item.day}
                  onMouseEnter={() => setHoveredCalorieDay(item.day)}
                  onMouseLeave={() => setHoveredCalorieDay(null)}
                  className="flex flex-col items-center flex-1 z-20 group cursor-pointer"
                >
                  <span
                    className={`font-label-sm text-[10px] font-semibold transition-opacity mb-1 ${
                      isSurplus ? 'text-[#e29100]' : 'text-[#3c4a42]'
                    } ${hoveredCalorieDay === item.day ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {item.calories}
                  </span>
                  <div
                    className={`w-7 rounded-t-lg transition-transform duration-300 group-hover:scale-y-105 origin-bottom ${
                      isSurplus ? 'bg-[#e29100]' : 'bg-[#10b981]'
                    }`}
                    style={{ height: `${barHeightPx}px` }}
                  />
                  <span
                    className={`font-label-sm text-[12px] mt-2 ${
                      isWed ? 'font-bold text-[#006c49]' : 'font-medium text-[#3c4a42]'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Within target range summary */}
        <div className="mt-3 pt-3 flex items-center justify-between bg-[#f2f3ff] rounded-lg p-2.5 border border-[#e2e7ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[20px]">insights</span>
            <span className="font-body-sm text-[12px] text-[#131b2e] font-medium">
              Within target range (±5%): <strong className="text-[#006c49]">4 of 7 days</strong>
            </span>
          </div>
          <span className="font-label-sm text-[11px] text-[#3c4a42] font-semibold">
            Delta: -58 kcal
          </span>
        </div>
      </div>

      {/* Hydration Reservoir Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e7ff] flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-headline-sm text-[15px] text-[#131b2e] font-bold tracking-tight">
                Hydration Reservoir
              </h2>
              <span className="material-symbols-outlined text-[#00687a] text-[18px]">
                humidity_mid
              </span>
            </div>
            <p className="font-body-sm text-[12px] text-[#3c4a42]">
              Total: <span className="font-semibold text-[#131b2e]">17.8 Litres</span> (7/7 days
              logged)
            </p>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#acedff]/40 text-[#001f26] text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[14px]">star</span>
            <span>Fri (3.0L Peak)</span>
          </div>
        </div>

        <div className="relative w-full pt-4 pb-1">
          <div className="relative h-32 w-full flex items-end justify-between px-2">
            {/* 3.0L Goal Line */}
            <div className="absolute inset-x-0 top-[15%] flex items-center pointer-events-none z-10">
              <div
                className="w-full h-[1px] bg-[#00687a]/30"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #00687a 40%, rgba(255, 255, 255, 0) 0%)',
                  backgroundPosition: 'top',
                  backgroundSize: '6px 1px',
                  backgroundRepeat: 'repeat-x',
                }}
              />
              <span className="absolute right-0 -top-3 bg-white px-1 rounded font-label-sm text-[9px] text-[#00687a] font-semibold border border-[#e2e7ff]">
                3.0L GOAL
              </span>
            </div>

            {WEEKLY_DATA.map((item) => {
              const isPeak = item.day === 'Fri';
              const colHeightPx = Math.round((item.water / 3.2) * 100);

              return (
                <div key={item.day} className="flex flex-col items-center flex-1 group">
                  <div
                    className={`w-5 rounded-t-full relative overflow-hidden transition-transform group-hover:scale-y-105 origin-bottom ${
                      isPeak
                        ? 'bg-[#00687a] ring-2 ring-[#57dffe] shadow-sm'
                        : 'bg-[#57dffe]'
                    }`}
                    style={{ height: `${colHeightPx}px` }}
                  >
                    <div
                      className={`absolute inset-x-0 bottom-0 h-2 ${
                        isPeak ? 'bg-white/40' : 'bg-[#00687a]/30'
                      }`}
                    />
                  </div>
                  <span
                    className={`font-label-sm text-[10px] mt-1.5 ${
                      isPeak ? 'text-[#00687a] font-bold' : 'text-[#3c4a42]'
                    }`}
                  >
                    {item.water.toFixed(1)}L
                  </span>
                  <span
                    className={`font-label-sm text-[11px] ${
                      isPeak ? 'font-bold text-[#00687a]' : 'font-medium text-[#6c7a71]'
                    }`}
                  >
                    {item.day.slice(0, 1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Aura Biometric Synthesis Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e7ff] flex flex-col space-y-3 relative">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#6ffbbe] flex items-center justify-center text-[#002113]">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-[15px] text-[#131b2e] font-bold tracking-tight">
                Aura Biometric Synthesis
              </h2>
              <p className="font-label-sm text-[11px] text-[#6c7a71]">
                Clinical AI Behavioral Correlations
              </p>
            </div>
          </div>
          <span className="font-label-sm text-[11px] bg-[#eaedff] px-2 py-0.5 rounded text-[#3c4a42] font-semibold">
            v3.2 Bio
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {/* Best Day */}
          <div className="p-3 rounded-lg bg-[#f2f3ff] flex items-start gap-3 border border-[#e2e7ff]">
            <span className="text-[18px] leading-none select-none mt-0.5">🌟</span>
            <div className="min-w-0 flex-1">
              <div className="font-label-sm text-[11px] font-bold text-[#006c49] uppercase tracking-wide">
                Best Day Identified
              </div>
              <p className="font-body-md text-[13px] text-[#131b2e] font-medium leading-snug mt-0.5">
                Wednesday — 100% Macro Precision &amp; steady glycemic balance
              </p>
            </div>
          </div>

          {/* Area for Improvement */}
          <div className="p-3 rounded-lg bg-[#f2f3ff] flex items-start gap-3 border border-[#e2e7ff]">
            <span className="text-[18px] leading-none select-none mt-0.5">⚠️</span>
            <div className="min-w-0 flex-1">
              <div className="font-label-sm text-[11px] font-bold text-[#855300] uppercase tracking-wide">
                Area for Improvement
              </div>
              <p className="font-body-md text-[13px] text-[#131b2e] font-medium leading-snug mt-0.5">
                Weekend evening snacks — Caloric load averaged +18% past 8 PM
              </p>
            </div>
          </div>

          {/* Next Micro-Action */}
          <div className="p-3 rounded-lg bg-[#6ffbbe]/25 flex items-start gap-3 border border-[#4edea3]/40">
            <span className="text-[18px] leading-none select-none mt-0.5">💡</span>
            <div className="min-w-0 flex-1">
              <div className="font-label-sm text-[11px] font-bold text-[#006c49] uppercase tracking-wide">
                Next Micro-Action
              </div>
              <p className="font-body-md text-[13px] text-[#131b2e] font-medium leading-snug mt-0.5">
                Add 25g fibrous greens to Sunday lunch to stabilize evening insulin response
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Action & Telemetry Security */}
      <div className="pt-1 flex flex-col items-center">
        <button
          onClick={handleExportClick}
          disabled={isExporting}
          className="w-full py-3 px-4 rounded-full bg-white text-[#131b2e] border border-[#e2e7ff] shadow-sm hover:bg-[#f2f3ff] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group min-h-[46px]"
          type="button"
        >
          {isExporting ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin text-[#10b981]">
                progress_activity
              </span>
              <span className="font-headline-sm text-[15px] font-semibold tracking-tight">
                Generating Clinical Telemetry PDF...
              </span>
            </>
          ) : exportComplete ? (
            <>
              <span className="material-symbols-outlined text-[18px] text-[#10b981]">
                check_circle
              </span>
              <span className="font-headline-sm text-[15px] font-semibold tracking-tight">
                Report Generated & Ready!
              </span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px] text-[#6c7a71] group-hover:text-[#006c49] transition-colors">
                lock
              </span>
              <span className="font-headline-sm text-[15px] font-semibold tracking-tight">
                Export Weekly Health Report (PDF)
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#6c7a71] group-hover:translate-x-0.5 transition-transform">
                download
              </span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5 mt-2.5 text-[#6c7a71]">
          <span className="material-symbols-outlined text-[13px]">verified_user</span>
          <span className="font-label-sm text-[11px]">
            HIPAA Compliant Encrypted Telemetry Export
          </span>
        </div>
      </div>

      {/* PDF Export Preview Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-[#dae2fd] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#10b981] text-[24px]">
                  picture_as_pdf
                </span>
                <div>
                  <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
                    AuraTrack Clinical Report
                  </h3>
                  <span className="text-[11px] text-[#6c7a71]">{currentWeekLabel}</span>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-[#6c7a71] hover:text-[#131b2e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-[13px] text-[#3c4a42]">
              <div className="bg-[#f2f3ff] p-3 rounded-xl space-y-1">
                <p>
                  <strong>Patient / Member:</strong> {userProfile.name} (Age {userProfile.age}, {userProfile.gender})
                </p>
                <p>
                  <strong>Metabolic Strategy:</strong> {userProfile.metabolicGoal.toUpperCase()}
                </p>
                <p>
                  <strong>Weekly Adherence:</strong> 94.8% (Target: &ge;90%)
                </p>
                <p>
                  <strong>Mean Caloric Intake:</strong> 2,042 kcal/day
                </p>
                <p>
                  <strong>Mean Protein:</strong> 132g / day
                </p>
                <p>
                  <strong>Hydration Volume:</strong> 17.8L Total (2.5L / day)
                </p>
              </div>

              <div className="border border-[#e2e7ff] p-3 rounded-xl bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase text-[#006c49]">Physician Notes:</span>
                <p className="text-[12px] leading-relaxed">
                  Patient exhibits sustained glycemic control and macro consistency across Monday–Thursday.
                  Mild weekend variance (+18%) identified in late evening snacks. Recommendation to introduce
                  soluble fiber at Sunday lunch validated.
                </p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-full bg-[#10b981] hover:bg-[#006c49] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2.5 rounded-full bg-[#f2f3ff] text-[#3c4a42] font-semibold text-[13px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
