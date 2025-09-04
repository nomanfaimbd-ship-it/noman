
import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { TARGET_ROLES, TARGET_INDUSTRIES } from './constants';
import type { ClassificationResult, PillColor } from './types';

const pillColorClasses: Record<PillColor, string> = {
    green: 'bg-green-100/80 border-green-400/80 text-green-800',
    yellow: 'bg-yellow-100/80 border-yellow-400/80 text-yellow-800',
    red: 'bg-red-100/80 border-red-400/80 text-red-800',
};

const basePillClasses = "rounded-xl p-3 font-semibold leading-tight border font-mono backdrop-blur-sm";

// Helper component to render text with highlighted keywords
const HighlightedText = ({ text, highlights }: { text: string, highlights?: string | string[] }) => {
    if (!highlights || highlights.length === 0) {
        return <>{text}</>;
    }

    // Ensure highlights is an array of strings and escape special regex characters for safety
    const keywords = (Array.isArray(highlights) ? highlights : [highlights]).map(
        keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    if (keywords.length === 0) {
        return <>{text}</>;
    }

    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                keywords.some(k => k.toLowerCase() === part.toLowerCase()) ? (
                    <strong key={i} className="font-extrabold bg-yellow-200/60 px-1 rounded-md">{part}</strong>
                ) : (
                    part
                )
            )}
        </>
    );
};


export default function App() {
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const handleCheck = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const roleValue = role.trim();
    const industryValue = industry.trim();

    if (!roleValue && !industryValue) {
        setResult(null);
        return;
    }

    let roleLine: string | undefined;
    let industryLine: string | undefined;
    let final_text: string = "Final: ❌ Red (Not a Match)";
    let final_color: PillColor = "red";
    let role_pill_color: PillColor = "red";
    let industry_pill_color: PillColor = "red";
    let matchedRoleValue: string | undefined = undefined;
    const matchedIndustryKeywords: string[] = [];

    let ok_role = false;
    if (roleValue) {
        ok_role = TARGET_ROLES.has(roleValue.toLowerCase());
        roleLine = `Role: ${roleValue} → ${ok_role ? 'It is correct' : 'It is wrong'}`;
        role_pill_color = ok_role ? 'green' : 'red';
        if (ok_role) {
            matchedRoleValue = roleValue;
        }
    }

    let ok_ind = false;
    if (industryValue) {
        const userIndustries = industryValue.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        
        // Find all target industries that are present in the user's input
        for (const targetIndustry of TARGET_INDUSTRIES) {
             if (userIndustries.some(userInd => userInd.includes(targetIndustry.toLowerCase()))) {
                matchedIndustryKeywords.push(targetIndustry);
             }
        }
        ok_ind = matchedIndustryKeywords.length > 0;
        
        industryLine = `Industry: ${industryValue} → ${ok_ind ? 'Falls under the targeted industries' : 'Does not fall under the targeted industries'}`;
        industry_pill_color = ok_ind ? 'green' : 'red';
    }
    
    if (ok_role && ok_ind) {
        final_text = "Final: ✅ Green (Good Lead)";
        final_color = "green";
    } else if (ok_role || ok_ind) {
        final_text = "Final: ⚠ Yellow (Partial)";
        final_color = "yellow";
    }

    setResult({
        roleLine,
        industryLine,
        finalText: final_text,
        rolePillColor: role_pill_color,
        industryPillColor: industry_pill_color,
        finalPillColor: final_color,
        roleValue: matchedRoleValue,
        matchedIndustryKeywords,
    });
  };

  const handleClear = () => {
    setRole('');
    setIndustry('');
    setResult(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-white/35 pointer-events-none z-0"></div>
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-7 z-10">
        <h1 className="text-center text-3xl font-bold text-gray-800 tracking-tight">Lead Classification</h1>
        <p className="text-center text-gray-500 text-sm mt-2 mb-6">Enter a role and/or company/industry info</p>

        <form onSubmit={handleCheck} autoComplete="off">
          <div>
            <label htmlFor="role" className="block font-semibold text-gray-700 mb-1.5">Role</label>
            <input 
              id="role" 
              name="role" 
              type="text" 
              placeholder="e.g., Chief Operating Officer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition duration-150 ease-in-out bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="industry" className="block font-semibold text-gray-700 mb-1.5">Industry / Company Info</label>
            <input 
              id="industry" 
              name="industry" 
              type="text" 
              placeholder="e.g., SaaS, AI, Cloud"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition duration-150 ease-in-out bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
            />
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button 
              type="submit"
              className="px-8 py-3 rounded-lg font-bold text-white bg-blue-600 transition duration-150 ease-in-out hover:bg-blue-700 active:transform active:translate-y-px active:scale-95 shadow-md hover:shadow-lg"
            >
              Check
            </button>
            <button 
              type="button"
              onClick={handleClear}
              className="px-8 py-3 rounded-lg font-bold text-gray-800 bg-gray-200 transition duration-150 ease-in-out hover:bg-gray-300 active:transform active:translate-y-px active:scale-95 shadow-md hover:shadow-lg"
            >
              Clear
            </button>
          </div>
        </form>

        {result && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid gap-3">
                {result.roleLine && (
                    <div className={`${basePillClasses} ${pillColorClasses[result.rolePillColor]}`}>
                        <HighlightedText text={result.roleLine} highlights={result.roleValue} />
                    </div>
                )}
                {result.industryLine && (
                    <div className={`${basePillClasses} ${pillColorClasses[result.industryPillColor]}`}>
                        <HighlightedText text={result.industryLine} highlights={result.matchedIndustryKeywords} />
                    </div>
                )}
                <div className={`${basePillClasses} ${pillColorClasses[result.finalPillColor]}`}>
                    {result.finalText}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
