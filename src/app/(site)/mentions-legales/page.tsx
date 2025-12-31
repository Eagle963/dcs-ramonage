import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ProtectedEmail } from '@/components/ui/ProtectedEmail';

export const metadata: Metadata = {
  title: 'Mentions Légales | DCS Ramonage',
  description: 'Mentions légales du site DCS Ramonage.',
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <section className="pt-32 pb-8 bg-mesh">
        <div className="container-site">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900">
            Mentions Légales
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site">
          <div className="max-w-3xl prose prose-secondary">
            
            <h2>1. Éditeur du site</h2>
            <p>
              Le site <strong>{siteConfig.urls.website}</strong> est édité par : {siteConfig.company.name}
            </p>

            <h2>2. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, etc.) 
              est la propriété exclusive de {siteConfig.company.name} ou de ses partenaires 
              et est protégé par les lois françaises et internationales relatives à la 
              propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication, transmission, 
              dénaturation, totale ou partielle du site ou de son contenu, par quelque 
              procédé que ce soit, et sur quelque support que ce soit est interdite sans 
              autorisation écrite préalable.
            </p>

            <h2>3. Données personnelles</h2>
            <p>
              Les informations recueillies via le formulaire de contact sont destinées 
              à {siteConfig.company.name} pour la gestion de vos demandes. Conformément 
              au Règlement Général sur la Protection des Données (RGPD) et à la loi 
              Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, 
              de suppression et d'opposition aux données vous concernant.
            </p>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter via notre{' '}
              <a href="/contact">page de contact</a>.
            </p>
            <p>
              Pour plus d'informations, consultez notre{' '}
              <a href="/politique-confidentialite">Politique de Confidentialité</a>.
            </p>

            <h2>4. Cookies</h2>
            <p>
              Le site peut utiliser des cookies pour améliorer l'expérience utilisateur 
              et réaliser des statistiques de visite. En naviguant sur ce site, vous 
              acceptez l'utilisation de cookies conformément à notre politique de 
              confidentialité.
            </p>

            <h2>5. Liens hypertextes</h2>
            <p>
              Le site peut contenir des liens vers d'autres sites internet. 
              {siteConfig.company.name} n'exerce aucun contrôle sur ces sites et 
              décline toute responsabilité quant à leur contenu.
            </p>

            <h2>6. Limitation de responsabilité</h2>
            <p>
              {siteConfig.company.name} s'efforce d'assurer l'exactitude des informations 
              diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, 
              la précision ou l'exhaustivité des informations mises à disposition.
            </p>
            <p>
              En conséquence, {siteConfig.company.name} décline toute responsabilité 
              pour toute imprécision, inexactitude ou omission portant sur des informations 
              disponibles sur le site.
            </p>

            <h2>7. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont soumises au droit français. 
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>

            <h2>8. Contact</h2>
            <p>
              Pour toute question concernant ces mentions légales, vous pouvez nous 
              contacter via notre <a href="/contact">page de contact</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
