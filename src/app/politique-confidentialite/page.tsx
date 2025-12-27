import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ProtectedEmail } from '@/components/ui/ProtectedEmail';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | DCS Ramonage',
  description: 'Politique de confidentialité et de protection des données personnelles du site DCS Ramonage.',
  robots: { index: false, follow: false },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <section className="pt-32 pb-8 bg-mesh">
        <div className="container-site">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900">
            Politique de Confidentialité
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site">
          <div className="max-w-3xl prose prose-secondary">
            
            <p className="lead">
              {siteConfig.company.name} s'engage à protéger la vie privée des utilisateurs 
              de son site internet. Cette politique de confidentialité explique comment 
              nous collectons, utilisons et protégeons vos données personnelles.
            </p>

            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles est <strong>{siteConfig.company.name}</strong>.
              <br />
              Pour nous contacter, rendez-vous sur notre <a href="/contact">page de contact</a>.
            </p>

            <h2>2. Données collectées</h2>
            <p>
              Nous collectons les données personnelles suivantes lorsque vous utilisez 
              notre formulaire de contact :
            </p>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Code postal</li>
              <li>Type de service souhaité</li>
              <li>Message / description de votre besoin</li>
            </ul>

            <h2>3. Finalités du traitement</h2>
            <p>
              Vos données personnelles sont collectées pour les finalités suivantes :
            </p>
            <ul>
              <li>Répondre à vos demandes de devis</li>
              <li>Planifier et confirmer vos rendez-vous</li>
              <li>Établir les documents commerciaux (devis, factures)</li>
              <li>Assurer le suivi de nos interventions</li>
              <li>Vous envoyer des rappels d'entretien (avec votre consentement)</li>
            </ul>

            <h2>4. Base légale du traitement</h2>
            <p>
              Le traitement de vos données repose sur :
            </p>
            <ul>
              <li>L'exécution d'un contrat ou de mesures précontractuelles</li>
              <li>Votre consentement explicite</li>
              <li>Notre intérêt légitime à développer notre activité</li>
              <li>Le respect de nos obligations légales</li>
            </ul>

            <h2>5. Durée de conservation</h2>
            <p>
              Vos données personnelles sont conservées :
            </p>
            <ul>
              <li><strong>Données clients :</strong> 5 ans après la dernière intervention</li>
              <li><strong>Données prospects :</strong> 3 ans après le dernier contact</li>
              <li><strong>Factures et documents comptables :</strong> 10 ans (obligation légale)</li>
            </ul>

            <h2>6. Destinataires des données</h2>
            <p>
              Vos données personnelles sont destinées exclusivement à {siteConfig.company.name} 
              et ne sont pas transmises à des tiers, sauf :
            </p>
            <ul>
              <li>Prestataires techniques (hébergement, emailing) dans le cadre strict de leurs missions</li>
              <li>Autorités compétentes en cas d'obligation légale</li>
            </ul>

            <h2>7. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul>
              <li><strong>Droit d'accès :</strong> obtenir la confirmation que des données vous concernant sont traitées</li>
              <li><strong>Droit de rectification :</strong> demander la correction de données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la limitation :</strong> demander la limitation du traitement</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous via notre <a href="/contact">page de contact</a>.
            </p>
            <p>
              Vous pouvez également introduire une réclamation auprès de la CNIL 
              (Commission Nationale de l'Informatique et des Libertés) : 
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>

            <h2>8. Cookies</h2>
            <p>
              Notre site utilise des cookies pour :
            </p>
            <ul>
              <li><strong>Cookies essentiels :</strong> fonctionnement du site</li>
              <li><strong>Cookies analytiques :</strong> mesure d'audience</li>
            </ul>
            <p>
              Vous pouvez configurer votre navigateur pour refuser les cookies ou 
              être averti lorsqu'un cookie est envoyé.
            </p>

            <h2>9. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles 
              appropriées pour protéger vos données personnelles contre la destruction 
              accidentelle ou illicite, la perte, l'altération, la divulgation ou 
              l'accès non autorisé.
            </p>

            <h2>10. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité 
              à tout moment. Les modifications prendront effet dès leur publication sur 
              cette page.
            </p>

            <h2>11. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou 
              pour exercer vos droits, rendez-vous sur notre <a href="/contact">page de contact</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
