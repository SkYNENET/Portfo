# Questions pour ton CV, Hector

Tout ce qui est en rouge dans `cv-hector-en-DRAFT.pdf` est marqué "TO CONFIRM" dans
`resume.data.json`. Réponds ici (ou directement dans le JSON), on ne met rien sur le CV
qui ne vienne pas de toi. Règle simple : si tu ne sais pas ou si ce n'est pas exact, on
laisse vide. Un recruteur préfère une ligne de moins qu'une ligne gonflée.

Tes chiffres Roblox et GitHub sont déjà dedans, relevés le 8 octobre 2026 sur les API
publiques : 26 expériences, 56 914 visites, 530 favoris, 1 035 abonnés, tes groupes,
tes jeux, tes dépôts. Si un chiffre te paraît faux, dis-le.

## 1. Identité et contact

1. Ton nom de famille, tel que tu veux qu'il apparaisse.
2. Ta ville et ton pays (sans adresse complète).
3. L'email que tu acceptes de mettre sur un CV public (pas un email perso sensible). Si tu n'en as pas, on peut en créer un dédié.
4. Ton LinkedIn, si tu en as un.
5. Le nom de domaine prévu pour le portfolio, si tu l'as déjà.
6. Tu veux une photo sur la version française ? (Pas sur la version anglaise.)
7. Téléphone sur le CV : oui ou non ? (Par défaut non.)

## 2. Le stage visé

1. Stage ou alternance ?
2. Date de début souhaitée et durée (ex : avril 2027, 6 mois).
3. Où : ville, télétravail possible, prêt à déménager ?
4. Plutôt studio de jeu, boîte web, les deux ?
5. Deux ou trois entreprises ou types d'entreprises que tu vises, si tu as une idée.

## 3. Études

1. Ton école et ta formation exacte (intitulé officiel).
2. En quelle année tu es, et année de fin prévue.
3. Les années de début et de fin pour chaque diplôme ou formation (bac compris si utile).
4. La piscine Python du 12 au 21 février 2026 (tes dépôts Day01Pool à PoolDay10) : c'était dans quel cadre ? Quelle école ou quel organisateur ?
5. Des modules, projets d'école ou notes qui méritent une ligne ?

## 4. Tes rôles dans les communautés

Pour chacun, on a besoin des dates (mois et année de début, et de fin si c'est fini) et de
deux phrases sur ce que tu fais concrètement.

1. Vorld (4 306 membres), tu es "Head Developer" : depuis quand ? Tu développes quoi pour eux ? Sur quels jeux ? Avec combien de personnes ?
2. PDK Community (11 151 membres), tu es "Admin" : depuis quand ? Tu fais quoi (modération, événements, dev) ? Tu as participé au jeu "Kurdish Obbyy" (6 862 visites) ou pas du tout ?
3. Hyper | Games (511 membres), ton groupe : créé quand ? Vous êtes combien ? Qui fait quoi ?
4. Tes autres groupes (AVortexGame, Lucky Block Factory Group, Chill Games fr, OG Game 2017) : c'est toi seul ou une équipe ? AVortexGame appartient à BlueShotss, tu es "Owners" : c'est un projet à deux ?
5. Les liens Discord de ces communautés, si tu veux qu'ils apparaissent sur le portfolio.

## 5. Tes jeux

Pour chaque jeu, les mêmes trois questions :
a) ton rôle : solo, scripteur, builder, ou équipe de combien ?
b) ce que tu as codé toi-même (systèmes, UI, data, monétisation...) ;
c) les outils au-delà de Luau et Roblox Studio (DataStore, Blender, plugins...).

1. Monster Mayhem (16 721 visites, 267 favoris, 96 % de likes). Tu as fait quoi dessus ? Il est toujours en bêta ?
2. Search For The Egg (9 275 visites, 169 favoris). Même question.
3. Escape Knockout for Speed (10 164 visites). Il n'a aucune description publique : c'est quoi comme jeu, en une phrase ?
4. Don't Eat Poisoned Slime (7 004 visites). Même question.
5. Salle Ancienne Rush (4 468 visites, 92 % de likes), ton premier jeu, sur ton compte perso, deux jours après la création du compte. La description crédite "j_judes" pour les graphismes : tu as fait tout le reste ?
6. Room Rush (4 151 visites). La description crédite @HyperDev7 (dev), @mykinglisa (scripter) et @BlueShotss (VFX), et pas Vbrut0x. Tu es l'un d'eux ? Sinon quel était ton rôle ?
7. Run For Dinosaurs (2 621 visites) et Lucky Block Factory (1 664 visites). Ton rôle sur chacun ?
8. Parmi ces 8 jeux, lesquels tu veux sur le CV (max 4) et lesquels sur le portfolio ?
9. Les 18 autres expériences (quiz, tests, prototypes) restent cachées. D'accord ?

## 6. Tes projets web et GitHub

1. alike.io (jeu type diep.io en TypeScript sur Canvas) : solo ? Combien de temps ? C'est jouable en ligne quelque part ?
2. roblox-followers-api (août 2025, Node.js) : ça fait quoi exactement ? Tu t'en es servi pour quoi ?
3. Le portfolio lui-même (React + TypeScript + Vite + Vercel) : tu veux le mettre comme projet ? Si oui, dis ce que tu as fait dedans toi-même.
4. D'autres projets, école ou perso, même pas sur GitHub ?

## 7. Compétences

Dis seulement ce que tu sais vraiment utiliser, avec un niveau honnête (bases / à l'aise / avancé).

1. Luau et Roblox Studio : à l'aise ou avancé ? Tu utilises DataStore, ProfileService, Knit, Rojo, autre chose ?
2. TypeScript et JavaScript : niveau ?
3. Python : niveau, et tu l'utilises pour quoi ?
4. Node.js, React, bases de données (SQL, Supabase, Firebase...) : lesquels, niveau ?
5. Git : tu bosses en branches et pull requests, ou juste des commits ?
6. Outils : Linux, Figma, Blender, Photoshop, autre ?

## 8. Langues et divers

1. Français : langue maternelle ?
2. Anglais : niveau (ex : B2, courant, TOEIC...) ?
3. D'autres langues ?
4. Deux ou trois centres d'intérêt courts, liés ou pas au jeu.
5. Prix, hackathons, game jams, concours ?

## Quand tu as répondu

Simon (ou Claude) reporte tes réponses dans `resume.data.json`, relance
`python3 docs/resume/build.py --final`, et tu relis le PDF avant tout envoi.
