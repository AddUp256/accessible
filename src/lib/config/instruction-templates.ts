/** R?le : Configuration d?clarative Instruction Templates : donn?es m?tier sans effet de bord. */
/** Exemples de consignes pour tester le découpage. */

export interface InstructionTemplate {
	id: string;
	title: string;
	text: string;
}

export const INSTRUCTION_TEMPLATES: InstructionTemplate[] = [
	{
		id: 'expose',
		title: 'Exposé oral',
		text: `Préparez un exposé de 5 minutes sur un sujet de votre choix.
1. Choisissez un sujet qui vous intéresse.
2. Cherchez 3 sources fiables.
3. Rédigez un plan en 3 parties.
4. Préparez une conclusion.
Rendez le plan avant vendredi 17 h.`
	},
	{
		id: 'lecture',
		title: 'Fiche de lecture',
		text: `Lisez le chapitre 4 du manuel.
- Notez les personnages principaux.
- Résumez l'intrigue en 5 phrases maximum.
- Écrivez une question que vous avez encore.
Date limite : lundi prochain.`
	},
	{
		id: 'email',
		title: 'E-mail formel',
		text: `Rédigez un e-mail à votre professeur pour demander un rendez-vous. Expliquez brièvement votre demande. Utilisez une formule de politesse au début et à la fin. Relisez avant d'envoyer.`
	}
];
