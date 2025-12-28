'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

// TOUS LES AVIS - 50 témoignages clients
const testimonials = [
  { id: 1, name: 'Marie L.', location: 'Beauvais', rating: 5, date: 'Novembre 2024', text: 'Je recommande cette société, entretien de notre poêle à granulés et ramonage de deux conduits réalisés avec un grand professionnalisme.', service: 'Ramonage & Entretien' },
  { id: 2, name: 'Sophie M.', location: 'Chantilly', rating: 5, date: 'Novembre 2024', text: 'Je recommande vivement DCS RAMONAGE ! Équipe très professionnelle, réactive et sympathique. Intervention en 48h.', service: 'Dépannage poêle' },
  { id: 3, name: 'Pierre D.', location: 'Senlis', rating: 5, date: 'Octobre 2024', text: 'Dépannage en urgence, ils étaient là 1h après le premier appel. Professionnels et agréables! Je recommande +++', service: 'Dépannage urgence' },
  { id: 4, name: 'Isabelle R.', location: 'Creil', rating: 5, date: 'Octobre 2024', text: 'Débistrage du conduit de ma cheminée. Travail fait avec matériel professionnel et proprement. Très satisfaite !', service: 'Débistrage' },
  { id: 5, name: 'Thomas B.', location: 'Méru', rating: 5, date: 'Septembre 2024', text: 'Équipe sérieuse et très professionnel, travail propre et minutieux, à recommander.', service: 'Ramonage' },
  { id: 6, name: 'Christine P.', location: 'Gouvieux', rating: 5, date: 'Septembre 2024', text: 'Monsieur très agréable et compétent. Très satisfaite de l\'entretien de mon poêle Piazzetta.', service: 'Entretien poêle' },
  { id: 7, name: 'Jean-Marc V.', location: 'Cergy', rating: 5, date: 'Août 2024', text: 'Excellent service ! Intervention rapide et soignée. Le technicien a pris le temps de tout expliquer.', service: 'Ramonage' },
  { id: 8, name: 'Nathalie G.', location: 'Pontoise', rating: 5, date: 'Août 2024', text: 'Très satisfaite. Ponctuel, professionnel et prix raisonnable. Je recommande vivement.', service: 'Ramonage' },
  { id: 9, name: 'François L.', location: 'Argenteuil', rating: 5, date: 'Juillet 2024', text: 'Prestation de qualité pour le tubage de ma cheminée. Équipe compétente et travail soigné.', service: 'Tubage' },
  { id: 10, name: 'Catherine D.', location: 'Compiègne', rating: 5, date: 'Juillet 2024', text: 'Service impeccable du début à la fin. Devis clair, intervention dans les délais. Merci !', service: 'Ramonage & Débistrage' },
  { id: 11, name: 'Michel R.', location: 'Clermont', rating: 5, date: 'Juin 2024', text: 'Professionnel sérieux. A détecté un problème que les autres n\'avaient pas vu.', service: 'Diagnostic conduit' },
  { id: 12, name: 'Anne-Marie P.', location: 'Senlis', rating: 5, date: 'Juin 2024', text: 'Entreprise très professionnelle. Travail impeccable et tout nettoyé après.', service: 'Ramonage' },
  { id: 13, name: 'Laurent M.', location: 'Ermont', rating: 5, date: 'Mai 2024', text: 'Très satisfait du ramonage. Travail propre et soigné. Je recommande.', service: 'Ramonage' },
  { id: 14, name: 'Sylvie B.', location: 'Taverny', rating: 5, date: 'Mai 2024', text: 'Intervention rapide pour problème de tirage. Résolu en moins d\'une heure.', service: 'Diagnostic' },
  { id: 15, name: 'Patrick H.', location: 'Bessancourt', rating: 5, date: 'Avril 2024', text: 'Excellent travail pour le tubage. Prix raisonnable et qualité.', service: 'Tubage' },
  { id: 16, name: 'Martine C.', location: 'Chambly', rating: 5, date: 'Avril 2024', text: 'Ramonage effectué avec professionnalisme. Certificat remis immédiatement. Parfait !', service: 'Ramonage' },
  { id: 17, name: 'Alain D.', location: 'Persan', rating: 5, date: 'Mars 2024', text: 'Très content de l\'entretien de mon poêle à granulés. Technicien compétent.', service: 'Entretien poêle' },
  { id: 18, name: 'Brigitte F.', location: 'L\'Isle-Adam', rating: 5, date: 'Mars 2024', text: 'Service de qualité, ponctualité et efficacité. Mon poêle fonctionne parfaitement.', service: 'Entretien poêle' },
  { id: 19, name: 'Yves L.', location: 'Beauvais', rating: 5, date: 'Février 2024', text: 'Débistrage complet. Travail impressionnant, le conduit est comme neuf !', service: 'Débistrage' },
  { id: 20, name: 'Dominique R.', location: 'Noailles', rating: 5, date: 'Février 2024', text: 'Intervention d\'urgence le week-end. Très réactif et professionnel.', service: 'Dépannage urgence' },
  { id: 21, name: 'Gérard T.', location: 'Chantilly', rating: 5, date: 'Janvier 2024', text: 'Ramonage de deux conduits effectué rapidement et proprement. Tarifs corrects.', service: 'Ramonage' },
  { id: 22, name: 'Jacqueline M.', location: 'Senlis', rating: 5, date: 'Janvier 2024', text: 'Excellent conseil pour le tubage. Installation parfaite et garantie.', service: 'Tubage' },
  { id: 23, name: 'Bernard S.', location: 'Creil', rating: 5, date: 'Décembre 2023', text: 'Très professionnel. Le ramoneur a pris le temps d\'expliquer l\'état du conduit.', service: 'Ramonage' },
  { id: 24, name: 'Monique L.', location: 'Gouvieux', rating: 5, date: 'Décembre 2023', text: 'Entretien annuel de notre poêle Dielle parfaitement réalisé. Technicien formé.', service: 'Entretien Dielle' },
  { id: 25, name: 'Philippe A.', location: 'Cergy', rating: 5, date: 'Novembre 2023', text: 'Intervention rapide pour problème de fumée. Diagnostic précis et réparation efficace.', service: 'Diagnostic' },
  { id: 26, name: 'Claire V.', location: 'Pontoise', rating: 5, date: 'Novembre 2023', text: 'Très satisfaite du débistrage. Le conduit tire beaucoup mieux maintenant.', service: 'Débistrage' },
  { id: 27, name: 'Jacques P.', location: 'Méru', rating: 5, date: 'Octobre 2023', text: 'Ramonage impeccable. Prix affiché respecté, pas de mauvaise surprise.', service: 'Ramonage' },
  { id: 28, name: 'Françoise B.', location: 'Argenteuil', rating: 5, date: 'Octobre 2023', text: 'Pose de chapeau de cheminée et ramonage. Travail soigné et propre.', service: 'Fumisterie' },
  { id: 29, name: 'Robert D.', location: 'Clermont', rating: 5, date: 'Septembre 2023', text: 'Excellent service client. Réponse rapide et intervention dans les délais.', service: 'Ramonage' },
  { id: 30, name: 'Hélène C.', location: 'Compiègne', rating: 5, date: 'Septembre 2023', text: 'Entretien complet du poêle à granulés avec nettoyage du conduit. Très pro.', service: 'Entretien poêle' },
  { id: 31, name: 'Daniel M.', location: 'Ermont', rating: 5, date: 'Août 2023', text: 'Intervention pendant les vacances pour problème urgent. Très reconnaissant !', service: 'Dépannage urgence' },
  { id: 32, name: 'Simone G.', location: 'Taverny', rating: 5, date: 'Août 2023', text: 'Ramonage annuel effectué avec sérieux. Certificat conforme remis.', service: 'Ramonage' },
  { id: 33, name: 'André F.', location: 'Beauvais', rating: 5, date: 'Juillet 2023', text: 'Tubage flexible installé parfaitement. Le tirage est bien meilleur.', service: 'Tubage' },
  { id: 34, name: 'Nicole H.', location: 'Chantilly', rating: 5, date: 'Juillet 2023', text: 'Très bon contact téléphonique et intervention de qualité. Je recommande.', service: 'Ramonage' },
  { id: 35, name: 'Marcel R.', location: 'Senlis', rating: 5, date: 'Juin 2023', text: 'Diagnostic complet avant achat de maison. Rapport détaillé très utile.', service: 'Diagnostic' },
  { id: 36, name: 'Odette T.', location: 'Creil', rating: 5, date: 'Juin 2023', text: 'Nettoyage de la toiture et ramonage le même jour. Très pratique !', service: 'Nettoyage & Ramonage' },
  { id: 37, name: 'Georges L.', location: 'Gouvieux', rating: 5, date: 'Mai 2023', text: 'Artisan de confiance. 3 ans que je fais appel à lui pour l\'entretien annuel.', service: 'Ramonage' },
  { id: 38, name: 'Paulette B.', location: 'Cergy', rating: 5, date: 'Mai 2023', text: 'Débistrage difficile mais réalisé avec persévérance. Résultat parfait.', service: 'Débistrage' },
  { id: 39, name: 'René P.', location: 'Pontoise', rating: 5, date: 'Avril 2023', text: 'Installation complète du conduit pour notre nouveau poêle. Impeccable.', service: 'Fumisterie' },
  { id: 40, name: 'Madeleine S.', location: 'Méru', rating: 5, date: 'Avril 2023', text: 'Très réactif suite à ma demande de devis. Intervention le lendemain !', service: 'Ramonage' },
  { id: 41, name: 'Christian A.', location: 'Argenteuil', rating: 5, date: 'Mars 2023', text: 'Ramonage de 3 conduits dans la maison. Tarif dégressif intéressant.', service: 'Ramonage' },
  { id: 42, name: 'Jeanne D.', location: 'Clermont', rating: 5, date: 'Mars 2023', text: 'Entretien poêle MCZ réalisé avec expertise. Refonctionne parfaitement.', service: 'Entretien poêle' },
  { id: 43, name: 'Louis V.', location: 'Chambly', rating: 5, date: 'Février 2023', text: 'Très content du service. Propre, rapide et efficace.', service: 'Ramonage' },
  { id: 44, name: 'Thérèse M.', location: 'Persan', rating: 5, date: 'Février 2023', text: 'Dépannage rapide de mon poêle. Problème résolu en 30 min.', service: 'Dépannage poêle' },
  { id: 45, name: 'Roger C.', location: 'L\'Isle-Adam', rating: 5, date: 'Janvier 2023', text: 'Tubage double paroi pour conduit extérieur. Installation propre et durable.', service: 'Tubage' },
  { id: 46, name: 'Ginette F.', location: 'Bessancourt', rating: 5, date: 'Janvier 2023', text: 'Ramonage obligatoire avant l\'hiver fait dans les temps. Merci !', service: 'Ramonage' },
  { id: 47, name: 'Maurice L.', location: 'Beauvais', rating: 5, date: 'Décembre 2022', text: 'Intervention de qualité pour le ramonage de notre cheminée ancienne.', service: 'Ramonage' },
  { id: 48, name: 'Lucienne R.', location: 'Noailles', rating: 5, date: 'Décembre 2022', text: 'Excellent professionnel, travail minutieux et conseils avisés.', service: 'Diagnostic' },
  { id: 49, name: 'Henri B.', location: 'Compiègne', rating: 5, date: 'Novembre 2022', text: 'Débistrage complet réussi après échec avec un autre prestataire. Vrai pro !', service: 'Débistrage' },
  { id: 50, name: 'Yvonne G.', location: 'Senlis', rating: 5, date: 'Novembre 2022', text: 'Service client au top. Réponse rapide et intervention de qualité.', service: 'Ramonage' },
];

export function TestimonialsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 1 : 6;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextPage, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextPage]);

  const startIndex = currentPage * itemsPerPage;
  const visibleTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section 
      className="section-padding bg-secondary-50/50 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary-700" />
              <span className="badge-primary">Témoignages</span>
            </div>
            <h2 className="section-title">
              Ce que disent{' '}
              <span className="text-gradient">nos clients</span>
            </h2>
            <p className="section-subtitle">
              {testimonials.length} avis clients avec une note moyenne de 5/5 sur Google
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-soft">
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning-400 text-warning-400" />
                ))}
              </div>
              <span className="text-2xl font-bold text-secondary-900">5.0</span>
              <span className="text-secondary-500 text-sm block">sur Google</span>
            </div>
            <a
              href={siteConfig.urls.googleBusiness}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
            >
              Voir tous les avis
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={prevPage}
            className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-secondary-600 hover:text-primary-700 hover:shadow-soft-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Page précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextPage}
            className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-secondary-600 hover:text-primary-700 hover:shadow-soft-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Page suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
            {visibleTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="card p-6 relative transition-all duration-300">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-100" />
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900">{testimonial.name}</p>
                    <p className="text-sm text-secondary-500">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning-400 text-warning-400" />
                  ))}
                </div>
                <p className="text-secondary-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs text-secondary-400 pt-4 border-t border-secondary-100">
                  <span className="badge bg-secondary-100 text-secondary-600 text-xs">{testimonial.service}</span>
                  <span>{testimonial.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={cn(
                  'h-3 rounded-full transition-all duration-300',
                  index === currentPage ? 'bg-primary-500 w-10' : 'bg-secondary-300 hover:bg-secondary-400 w-3'
                )}
                aria-label={`Aller à la page ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-secondary-600 mb-4">Vous aussi, faites confiance à DCS Ramonage</p>
          <a href="/contact" className="btn-primary btn-md inline-flex">Demander un devis gratuit</a>
        </div>
      </div>
    </section>
  );
}
