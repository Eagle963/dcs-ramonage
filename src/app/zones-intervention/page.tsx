import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calendar, 
  ArrowRight, 
  Phone,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Zones d\'intervention | Ramonage Oise et Val-d\'Oise',
  description: 'DCS Ramonage intervient dans l\'Oise (60) et le Val-d\'Oise (95) : Beauvais, Creil, Chantilly, Senlis, Cergy, Pontoise, Argenteuil.',
  keywords: ['ramonage Oise', 'ramonage Val-d\'Oise', 'ramoneur 60', 'ramoneur 95', 'zone intervention ramonage'],
  alternates: { canonical: `${siteConfig.urls.website}/zones-intervention` },
};

const zones = [
  {
    department: 'Oise (60)',
    description: 'Nous intervenons dans l\'Oise, de Beauvais à Senlis.',
    cities: [
      { name: 'Beauvais', slug: 'beauvais', postalCode: '60000' },
      { name: 'Clermont', slug: 'clermont', postalCode: '60600' },
      { name: 'Creil', slug: 'creil', postalCode: '60100' },
      { name: 'Chantilly', slug: 'chantilly', postalCode: '60500' },
      { name: 'Senlis', slug: 'senlis', postalCode: '60300' },
      { name: 'Gouvieux', slug: 'gouvieux', postalCode: '60270' },
      { name: 'Méru', slug: 'meru', postalCode: '60110' },
      { name: 'Chambly', slug: 'chambly', postalCode: '60230' },
    ],
  },
  {
    department: 'Val-d\'Oise (95)',
    description: 'Nous intervenons dans le Val-d\'Oise, de Cergy à Argenteuil.',
    cities: [
      { name: 'L\'Isle-Adam', slug: 'isle-adam', postalCode: '95290' },
      { name: 'Persan', slug: 'persan', postalCode: '95340' },
      { name: 'Cergy', slug: 'cergy', postalCode: '95000' },
      { name: 'Pontoise', slug: 'pontoise', postalCode: '95300' },
      { name: 'Bessancourt', slug: 'bessancourt', postalCode: '95550' },
      { name: 'Taverny', slug: 'taverny', postalCode: '95150' },
      { name: 'Ermont', slug: 'ermont', postalCode: '95120' },
      { name: 'Argenteuil', slug: 'argenteuil', postalCode: '95100' },
    ],
  },
];

export default function ZonesInterventionPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-500" />
              <span className="badge-primary">Zones d'intervention</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
              Nous intervenons dans{' '}
              <span className="text-gradient">l'Oise et le Val-d'Oise</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              DCS Ramonage intervient dans l'Oise (60) et le Val-d'Oise (95).
              <br />
              Déplacement inclus dans nos tarifs.
              <br />
              Intervention sous 24-48h.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-secondary-600">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span>Déplacement inclus</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-600">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span>Intervention rapide</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-600">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span>Devis gratuit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cartes des zones - Leaflet */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Notre zone d'intervention
            </h2>
            <p className="text-secondary-600">
              Nous intervenons dans le sud de l'Oise et dans tout le Val-d'Oise.
            </p>
          </div>

          {/* 2 cartes côte à côte */}
          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Carte Oise */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-soft border border-secondary-100">
              <div className="p-4 border-b border-secondary-100">
                <h3 className="font-display font-bold text-lg text-secondary-900">Oise (60)</h3>
                <p className="text-sm text-secondary-500">Sud du département couvert</p>
              </div>
              <div id="map-oise" className="h-[350px] w-full"></div>
              <div className="p-3 bg-secondary-50 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-orange-500/70 border border-orange-600"></span>
                  <span className="text-secondary-600">Zone couverte</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-300/70 border border-slate-400"></span>
                  <span className="text-secondary-600">Hors zone</span>
                </div>
              </div>
            </div>

            {/* Carte Val-d'Oise */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-soft border border-secondary-100">
              <div className="p-4 border-b border-secondary-100">
                <h3 className="font-display font-bold text-lg text-secondary-900">Val-d'Oise (95)</h3>
                <p className="text-sm text-secondary-500">Tout le département couvert</p>
              </div>
              <div id="map-valdoise" className="h-[350px] w-full"></div>
              <div className="p-3 bg-secondary-50 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-orange-500/70 border border-orange-600"></span>
                  <span className="text-secondary-600">Zone couverte</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-300/70 border border-slate-400"></span>
                  <span className="text-secondary-600">Hors zone</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-secondary-500 mt-6">
            Votre commune n'est pas listée ? Contactez-nous pour vérifier notre disponibilité.
          </p>
        </div>

        {/* Scripts Leaflet */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                // Attendre que Leaflet soit chargé
                setTimeout(function() {
                  if (typeof L === 'undefined') return;
                  
                  // Carte Oise
                  var mapOise = L.map('map-oise', { scrollWheelZoom: false }).setView([49.35, 2.4], 9);
                  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '© OpenStreetMap, © CARTO'
                  }).addTo(mapOise);
                  
                  // Carte Val-d'Oise
                  var mapValdoise = L.map('map-valdoise', { scrollWheelZoom: false }).setView([49.05, 2.15], 10);
                  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '© OpenStreetMap, © CARTO'
                  }).addTo(mapValdoise);
                  
                  // Codes postaux exclus Oise (nord)
                  var excludedOise = ['60128','60150','60170','60320','60330','60350','60400','60440','60800','60138','60129','60117','60640','60380','60810','60141','60123','60490','60950','60890','60157','60420','60220','60127','60620'];
                  
                  // Charger GeoJSON
                  fetch('https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson')
                    .then(function(r) { return r.json(); })
                    .then(function(data) {
                      // Oise
                      var oise = data.features.find(function(f) { return f.properties.code === '60'; });
                      if (oise) {
                        L.geoJSON(oise, {
                          style: { fillColor: '#f97316', fillOpacity: 0.4, color: '#ea580c', weight: 2 }
                        }).addTo(mapOise);
                        mapOise.fitBounds(L.geoJSON(oise).getBounds(), { padding: [20, 20] });
                      }
                      
                      // Val-d'Oise
                      var valdoise = data.features.find(function(f) { return f.properties.code === '95'; });
                      if (valdoise) {
                        L.geoJSON(valdoise, {
                          style: { fillColor: '#f97316', fillOpacity: 0.4, color: '#ea580c', weight: 2 }
                        }).addTo(mapValdoise);
                        mapValdoise.fitBounds(L.geoJSON(valdoise).getBounds(), { padding: [20, 20] });
                      }
                      
                      // Villes Oise
                      var villesOise = [
                        { name: 'Beauvais', lat: 49.4295, lng: 2.0807 },
                        { name: 'Creil', lat: 49.2583, lng: 2.4833 },
                        { name: 'Chantilly', lat: 49.1947, lng: 2.4711 },
                        { name: 'Senlis', lat: 49.2069, lng: 2.5864 },
                        { name: 'Méru', lat: 49.2364, lng: 2.1339 },
                        { name: 'Chambly', lat: 49.1656, lng: 2.2478 }
                      ];
                      villesOise.forEach(function(v) {
                        L.circleMarker([v.lat, v.lng], {
                          radius: 6, fillColor: '#1e293b', fillOpacity: 1, color: '#fff', weight: 2
                        }).bindTooltip(v.name, { direction: 'top' }).addTo(mapOise);
                      });
                      
                      // Villes Val-d'Oise
                      var villesValdoise = [
                        { name: 'Cergy', lat: 49.0364, lng: 2.0633 },
                        { name: 'Vauréal', lat: 49.0308, lng: 2.0297 },
                        { name: 'Pontoise', lat: 49.0500, lng: 2.1000 },
                        { name: "L'Isle-Adam", lat: 49.1081, lng: 2.2283 },
                        { name: 'Argenteuil', lat: 48.9472, lng: 2.2467 },
                        { name: 'Taverny', lat: 49.0264, lng: 2.2258 },
                        { name: 'Ermont', lat: 48.9903, lng: 2.2578 },
                        { name: 'Persan', lat: 49.1531, lng: 2.2728 }
                      ];
                      villesValdoise.forEach(function(v) {
                        L.circleMarker([v.lat, v.lng], {
                          radius: 6, fillColor: '#1e293b', fillOpacity: 1, color: '#fff', weight: 2
                        }).bindTooltip(v.name, { direction: 'top' }).addTo(mapValdoise);
                      });
                    });
                }, 500);
              });
            `,
          }}
        />
      </section>

      {/* Zones par département */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-8">
            {zones.map((zone, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-secondary-100 shadow-soft overflow-hidden"
              >
                <div className="p-6 bg-secondary-900 text-white">
                  <h2 className="font-display font-bold text-xl">{zone.department}</h2>
                  <p className="text-secondary-300 text-sm mt-1">{zone.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {zone.cities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/ramonage-${city.slug}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary-50 
                                   hover:bg-primary-50 hover:border-primary-200 border border-transparent
                                   transition-all group"
                      >
                        <div>
                          <span className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">
                            {city.name}
                          </span>
                          <span className="block text-xs text-secondary-500">{city.postalCode}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-500 
                                               group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                  
                  <p className="text-sm text-secondary-500 mt-4 text-center">
                    + communes environnantes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autres communes */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Votre commune n'est pas listée ?
            </h2>
            <p className="text-secondary-600">
              Nous intervenons dans l'Oise (60) et le Val-d'Oise (95). 
              Contactez-nous pour vérifier notre disponibilité dans votre secteur.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
              <Calendar className="w-5 h-5" />
              Vérifier la disponibilité
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
              className="btn-outline btn-lg"
            >
              <Phone className="w-5 h-5" />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-secondary-900 to-secondary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Prêt à prendre rendez-vous ?
            </h2>
            <p className="text-secondary-300 mb-8">
              Réservez votre créneau en ligne. Intervention rapide sous 24-48h dans l'Oise et le Val-d'Oise.
            </p>
            
            <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn bg-primary-500 hover:bg-primary-600 text-white btn-lg">
              <Calendar className="w-5 h-5" />
              Prendre rendez-vous
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
