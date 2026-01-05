'use client';

import { useState, useEffect, useRef } from 'react';
import { Building2, Loader2 } from 'lucide-react';

interface CompanyResult {
  siret: string;
  siren: string;
  nom: string;
  nomCommercial?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  codeAPE: string;
  libelleAPE: string;
  tvaIntra: string;
  lat?: number;
  lng?: number;
}

interface CompanySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onCompanySelect: (company: CompanyResult) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
}

export default function CompanySearchInput({ 
  value,
  onChange,
  onCompanySelect, 
  placeholder = "Saisissez le nom ou SIRET...",
  required = false,
  label = "Raison sociale"
}: CompanySearchInputProps) {
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fermer dropdown au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(value)}&page=1&per_page=5`
        );
        const data = await response.json();
        
        const companies: CompanyResult[] = data.results?.map((item: any) => {
          const siege = item.siege;
          const siren = item.siren || '';
          
          // Calculer le numéro TVA intracommunautaire
          const tvaKey = (12 + 3 * (parseInt(siren) % 97)) % 97;
          const tvaIntra = siren ? `FR${tvaKey.toString().padStart(2, '0')}${siren}` : '';
          
          return {
            siret: siege?.siret || '',
            siren: siren,
            nom: item.nom_complet || item.nom_raison_sociale || '',
            nomCommercial: item.nom_commercial,
            adresse: siege?.adresse ? `${siege.numero_voie || ''} ${siege.type_voie || ''} ${siege.libelle_voie || ''}`.trim() : '',
            codePostal: siege?.code_postal || '',
            ville: siege?.libelle_commune || '',
            codeAPE: item.activite_principale || '',
            libelleAPE: item.libelle_activite_principale || '',
            tvaIntra: tvaIntra,
            lat: siege?.latitude,
            lng: siege?.longitude,
          };
        }) || [];
        
        setResults(companies);
        setIsOpen(companies.length > 0);
      } catch (error) {
        console.error('Erreur recherche entreprise:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  const handleSelect = (company: CompanyResult) => {
    onChange(company.nom);
    setIsOpen(false);
    setResults([]);
    onCompanySelect(company);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-secondary-700 mb-1">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 animate-spin" />
        )}
      </div>

      {/* Dropdown résultats */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          {results.map((company, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(company)}
              className="w-full px-4 py-3 text-left hover:bg-secondary-50 border-b border-secondary-100 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">{company.nom}</p>
                  {company.nomCommercial && company.nomCommercial !== company.nom && (
                    <p className="text-xs text-secondary-600">{company.nomCommercial}</p>
                  )}
                  <p className="text-xs text-secondary-500 mt-1">
                    {company.adresse && `${company.adresse}, `}{company.codePostal} {company.ville}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-secondary-400">
                    <span>SIRET: {company.siret}</span>
                    {company.codeAPE && <span>APE: {company.codeAPE}</span>}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
