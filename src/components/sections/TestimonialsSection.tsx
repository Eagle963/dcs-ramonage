'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

// VRAIS AVIS GOOGLE - DCS Ramonage (mis à jour décembre 2024)
const testimonials = [
  { id: 1, name: 'Abdelkader B.', location: 'Oise', rating: 5, date: 'Décembre 2024', text: 'Personnel efficace très professionnel à l\'écoute de ses clients très organisé je recommande fortement merci Dcs Ramonage', service: 'Ramonage' },
  { id: 2, name: 'Thierry L.', location: 'Oise', rating: 5, date: 'Décembre 2024', text: 'Ponctuel, réactif, sympathique, travail soigné. Je recommande', service: 'Ramonage' },
  { id: 3, name: 'Barbara S.', location: 'Oise', rating: 5, date: 'Novembre 2024', text: 'Excellent travail. Personnes très agréables et professionnelles. Ils ont laissé la maison impeccable et le poêle nickel. Avec un tarif défiant toute concurrence.', service: 'Entretien poêle' },
  { id: 4, name: 'Marie-Hélène D.', location: 'Oise', rating: 5, date: 'Novembre 2024', text: 'Non seulement les rendez-vous sont rapides mais en plus vous allez rencontrer des personnes compétentes et méticuleuses.', service: 'Ramonage' },
  { id: 5, name: 'Sophie D.', location: 'Oise', rating: 5, date: 'Octobre 2024', text: 'Prise de rendez vous rapide. Très professionnel. Je recommande', service: 'Ramonage' },
  { id: 6, name: 'Martine L.', location: 'Oise', rating: 5, date: 'Novembre 2024', text: 'Travail propre, rapide et efficace. Vraiment c\'est la première fois que j\'ai ce ressenti sur ce genre d\'intervention et je les recommande à 100%', service: 'Ramonage' },
  { id: 7, name: 'Cédric S.', location: 'Oise', rating: 5, date: 'Octobre 2024', text: 'Top merci efficace rapide et pro', service: 'Ramonage' },
  { id: 8, name: 'Said B.', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Travail professionnel, de bon conseil, je recommande vivement cet artisan', service: 'Ramonage poêle à bois' },
  { id: 9, name: 'Ines L.', location: 'Oise', rating: 5, date: 'Octobre 2024', text: 'Super service, professionnel, courtois je recommande les yeux fermés !!!', service: 'Ramonage' },
  { id: 10, name: 'Emmanuelle L.', location: 'Oise', rating: 5, date: 'Octobre 2024', text: 'Je recommande cette société. Un artisan très sérieux et courtois.', service: 'Ramonage' },
  { id: 11, name: 'Abdel E.', location: 'Oise', rating: 5, date: 'Octobre 2024', text: 'Je recommande chaleureusement cette entreprise. Prise de rendez-vous rapide, prestation pro et propreté assurée.', service: 'Ramonage' },
  { id: 12, name: 'Mathilde G.', location: 'Oise', rating: 5, date: 'Octobre 2024', text: 'Équipe super agréable, donne de bons conseils pour entretenir le poêle à granulés et le ramonage parfait et fait proprement je les recommande vraiment, merci', service: 'Entretien poêle à granulés' },
  { id: 13, name: 'Amélie S.', location: 'Oise', rating: 5, date: 'Octobre 2024', text: 'Je recommande Dcs ramonage. L\'entretien a été rapide et j\'ai été très surprise qu\'ils démontent tout afin de nettoyer en profondeur. Merci beaucoup.', service: 'Entretien poêle' },
  { id: 14, name: 'Mélanie S.', location: 'Oise', rating: 5, date: 'Octobre 2024', text: 'Je recommande. Prise de rendez-vous via le site la veille pour le lendemain. Des artisans courtois pour un travail propre! On rappellera à coup sûr pour l\'année prochaine !', service: 'Ramonage' },
  { id: 15, name: 'Fernand D.', location: 'Oise', rating: 5, date: 'Octobre 2024', text: 'Service parfait, travail soigné', service: 'Ramonage' },
  { id: 16, name: 'Kissley P.', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Très professionnel, de bon conseil et vraiment très sympathique ! Je recommande vivement ! Très bonne équipe.', service: 'Ramonage' },
  { id: 17, name: 'Anonyme B.', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Un grand merci pour cette intervention rapide et efficace. Très sérieux et très professionnel je recommande.', service: 'Ramonage' },
  { id: 18, name: 'Thibault D.', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Très bonne société. Je recommande', service: 'Ramonage' },
  { id: 19, name: 'Pascal P.', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Equipe soigneuse, professionnelle. Laisse la maison impeccable. Allez y les yeux fermés.', service: 'Ramonage' },
  { id: 20, name: 'Aicha G.', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Super, ce jeune homme est un vrai professionnel. Amabilité, à l\'écoute, explique le travail qu\'il fait.', service: 'Ramonage' },
  { id: 21, name: 'Dillan P.', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Je recommande fortement cette société, très réactive, travail propre et de bons conseils. J\'ai eu un rendez-vous très rapidement.', service: 'Ramonage' },
  { id: 22, name: 'Emmanuel B.', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Rapides, efficaces et sympathiques. A l\'année prochaine...', service: 'Ramonage' },
  { id: 23, name: 'Régine D.', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Au niveau ponctualité très sérieux même en avance de quelques jours. Travail très propre et pro. Je recommande.', service: 'Ramonage' },
  { id: 24, name: 'Khalid', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Travail propre, sérieux et professionnel', service: 'Entretien poêle Palazzetti' },
  { id: 25, name: 'Mélanie D.', location: 'Oise', rating: 5, date: 'Septembre 2024', text: 'Rapide, efficace et professionnel! J\'ai pu réserver un créneau en ligne.', service: 'Ramonage' },
  { id: 26, name: 'Jérémie G.', location: 'Oise', rating: 5, date: 'Août 2024', text: 'Service au top, très sympa et réactif. Je recommande les yeux fermés. 👍', service: 'Ramonage' },
  { id: 27, name: 'Laetitia H.', location: 'Oise', rating: 5, date: 'Août 2024', text: 'Très rapide efficace prise de rendez vous la veille pour le lendemain enfin quelqu\'un qui se déplace courtois aimable.', service: 'Ramonage' },
  { id: 28, name: 'Danielle V.', location: 'Oise', rating: 5, date: 'Juillet 2024', text: 'Très bonne expérience avec cette société je recommande très agréable personne.', service: 'Ramonage' },
  { id: 29, name: 'Yvette B.', location: 'Oise', rating: 5, date: 'Juin 2024', text: 'Travail correctement effectué tout en respectant l\'intérieur de la maison. Ainsi qu\'une grande gentillesse. Je recommande cette société à 100%', service: 'Entretien poêle à granulés' },
  { id: 30, name: 'RachL B.', location: 'Oise', rating: 5, date: 'Juin 2024', text: 'Je recommande à 100% tant sur la prestation que sur les conseils prodigués par le professionnel !', service: 'Ramonage' },
  { id: 31, name: 'Guerroumist G.', location: 'Oise', rating: 5, date: 'Juin 2024', text: 'Travail soigné, équipe au top. Ponctuelle polis et travailleur. Je recommande les yeux fermés', service: 'Ramonage' },
  { id: 32, name: 'Farouk A.', location: 'Oise', rating: 5, date: 'Avril 2024', text: 'Une équipe super sérieuse et professionnelle!!! Ils ont pris le temps qu\'il fallait.', service: 'Entretien poêle Palazzetti' },
  { id: 33, name: 'Lolo S.', location: 'Oise', rating: 5, date: 'Mars 2024', text: 'Panne de bougie de préchauffage le 13 mars, intervention le lendemain ! Entreprise sérieuse, rapide, professionnelle et technicien très sympa 👍🏻', service: 'Dépannage poêle à granulés' },
  { id: 34, name: 'Gérard G.', location: 'Oise', rating: 5, date: 'Avril 2024', text: 'Entretien poêle à granulés et ramonage parfaitement effectué ! Ce poêle n\'avait jamais été aussi bien nettoyé !! Super travail, et en plus super sympa.', service: 'Entretien & Ramonage' },
  { id: 35, name: 'Didier B.', location: 'Oise', rating: 5, date: 'Avril 2024', text: 'Je recommande cette société, entretien de notre poêle à granulés et ramonage de deux conduits de cheminée réalisés avec un grand professionnalisme.', service: 'Entretien & Ramonage' },
  { id: 36, name: 'M A.', location: 'Oise', rating: 5, date: 'Avril 2024', text: 'Je recommande vivement la société DCS RAMONAGE ! Une équipe très professionnelle, réactive et surtout très sympathique.', service: 'Dépannage poêle' },
  { id: 37, name: 'Pascal', location: 'Oise', rating: 5, date: 'Mars 2024', text: 'Équipe sérieuse et très très professionnelle, le travail effectué a été propre et minutieux, à recommander', service: 'Ramonage' },
  { id: 38, name: 'Estela S.', location: 'Oise', rating: 5, date: 'Mars 2024', text: 'J\'ai fait appel à cette société pour le débistrage du conduit de ma cheminée. Le travail a été fait avec matériel professionnel et proprement. Je suis très satisfaite du résultat.', service: 'Débistrage' },
  { id: 39, name: 'Audrey C.', location: 'Oise', rating: 5, date: 'Mars 2024', text: 'C\'était parfait ! Travail bien fait et personnes très sympathiques. Je recommande vivement', service: 'Ramonage' },
  { id: 40, name: 'Sandrine G.', location: 'Oise', rating: 5, date: 'Mars 2024', text: 'Monsieur très agréable, à l\'écoute et surtout très compétent. Vous pouvez le contacter les yeux fermés.', service: 'Ramonage' },
  { id: 41, name: 'Laurine R.', location: 'Oise', rating: 5, date: 'Février 2024', text: 'Dépannage en urgence, fuite, plusieurs éléments obstrués. Ils étaient là 1h après le premier appel. Professionnels, consciencieux, rassurants et agréables! Je recommande +++', service: 'Dépannage urgence' },
  { id: 42, name: 'Laure G.', location: 'Oise', rating: 5, date: 'Février 2024', text: 'Service pro. Très satisfaite de l\'entretien de mon poêle Piazzetta', service: 'Entretien poêle Piazzetta' },
  { id: 43, name: 'Capucine D.', location: 'Oise', rating: 5, date: 'Janvier 2024', text: 'Professionnels et efficaces je recommande vivement !', service: 'Ramonage' },
  { id: 44, name: 'Jordan D.', location: 'Oise', rating: 5, date: 'Janvier 2024', text: 'Je recommande, professionnel rien à dire 👍', service: 'Ramonage' },
  { id: 45, name: 'Fabien G.', location: 'Oise', rating: 5, date: 'Janvier 2024', text: 'Entreprise sérieuse et réactive, prend le temps nécessaire pour l\'entretien de l\'appareil.', service: 'Entretien poêle' },
  { id: 46, name: 'Amandine G.', location: 'Oise', rating: 5, date: 'Janvier 2024', text: 'Entreprise très professionnelle. Un excellent travail d\'entretien.', service: 'Entretien poêle' },
  { id: 47, name: 'Sylvain G.', location: 'Oise', rating: 5, date: 'Janvier 2024', text: 'Très réactif et efficace. A recommander', service: 'Ramonage' },
  { id: 48, name: 'Xavier L.', location: 'Oise', rating: 5, date: 'Janvier 2024', text: 'Intervention sur mon Piazzetta à granulés le travail est vraiment fait à fond personnel expérimenté consciencieux et agréable je recommande fortement', service: 'Entretien poêle Piazzetta' },
  { id: 49, name: 'Julien V.', location: 'Oise', rating: 5, date: 'Janvier 2024', text: 'Artisan consciencieux et travail de qualité, je recommande sans hésiter.', service: 'Ramonage' },
  { id: 50, name: 'Marcelino B.', location: 'Oise', rating: 5, date: 'Janvier 2024', text: 'Entreprise très consciencieuse et professionnelle. Travail soigné, parfaitement équipée. Une grande rigueur et du sérieux. Rdv déjà pris pour 2026 😁', service: 'Ramonage' },
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
          <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn-primary btn-md inline-flex">Demander un devis gratuit</a>
        </div>
      </div>
    </section>
  );
}
