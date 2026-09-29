import { useState } from 'react';
import { useApp } from '../context/AppContext';
import SchemeCard from '../components/common/SchemeCard';
import PageTransition from '../components/layout/PageTransition';
import { Search } from 'lucide-react';

export default function ScholarshipExplorer() {
  const { schemes, darkMode, t } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    { id: 'all', label: t('filterAll', 'All Schemes') },
    { id: 'NSP', label: t('filterNsp', 'NSP Portal') },
    { id: 'SFMP', label: t('filterSfmp', 'SFMP (Canara)') },
    { id: 'NOS', label: t('filterNos', 'NOS Portal') },
  ];

  const filtered = schemes.filter((s) => {
    const portalMatch =
      activeFilter === 'all'
        ? true
        : activeFilter === 'NSP'
        ? s.portal === 'NSP'
        : activeFilter === 'SFMP'
        ? s.portal === 'SFMP'
        : s.portal === 'NOS Portal';

    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortName.toLowerCase().includes(searchQuery.toLowerCase());

    return portalMatch && matchesSearch;
  });

  return (
    <PageTransition className="pt-2 pb-20 md:pb-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
      {/* Title & Badge */}
      <div className="mt-4 mb-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-saffron/15 text-saffron">
            {t('schemeDirectory', 'Unified Scheme Directory')}
          </span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            • {t('motaCentralSchemes', '5 MoTA Central Schemes')}
          </span>
        </div>
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {t('exploreSchemes', 'Explore ST Scholarship Programs')}
        </h2>
      </div>

      {/* Search Box */}
      <div className="mb-3.5">
        <div className={`flex items-center gap-2.5 rounded-2xl px-3.5 h-12 border transition-all ${
          darkMode
            ? 'bg-navy-light/60 border-white/10 text-white focus-within:border-saffron/50'
            : 'bg-white border-slate-200 text-slate-800 shadow-xs focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20'
        }`}>
          <Search className={`w-4 h-4 shrink-0 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchSchemesPlaceholder', 'Search by scheme name, degree or institute...')}
            className="flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === f.id
                ? 'bg-saffron text-white shadow-xs'
                : darkMode
                ? 'bg-navy-light/40 text-gray-400 border border-white/5 hover:bg-white/10'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Scheme Cards List */}
      <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5">
        {filtered.map((scheme, i) => (
          <SchemeCard key={scheme.id} scheme={scheme} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className={`text-center py-12 rounded-2xl border ${
            darkMode ? 'bg-navy-light/30 border-white/10 text-gray-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <p className="text-xs font-medium">{t('noSchemesFound', 'No scholarship schemes match your search criteria.')}</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
