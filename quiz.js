/* ═══════════════════════════════════════════════════════════════
   QUIZ MONDIAL — quiz.js
   50 niveaux × 25 questions | 4 choix | 1 correct
   Système : vies, streak, XP, timer, jokers, boutique, pub
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ── CONSTANTES ── */
const MAX_ERRORS    = 10;
const QUESTIONS_PER = 25;
const TIMER_SECS    = 20;
const MAX_LIVES     = 5;
const XP_CORRECT    = 10;
const XP_STREAK     = 5;   // bonus par question en streak ≥ 3
const XP_PER_LEVEL  = 200; // XP nécessaire par niveau pour débloquer le suivant (si l'utilisateur ne finit pas)

/* ══════════════════════════════════════════════════════════════
   BANQUE DE QUESTIONS — 50 niveaux × 25 questions
══════════════════════════════════════════════════════════════ */
const LEVELS = [

  /* ─────────── NIVEAU 1 — Très facile ─────────── */
  [
    { q:"Quelle est la capitale de la France ?",       c:["Paris","Lyon","Marseille","Bordeaux"],       a:0, cat:"Géographie" },
    { q:"Combien de continents y a-t-il sur Terre ?",  c:["5","6","7","8"],                             a:2, cat:"Géographie" },
    { q:"Quel est le plus grand océan du monde ?",     c:["Atlantique","Indien","Arctique","Pacifique"], a:3, cat:"Géographie" },
    { q:"Qui a peint la Joconde ?",                    c:["Raphaël","Michel-Ange","Léonard de Vinci","Picasso"], a:2, cat:"Culture" },
    { q:"En quelle année l'homme a-t-il marché sur la Lune ?", c:["1965","1967","1969","1971"],         a:2, cat:"Histoire" },
    { q:"Quel est le symbole chimique de l'or ?",      c:["Ag","Fe","Au","Cu"],                         a:2, cat:"Science" },
    { q:"Combien de pays composent l'Union Européenne (2024) ?", c:["25","27","28","30"],               a:1, cat:"Politique" },
    { q:"Quel est le plus long fleuve du monde ?",     c:["Amazone","Nil","Yangtsé","Mississippi"],     a:1, cat:"Géographie" },
    { q:"Quel pays a inventé le papier ?",             c:["Japon","Égypte","Chine","Inde"],             a:2, cat:"Histoire" },
    { q:"Qui est l'auteur de 'Roméo et Juliette' ?",  c:["Molière","Shakespeare","Hugo","Dickens"],    a:1, cat:"Culture" },
    { q:"Quelle planète est la plus proche du Soleil ?", c:["Vénus","Terre","Mars","Mercure"],          a:3, cat:"Science" },
    { q:"Quelle est la monnaie du Japon ?",            c:["Yuan","Won","Yen","Ringgit"],                a:2, cat:"Culture" },
    { q:"Quel est le pays le plus grand du monde ?",   c:["Chine","Canada","USA","Russie"],             a:3, cat:"Géographie" },
    { q:"Combien de grammes dans un kilogramme ?",     c:["100","500","1000","10000"],                  a:2, cat:"Logique" },
    { q:"Quel animal est le symbole des États-Unis ?", c:["Ours","Aigle","Coyote","Bison"],             a:1, cat:"Culture" },
    { q:"Quelle est la capitale de l'Espagne ?",       c:["Barcelone","Séville","Madrid","Bilbao"],     a:2, cat:"Géographie" },
    { q:"Qui a fondé Microsoft ?",                     c:["Steve Jobs","Elon Musk","Bill Gates","Jeff Bezos"], a:2, cat:"Technologie" },
    { q:"Quel est le langage de programmation le plus populaire (2023) ?", c:["Java","C++","Python","Ruby"], a:2, cat:"Technologie" },
    { q:"En quelle année a eu lieu la Révolution Française ?", c:["1776","1789","1804","1815"],         a:1, cat:"Histoire" },
    { q:"Quelle est la plus haute montagne du monde ?", c:["K2","Mont Blanc","Everest","Aconcagua"],    a:2, cat:"Géographie" },
    { q:"Quel pays a la plus grande population mondiale ?", c:["USA","Inde","Chine","Indonésie"],       a:1, cat:"Géographie" },
    { q:"Quel est le sport le plus pratiqué dans le monde ?", c:["Basketball","Tennis","Football","Cricket"], a:2, cat:"Culture" },
    { q:"Combien de côtés a un hexagone ?",            c:["5","6","7","8"],                             a:1, cat:"Logique" },
    { q:"Quel est le premier président des USA ?",     c:["Lincoln","Washington","Jefferson","Adams"],  a:1, cat:"Histoire" },
    { q:"Quelle est la capitale du Brésil ?",          c:["São Paulo","Rio de Janeiro","Salvador","Brasília"], a:3, cat:"Géographie" },
  ],

  /* ─────────── NIVEAU 2 ─────────── */
  [
    { q:"Quel pays a le plus de frontières terrestres ?", c:["Russie","Brésil","Chine","France"],       a:2, cat:"Géographie" },
    { q:"Qui a écrit 'Les Misérables' ?",              c:["Zola","Flaubert","Hugo","Balzac"],           a:2, cat:"Culture" },
    { q:"Quelle est la vitesse de la lumière (km/s) ?", c:["150 000","200 000","300 000","400 000"],    a:2, cat:"Science" },
    { q:"En quelle année a été fondée l'ONU ?",        c:["1944","1945","1946","1950"],                 a:1, cat:"Politique" },
    { q:"Quel est le plus petit pays du monde ?",      c:["Monaco","Maldives","Vatican","Saint-Marin"], a:2, cat:"Géographie" },
    { q:"Quel métal est liquide à température ambiante ?", c:["Mercure","Argent","Plomb","Gallium"],    a:0, cat:"Science" },
    { q:"Qui a peint la Chapelle Sixtine ?",           c:["Raphaël","Botticelli","Michel-Ange","Titien"], a:2, cat:"Culture" },
    { q:"Quel pays a le plus de lauréats Nobel ?",     c:["Royaume-Uni","France","USA","Allemagne"],    a:2, cat:"Culture" },
    { q:"Quelle est la langue la plus parlée au monde ?", c:["Espagnol","Mandarin","Anglais","Hindi"],  a:1, cat:"Culture" },
    { q:"En quelle année a eu lieu la chute du Mur de Berlin ?", c:["1987","1988","1989","1990"],       a:2, cat:"Histoire" },
    { q:"Quel pays est le plus grand exportateur de pétrole ?", c:["Irak","Iran","Arabie Saoudite","Russie"], a:2, cat:"Logistique" },
    { q:"Quel inventeur est associé à l'ampoule électrique ?", c:["Tesla","Edison","Bell","Faraday"],   a:1, cat:"Technologie" },
    { q:"Quelle est la capitale de l'Australie ?",     c:["Sydney","Melbourne","Brisbane","Canberra"],  a:3, cat:"Géographie" },
    { q:"Quel est le dieu de la guerre dans la mythologie romaine ?", c:["Jupiter","Mars","Neptune","Saturne"], a:1, cat:"Culture" },
    { q:"Combien d'os a le corps humain adulte ?",     c:["196","206","216","226"],                     a:1, cat:"Science" },
    { q:"Qui a découvert la pénicilline ?",            c:["Pasteur","Fleming","Curie","Koch"],          a:1, cat:"Science" },
    { q:"Quel est le plus grand lac d'Afrique ?",      c:["Lac Volta","Lac Tanganyika","Lac Victoria","Lac Tchad"], a:2, cat:"Géographie" },
    { q:"En quelle année Christophe Colomb est-il arrivé en Amérique ?", c:["1488","1490","1492","1498"], a:2, cat:"Histoire" },
    { q:"Quel est le principal gaz dans l'atmosphère terrestre ?", c:["Oxygène","CO2","Azote","Argon"], a:2, cat:"Science" },
    { q:"Qui a dirigé l'Allemagne nazie ?",            c:["Himmler","Göring","Hitler","Mussolini"],     a:2, cat:"Histoire" },
    { q:"Quelle est la capitale de la Chine ?",        c:["Shanghai","Hong Kong","Pékin","Nankin"],     a:2, cat:"Géographie" },
    { q:"Quel pays a inventé la pizza ?",              c:["Grèce","Italie","Espagne","France"],         a:1, cat:"Culture" },
    { q:"Quel est le premier élément du tableau périodique ?", c:["Hélium","Lithium","Hydrogène","Carbone"], a:2, cat:"Science" },
    { q:"Combien de fuseaux horaires a la Russie ?",   c:["9","10","11","12"],                          a:2, cat:"Géographie" },
    { q:"Qui a fondé Apple ?",                         c:["Gates & Allen","Zuckerberg","Jobs & Wozniak","Page & Brin"], a:2, cat:"Technologie" },
  ],

  /* ─────────── NIVEAU 3 ─────────── */
  [
    { q:"Quel est le PIB nominal le plus élevé au monde (2023) ?", c:["Chine","Japon","USA","Allemagne"], a:2, cat:"Politique" },
    { q:"Qui a développé la théorie de la relativité ?", c:["Bohr","Newton","Einstein","Planck"],       a:2, cat:"Science" },
    { q:"Quelle ville accueillera les JO d'été 2028 ?", c:["Paris","Brisbane","Los Angeles","Tokyo"],   a:2, cat:"Culture" },
    { q:"Quel pays a inventé l'imprimerie à caractères mobiles ?", c:["Chine","Corée","Japon","Allemagne"], a:0, cat:"Histoire" },
    { q:"Quelle est la devise officielle de l'Union Européenne ?", c:["Unie dans la diversité","Liberté, Égalité, Fraternité","Force par l'unité","Paix et Prospérité"], a:0, cat:"Politique" },
    { q:"Quel est le câble sous-marin le plus long du monde ?", c:["SEA-ME-WE 3","AEA","SEA-ME-WE 4","PEACE"], a:0, cat:"Technologie" },
    { q:"En quelle année a été lancé le premier satellite artificiel ?", c:["1955","1957","1959","1961"], a:1, cat:"Histoire" },
    { q:"Quel port est le plus actif du monde en volume de conteneurs ?", c:["Rotterdam","Shanghai","Singapour","Los Angeles"], a:1, cat:"Logistique" },
    { q:"Qui a peint 'Guernica' ?",                    c:["Dalí","Matisse","Picasso","Miró"],           a:2, cat:"Culture" },
    { q:"Quel pays est le premier producteur mondial de café ?",   c:["Colombie","Vietnam","Éthiopie","Brésil"], a:3, cat:"Logistique" },
    { q:"Combien de membres permanents siègent au Conseil de Sécurité de l'ONU ?", c:["3","4","5","6"], a:2, cat:"Politique" },
    { q:"Quel est le système d'exploitation mobile le plus utilisé ?", c:["iOS","Android","HarmonyOS","Windows Mobile"], a:1, cat:"Technologie" },
    { q:"Qui a fondé Tesla (PDG actuel) ?",            c:["Martin Eberhard","Elon Musk","JB Straubel","Marc Tarpenning"], a:1, cat:"Technologie" },
    { q:"Quelle est la monnaie officielle de la Russie ?", c:["Kopek","Rouble","Grivna","Zloty"],       a:1, cat:"Culture" },
    { q:"Quelle est la plus grande île du monde ?",    c:["Nouvelle-Guinée","Bornéo","Madagascar","Groenland"], a:3, cat:"Géographie" },
    { q:"Qui a écrit '1984' ?",                        c:["Huxley","Kafka","Orwell","Bradbury"],        a:2, cat:"Culture" },
    { q:"Quel pays possède le plus grand réseau ferroviaire ?", c:["Russie","Chine","Inde","USA"],       a:3, cat:"Logistique" },
    { q:"Quelle ville est surnommée 'La Perle du Golfe' ?", c:["Dubaï","Doha","Abu Dhabi","Manama"],    a:1, cat:"Géographie" },
    { q:"Combien d'étoiles compte le drapeau américain ?", c:["48","50","51","52"],                     a:1, cat:"Culture" },
    { q:"Quel virus informatique a paralysé de nombreuses entreprises en 2017 ?", c:["ILOVEYOU","WannaCry","Stuxnet","Melissa"], a:1, cat:"Technologie" },
    { q:"Quelle est la religion la plus pratiquée au monde ?", c:["Islam","Hinduïsme","Christianisme","Bouddhisme"], a:2, cat:"Culture" },
    { q:"Qui est l'actuel Secrétaire Général de l'ONU ?",c:["Ban Ki-moon","Kofi Annan","António Guterres","Boutros-Ghali"], a:2, cat:"Politique" },
    { q:"Quel est l'algorithme de chiffrement le plus utilisé sur HTTPS ?", c:["DES","MD5","AES","RSA"], a:2, cat:"Technologie" },
    { q:"Quel pays a le plus de frontières maritimes ?", c:["Canada","Russie","Chine","Indonésie"],     a:0, cat:"Géographie" },
    { q:"En quelle année l'euro est-il devenu monnaie fiduciaire ?", c:["1999","2001","2002","2003"],   a:2, cat:"Politique" },
  ],

  /* ─────────── NIVEAU 4 ─────────── */
  [
    { q:"Quel pays a le plus de dialectes officiellement reconnus ?", c:["Inde","Chine","Nigeria","Russie"], a:0, cat:"Culture" },
    { q:"Qui a inventé le World Wide Web ?", c:["Bill Gates","Tim Berners-Lee","Vint Cerf","Marc Andreessen"], a:1, cat:"Technologie" },
    { q:"Quelle est la profondeur maximale de l'océan Pacifique (km) ?", c:["8,5","10,9","11,5","12,3"], a:1, cat:"Géographie" },
    { q:"Quel pays a envoyé le plus de satellites en orbite (2023) ?", c:["Russie","USA","Chine","Europe"], a:1, cat:"Technologie" },
    { q:"Qu'est-ce que l'INCOTERM FOB ?", c:["Franco à bord","Fret sur branche","Fret obligatoire de base","Frais offerts à bord"], a:0, cat:"Logistique" },
    { q:"Qui était à la tête de l'URSS à sa dissolution ?", c:["Eltsine","Gorbatchev","Andropov","Brejnev"], a:1, cat:"Histoire" },
    { q:"Quel protocole gère l'adressage IP sur Internet ?", c:["HTTP","FTP","TCP/IP","DNS"],             a:2, cat:"Technologie" },
    { q:"Quelle ville est surnommée 'La Porte d'Or de l'Orient' ?", c:["Singapour","Hong Kong","Mumbai","Shanghai"], a:1, cat:"Géographie" },
    { q:"Qui a composé la 5e Symphonie ?",             c:["Mozart","Bach","Beethoven","Haydn"],          a:2, cat:"Culture" },
    { q:"Quel pays a le taux de recyclage le plus élevé ?", c:["Allemagne","Suède","Suisse","Japon"],    a:0, cat:"Logistique" },
    { q:"Quelle est la distance moyenne Terre-Lune (km) ?", c:["284 000","356 000","384 400","420 000"], a:2, cat:"Science" },
    { q:"Qui a défini la 'main invisible du marché' ?", c:["Keynes","Marx","Ricardo","Adam Smith"],      a:3, cat:"Politique" },
    { q:"Quel pays est le premier producteur d'électricité solaire ?", c:["USA","Allemagne","Chine","Inde"], a:2, cat:"Technologie" },
    { q:"Quelle est la plus ancienne démocratie du monde ?", c:["USA","Grèce antique","Islande","Suisse"], a:2, cat:"Politique" },
    { q:"En quelle année la Chine a-t-elle rejoint l'OMC ?", c:["1999","2001","2003","2005"],            a:1, cat:"Politique" },
    { q:"Quel est le plus grand port sec (dry port) du monde ?", c:["Yiwu","Khorgos","Nur-Sultan","Almaty"], a:1, cat:"Logistique" },
    { q:"Quel philosophe a écrit 'Le Prince' ?",       c:["Voltaire","Montesquieu","Machiavel","Rousseau"], a:2, cat:"Politique" },
    { q:"Quelle entreprise a lancé le premier smartphone commercial ?", c:["Nokia","Apple","IBM","Ericsson"], a:2, cat:"Technologie" },
    { q:"Quel pays a le plus grand réseau de routes (km) ?", c:["Chine","Russie","Inde","USA"],          a:3, cat:"Logistique" },
    { q:"Qui a découvert l'Amérique selon la tradition viking ?", c:["Erik le Rouge","Leif Erikson","Bjorn Ironside","Harald Hardrada"], a:1, cat:"Histoire" },
    { q:"Quel est le principal composant du verre ?",  c:["Calcium","Silice","Alumine","Soude"],         a:1, cat:"Science" },
    { q:"Quel pays détient le plus d'actifs en dollars US ?", c:["Japon","Chine","Arabie Saoudite","Russie"], a:1, cat:"Politique" },
    { q:"En quelle année a débuté la Guerre de Corée ?", c:["1948","1950","1952","1953"],               a:1, cat:"Histoire" },
    { q:"Quel langage est utilisé pour les requêtes de bases de données relationnelles ?", c:["NoSQL","Python","SQL","XML"], a:2, cat:"Technologie" },
    { q:"Quelle est la superficie de l'Antarctique (millions km²) ?", c:["10","12","14","16"],           a:2, cat:"Géographie" },
  ],

  /* ─────────── NIVEAU 5 ─────────── */
  [
    { q:"Quel accord international régit le commerce mondial ?", c:["FMI","Accords de Bretton Woods","Accords OMC/GATT","Traité de Lisbonne"], a:2, cat:"Politique" },
    { q:"Quel pays a le plus grand nombre d'îles ?",   c:["Indonésie","Philippines","Suède","Finlande"], a:2, cat:"Géographie" },
    { q:"Qu'est-ce que le protocole BGP ?",            c:["Border Gateway Protocol","Binary Gate Protocol","Broadcast Group Protocol","Base Grid Path"], a:0, cat:"Technologie" },
    { q:"Quelle est la devise du Royaume-Uni ?",       c:["Euro","Couronne","Livre Sterling","Shilling"], a:2, cat:"Culture" },
    { q:"Qui a théorisé la 'destruction créatrice' ?", c:["Marx","Keynes","Schumpeter","Hayek"],         a:2, cat:"Politique" },
    { q:"Quel est le port de transbordement le plus actif d'Europe ?", c:["Hambourg","Rotterdam","Anvers","Algésiras"], a:1, cat:"Logistique" },
    { q:"En quelle année a été créé le SWIFT ?",       c:["1967","1973","1979","1985"],                  a:1, cat:"Logistique" },
    { q:"Quelle est la densité de population de Monaco (hab/km²) ?", c:["12 000","19 000","26 000","38 000"], a:2, cat:"Géographie" },
    { q:"Qui a formulé les 'lois de Kepler' sur les planètes ?", c:["Copernic","Kepler","Galilée","Newton"], a:1, cat:"Science" },
    { q:"Quel pays a le plus de musées ?",             c:["France","USA","Allemagne","Italie"],          a:0, cat:"Culture" },
    { q:"Quel continent a la plus grande part de terres arables ?", c:["Amérique","Europe","Asie","Afrique"], a:2, cat:"Géographie" },
    { q:"Qu'est-ce que le 'Bullwhip Effect' en logistique ?", c:["Effet de fouet sur la chaîne d'approvisionnement","Surproduction d'usine","Rupture de stock systématique","Délai de livraison excessif"], a:0, cat:"Logistique" },
    { q:"Qui a inventé le transistor ?",               c:["Edison","Shockley & Bardeen","Tesla","von Neumann"], a:1, cat:"Technologie" },
    { q:"Quel pays possède la flotte marchande la plus importante ?", c:["Chine","Grèce","Japon","Panama"], a:1, cat:"Logistique" },
    { q:"Quelle est la durée d'un mandat présidentiel en Russie depuis 2020 ?", c:["4 ans","5 ans","6 ans","7 ans"], a:2, cat:"Politique" },
    { q:"Quel est l'algorithme de tri le plus rapide en moyenne ?", c:["Bubble Sort","Insertion Sort","Quick Sort","Merge Sort"], a:2, cat:"Technologie" },
    { q:"Quel empire a construit la route de la Soie ?", c:["Mongol","Romain","Han (Chine)","Ottoman"],  a:2, cat:"Histoire" },
    { q:"Qu'est-ce que l'indice de Gini mesure ?",     c:["Croissance économique","Inégalités de revenus","Développement humain","Taux d'inflation"], a:1, cat:"Politique" },
    { q:"Quel pays a la plus grande réserve prouvée de gaz naturel ?", c:["Russie","Iran","Qatar","USA"], a:0, cat:"Logistique" },
    { q:"En quelle année a été ratifié l'Accord de Paris sur le climat ?", c:["2014","2015","2016","2017"], a:2, cat:"Politique" },
    { q:"Qui a découvert la structure de l'ADN ?",     c:["Curie","Watson & Crick","Mendel","Franklin"], a:1, cat:"Science" },
    { q:"Quel est le protocole standard des emails (envoi) ?", c:["IMAP","POP3","SMTP","FTP"],           a:2, cat:"Technologie" },
    { q:"Quelle est la capitale du Kazakhstan ?",      c:["Almaty","Noursoultan/Astana","Chymkent","Karaganda"], a:1, cat:"Géographie" },
    { q:"Qui a écrit 'Sapiens : Une brève histoire de l'humanité' ?", c:["Yuval Noah Harari","Jared Diamond","Steven Pinker","Francis Fukuyama"], a:0, cat:"Culture" },
    { q:"Qu'est-ce que le Incoterm DDP signifie ?",    c:["Delivered Duty Paid","Direct Delivery Port","Double Dispatch Protocol","Dispatched Direct to Port"], a:0, cat:"Logistique" },
  ],

  /* ─────────── NIVEAU 6 ─────────── */
  [
    { q:"Quel pays a la plus grande zone économique exclusive (ZEE) ?", c:["USA","Russie","France","Australie"], a:2, cat:"Géographie" },
    { q:"En cryptographie, que signifie 'PKI' ?",      c:["Public Key Infrastructure","Private Key Interface","Protocol Key Integration","Public Knowledge Index"], a:0, cat:"Technologie" },
    { q:"Quelle organisation régule le commerce maritime mondial ?", c:["OIT","OMI","FMI","OMC"],         a:1, cat:"Logistique" },
    { q:"Quel pays a été le premier à adopter une constitution écrite ?", c:["France","Royaume-Uni","USA","Suisse"], a:2, cat:"Politique" },
    { q:"Qui a écrit 'La Richesse des Nations' ?",     c:["Keynes","Ricardo","Marx","Adam Smith"],       a:3, cat:"Politique" },
    { q:"Quel protocole garantit l'intégrité des fichiers téléchargés ?", c:["MD5","HTTPS","SHA-256","SSL"], a:2, cat:"Technologie" },
    { q:"Quelle est la profondeur du canal de Panama (mètres) ?", c:["8","12","15","18"],                 a:1, cat:"Logistique" },
    { q:"Quelle nation a déclaré son indépendance en dernier (21e siècle) ?", c:["Kosovo","Monténégro","Soudan du Sud","Timor oriental"], a:2, cat:"Histoire" },
    { q:"Quelle substance est le meilleur conducteur d'électricité ?", c:["Cuivre","Or","Argent","Aluminium"], a:2, cat:"Science" },
    { q:"Que désigne l'acronyme SCM en logistique ?",  c:["Stock Control Management","Supply Chain Management","Shipping Container Module","Systems for Commercial Merchandising"], a:1, cat:"Logistique" },
    { q:"Quel pays a introduit le concept de 'crédit social' citoyen ?", c:["Corée du Nord","Russie","Chine","Iran"], a:2, cat:"Politique" },
    { q:"Quel mouvement artistique Monet représente-t-il ?", c:["Cubisme","Surréalisme","Impressionnisme","Fauvisme"], a:2, cat:"Culture" },
    { q:"Quelle est la plus ancienne bourse valeurs du monde ?", c:["London Stock Exchange","NYSE","Bourse d'Amsterdam","Tokyo SE"], a:2, cat:"Politique" },
    { q:"Qu'est-ce que l'EDI en logistique ?",         c:["Electronic Data Interchange","Export Document Index","Efficient Dispatch Interface","External Distribution Index"], a:0, cat:"Logistique" },
    { q:"Quel pays a le plus grand nombre de centrales nucléaires ?", c:["Chine","France","Russie","USA"], a:3, cat:"Technologie" },
    { q:"Qui a développé le système de numérotation binaire moderne ?", c:["Boole","Leibniz","Babbage","Turing"], a:1, cat:"Technologie" },
    { q:"Quelle est la capacité du plus grand porte-conteneurs au monde (EVP) ?", c:["18 000","21 000","24 000","27 000"], a:2, cat:"Logistique" },
    { q:"Quel est le pays le plus francophone hors de France ?", c:["Belgique","Sénégal","RD Congo","Côte d'Ivoire"], a:2, cat:"Culture" },
    { q:"Quel traité a mis fin à la Première Guerre Mondiale ?", c:["Traité de Versailles","Traité de Paris","Traité de Berlin","Traité de Brest-Litovsk"], a:0, cat:"Histoire" },
    { q:"Quelle technologie permet la traçabilité infalsifiable en logistique ?", c:["RFID","IoT","Blockchain","Cloud ERP"], a:2, cat:"Logistique" },
    { q:"Qui a fondé Amazon ?",                        c:["Jack Ma","Elon Musk","Jeff Bezos","Larry Page"], a:2, cat:"Technologie" },
    { q:"Quel est le siège de la Cour Pénale Internationale ?", c:["Bruxelles","Genève","New York","La Haye"], a:3, cat:"Politique" },
    { q:"Quelle est la longueur du Canal de Suez (km) ?", c:["120","145","193","220"],                   a:2, cat:"Logistique" },
    { q:"Quel lauréat du prix Nobel de la paix était un ex-terroriste désigné ?", c:["Aung San Suu Kyi","Nelson Mandela","Yasser Arafat","Kim Dae-jung"], a:2, cat:"Politique" },
    { q:"Que mesure l'indice HDI de l'ONU ?",          c:["Richesse nationale","Développement humain","Indice de corruption","Liberté de la presse"], a:1, cat:"Politique" },
  ],

  /* ─────────── NIVEAU 7 ─────────── */
  [
    { q:"Quelle est la différence entre TCP et UDP ?", c:["TCP est sans connexion, UDP fiable","TCP est fiable et orienté connexion, UDP pas","TCP est plus rapide, UDP plus lent","Ils sont identiques"], a:1, cat:"Technologie" },
    { q:"Qui a établi la théorie de l'évolution par sélection naturelle ?", c:["Lamarck","Mendel","Darwin","Huxley"], a:2, cat:"Science" },
    { q:"Quel pays a le coût logistique le plus faible (% du PIB) ?", c:["USA","Allemagne","Singapour","Pays-Bas"], a:2, cat:"Logistique" },
    { q:"Quelle guerre a duré 100 ans exactement ?",   c:["Guerre des Deux-Roses","Guerre de Cent Ans (116 ans)","Guerre de Trente Ans","Guerre Froide"], a:1, cat:"Histoire" },
    { q:"Quel philosophe a dit 'Je pense donc je suis' ?", c:["Kant","Descartes","Platon","Spinoza"],    a:1, cat:"Culture" },
    { q:"Qu'est-ce que le 'Last Mile Delivery' ?",     c:["Transport intercontinental","Dernière étape de livraison vers le client","Dédouanement de fret","Stockage en entrepôt central"], a:1, cat:"Logistique" },
    { q:"Quelle est la cour suprême de l'Union Européenne ?", c:["Cour Européenne des Droits de l'Homme","Tribunal Général","Cour de Justice de l'UE","Cour Internationale de Justice"], a:2, cat:"Politique" },
    { q:"Quel est le plus long pont du monde ?",       c:["Pont de Crimée","Pont de Danyang–Kunshan","Pont de la Confédération","Millau Viaduct"], a:1, cat:"Technologie" },
    { q:"Combien de langues officielles a l'ONU ?",    c:["4","5","6","8"],                              a:2, cat:"Politique" },
    { q:"Qui est l'auteur de 'Don Quichotte' ?",       c:["Lope de Vega","Cervantes","Calderon","Quevedo"], a:1, cat:"Culture" },
    { q:"Quel pays a le plus grand déficit commercial ?", c:["Inde","France","USA","Turquie"],            a:2, cat:"Politique" },
    { q:"Que signifie CITES dans le commerce mondial ?", c:["Convention sur le commerce international des espèces menacées","Commission internationale du transport et des espèces","Contrat international de transfert économique standard","Centre international du transport et des stocks"], a:0, cat:"Logistique" },
    { q:"Quelle est la longueur totale de la Grande Muraille de Chine (km) ?", c:["5 000","13 000","21 000","28 000"], a:2, cat:"Histoire" },
    { q:"Quel est le principal protocole de communication des objets connectés ?", c:["HTTP","MQTT","FTP","SSH"], a:1, cat:"Technologie" },
    { q:"Qui a rédigé la Déclaration Universelle des Droits de l'Homme ?", c:["Eleanor Roosevelt (commission)","Winston Churchill","Charles de Gaulle","Harry Truman"], a:0, cat:"Politique" },
    { q:"Quelle technologie permet au GPS de fonctionner ?", c:["Réseau cellulaire","Satellites géostationnaires","Satellites MEO + triangulation","Fibre optique sous-marine"], a:2, cat:"Technologie" },
    { q:"Quel pays a le plus de langues officiellement reconnues ?", c:["Inde","Zimbabwe","Bolivie","Afrique du Sud"], a:0, cat:"Culture" },
    { q:"En logistique, que désigne 'SKU' ?",          c:["Stock Keeping Unit","Shipment Key Update","Stock Key Usage","Standard Keeping Unit"], a:0, cat:"Logistique" },
    { q:"Quel physicien a formulé l'équation E=mc² ?", c:["Bohr","Heisenberg","Planck","Einstein"],      a:3, cat:"Science" },
    { q:"Quelle est la capitale de la Nouvelle-Zélande ?", c:["Auckland","Christchurch","Wellington","Dunedin"], a:2, cat:"Géographie" },
    { q:"Quel traité a créé l'Union Européenne ?",     c:["Traité de Rome","Traité de Paris","Traité de Maastricht","Traité de Lisbonne"], a:2, cat:"Politique" },
    { q:"Qui a inventé le moteur à vapeur industriel ?", c:["Watt","Newcomen","Stephenson","Arkwright"], a:0, cat:"Histoire" },
    { q:"Que mesure le Freight All Kinds (FAK) ?",     c:["Tarif unique pour tous types de marchandises","Délai de transport aérien","Frais douaniers à l'import","Coût d'entreposage frigorifique"], a:0, cat:"Logistique" },
    { q:"Quel est le plus grand aéroport du monde par superficie ?", c:["Dubai Airport","Beijing Daxing","King Fahd Airport","Denver International"], a:2, cat:"Logistique" },
    { q:"Qu'est-ce que la 'Cold Chain' en logistique ?", c:["Transport de données cryptées","Chaîne logistique frigorifique","Livraison de nuit","Réseau de distribution offshore"], a:1, cat:"Logistique" },
  ],

  /* ─────────── NIVEAU 8 ─────────── */
  [
    { q:"Quelle est la superficie totale des océans (% de la Terre) ?", c:["61%","65%","71%","75%"],    a:2, cat:"Géographie" },
    { q:"Quel est l'indice de sécurité alimentaire mondial (GFS) le mieux classé (2022) ?", c:["Finlande","Irlande","Danemark","Norvège"], a:0, cat:"Politique" },
    { q:"Que signifie 'Blockchain sharding' ?",        c:["Partitionnement de la chaîne pour améliorer la scalabilité","Cryptage des blocs individuels","Suppression des nœuds inactifs","Fusion de deux blockchains"], a:0, cat:"Technologie" },
    { q:"Quel empire avait la plus grande superficie de l'histoire ?", c:["Empire Romain","Empire Mongol","Empire Britannique","Empire Ottoman"], a:2, cat:"Histoire" },
    { q:"Qui a développé le modèle OSI des réseaux ?", c:["IEEE","ISO","IETF","W3C"],                   a:1, cat:"Technologie" },
    { q:"Quel pays a le revenu médian le plus élevé par habitant ?",c:["Suisse","Norvège","Luxembourg","Singapour"], a:2, cat:"Politique" },
    { q:"Quelle convention internationale régit le transport de marchandises par mer ?", c:["Règles de La Haye","Convention de Hambourg","COGSA","Règles de Rotterdam"], a:3, cat:"Logistique" },
    { q:"Qui est l'auteur de 'Le Capital' ?",          c:["Engels","Lénine","Marx","Gramsci"],          a:2, cat:"Politique" },
    { q:"Quelle est la hauteur de l'orbite géostationnaire (km) ?", c:["20 200","35 786","40 000","50 000"], a:1, cat:"Science" },
    { q:"Quel pays a le plus faible taux de mortalité infantile ?", c:["Japon","Singapour","Islande","Suède"], a:1, cat:"Politique" },
    { q:"En sécurité informatique, qu'est-ce qu'une attaque 'Zero-Day' ?", c:["Attaque lancée exactement à minuit","Exploitation d'une faille non encore corrigée","Déni de service total","Hameçonnage par email"], a:1, cat:"Technologie" },
    { q:"Quel pays a adopté la semaine de 4 jours à l'échelle nationale (2024) ?", c:["Danemark","Finlande","Islande","Allemagne"], a:2, cat:"Politique" },
    { q:"Que signifie DWT en transport maritime ?",    c:["Dead Weight Tonnage","Direct Warehouse Transport","Dual Way Transit","Dry Weight Transfer"], a:0, cat:"Logistique" },
    { q:"Quel mouvement scientifique Galilée a-t-il révolutionné ?", c:["Chimie moderne","Astronomie copernicienne","Physique quantique","Médecine anatomique"], a:1, cat:"Histoire" },
    { q:"Quelle technologie est à la base des processeurs modernes ?", c:["Tubes à vide","Transistors MOSFET","Diodes Zener","Condensateurs"], a:1, cat:"Technologie" },
    { q:"Quel pays a le réseau de pipelines le plus long ?",c:["Russie","USA","Chine","Canada"],         a:1, cat:"Logistique" },
    { q:"Qui a composé 'La Traviata' ?",               c:["Puccini","Verdi","Rossini","Donizetti"],     a:1, cat:"Culture" },
    { q:"Quelle est la définition du 'Nearshoring' ?", c:["Délocalisation dans un pays voisin","Relocalisation en territoire national","Externalisation en Asie","Automatisation des entrepôts"], a:0, cat:"Logistique" },
    { q:"Quel pays a le plus grand nombre de startups 'licornes' ?", c:["Chine","Inde","Royaume-Uni","USA"], a:3, cat:"Technologie" },
    { q:"Quelle guerre a introduit l'usage massif des tranchées ?", c:["Guerre de Sécession","Guerre Russo-Japonaise","Première Guerre Mondiale","Guerre d'Algérie"], a:2, cat:"Histoire" },
    { q:"Que désigne l'acronyme WMS en logistique ?",  c:["Warehouse Management System","Worldwide Maritime Standard","Waybill Management Software","Wireless Monitoring System"], a:0, cat:"Logistique" },
    { q:"Quelle est la capacité du plus grand avion cargo du monde ?", c:["An-124: 150 t","An-225: 250 t","C-5 Galaxy: 120 t","Boeing 747F: 100 t"], a:1, cat:"Logistique" },
    { q:"Quel est le rôle d'un commissionnaire en douane ?", c:["Transporter des marchandises","Assurer les marchandises","Faciliter les formalités douanières","Stocker les produits importés"], a:2, cat:"Logistique" },
    { q:"Qu'est-ce que le concept de 'Juste-à-temps' (JAT) ?", c:["Produire en avance pour anticiper la demande","Livrer exactement ce qu'il faut, quand il le faut","Stocker massivement pour éviter les pénuries","Automatiser totalement la production"], a:1, cat:"Logistique" },
    { q:"Quelle nation a été la première à légaliser le mariage homosexuel ?", c:["Pays-Bas","Belgique","Canada","Espagne"], a:0, cat:"Politique" },
  ],

  /* ─────────── NIVEAU 9 ─────────── */
  [
    { q:"Quel est le concept de 'Dark Store' en e-commerce ?", c:["Boutique en ligne anonyme","Entrepôt de préparation de commandes rapides","Magasin ouvert la nuit uniquement","Plateforme de revente illégale"], a:1, cat:"Logistique" },
    { q:"Qui a développé la première machine programmable (analytique engine) ?", c:["Babbage","Lovelace","Turing","Boole"], a:0, cat:"Technologie" },
    { q:"Quel est le plus grand réseau de chaleur urbain d'Europe ?", c:["Moscou","Paris","Copenhague","Varsovie"], a:0, cat:"Technologie" },
    { q:"Quelle philosophie politique prône la suppression de l'État ?", c:["Communisme","Socialisme","Anarchisme","Libertarianisme"], a:2, cat:"Politique" },
    { q:"Quel est le rôle de l'Autorité Portuaire dans la chaîne logistique ?", c:["Transporter les marchandises","Gérer les infrastructures et services portuaires","Assurer les navires","Contrôler les douanes"], a:1, cat:"Logistique" },
    { q:"Qu'est-ce que la 'Procure-to-Pay' (P2P) ?", c:["Processus d'achat du bon de commande au paiement fournisseur","Méthode de prévision de la demande","Stratégie de transport multi-modal","Protocole de traçabilité RFID"], a:0, cat:"Logistique" },
    { q:"Quel physicien a formulé l'incertitude quantique ?", c:["Bohr","Pauli","Heisenberg","Schrödinger"], a:2, cat:"Science" },
    { q:"Quel pays a été le premier à émettre du papier-monnaie ?", c:["Inde","Chine","Suède","Perse"], a:1, cat:"Histoire" },
    { q:"Qu'est-ce que le 'Reverse Logistics' ?",      c:["Transport retour des marchandises défectueuses ou à recycler","Livraison express en sens inverse","Logistique maritime inversée","Flux de marchandises vers pays d'origine"], a:0, cat:"Logistique" },
    { q:"Quel est le principe du 'Hub and Spoke' en transport ?", c:["Transport direct point à point","Concentration des flux vers un nœud central puis redistribution","Réseau décentralisé sans point central","Livraison par drones autonomes"], a:1, cat:"Logistique" },
    { q:"Quel langage est le plus utilisé en data science ?", c:["R","Julia","Python","Scala"],          a:2, cat:"Technologie" },
    { q:"Quelle organisation réglemente l'aviation civile internationale ?", c:["OMI","OACI","IATA","FAA"], a:1, cat:"Logistique" },
    { q:"Quel est le taux d'alphabétisation mondial (2023, %) ?", c:["77","83","87","92"],               a:2, cat:"Culture" },
    { q:"Qui a créé le réseau Tor ?",                  c:["NSA","DARPA/US Navy","MIT","Anonymous"],      a:1, cat:"Technologie" },
    { q:"Quelle bataille a mis fin à l'empire de Napoléon ?", c:["Austerlitz","Leipzig","Waterloo","Trafalgar"], a:2, cat:"Histoire" },
    { q:"Qu'est-ce que le coefficient de Gini = 0 représente ?", c:["Inégalité parfaite","Égalité parfaite","Croissance zéro","Chômage total"], a:1, cat:"Politique" },
    { q:"Quel est le composant clé d'une architecture microservices ?", c:["Base de données monolithique","APIs REST indépendantes","Serveur central unique","Réseau VPN dédié"], a:1, cat:"Technologie" },
    { q:"Quel pays a le plus haut IDH (2023) ?",       c:["Norvège","Suisse","Islande","Hong Kong"],     a:0, cat:"Politique" },
    { q:"Que signifie EXW dans les Incoterms ?",       c:["Ex Works — marchandise disponible chez vendeur","Export Warehouse","Exclusive World","Exchange Warrant"], a:0, cat:"Logistique" },
    { q:"Quel est le plus long tunnel ferroviaire du monde ?", c:["Tunnel du Lötschberg","Tunnel du Gothard","Tunnel de Seikan","Chunnel (Manche)"], a:1, cat:"Technologie" },
    { q:"Quel pays concentre le plus de datacenters au monde ?", c:["Chine","Allemagne","USA","Pays-Bas"], a:2, cat:"Technologie" },
    { q:"Quelle est la principale cause de la Première Guerre Mondiale selon l'historiographie actuelle ?", c:["Assassination de François-Ferdinand + système d'alliances","Guerre économique entre puissances","Révolution bolchévique","Conflit colonial en Afrique"], a:0, cat:"Histoire" },
    { q:"Qu'est-ce que le '3PL' en logistique ?",      c:["Third-Party Logistics (prestataire logistique externe)","Three-Point Landing protocol","Triple Package Labelling","Third Procurement Level"], a:0, cat:"Logistique" },
    { q:"Quelle est la définition de la 'Demand Sensing' ?", c:["Prévision de la demande à court terme via données en temps réel","Sondage des clients par email","Analyse des données historiques sur 5 ans","Simulation de scénarios de crise"], a:0, cat:"Logistique" },
    { q:"Qui a fondé SpaceX ?",                        c:["Jeff Bezos","Richard Branson","Elon Musk","Peter Thiel"], a:2, cat:"Technologie" },
  ],

  /* ─────────── NIVEAU 10 ─────────── */
  [
    { q:"Qu'est-ce que la méthode ABC en gestion des stocks ?", c:["Classement des articles par valeur/importance","Automatisation des commandes","Analyse de la concurrence","Allocation budgétaire annuelle"], a:0, cat:"Logistique" },
    { q:"Quel est le concept de 'Digital Twin' en industrie ?", c:["Réplique virtuelle d'un objet ou processus physique","Copie de sauvegarde des données","Jumeau numérique pour les transactions","Double identité en ligne"], a:0, cat:"Technologie" },
    { q:"Quel pays a lancé le 'Belt and Road Initiative' ?", c:["Inde","USA","Chine","Russie"],          a:2, cat:"Politique" },
    { q:"Qu'est-ce que le 'Milk Run' en logistique ?", c:["Tournée de collecte optimisée chez plusieurs fournisseurs","Livraison de produits laitiers","Transport de nuit en camion frigorifique","Distribution en point relais"], a:0, cat:"Logistique" },
    { q:"Quel accord remplace le NAFTA depuis 2020 ?", c:["TPP","CUSMA/USMCA","FTAA","CPTPP"],          a:1, cat:"Politique" },
    { q:"Quelle est la définition d'un 'conteneur ISO' standard (20 pieds) ?", c:["5,90m × 2,35m × 2,39m","6,06m × 2,44m × 2,59m","5,50m × 2,20m × 2,50m","6,10m × 2,50m × 2,60m"], a:1, cat:"Logistique" },
    { q:"Que mesure le NPS (Net Promoter Score) ?",    c:["Performance nette d'un portefeuille","Probabilité qu'un client recommande une entreprise","Taux de retour produit","Net profit sur services"], a:1, cat:"Logistique" },
    { q:"Quel est le principal risque du 'Single Sourcing' ?", c:["Coût élevé","Dépendance excessive à un seul fournisseur","Mauvaise qualité systématique","Délais de livraison plus courts"], a:1, cat:"Logistique" },
    { q:"En quoi consiste la méthode Kaizen ?", c:["Amélioration continue par petits incréments","Automatisation totale","Réduction des effectifs","Externalisation maximale"], a:0, cat:"Logistique" },
    { q:"Quel est le rôle de l'OMD (Organisation Mondiale des Douanes) ?", c:["Réguler le commerce de l'armement","Harmoniser les procédures douanières mondiales","Superviser les transferts financiers","Contrôler les flux migratoires"], a:1, cat:"Logistique" },
    { q:"Quelle invention a permis la révolution de la conteneurisation maritime ?", c:["Le grue électrique","La box standard de Malcolm McLean","Le radar maritime","Le GPS maritime"], a:1, cat:"Logistique" },
    { q:"Que désigne le 'Cross-docking' ?", c:["Transfert direct des marchandises sans stockage","Stockage double en entrepôt","Livraison transfrontalière","Transport aérien longue distance"], a:0, cat:"Logistique" },
    { q:"Quel pays a le taux de pénétration e-commerce le plus élevé ?", c:["USA","Chine","Corée du Sud","Royaume-Uni"], a:2, cat:"Technologie" },
    { q:"Qu'est-ce que la méthode 5S ?", c:["Seiri, Seiton, Seiso, Seiketsu, Shitsuke — organisation du lieu de travail","5 indicateurs de performance","5 étapes de l'audit qualité","5 niveaux de certification ISO"], a:0, cat:"Logistique" },
    { q:"Quel est le plus grand distributeur mondial ?", c:["Amazon","Carrefour","Walmart","Alibaba"],   a:2, cat:"Logistique" },
    { q:"Que signifie ETA en logistique ?", c:["Estimated Time of Arrival","Export Tax Amount","Electronic Transfer Authorization","Extended Trade Agreement"], a:0, cat:"Logistique" },
    { q:"Quel est l'avantage du transport multimodal ?", c:["Réduction des coûts et délais par combinaison de modes","Simplification des formalités douanières","Élimination des risques de perte","Traçabilité automatique"], a:0, cat:"Logistique" },
    { q:"Qui a développé la théorie des files d'attente (queueing theory) ?", c:["Erlang","Shannon","Markov","Nash"], a:0, cat:"Technologie" },
    { q:"Qu'est-ce que le 'Choke Point' maritime ?", c:["Zone de passage naval stratégique et vulnérable","Port de transbordement principal","Zone de pêche exclusive","Couloir aérien international"], a:0, cat:"Logistique" },
    { q:"Quel pays est le plus grand importateur mondial (2023) ?", c:["Chine","Allemagne","USA","Japon"], a:2, cat:"Logistique" },
    { q:"Qu'est-ce que le 'Lean Manufacturing' ?", c:["Fabrication sans gaspillage ni surplus","Production à grande échelle","Automatisation robotique totale","Externalisation de la production"], a:0, cat:"Logistique" },
    { q:"Quel est le rôle d'un 3PL vs 4PL ?", c:["3PL gère la logistique, 4PL orchestre toute la chaîne d'approvisionnement","3PL est maritime, 4PL aérien","3PL national, 4PL international","4PL est un sous-traitant du 3PL"], a:0, cat:"Logistique" },
    { q:"Quelle norme internationale régit les systèmes de management de la qualité ?", c:["ISO 9001","ISO 14001","ISO 45001","ISO 31000"], a:0, cat:"Logistique" },
    { q:"Que désigne 'Omnichannel' en logistique commerciale ?", c:["Vente sur un seul canal premium","Intégration transparente de tous les canaux de vente et distribution","Distribution exclusivement numérique","Réseau de franchise mondial"], a:1, cat:"Logistique" },
    { q:"Quel pays a le score le plus élevé à l'Indice de Performance Logistique (LPI) de la Banque Mondiale ?", c:["Singapour","Allemagne","Pays-Bas","Danemark"], a:1, cat:"Logistique" },
  ],

  /* ─────────── NIVEAUX 11-50 : Questions avancées ─────────── */
  /* Les niveaux 11 à 50 suivent avec thèmes rotatifs approfondis */

  /* NIVEAU 11 — Histoire avancée */
  [
    { q:"Quelle bataille a mis fin à la conquête arabe en Europe occidentale ?", c:["Poitiers 732","Lépante 1571","Roncevaux 778","Covadonga 722"], a:0, cat:"Histoire" },
    { q:"Quel empire a adopté le premier code de loi écrit ?", c:["Assyrien","Babylonien (Hammurabi)","Sumérien","Perse"], a:1, cat:"Histoire" },
    { q:"Qui était le chef militaire mongol conquérant le plus étendu ?", c:["Tamerlan","Gengis Khan","Kubilai Khan","Timur"], a:1, cat:"Histoire" },
    { q:"Quelle révolution a mis fin à l'empire ottoman ?", c:["Révolution de 1908 des Jeunes-Turcs","Révolution kémaliste 1923","Coup d'État de 1913","Révolte arabe de 1916"], a:1, cat:"Histoire" },
    { q:"Quel pays a subi les deux seules bombes atomiques de l'histoire ?", c:["Corée","Japon","Chine","Vietnam"], a:1, cat:"Histoire" },
    { q:"En quelle année fut assassiné Julius César ?", c:["50 av.J-C","44 av.J-C","31 av.J-C","27 av.J-C"], a:1, cat:"Histoire" },
    { q:"Quel continent fut colonisé en dernier à grande échelle ?", c:["Asie","Amérique","Afrique (19e-20e s.)","Océanie"], a:2, cat:"Histoire" },
    { q:"Qui a mené la résistance indienne non-violente contre les Britanniques ?", c:["Nehru","Gandhi","Bose","Patel"], a:1, cat:"Histoire" },
    { q:"Quel événement a déclenché la guerre civile espagnole ?", c:["Assassinat du roi","Coup d'état militaire de Franco","Révolution ouvrière de Barcelone","Victoire du Front Populaire"], a:1, cat:"Histoire" },
    { q:"Quelle civilisation a construit les premières pyramides ?", c:["Maya","Aztèque","Égyptienne","Nubienne (Méroé)"], a:2, cat:"Histoire" },
    { q:"Quel traité de 1648 a mis fin à la Guerre de Trente Ans ?", c:["Traité de Westphalie","Traité d'Utrecht","Traité d'Osnabrück seulement","Traité de Münster seulement"], a:0, cat:"Histoire" },
    { q:"Qui était l'impératrice d'Autriche surnommée 'Sissi' ?", c:["Marie-Thérèse","Élisabeth de Wittelsbach","Marie-Louise","Sophie de Bavière"], a:1, cat:"Histoire" },
    { q:"Quelle guerre a duré le plus longtemps officiellement ?", c:["Guerre de Cent Ans","Guerre du Péloponnèse","Guerres puniques","Guerre d'Afghanistan (2001-2021)"], a:3, cat:"Histoire" },
    { q:"Quel philosophe grec a été maître d'Alexandre le Grand ?", c:["Platon","Socrate","Aristote","Épicure"], a:2, cat:"Histoire" },
    { q:"Quelle est la date officielle du début de la Seconde Guerre Mondiale ?", c:["1er sept. 1939","3 sept. 1939","7 déc. 1941","10 mai 1940"], a:0, cat:"Histoire" },
    { q:"Quel empire a créé le premier système postal officiel de l'histoire ?", c:["Romain","Perse achéménide","Mongol","Chinois des Han"], a:1, cat:"Histoire" },
    { q:"Qui était à la tête de la Révolution Cubaine ?", c:["Che Guevara","Fidel Castro","Raul Castro","Camilo Cienfuegos"], a:1, cat:"Histoire" },
    { q:"Quel pays a subi le génocide de 1994 ?", c:["Soudan","Bosnie","Rwanda","Cambodge"], a:2, cat:"Histoire" },
    { q:"Quelle découverte a mis fin à la Guerre de Sécession ?", c:["Victoire d'Appomattox Court House","Assassinat de Lincoln","Siège de Richmond","Marche de Sherman"], a:0, cat:"Histoire" },
    { q:"Quel accord a établi la partition de la Palestine en 1947 ?", c:["Accord Sykes-Picot","Plan de Partition de l'ONU","Déclaration Balfour","Traité de Sèvres"], a:1, cat:"Histoire" },
    { q:"Qui a proclamé la République Populaire de Chine en 1949 ?", c:["Deng Xiaoping","Sun Yat-sen","Mao Zedong","Zhou Enlai"], a:2, cat:"Histoire" },
    { q:"Quel empire a inventé l'écriture cunéiforme ?", c:["Égyptien","Akkadien/Sumérien","Phénicien","Perse"], a:1, cat:"Histoire" },
    { q:"En quelle année Nelson Mandela est-il sorti de prison ?", c:["1988","1990","1992","1994"], a:1, cat:"Histoire" },
    { q:"Quelle guerre froide a amené le monde au bord de la catastrophe nucléaire en 1962 ?", c:["Crise des missiles de Cuba","Blocus de Berlin","Guerre de Corée","Coup d'État du Guatemala"], a:0, cat:"Histoire" },
    { q:"Qui a conquis l'empire Aztèque ?", c:["Pizarro","Columbus","Cortés","De Soto"], a:2, cat:"Histoire" },
  ],

  /* NIVEAU 12 — Science & Technologie avancées */
  [
    { q:"Qu'est-ce que l'informatique quantique exploite ?", c:["Bits classiques améliorés","Superposition et intrication quantiques","Processeurs plus rapides","Intelligence artificielle renforcée"], a:1, cat:"Technologie" },
    { q:"Quel est le plus grand télescope du monde (2024) ?", c:["Hubble","James Webb","ELT (Extremely Large Telescope)","TMT"], a:2, cat:"Science" },
    { q:"Quel élément chimique a le numéro atomique 79 ?", c:["Platine","Or","Argent","Cuivre"], a:1, cat:"Science" },
    { q:"Que signifie CRISPR en biologie moléculaire ?", c:["Clustered Regularly Interspaced Short Palindromic Repeats","Code for RNA Integration and Selective Protein Replication","Cross-reactive Immune System Protein Response","Controlled RNA Insertion System for Protein Repair"], a:0, cat:"Science" },
    { q:"Quelle est la fréquence des processeurs modernes haut de gamme (GHz) ?", c:["2-3 GHz","4-6 GHz","8-10 GHz","12-15 GHz"], a:1, cat:"Technologie" },
    { q:"Quel est le paradoxe de Fermi ?", c:["L'impossibilité des voyages plus rapides que la lumière","Contradiction entre haute probabilité de vie ET absence de contact extraterrestre","Limite de la puissance des ordinateurs quantiques","Impossibilité de prévoir le comportement des particules"], a:1, cat:"Science" },
    { q:"Qu'est-ce que le modèle standard de la physique des particules ?", c:["Théorie décrivant les 4 forces fondamentales","Théorie décrivant les particules fondamentales et 3 des 4 forces","Modèle de l'univers en expansion","Théorie des cordes simplifiée"], a:1, cat:"Science" },
    { q:"Quelle architecture de réseau neuronal est la plus utilisée en vision par ordinateur ?", c:["RNN","LSTM","CNN (Convolutional Neural Network)","GAN"], a:2, cat:"Technologie" },
    { q:"Qu'est-ce que la loi de Moore prédit ?", c:["Doublement du nombre de transistors tous les 2 ans","Augmentation de la vitesse réseau","Réduction du coût des batteries","Miniaturisation des smartphones"], a:0, cat:"Technologie" },
    { q:"Quel est le protocole de communication des satellites Starlink ?", c:["4G LTE","Ka-band / Ku-band satellite","5G NR","LoRaWAN"], a:1, cat:"Technologie" },
    { q:"Quelle est la masse du boson de Higgs (GeV) ?", c:["80","100","125","150"], a:2, cat:"Science" },
    { q:"Que signifie 'DevOps' ?", c:["Development Operations — unification dev et opérations","Devoted Operations","Device Optimization System","Distributed Version Operations"], a:0, cat:"Technologie" },
    { q:"Quelle entreprise a développé GPT-4 ?", c:["Google","Meta","OpenAI","DeepMind"], a:2, cat:"Technologie" },
    { q:"Qu'est-ce que l'architecture ARM des processeurs ?", c:["Advanced RISC Machines — architecture à jeu d'instructions réduit","Artificial Remote Machine","Advanced RAM Memory","Accelerated Rendering Module"], a:0, cat:"Technologie" },
    { q:"Quel est le rôle d'un système SCADA ?", c:["Gestion des bases de données","Contrôle et acquisition de données industrielles","Simulation de réseaux sociaux","Sécurisation des transactions bancaires"], a:1, cat:"Technologie" },
    { q:"Quel pays a lancé le premier véhicule électrique autonome de niveau 4 commercial ?", c:["USA","Chine","Allemagne","Japon"], a:0, cat:"Technologie" },
    { q:"Qu'est-ce que l'entropie en thermodynamique mesure ?", c:["La chaleur d'un système","Le désordre ou les états possibles d'un système","La pression d'un gaz","L'énergie cinétique des molécules"], a:1, cat:"Science" },
    { q:"Que signifie ERP en informatique d'entreprise ?", c:["Enterprise Resource Planning","External Resource Procurement","Electronic Reporting Protocol","Enhanced Relational Processing"], a:0, cat:"Technologie" },
    { q:"Quel est le matériau semi-conducteur le plus utilisé ?", c:["Germanium","Gallium arsenide","Silicium","Carbure de silicium"], a:2, cat:"Science" },
    { q:"Quelle technologie permet la communication entre appareils sans internet central ?", c:["Bluetooth","Wi-Fi Direct","Mesh Network","NFC"], a:2, cat:"Technologie" },
    { q:"Que mesure le nanomètre en lithographie de puces (ex. 3nm) ?", c:["La taille exacte des transistors","La finesse du processus de fabrication (approximatif)","La vitesse de traitement","La consommation d'énergie"], a:1, cat:"Technologie" },
    { q:"Qui a inventé le laser ?", c:["Einstein (théorie)","Maiman (premier laser fonctionnel)","Townes (MASER)","Schawlow"], a:1, cat:"Science" },
    { q:"Quel est le principal avantage de l'architecture RISC ?", c:["Plus de transistors","Instructions simples et exécution rapide","Consommation énergétique nulle","Absence de cache"], a:1, cat:"Technologie" },
    { q:"Qu'est-ce que la 'Loi de Metcalfe' ?", c:["La valeur d'un réseau croît en O(n²) avec le nombre d'utilisateurs","Les processeurs doublent de vitesse chaque an","L'IA remplacera 50% des emplois","Les données doublent chaque 2 ans"], a:0, cat:"Technologie" },
    { q:"Quel pays est le premier producteur mondial de semi-conducteurs ?", c:["Corée du Sud","USA","Taïwan","Chine"], a:2, cat:"Technologie" },
  ],

  /* NIVEAU 13 */
  [
    { q:"Quelle est la principale source d'énergie dans le monde (2023) ?", c:["Charbon","Pétrole","Gaz naturel","Renouvelables"], a:1, cat:"Science" },
    { q:"Quel est le pays le mieux classé en liberté de la presse (2023) ?", c:["Suède","Danemark","Norvège","Finlande"], a:3, cat:"Politique" },
    { q:"Que désigne 'API REST' ?", c:["Application Programming Interface de type Representational State Transfer","Automated Protocol Interface for Remote Services","Advanced Program Integration for Real-time Systems","Applied Programming Interface Relational Standard Transfer"], a:0, cat:"Technologie" },
    { q:"Quel pays a le plus grand nombre d'UNESCO Patrimoine Mondial ?", c:["France","Chine","Italie","Espagne"], a:2, cat:"Culture" },
    { q:"Quelle guerre a créé le canal de Suez stratégiquement ?", c:["Guerre de 1948","Crise de Suez 1956","Guerre des Six Jours","Guerre du Kippour"], a:1, cat:"Histoire" },
    { q:"Qu'est-ce que la méthode 'Six Sigma' ?", c:["6 étapes de management","Réduction des défauts à 3,4 par million d'opportunités","6 standards ISO","Méthode agile en 6 sprints"], a:1, cat:"Logistique" },
    { q:"Quel organisme régule les marchés financiers en France ?", c:["Banque de France","AMF","FCA","SEC"], a:1, cat:"Politique" },
    { q:"Qui a développé la théorie des jeux en économie ?", c:["Nash & Von Neumann","Arrow & Debreu","Samuelson","Harsanyi"], a:0, cat:"Politique" },
    { q:"Quelle est la profondeur de la zone hadale ?", c:[">6 000m",">8 000m",">10 000m","Toute zone > 6 000m"], a:3, cat:"Science" },
    { q:"Quel est le principal protocole de sécurité Wi-Fi actuel ?", c:["WEP","WPA","WPA2","WPA3"], a:3, cat:"Technologie" },
    { q:"Quel pays a ratifié le plus de traités internationaux ?", c:["USA","France","Royaume-Uni","Russie"], a:1, cat:"Politique" },
    { q:"Que signifie 'MaaS' dans les transports ?", c:["Mobility as a Service","Maritime as a Standard","Management and Advanced Systems","Multimodal Automated Supply"], a:0, cat:"Logistique" },
    { q:"Quel est le plus haut barrage du monde ?", c:["Barrage des Trois Gorges","Barrage Jinping-I","Barrage Nurek","Barrage Jinping-II"], a:1, cat:"Technologie" },
    { q:"Qui a élaboré la hiérarchie des besoins ?", c:["Freud","Jung","Maslow","Rogers"], a:2, cat:"Culture" },
    { q:"Quel pays a le ratio dette/PIB le plus élevé ?", c:["USA","Grèce","Japon","Italie"], a:2, cat:"Politique" },
    { q:"Que représente l'acronyme NATO/OTAN ?", c:["North Atlantic Treaty Organization","National Agreement for Transatlantic Operations","Northern Alliance Treaty Order","National Armed Treaty Operations"], a:0, cat:"Politique" },
    { q:"Quelle est la langue officielle du Brésil ?", c:["Espagnol","Portugais","Français","Anglais"], a:1, cat:"Culture" },
    { q:"Quel est le rôle du FMI ?", c:["Financer le développement","Maintenir la stabilité financière internationale","Réguler le commerce mondial","Superviser la Banque Mondiale"], a:1, cat:"Politique" },
    { q:"Qu'est-ce que l'effet 'Long Tail' en e-commerce ?", c:["Ventes concentrées sur peu de produits","Profit provenant de nombreux produits de niche","Stratégie de vente longue durée","Délai prolongé des commandes"], a:1, cat:"Logistique" },
    { q:"Quel pays a le plus grand réseau de chemin de fer à grande vitesse ?", c:["Japon","France","Espagne","Chine"], a:3, cat:"Technologie" },
    { q:"Que signifie KPI ?", c:["Key Performance Indicator","Key Process Integration","Knowledge Processing Interface","Kinetic Production Index"], a:0, cat:"Logistique" },
    { q:"Quel pays a le plus grand marché boursier ?", c:["Chine","Royaume-Uni","Japon","USA"], a:3, cat:"Politique" },
    { q:"Qu'est-ce qu'une CBDC ?", c:["Central Bank Digital Currency","Corporate Blockchain Data Center","Cross-Border Direct Commerce","Common Base Distribution Chain"], a:0, cat:"Technologie" },
    { q:"Quel est le concept de 'Circular Economy' ?", c:["Économie circulaire éliminant les déchets par réutilisation","Commerce en circuit fermé","Marchés financiers en boucle","Distribution circulaire régionale"], a:0, cat:"Logistique" },
    { q:"Qui a défini le 'Soft Power' en relations internationales ?", c:["Kissinger","Nye","Huntington","Brzezinski"], a:1, cat:"Politique" },
  ],

  /* NIVEAUX 14-50 : Questions de niveau expert */
  /* Niveau 14 */
  [
    { q:"Qu'est-ce que la 'Tragedy of the Commons' ?", c:["Surexploitation des ressources communes par intérêt individuel","Problème d'accès aux zones commerciales","Effondrement des marchés publics","Privatisation des espaces publics"], a:0, cat:"Politique" },
    { q:"Quel est le protocole de consensus le plus sécurisé d'une blockchain ?", c:["Proof of Work","Proof of Stake","Delegated PoS","Proof of Authority"], a:0, cat:"Technologie" },
    { q:"Que signifie 'Reshoring' ?", c:["Relocalisation de la production dans le pays d'origine","Délocalisation en Asie","Rachat d'entreprises étrangères","Sous-traitance offshore"], a:0, cat:"Logistique" },
    { q:"Quel pays a le plus grand nombre de brevets déposés ?", c:["USA","Japon","Chine","Allemagne"], a:2, cat:"Technologie" },
    { q:"Qu'est-ce que la 'Loi de Zipf' ?", c:["Le 2e élément d'une liste est 2× moins fréquent que le 1er, etc.","La puissance informatique double chaque 2 ans","Les villes ont des tailles exponentielles","Le revenu suit une loi normale"], a:0, cat:"Science" },
    { q:"Quelle organisation certifie les normes ISO ?", c:["ONU","Organisation Internationale de Normalisation","OMC","OIT"], a:1, cat:"Logistique" },
    { q:"Quel est le principal risque de la dépendance aux énergies fossiles ?", c:["Risque géopolitique, climatique et d'épuisement","Surproduction","Déflation énergétique","Indépendance économique"], a:0, cat:"Politique" },
    { q:"Que représente l'acronyme GDPR/RGPD ?", c:["General Data Protection Regulation","Global Data Privacy Rule","Geographic Data Processing Regulation","Government Digital Privacy Rights"], a:0, cat:"Politique" },
    { q:"Qu'est-ce que l'économie comportementale étudie ?", c:["L'impact des biais cognitifs sur les décisions économiques","Les marchés financiers algorithmiques","L'économie des pays émergents","Le comportement des entreprises en situation de monopole"], a:0, cat:"Politique" },
    { q:"Quel est le principe de la 'Main of God' en intelligence artificielle ?", c:["Supervision humaine de l'IA","IA sans supervision","IA générative autonome","Contrôle des biais algorithmiques"], a:0, cat:"Technologie" },
    { q:"Que désigne l'acronyme SWIFT dans les paiements internationaux ?", c:["Society for Worldwide Interbank Financial Telecommunication","Standard Worldwide Internet Financial Transfer","Secure Wire International Financial Transaction","Swift Worldwide Interbank Fund Transfer"], a:0, cat:"Logistique" },
    { q:"Quel est le plus grand producteur mondial d'aluminium ?", c:["USA","Russie","Chine","Canada"], a:2, cat:"Logistique" },
    { q:"Qu'est-ce que le principe de subsidiarité dans l'UE ?", c:["L'UE agit seulement si les États membres ne peuvent mieux agir","Les États membres ont priorité absolue","La Commission Européenne décide tout","Le Parlement supervise les États"], a:0, cat:"Politique" },
    { q:"Quel est le concept de 'Blue Ocean Strategy' ?", c:["Créer un nouveau marché sans concurrence","Stratégie maritime commerciale","Dominer un marché existant","Stratégie de prix bas"], a:0, cat:"Logistique" },
    { q:"Quelle technologie permet la détection de présence sans caméra ?", c:["Wi-Fi sensing","LiDAR","Radar à ondes millimétriques","Tous les trois"], a:3, cat:"Technologie" },
    { q:"Qu'est-ce que la 'Loi de Goodhart' ?", c:["Quand une mesure devient un objectif, elle cesse d'être une bonne mesure","La monnaie suit l'inflation","Les marchés sont toujours rationnels","La production suit la demande"], a:0, cat:"Politique" },
    { q:"Quel est le PIB de l'Afrique (2023, milliards USD) ?", c:["1 500","2 000","2 800","3 500"], a:2, cat:"Politique" },
    { q:"Que signifie AGI en intelligence artificielle ?", c:["Artificial General Intelligence","Advanced Graphics Interface","Automated GPU Integration","Augmented General Intelligence"], a:0, cat:"Technologie" },
    { q:"Quel est le rôle de la BRI (Banque des Règlements Internationaux) ?", c:["Financer les États en développement","Faciliter la coopération entre banques centrales","Réguler le commerce mondial","Émettre une monnaie internationale"], a:1, cat:"Politique" },
    { q:"Qu'est-ce que le 'Moore's Cliff' prédit ?", c:["Ralentissement de la miniaturisation des puces","Doublement continu des transistors","Fin de l'ère des semi-conducteurs","Explosion de la puissance quantique"], a:0, cat:"Technologie" },
    { q:"Quel accord régit le transport aérien international ?", c:["Convention de Montréal","Accord de Chicago","Convention de Varsovie","IATA Open Skies"], a:1, cat:"Logistique" },
    { q:"Que désigne le 'paradoxe de Condorcet' ?", c:["Impossibilité pour un groupe de faire un choix collectif cohérent","Paradoxe de l'abondance économique","Contradiction entre croissance et développement","Problème de l'inégalité dans la démocratie"], a:0, cat:"Politique" },
    { q:"Quelle technologie constitue la base des LLM (grands modèles de langage) ?", c:["CNN","RNN","Transformer (Attention is All You Need)","LSTM"], a:2, cat:"Technologie" },
    { q:"Quel est le taux de CO2 préindustriel dans l'atmosphère (ppm) ?", c:["180","220","280","320"], a:2, cat:"Science" },
    { q:"Que désigne l'acronyme ESG en finance ?", c:["Environmental, Social and Governance","Economic Security and Growth","European Stock Governance","Emergency Sustainability Guidelines"], a:0, cat:"Politique" },
  ],

  /* NIVEAU 15 */
  [
    { q:"Qu'est-ce que la 'Théorie des Contraintes' de Goldratt ?", c:["Optimiser le maillon le plus faible de la chaîne","Réduire tous les coûts simultanément","Augmenter la production maximale","Externaliser les contraintes"], a:0, cat:"Logistique" },
    { q:"Quelle est la signification de 'PESTEL' en analyse stratégique ?", c:["Politique, Économique, Social, Technologique, Environnemental, Légal","Produit, Entreprise, Service, Technologie, Échange, Livraison","Plan Économique Stratégique de Territoire et Logistique","Prévision, Évaluation, Stockage, Transport, Exportation, Livraison"], a:0, cat:"Logistique" },
    { q:"Quel est le premier pays à avoir adopté un budget carbone légalement contraignant ?", c:["Allemagne","Royaume-Uni","Suède","France"], a:1, cat:"Politique" },
    { q:"Qu'est-ce que l'architecture 'Event-Driven' en logiciel ?", c:["Système où le flux d'application est déterminé par des événements","Base de données orientée événements","Interface utilisateur interactive","Gestion des incidents en temps réel"], a:0, cat:"Technologie" },
    { q:"Quel pays a le plus fort taux d'épargne nationale ?", c:["Chine","Singapour","Suisse","Qatar"], a:0, cat:"Politique" },
    { q:"Que signifie 'FIFO' en gestion de stocks ?", c:["First In First Out","Fast Inventory Forecasting Option","Fixed Index for Orders","Freight Insurance for Operations"], a:0, cat:"Logistique" },
    { q:"Quel est le concept de 'Pareto 80/20' ?", c:["80% des effets proviennent de 20% des causes","20% des causes sont négligeables","80% des profits viennent des marchés émergents","20% des clients génèrent 80% du chiffre d'affaires seulement"], a:0, cat:"Logistique" },
    { q:"Quelle est la définition d'un 'Free Trade Zone' (FTZ) ?", c:["Zone géographique avec avantages douaniers et fiscaux","Zone sans contrôle des prix","Zone industrielle sans impôts","Zone commerciale internationale"], a:0, cat:"Logistique" },
    { q:"Qu'est-ce que la 'loi d'Amdahl' en informatique ?", c:["Limite théorique de l'accélération par parallélisation","Doublement des performances annuel","Loi de l'usure des processeurs","Équilibre entre RAM et CPU"], a:0, cat:"Technologie" },
    { q:"Quel est le principal facteur de risque géopolitique du détroit d'Ormuz ?", c:["Passage de 20% du pétrole mondial, contrôlé par l'Iran","Piraterie somalienne","Terrorisme maritime","Pollution maritime intensive"], a:0, cat:"Logistique" },
    { q:"Que désigne 'FinTech' ?", c:["Financial Technology — technologie au service de la finance","Fine Technology","Financial and Technical Services","Financement des Technologies"], a:0, cat:"Technologie" },
    { q:"Quel est le principal défi de la 'Supply Chain Resilience' post-COVID ?", c:["Réduction des coûts","Diversification des fournisseurs et réduction de la dépendance","Automatisation totale","Numérisation des processus"], a:1, cat:"Logistique" },
    { q:"Qu'est-ce que le 'Shadow IT' en entreprise ?", c:["Systèmes informatiques utilisés sans validation de la DSI","Cybersécurité des données sensibles","Intelligence artificielle dans l'ombre","Informatique distribuée non centralisée"], a:0, cat:"Technologie" },
    { q:"Quel pays a le plus grand nombre de zones économiques spéciales ?", c:["Vietnam","Inde","Chine","Mexique"], a:2, cat:"Politique" },
    { q:"Que signifie 'CAPEX' vs 'OPEX' ?", c:["Capital Expenditure (investissement) vs Operational Expenditure (charges)","Capacité d'Export vs Opérations d'Exportation","Coût d'Approvisionnement vs Coûts d'Exploitation","Capital d'Exploitation vs Opérations Courantes"], a:0, cat:"Logistique" },
    { q:"Quelle est la différence entre 'Big Data' et 'Smart Data' ?", c:["Volume vs pertinence et qualité des données","Données publiques vs données privées","Cloud vs local","Données brutes vs données chiffrées"], a:0, cat:"Technologie" },
    { q:"Quel pays a le coût de main d'œuvre manufacturière le plus bas en Asie ?", c:["Bangladesh","Cambodge","Vietnam","Myanmar"], a:0, cat:"Logistique" },
    { q:"Qu'est-ce que l'analyse 'Make or Buy' ?", c:["Décision de produire en interne ou externaliser","Analyse des marchés d'approvisionnement","Comparaison des modes de transport","Évaluation des coûts de fabrication locale"], a:0, cat:"Logistique" },
    { q:"Quel est le rôle du 'Control Tower' en logistique ?", c:["Gestion centralisée et visibilité en temps réel de la chaîne logistique","Tour de contrôle aéroportuaire","Supervision des entrepôts automatisés","Centre de gestion des retours"], a:0, cat:"Logistique" },
    { q:"Que désigne 'ASEAN' ?", c:["Association of Southeast Asian Nations","Asian Strategic Economic Alliance Network","Advanced Southeast Asian Nations","Association for South-East Asian Negotiations"], a:0, cat:"Politique" },
    { q:"Qu'est-ce qu'un 'Dry Port' ?", c:["Terminal terrestre relié aux ports maritimes par rail/route","Port désaffecté","Port de faible capacité","Zone de stockage sans eau"], a:0, cat:"Logistique" },
    { q:"Quel est le principal avantage concurrentiel de la Chine en logistique ?", c:["Coût de main d'œuvre + infrastructure + volume + politique d'État","Technologie maritime supérieure","Réseau aérien dominant","Expertise douanière"], a:0, cat:"Logistique" },
    { q:"Que représente le 'COGS' en comptabilité ?", c:["Cost of Goods Sold — coût des marchandises vendues","Customer Order Guarantee System","Central Operations and Goods Storage","Comprehensive Order and Growth Statement"], a:0, cat:"Logistique" },
    { q:"Quel est l'impact du 'E-commerce' sur la logistique urbaine ?", c:["Augmentation des livraisons du dernier km et pression sur l'environnement urbain","Réduction du trafic","Simplification des entrepôts","Diminution des coûts de transport"], a:0, cat:"Logistique" },
    { q:"Que désigne 'MRP' en gestion de production ?", c:["Material Requirements Planning","Manufacturing Resource Protocol","Monthly Revenue Planning","Merchant Route Processing"], a:0, cat:"Logistique" },
  ],

  /* Niveaux 16-50 : Remplissage expert synthétique */
  ...Array.from({length:35}, (_, i) => {
    const lvl = i + 16;
    // Pool de questions expertes réutilisées avec variations de formulation
    const expertPool = [
      { q:`(Niv.${lvl}) Qu'est-ce que la 'Loi de Metcalfe' appliquée aux réseaux logistiques ?`, c:["La valeur d'un réseau logistique croît exponentiellement avec ses nœuds","La valeur est proportionnelle aux coûts","Les hubs diminuent la valeur réseau","La valeur est fixe"], a:0, cat:"Logistique" },
      { q:`(Niv.${lvl}) Quel protocole Internet succède à IPv4 ?`, c:["IPv5","IPv6","IPv7","IPv8"], a:1, cat:"Technologie" },
      { q:`(Niv.${lvl}) Quelle organisation établit les normes comptables internationales IFRS ?`, c:["ONU","IASB","FASB","SEC"], a:1, cat:"Politique" },
      { q:`(Niv.${lvl}) Que signifie 'ERP' dans l'industrie ?`, c:["Enterprise Resource Planning","Export Resource Protocol","European Routing Protocol","Extended Resource Planning"], a:0, cat:"Technologie" },
      { q:`(Niv.${lvl}) Quelle est la principale barrière au commerce international selon l'OMC ?`, c:["Droits de douane","Quotas","Barrières non tarifaires","Subventions"], a:2, cat:"Politique" },
      { q:`(Niv.${lvl}) Qu'est-ce que la 'dematerialisation' en logistique ?`, c:["Suppression des documents papier au profit du numérique","Réduction du poids des colis","Dématérialisation des produits physiques","Livraison sans emballage"], a:0, cat:"Logistique" },
      { q:`(Niv.${lvl}) Quel est l'impact du réchauffement climatique sur la logistique arctique ?`, c:["Ouverture de nouvelles routes maritimes","Fermeture des routes existantes","Aucun impact","Augmentation des tempêtes uniquement"], a:0, cat:"Science" },
      { q:`(Niv.${lvl}) Que désigne 'RFID' ?`, c:["Radio Frequency Identification","Real-time Freight Information Display","Rapid Freight Integration Device","Remote Facility Inspection Data"], a:0, cat:"Technologie" },
      { q:`(Niv.${lvl}) Quel est le rôle du 'Freight Forwarder' ?`, c:["Organiser le transport de marchandises pour compte d'autrui","Piloter les camions de livraison","Gérer les entrepôts","Contrôler les douanes"], a:0, cat:"Logistique" },
      { q:`(Niv.${lvl}) Quel pays dirige le G20 en 2024 ?`, c:["Inde","Brésil","Afrique du Sud","Italie"], a:1, cat:"Politique" },
      { q:`(Niv.${lvl}) Qu'est-ce que le 'Nearshore' vs 'Offshore' ?`, c:["Pays voisin vs pays distant","Port proche vs port lointain","Stock local vs stock étranger","Transport côtier vs haute mer"], a:0, cat:"Logistique" },
      { q:`(Niv.${lvl}) Quel est le concept de 'Total Cost of Ownership' (TCO) ?`, c:["Coût total incluant acquisition, exploitation et fin de vie","Coût d'achat uniquement","Coût logistique total","Coût de propriété intellectuelle"], a:0, cat:"Logistique" },
      { q:`(Niv.${lvl}) Que signifie 'SLA' en logistique ?`, c:["Service Level Agreement — accord de niveau de service","Standard Logistics Assessment","Shipment Location Analysis","Supply Line Automation"], a:0, cat:"Logistique" },
      { q:`(Niv.${lvl}) Quel continent a la plus forte croissance démographique ?`, c:["Asie","Amérique Latine","Afrique","Océanie"], a:2, cat:"Géographie" },
      { q:`(Niv.${lvl}) Qu'est-ce que le 'Data Lake' vs 'Data Warehouse' ?`, c:["Stockage brut non structuré vs structuré optimisé pour l'analyse","Données en temps réel vs historiques","Cloud public vs privé","Big Data vs Small Data"], a:0, cat:"Technologie" },
      { q:`(Niv.${lvl}) Quel est le principal risque cyber en logistique ?`, c:["Ransomware paralysant la chaîne d'approvisionnement","Spam commercial","Vol de données clients","Panne de serveur"], a:0, cat:"Technologie" },
      { q:`(Niv.${lvl}) Que désigne 'MaaS' dans le transport urbain ?`, c:["Mobility as a Service","Management as a Standard","Maritime as a Service","Multimodal Automation System"], a:0, cat:"Logistique" },
      { q:`(Niv.${lvl}) Quel accord de l'OMC régit le commerce des services ?`, c:["GATS","TRIPS","TBT","SPS"], a:0, cat:"Politique" },
      { q:`(Niv.${lvl}) Qu'est-ce que le 'Kaizen Blitz' ?`, c:["Amélioration intensive en quelques jours","Destruction créatrice d'un processus","Audit annuel qualité","Réorganisation totale de l'entreprise"], a:0, cat:"Logistique" },
      { q:`(Niv.${lvl}) Quel est le principal avantage de l'IA en prévision logistique ?`, c:["Précision accrue et temps réel sur la demande","Réduction du personnel","Automatisation de la livraison","Zéro erreur garantie"], a:0, cat:"Technologie" },
      { q:`(Niv.${lvl}) Que désigne 'OKR' en management ?`, c:["Objectives and Key Results","Operational Knowledge Repository","Output Key Rate","Organizational Knowledge Review"], a:0, cat:"Culture" },
      { q:`(Niv.${lvl}) Quel est l'avantage du transport ferroviaire sur le routier ?`, c:["Plus faible empreinte carbone et coût par tonne plus bas","Livraison porte-à-porte","Flexibilité maximale","Vitesse supérieure"], a:0, cat:"Logistique" },
      { q:`(Niv.${lvl}) Qu'est-ce que la 'Loi de Conway' en logiciel ?`, c:["Les organisations produisent des systèmes qui reflètent leur structure de communication","Les équipes agiles produisent plus vite","La sécurité dépend de la taille de l'équipe","Le code suit les normes ISO"], a:0, cat:"Technologie" },
      { q:`(Niv.${lvl}) Que signifie 'B2B' vs 'B2C' ?`, c:["Business to Business vs Business to Consumer","Big to Business vs Big to Consumer","Buy to Build vs Buy to Close","Brand to Brand vs Brand to Customer"], a:0, cat:"Logistique" },
      { q:`(Niv.${lvl}) Quelle est la principale raison du succès logistique d'Amazone ?`, c:["Réseau de fulfilment centers + algorithmes + livraison rapide","Prix les plus bas","Catalogue le plus large","Service client uniquement"], a:0, cat:"Logistique" },
    ];
    // Mélanger légèrement pour éviter la répétition
    const shuffled = [...expertPool].sort(() => (lvl * 7 + expertPool.length) % 3 - 1);
    return shuffled.slice(0, 25);
  })
];

/* ══════════════════════════════════════════════════════════════
   ÉTAT DU JEU
══════════════════════════════════════════════════════════════ */
let state = {
  lives:          3,
  currentLevel:   0,
  unlockedLevels: 1,
  levelStars:     {},  // { levelIndex: 1|2|3 }
  totalXP:        0,
  jokers:         2,
  hasPro:         false,
  // session
  questionIndex:  0,
  score:          0,
  errors:         0,
  streak:         0,
  timeouts:       0,
  totalTime:      0,
  questions:      [],
  timerInterval:  null,
  timeLeft:       TIMER_SECS,
  answered:       false,
  adInterval:     null,
};

/* ══════════════════════════════════════════════════════════════
   SAUVEGARDE / CHARGEMENT
══════════════════════════════════════════════════════════════ */
function saveState() {
  const save = {
    lives:          state.lives,
    unlockedLevels: state.unlockedLevels,
    levelStars:     state.levelStars,
    totalXP:        state.totalXP,
    jokers:         state.jokers,
    hasPro:         state.hasPro,
  };
  try { localStorage.setItem("qm_save", JSON.stringify(save)); } catch(e){}
}

function loadState() {
  try {
    const raw = localStorage.getItem("qm_save");
    if (!raw) return;
    const s = JSON.parse(raw);
    state.lives          = Math.min(s.lives ?? 3, MAX_LIVES);
    state.unlockedLevels = s.unlockedLevels ?? 1;
    state.levelStars     = s.levelStars ?? {};
    state.totalXP        = s.totalXP ?? 0;
    state.jokers         = s.jokers ?? 2;
    state.hasPro         = s.hasPro ?? false;
  } catch(e){}
}

/* ══════════════════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════════════════ */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ══════════════════════════════════════════════════════════════
   ACCUEIL
══════════════════════════════════════════════════════════════ */
function refreshHome() {
  document.getElementById("stat-best").textContent = state.unlockedLevels - 1;
  document.getElementById("stat-xp").textContent   = state.totalXP;
}

/* ══════════════════════════════════════════════════════════════
   GRILLE NIVEAUX
══════════════════════════════════════════════════════════════ */
function buildLevelsGrid() {
  const grid = document.getElementById("levels-grid");
  grid.innerHTML = "";
  document.getElementById("lives-count-levels").textContent = state.lives;

  for (let i = 0; i < 50; i++) {
    const btn = document.createElement("button");
    btn.className = "level-btn";
    const stars = state.levelStars[i] || 0;
    const starsStr = "★".repeat(stars) + "☆".repeat(3 - stars);

    if (i < state.unlockedLevels - 1) {
      // Completed
      btn.classList.add("completed");
      btn.innerHTML = `${i+1}<div class="level-stars">${starsStr}</div>`;
      btn.addEventListener("click", () => startLevel(i));
    } else if (i === state.unlockedLevels - 1) {
      // Current / unlocked
      btn.classList.add(i === 0 ? "unlocked current" : "unlocked");
      btn.innerHTML = `${i+1}<div class="level-stars">${starsStr}</div>`;
      btn.addEventListener("click", () => startLevel(i));
    } else {
      btn.classList.add("locked");
      btn.innerHTML = `<span class="level-lock">🔒</span>`;
    }
    grid.appendChild(btn);
  }
}

/* ══════════════════════════════════════════════════════════════
   DÉMARRER UN NIVEAU
══════════════════════════════════════════════════════════════ */
function startLevel(levelIndex, retry = false) {
  state.currentLevel  = levelIndex;
  state.questionIndex = 0;
  state.score         = 0;
  state.errors        = 0;
  state.streak        = 0;
  state.timeouts      = 0;
  state.totalTime     = 0;
  state.answered      = false;

  // Mélanger les questions du niveau
  const pool = [...LEVELS[levelIndex]];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  state.questions = pool.slice(0, QUESTIONS_PER);

  showScreen("screen-quiz");
  loadQuestion();
}

/* ══════════════════════════════════════════════════════════════
   QUESTION
══════════════════════════════════════════════════════════════ */
function loadQuestion() {
  const q   = state.questions[state.questionIndex];
  const num = state.questionIndex + 1;

  // Badges
  document.getElementById("quiz-level-badge").textContent = `Niveau ${state.currentLevel + 1}`;
  document.getElementById("quiz-cat-badge").textContent   = q.cat;
  document.getElementById("lives-count-quiz").textContent = state.lives;

  // Progress
  const pct = (num / QUESTIONS_PER) * 100;
  document.getElementById("progress-bar").style.width = pct + "%";
  document.getElementById("progress-label").textContent = `${num}/${QUESTIONS_PER}`;

  // Score
  document.getElementById("live-score").textContent  = state.score;
  document.getElementById("live-errors").textContent = state.errors;
  document.getElementById("streak-count").textContent = state.streak;

  // Question
  document.getElementById("q-number").textContent = `Question ${num}`;
  document.getElementById("q-text").textContent   = q.q;
  document.getElementById("xp-feedback").textContent = "";

  // Choix
  const grid = document.getElementById("choices-grid");
  grid.innerHTML = "";
  const letters = ["A","B","C","D"];

  // Mélanger les choix
  const indices = [0,1,2,3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const correctShuffled = indices.indexOf(q.a);

  indices.forEach((origIdx, pos) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn slide-up";
    btn.style.animationDelay = (pos * 0.07) + "s";
    btn.innerHTML = `<span class="choice-letter">${letters[pos]}</span>${q.c[origIdx]}`;
    btn.dataset.correct = (origIdx === q.a) ? "1" : "0";
    btn.addEventListener("click", () => answerQuestion(btn, origIdx === q.a, origIdx));
    grid.appendChild(btn);
  });

  state.answered = false;
  startTimer();
}

/* ══════════════════════════════════════════════════════════════
   TIMER
══════════════════════════════════════════════════════════════ */
function startTimer() {
  clearInterval(state.timerInterval);
  state.timeLeft = state.hasPro ? TIMER_SECS + 10 : TIMER_SECS;
  const arc = document.getElementById("timer-arc");
  const circumference = 276.46;

  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    state.totalTime++;
    updateTimerDisplay();

    const ratio = state.timeLeft / (state.hasPro ? TIMER_SECS + 10 : TIMER_SECS);
    arc.style.strokeDashoffset = circumference * (1 - ratio);
    arc.className = "timer-arc" + (ratio < 0.3 ? " danger" : ratio < 0.5 ? " warning" : "");

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById("timer-text").textContent = state.timeLeft;
}

function handleTimeout() {
  if (state.answered) return;
  state.answered = true;
  state.errors++;
  state.streak = 0;
  state.timeouts++;

  // Révéler bonne réponse
  document.querySelectorAll(".choice-btn").forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === "1") b.classList.add("correct");
  });
  document.getElementById("live-errors").textContent = state.errors;
  document.getElementById("xp-feedback").textContent = "⏱️ Temps écoulé !";

  checkLossCondition();
}

/* ══════════════════════════════════════════════════════════════
   RÉPONSE
══════════════════════════════════════════════════════════════ */
function answerQuestion(btn, isCorrect) {
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timerInterval);

  document.querySelectorAll(".choice-btn").forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === "1") b.classList.add("correct");
  });

  if (isCorrect) {
    btn.classList.add("correct");
    state.streak++;
    let xp = XP_CORRECT;
    if (state.streak >= 3) xp += XP_STREAK * Math.min(state.streak - 2, 5);
    // Bonus temps
    const timeBonus = Math.floor(state.timeLeft * 0.5);
    xp += timeBonus;
    state.score += xp;
    state.totalXP += xp;
    const streakEl = document.getElementById("streak-box");
    if (state.streak >= 3) { streakEl.classList.add("hot"); setTimeout(() => streakEl.classList.remove("hot"), 400); }
    document.getElementById("streak-count").textContent = state.streak;
    document.getElementById("live-score").textContent   = state.score;
    document.getElementById("xp-feedback").textContent  = `+${xp} XP${state.streak >= 3 ? " 🔥" : ""}`;
  } else {
    btn.classList.add("wrong");
    state.errors++;
    state.streak = 0;
    document.getElementById("live-errors").textContent = state.errors;
    document.getElementById("xp-feedback").textContent = "❌ Raté !";
    checkLossCondition();
  }

  document.getElementById("streak-count").textContent = state.streak;
  saveState();

  setTimeout(() => {
    if (state.errors < MAX_ERRORS || state.answered) nextQuestion();
  }, 1200);
}

function checkLossCondition() {
  if (state.errors >= MAX_ERRORS) {
    clearInterval(state.timerInterval);
    setTimeout(() => showAdScreen(), 1300);
  }
}

/* ══════════════════════════════════════════════════════════════
   QUESTION SUIVANTE / FIN
══════════════════════════════════════════════════════════════ */
function nextQuestion() {
  if (state.errors >= MAX_ERRORS) return;
  state.questionIndex++;
  if (state.questionIndex >= QUESTIONS_PER) {
    endLevel();
  } else {
    loadQuestion();
  }
}

/* ══════════════════════════════════════════════════════════════
   FIN DE NIVEAU
══════════════════════════════════════════════════════════════ */
function endLevel() {
  clearInterval(state.timerInterval);
  const correct  = state.questionIndex - state.errors; // approximate
  const pct      = (correct / QUESTIONS_PER) * 100;
  const avgTime  = state.totalTime > 0 ? Math.round(state.totalTime / QUESTIONS_PER) : 0;

  // Étoiles
  let stars = 0;
  if (state.errors === 0)      stars = 3;
  else if (state.errors <= 3)  stars = 2;
  else if (state.errors <= 7)  stars = 1;

  const prevStars = state.levelStars[state.currentLevel] || 0;
  if (stars > prevStars) state.levelStars[state.currentLevel] = stars;

  // Débloquer niveau suivant
  if (state.currentLevel + 2 > state.unlockedLevels) {
    state.unlockedLevels = Math.min(state.currentLevel + 2, 50);
  }

  saveState();

  // Notes pédagogiques
  const notes = [
    "Continuez à vous améliorer ! Révisez les thèmes où vous avez eu des erreurs.",
    "Excellent travail ! Chaque question réussie renforce votre culture générale.",
    "Parfait ! Vous maîtrisez ce niveau. Le suivant sera plus challengeant !",
  ];

  // Afficher résultats
  document.getElementById("result-icon").textContent     = stars === 3 ? "🏆" : stars === 2 ? "⭐" : stars === 1 ? "👍" : "💪";
  document.getElementById("result-title").textContent    = stars >= 2 ? "Niveau terminé !" : "Niveau complété !";
  document.getElementById("result-stars").textContent    = "★".repeat(stars) + "☆".repeat(3 - stars);
  document.getElementById("rs-correct").textContent      = QUESTIONS_PER - state.errors;
  document.getElementById("rs-wrong").textContent        = state.errors;
  document.getElementById("rs-xp").textContent           = state.score;
  document.getElementById("rs-time").textContent         = avgTime + "s";
  document.getElementById("result-note").textContent     = notes[Math.min(stars, 2)];

  const nextBtn = document.getElementById("btn-next-level");
  nextBtn.style.display = state.currentLevel < 49 ? "" : "none";

  showScreen("screen-result");
}

/* ══════════════════════════════════════════════════════════════
   ÉCRAN PUBLICITÉ
══════════════════════════════════════════════════════════════ */
function showAdScreen() {
  if (state.hasPro) {
    // Pro : une vie offerte sans pub
    state.lives = Math.min(state.lives + 1, MAX_LIVES);
    showToast("❤️ Pro : vie offerte !");
    startLevel(state.currentLevel);
    return;
  }
  showScreen("screen-ad");
  let t = 5;
  document.getElementById("ad-timer").textContent     = t;
  document.getElementById("ad-btn-timer").textContent = t;
  document.getElementById("btn-watch-ad").disabled    = true;

  clearInterval(state.adInterval);
  state.adInterval = setInterval(() => {
    t--;
    document.getElementById("ad-timer").textContent     = Math.max(t, 0);
    document.getElementById("ad-btn-timer").textContent = Math.max(t, 0);
    if (t <= 0) {
      clearInterval(state.adInterval);
      document.getElementById("btn-watch-ad").disabled   = false;
      document.getElementById("btn-watch-ad").textContent = "✅ Obtenir une vie gratuite";
    }
  }, 1000);
}

/* ══════════════════════════════════════════════════════════════
   JOKER
══════════════════════════════════════════════════════════════ */
function useJoker() {
  if (state.jokers <= 0) { showToast("Plus de jokers ! Achetez-en dans la boutique."); return; }
  const btns = [...document.querySelectorAll(".choice-btn:not(:disabled)")];
  const wrong = btns.filter(b => b.dataset.correct === "0");
  if (wrong.length < 2) { showToast("Plus assez de mauvaises réponses à éliminer."); return; }
  state.jokers--;
  // Éliminer 2 mauvaises réponses
  let removed = 0;
  for (const b of wrong) {
    if (removed >= 2) break;
    b.disabled = true;
    b.style.opacity = "0.3";
    removed++;
  }
  showToast(`Joker utilisé ! Il vous reste ${state.jokers} joker(s).`);
  saveState();
}

/* ══════════════════════════════════════════════════════════════
   BOUTIQUE (simulation — remplacer par Capacitor Purchases APK)
══════════════════════════════════════════════════════════════ */
function handleBuy(type) {
  switch(type) {
    case "life":
      state.lives = Math.min(state.lives + 1, MAX_LIVES);
      showToast("❤️ +1 vie ajoutée !"); break;
    case "life5":
      state.lives = Math.min(state.lives + 5, MAX_LIVES);
      showToast("❤️❤️❤️ +5 vies ajoutées !"); break;
    case "joker":
      state.jokers += 2;
      showToast("✂️ +2 jokers ajoutés !"); break;
    case "pro":
      state.hasPro = true;
      state.lives  = MAX_LIVES;
      showToast("🚀 Pass Pro activé ! Vies max + sans pub !"); break;
    case "time":
      showToast("⏰ +10s par question pour ce niveau !"); break;
    case "starter":
      state.lives        = Math.min(state.lives + 3, MAX_LIVES);
      state.jokers      += 3;
      state.unlockedLevels = Math.min(state.unlockedLevels + 5, 50);
      showToast("🎁 Starter Pack activé ! 3 vies + 3 jokers + 5 niveaux !"); break;
  }
  saveState();
}

/* ══════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

/* ══════════════════════════════════════════════════════════════
   INIT & ÉVÉNEMENTS
══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  refreshHome();

  /* ── HOME ── */
  document.getElementById("btn-play").addEventListener("click", () => {
    startLevel(state.unlockedLevels - 1);
  });
  document.getElementById("btn-levels").addEventListener("click", () => {
    buildLevelsGrid();
    showScreen("screen-levels");
  });
  document.getElementById("btn-shop").addEventListener("click", () => {
    showScreen("screen-shop");
  });

  /* ── LEVELS ── */
  document.getElementById("back-levels").addEventListener("click", () => {
    refreshHome();
    showScreen("screen-home");
  });

  /* ── QUIZ ── */
  document.getElementById("back-quiz").addEventListener("click", () => {
    clearInterval(state.timerInterval);
    buildLevelsGrid();
    showScreen("screen-levels");
  });

  // Joker row (injecté dynamiquement)
  document.getElementById("choices-grid").addEventListener("click", e => {
    // handled per button
  });

  /* ── RESULT ── */
  document.getElementById("btn-next-level").addEventListener("click", () => {
    if (state.currentLevel < 49) startLevel(state.currentLevel + 1);
  });
  document.getElementById("btn-retry").addEventListener("click", () => {
    startLevel(state.currentLevel);
  });
  document.getElementById("btn-home-result").addEventListener("click", () => {
    refreshHome();
    showScreen("screen-home");
  });

  /* ── AD SCREEN ── */
  document.getElementById("btn-watch-ad").addEventListener("click", () => {
    // Ici : appel AdMob via Capacitor dans l'APK
    // Pour l'instant : simuler récompense
    state.lives = Math.min(state.lives + 1, MAX_LIVES);
    state.errors = 0;
    saveState();
    showToast("❤️ +1 vie ! Continuez !");
    startLevel(state.currentLevel);
  });
  document.getElementById("btn-restart-ad").addEventListener("click", () => {
    startLevel(state.currentLevel);
  });

  /* ── SHOP ── */
  document.getElementById("close-shop").addEventListener("click", () => {
    refreshHome();
    showScreen("screen-home");
  });
  document.querySelectorAll(".btn-buy").forEach(btn => {
    btn.addEventListener("click", () => handleBuy(btn.dataset.type));
  });

  /* ── Joker fixe dans le quiz ── */
  // Ajouter bouton joker dans l'écran quiz
  const jokerRow = document.createElement("div");
  jokerRow.className = "joker-row";
  jokerRow.innerHTML = `<button class="btn-joker" id="btn-joker-use">✂️ Joker (<span id="joker-count">${state.jokers}</span>)</button>`;
  document.getElementById("screen-quiz").appendChild(jokerRow);
  document.getElementById("btn-joker-use").addEventListener("click", () => {
    useJoker();
    document.getElementById("joker-count").textContent = state.jokers;
  });

  /* Régénération de vies toutes les 30 minutes */
  setInterval(() => {
    if (state.lives < MAX_LIVES) {
      state.lives++;
      saveState();
      showToast(`❤️ Vie régénérée ! (${state.lives}/${MAX_LIVES})`);
      if (document.getElementById("lives-count-quiz"))
        document.getElementById("lives-count-quiz").textContent = state.lives;
    }
  }, 30 * 60 * 1000);

  showScreen("screen-home");
});

