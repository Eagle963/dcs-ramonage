import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | DCS Ramonage',
  description: 'Conditions générales de vente des prestations de ramonage et d\'entretien de DCS Ramonage.',
  robots: { index: false, follow: false },
};

export default function CGVPage() {
  return (
    <>
      <section className="pt-32 pb-8 bg-mesh">
        <div className="container-site">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900">
            Conditions Générales de Vente
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site">
          <div className="max-w-3xl prose prose-secondary">
            
            <h2>Article 1 - Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations 
              contractuelles entre {siteConfig.company.name} et ses clients pour toutes 
              les prestations de ramonage, d'entretien et de travaux de fumisterie.
            </p>

            <h2>Article 2 - Prestations</h2>
            <p>
              {siteConfig.company.name} propose les prestations suivantes :
            </p>
            <ul>
              <li>Ramonage de cheminées, inserts, poêles à bois et chaudières</li>
              <li>Entretien de poêles à granulés</li>
              <li>Débistrage de conduits</li>
              <li>Diagnostic et inspection de conduits</li>
              <li>Tubage et rénovation de conduits</li>
              <li>Pose d'accessoires de fumisterie</li>
              <li>Nettoyage et démoussage (toitures, murs, sols, vérandas)</li>
            </ul>

            <h2>Article 3 - Tarifs</h2>
            <p>
              Les tarifs des prestations sont indiqués en euros TTC sur notre site 
              internet et dans nos devis. Ils comprennent le déplacement dans notre 
              zone d'intervention (Oise et Val-d'Oise).
            </p>
            <p>
              Pour les professionnels, les tarifs sont indiqués en HT.
            </p>
            <p>
              {siteConfig.company.name} se réserve le droit de modifier ses tarifs à 
              tout moment. Les prestations sont facturées sur la base des tarifs en 
              vigueur au moment de la commande.
            </p>

            <h2>Article 4 - Devis</h2>
            <p>
              Pour les prestations dont le prix n'est pas fixé à l'avance (débistrage, 
              tubage, travaux spécifiques), un devis gratuit est établi préalablement.
            </p>
            <p>
              Le devis est valable 30 jours à compter de sa date d'émission. 
              L'acceptation du devis par le client vaut commande ferme.
            </p>

            <h2>Article 5 - Contact et rendez-vous</h2>
            <p>
              Vous pouvez nous contacter :
            </p>
            <ul>
              <li>Via notre <a href="/contact">page de contact</a> sur le site internet</li>
              <li>Par téléphone</li>
            </ul>
            <p>
              Le client s'engage à être présent au rendez-vous convenu ou à le reporter 
              au moins 24 heures à l'avance. En cas d'absence non signalée, des frais 
              de déplacement pourront être facturés.
            </p>

            <h2>Article 6 - Exécution des prestations</h2>
            <p>
              Les prestations sont réalisées selon les règles de l'art et dans le 
              respect des normes en vigueur (notamment DTU 24.1 pour les travaux de 
              fumisterie).
            </p>
            <p>
              Le client s'engage à permettre l'accès aux installations concernées et 
              à signaler toute information utile au bon déroulement de l'intervention.
            </p>

            <h2>Article 7 - Certificat de ramonage</h2>
            <p>
              Un certificat de ramonage est remis au client après chaque intervention 
              de ramonage. Ce document atteste de la bonne exécution de la prestation 
              et peut être exigé par votre assurance en cas de sinistre.
            </p>

            <h2>Article 8 - Paiement</h2>
            <p>
              Le paiement est dû à la fin de l'intervention. Les modes de paiement 
              acceptés sont :
            </p>
            <ul>
              <li>Espèces</li>
              <li>Chèque</li>
              <li>Virement bancaire</li>
            </ul>
            <p>
              En cas de retard de paiement, des pénalités de retard seront appliquées 
              au taux légal en vigueur.
            </p>

            <h2>Article 9 - Annulation</h2>
            <p>
              Toute annulation de rendez-vous doit être signalée au moins 24 heures 
              à l'avance. Passé ce délai, des frais d'annulation correspondant aux 
              frais de déplacement pourront être facturés.
            </p>

            <h2>Article 10 - Responsabilité</h2>
            <p>
              {siteConfig.company.name} est assuré pour les dommages pouvant survenir 
              lors de ses interventions. En cas de dommage, le client doit le signaler 
              immédiatement et par écrit.
            </p>
            <p>
              La responsabilité de {siteConfig.company.name} ne saurait être engagée 
              pour des dommages résultant d'un mauvais entretien antérieur, d'une 
              utilisation non conforme des installations ou de vices cachés.
            </p>

            <h2>Article 11 - Garantie</h2>
            <p>
              Les prestations de ramonage et d'entretien sont garanties dans le cadre 
              d'une utilisation normale des installations. Les travaux de tubage et 
              de fumisterie sont couverts par la garantie légale de conformité.
            </p>

            <h2>Article 12 - Réclamations</h2>
            <p>
              Toute réclamation doit être adressée par écrit à {siteConfig.company.name} 
              dans un délai de 8 jours suivant l'intervention via notre{' '}
              <a href="/contact">page de contact</a>.
            </p>

            <h2>Article 13 - Droit de rétractation</h2>
            <p>
              Conformément à l'article L221-28 du Code de la consommation, le droit 
              de rétractation ne s'applique pas aux prestations de services pleinement 
              exécutées avant la fin du délai de rétractation et dont l'exécution a 
              commencé avec l'accord préalable du consommateur.
            </p>

            <h2>Article 14 - Données personnelles</h2>
            <p>
              Les données personnelles collectées sont traitées conformément à notre{' '}
              <a href="/politique-confidentialite">Politique de Confidentialité</a>.
            </p>

            <h2>Article 15 - Litiges</h2>
            <p>
              En cas de litige, une solution amiable sera recherchée avant toute 
              action judiciaire. À défaut d'accord, les tribunaux compétents seront 
              ceux du ressort du siège social de {siteConfig.company.name}.
            </p>
            <p>
              Le client peut également recourir à un médiateur de la consommation. 
              La liste des médiateurs est disponible sur le site du Ministère de 
              l'Économie.
            </p>

            <h2>Article 16 - Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit français.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
