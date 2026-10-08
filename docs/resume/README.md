# Resume kit (CV d'Hector)

Un CV une page, A4, ATS-friendly, généré à partir d'un seul fichier de données.
Rien n'est inventé : tout champ inconnu vaut `"TO CONFIRM"` et ressort en rouge dans le brouillon.

## Fichiers

- `resume.data.json` : toutes les données du CV (identité, cible, profil, compétences, expérience, projets, études, divers). C'est le seul fichier à remplir.
- `template.html` : la mise en page (une colonne, Georgia pour le nom, Helvetica Neue pour le corps, bleu marine pour les titres). Ne contient aucune donnée.
- `build.py` : injecte le JSON dans le template, écrit `cv-hector-en.html`, imprime le PDF avec Chrome headless et vérifie qu'il tient sur une page (PyMuPDF).
- `QUESTIONS.md` : le questionnaire pour Hector, section par section.
- Sorties : `cv-hector-en.html`, `cv-hector-en-DRAFT.pdf` (brouillon, rouge) ou `cv-hector-en.pdf` (final).

## Les 3 commandes

Depuis la racine du dépôt (ou n'importe où, le script retrouve son dossier) :

```bash
python3 docs/resume/build.py            # 1. brouillon : TO CONFIRM en rouge -> cv-hector-en-DRAFT.pdf
#    ... remplir resume.data.json avec les réponses d'Hector (QUESTIONS.md) ...
python3 docs/resume/build.py --final    # 2. version propre : champs TO CONFIRM retirés -> cv-hector-en.pdf
open docs/resume/cv-hector-en.pdf       # 3. relire, puis copier vers public/cv.pdf pour le bouton "Resume" du site
```

Option `--no-pdf` pour ne produire que le HTML (utile pour ajuster le template dans un navigateur).

## Comment remplir

- Remplacer chaque `"TO CONFIRM"` par la vraie valeur, ou par `""` (chaîne vide) pour retirer la ligne.
  Ce que fait `--final` avec ce qui reste : une valeur ou une puce qui commence par `TO CONFIRM` est
  supprimée entière ; une parenthèse qui le contient est retirée (`French (TO CONFIRM level)` donne `French`) ;
  une clause après `,` ou `;` qui commence par `TO CONFIRM` est coupée jusqu'à la fin de la phrase.
  Relire le PDF final quand même.
- Les nombres (visites, favoris) restent des nombres dans le JSON, le template les formate (`16,721`).
- `projects` : 5 entrées max pour tenir sur une page. Les autres jeux vérifiés sont dans `projects_more`,
  il suffit de déplacer un bloc d'une liste à l'autre.
- `show_liked` : affiche le pourcentage de likes d'un jeu (vrai seulement là où il est flatteur).
- Les clés qui commencent par `_` (sources, preuves) ne sont jamais rendues.
- Tout texte du CV est en anglais. Pour une version française, dupliquer le JSON en `resume.data.fr.json`
  et lancer `python3 docs/resume/build.py --data docs/resume/resume.data.fr.json` (les titres de section
  du template restent à traduire dans une copie `template.fr.html` passée avec `--template`).

## Garde-fous

- Jamais de téléphone, d'adresse ou d'email privé dans ce dossier (le dépôt est public).
- Le script vérifie que le PDF fait exactement 1 page et avertit sinon (code de sortie 2).
- Chrome headless utilise un profil temporaire sous `docs/resume/.chrome/` (ignoré par git, supprimé après).
- Les données Roblox viennent de `docs/data/roblox.json` (8 octobre 2026). Pour rafraîchir les chiffres :
  `python3 docs/data/fetch_roblox.py` puis reporter les nouvelles valeurs dans le JSON.
