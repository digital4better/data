# Audit SEO et accès des agents — 8 septembre 2026

Périmètre : version locale générée, hébergée à terme sous `https://digital4better.github.io/data/`. Aucun déploiement effectué pendant cet audit.

## Résultats locaux

Lighthouse CLI, Chrome headless, profil mobile par défaut : SEO **100/100** sur dix URL : accueils FR/EN, six collections FR, fiche EN cloud/aws-regions et guide EN electricity. Rapports JSON/HTML disponibles localement dans `site/.audit/` (non versionnés). Les scores Lighthouse sont des mesures de laboratoire, pas une preuve d’indexation ou des données terrain Core Web Vitals.

Audits complets : accueil FR et fiche cloud EN à 100 dans les quatre catégories. Mix FR : 82 en performance avant correction du chargement, 100 après ; SEO, accessibilité automatisée et bonnes pratiques à 100. CLS du mix réduit de 0,361 à 0 en réservant l’espace du chargement et de la carte. Les contrôles SEO supplémentaires des autres pages ont été réalisés avant cette dernière correction de présentation et l’ajout de l’image sociale ; les 124 pages finales ont ensuite passé les tests statiques.

Build, compilation TypeScript et **19 tests** réussis. Contrôles sur les 124 pages : descriptions uniques, H1, canoniques propres, alternances FR/EN, JSON-LD Dataset/DataCatalog/DataDownload, existence des liens locaux et téléchargements, schémas et fichiers source préservés. Aucune page géographie/distances dans le sitemap.

## Corrections

- Redirection immédiate sans JavaScript de `/data/` vers `/data/en/`, canonical et liens de secours bilingues ; destination vérifiée dans le navigateur.
- Descriptions distinctes par fiche et pages méthodologie/réutilisation.
- Métadonnées complètes des Dataset imbriqués dans les DataCatalog.
- Image de partage PNG 1200 × 630, Open Graph et Twitter.
- Page 404 marquée noindex.
- `/data/llms.txt`, liens de découverte dans chaque page et pied de page ; catalogue JSON enrichi avec sources, licence, liens bilingues et téléchargements absolus.

## Ora : limite de périmètre constatée

Appel effectué à `POST https://ora.ai/api/scan?include=essentials` avec `{"url":"https://digital4better.github.io/data/"}`. Réponse complète conservée dans `site/.audit/ora-live.json`.

Ora a normalisé cette URL en `https://digital4better.github.io/` : score global 31/100, essentials 70/100. **Ces scores ne mesurent pas le catalogue `/data/` et ne valident pas la version locale.** Plusieurs diagnostics concernent même GitHub et ses interfaces, donc ne doivent pas être appliqués aveuglément à ce catalogue statique. Le scan local Ora nécessite un tunnel public ; aucune exposition ni publication supplémentaire n’a été réalisée.

La version locale fournit déjà ses descriptions et liens de téléchargement sans JavaScript ; les agents peuvent récupérer directement le catalogue JSON et les fichiers source. llms.txt facilite la découverte selon une proposition émergente : il ne garantit ni son utilisation par tous les modèles ni une citation dans leurs réponses.

## GitHub Pages et vérifications après publication

La racine de ce projet est `/data/`. La racine du domaine `/` et `/robots.txt` relèvent du dépôt du site de l’organisation ; ce projet ne peut pas les rediriger/configurer. `/robots.txt` répond actuellement 404 : cela n’est pas une interdiction de crawl. Ne pas placer un robots.txt trompeur sous `/data/`.

GitHub Pages sert des fichiers statiques : la redirection utilise une meta refresh immédiate, pas un code HTTP 301 configurable. Google documente cette solution lorsque la plateforme ne permet pas une redirection serveur.

Au moment du contrôle, `/data/fr/` et `/data/sitemap.xml` publics répondent 404. Après déploiement autorisé : vérifier les statuts HTTP des routes et de la vraie 404, la redirection, les téléchargements et métadonnées publics ; soumettre le sitemap dans Search Console et contrôler l’indexation ainsi que les résultats enrichis Dataset. Ces dernières vérifications ne sont pas effectuées faute de version publiée et d’accès Search Console.

Références : [Google — redirections](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [Ora — API](https://ora.ai/docs), [llms.txt — découverte sous un chemin de projet](https://llmstxt.org/changes.html).
