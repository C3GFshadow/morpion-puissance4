// Variables globales pour morpion
let joueurActuel = 'X'; 
let jeuTermine = false;
let modeDeJeu = ''; 
let grilleMorpion = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

// Variables globales pour puissance 4
let grillePuissance4 = Array(6).fill().map(() => Array(7).fill(''));
let joueurActuelPuissance4 = 'X'; 
let jeuTerminePuissance4 = false;

// Fonction pour démarrer le menu principal
function demarrerJeu(jeu) {
    if (jeu === 'morpion') {
        // Afficher le sous-menu pour choisir JvJ ou JvO
        document.getElementById('menu').style.display = 'none';
        document.getElementById('menuMorpion').style.display = 'block';
    } else if (jeu === 'puissance4') {
        // Commencer le jeu Puissance 4
        document.getElementById('menu').style.display = 'none';
        document.getElementById('puissance4').style.display = 'block';
        modeDeJeu = '';
        jeuTerminePuissance4 = false;
        grillePuissance4 = Array(6).fill().map(() => Array(7).fill(''));
        afficherGrillePuissance4();
    }
}

// Sous-menu Morpion : Choisir entre JvJ ou JvO
function demarrerJeuMorpion(mode) {
    modeDeJeu = mode; // 'JvJ' ou 'JvO'
    joueurActuel = 'X'; // X commence
    jeuTermine = false;
    grilleMorpion = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    document.getElementById('menuMorpion').style.display = 'none';
    document.getElementById('morpion').style.display = 'block';
    afficherGrilleMorpion();
    document.getElementById('message').textContent = `C'est au tour du joueur ${joueurActuel}`;
}

// -- Jeu du Morpion --

// Fonction pour afficher la grille du Morpion
function afficherGrilleMorpion() {
    const grilleElement = document.getElementById('grilleMorpion');
    grilleElement.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const caseElement = document.createElement('div');
            caseElement.classList.add('case');
            caseElement.dataset.row = i;
            caseElement.dataset.col = j;
            
            if (grilleMorpion[i][j] !== '') {
                caseElement.textContent = grilleMorpion[i][j];
                caseElement.classList.add(grilleMorpion[i][j]); 
            }

            caseElement.addEventListener('click', () => jouerMorpion(i, j));
            grilleElement.appendChild(caseElement);
        }
    }
}

// Fonction pour jouer un coup dans le Morpion
function jouerMorpion(row, col) {
    if (jeuTermine || grilleMorpion[row][col] !== '') return;

    grilleMorpion[row][col] = joueurActuel;
    afficherGrilleMorpion();
    verifierVictoireMorpion();

    if (!jeuTermine && modeDeJeu === 'JvO' && joueurActuel === 'X') {
        joueurActuel = 'O';
        document.getElementById('message').textContent = `C'est au tour du joueur ${joueurActuel}`;
        setTimeout(() => ordinateurJoueMorpion(), 500);
    } else if (!jeuTermine) {
        joueurActuel = joueurActuel === 'X' ? 'O' : 'X';
        document.getElementById('message').textContent = `C'est au tour du joueur ${joueurActuel}`;
    }
}

// Fonction pour que l'ordinateur joue de manière aléatoire dans Morpion
function ordinateurJoueMorpion() {
    const casesLibres = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grilleMorpion[i][j] === '') {
                casesLibres.push([i, j]);
            }
        }
    }
    const [row, col] = casesLibres[Math.floor(Math.random() * casesLibres.length)];
    grilleMorpion[row][col] = 'O';
    afficherGrilleMorpion();
    verifierVictoireMorpion();
    if (!jeuTermine) {
        joueurActuel = 'X';
        document.getElementById('message').textContent = `C'est au tour du joueur ${joueurActuel}`;
    }
}

// Fonction pour vérifier la victoire dans le Morpion
function verifierVictoireMorpion() {
    const combinaisonsGagnantes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];
    for (let combi of combinaisonsGagnantes) {
        const [a, b, c] = combi;
        if (grilleMorpion[Math.floor(a / 3)][a % 3] === joueurActuel && 
            grilleMorpion[Math.floor(b / 3)][b % 3] === joueurActuel && 
            grilleMorpion[Math.floor(c / 3)][c % 3] === joueurActuel) {
            document.getElementById('message').textContent = `Le joueur ${joueurActuel} a gagné !`;
            jeuTermine = true;
            return;
        }
    }
    if (grilleMorpion.every(row => row.every(cell => cell !== ''))) {
        document.getElementById('message').textContent = "Match nul !";
        jeuTermine = true;
    }
}

// -- Jeu Puissance 4 ! --

// Fonction pour afficher la grille du puissance 4
function afficherGrillePuissance4() {
    const grilleElement = document.getElementById('grillePuissance4');
    grilleElement.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            const caseElement = document.createElement('div');
            caseElement.classList.add('casePuissance4');
            caseElement.dataset.row = i;
            caseElement.dataset.col = j;
            
            if (grillePuissance4[i][j] !== '') {
                caseElement.classList.add(grillePuissance4[i][j] === 'X' ? 'XP4' : 'OP4');
            }

            caseElement.addEventListener('click', () => jouerPuissance4(j));
            grilleElement.appendChild(caseElement);
        }
    }
}

// Fonction pour jouer un coup dans le Puissance 4
function jouerPuissance4(col) {
    if (jeuTerminePuissance4) return;
    
    // Trouve la première case vide dans la colonne
    for (let i = 5; i >= 0; i--) {
        if (grillePuissance4[i][col] === '') {
            grillePuissance4[i][col] = joueurActuelPuissance4;
            afficherGrillePuissance4();
            verifierVictoirePuissance4();
            if (!jeuTerminePuissance4) {
                joueurActuelPuissance4 = joueurActuelPuissance4 === 'X' ? 'O' : 'X';
                document.getElementById('messagePuissance4').textContent = `C'est au tour du joueur ${joueurActuelPuissance4}`;
                if (modeDeJeu === 'JvO' && joueurActuelPuissance4 === 'O') {
                    setTimeout(() => ordinateurJouePuissance4(), 500);
                }
            }
            return;
        }
    }
}

// Fonction pour que l'ordinateur joue 
function ordinateurJouePuissance4() {
    const colonnesLibres = [];
    for (let j = 0; j < 7; j++) {
        if (grillePuissance4[0][j] === '') {
            colonnesLibres.push(j);
        }
    }
    const col = colonnesLibres[Math.floor(Math.random() * colonnesLibres.length)];
    jouerPuissance4(col);
}

// Fonction pour vérifier la victoire 
function verifierVictoirePuissance4() {
    // Vérification de toutes les lignes, colonnes et diagonales pour 4 jetons alignés
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (grillePuissance4[i][j] === '') continue;
            const joueur = grillePuissance4[i][j];
            
            // Horizontal
            if (j + 3 < 7 && grillePuissance4[i][j + 1] === joueur && grillePuissance4[i][j + 2] === joueur && grillePuissance4[i][j + 3] === joueur) {
                document.getElementById('messagePuissance4').textContent = `Le joueur ${joueur} a gagné !`;
                jeuTerminePuissance4 = true;
                return;
            }
            
            // Vertical
            if (i + 3 < 6 && grillePuissance4[i + 1][j] === joueur && grillePuissance4[i + 2][j] === joueur && grillePuissance4[i + 3][j] === joueur) {
                document.getElementById('messagePuissance4').textContent = `Le joueur ${joueur} a gagné !`;
                jeuTerminePuissance4 = true;
                return;
            }

            // Diagonale descendante
            if (i + 3 < 6 && j + 3 < 7 && grillePuissance4[i + 1][j + 1] === joueur && grillePuissance4[i + 2][j + 2] === joueur && grillePuissance4[i + 3][j + 3] === joueur) {
                document.getElementById('messagePuissance4').textContent = `Le joueur ${joueur} a gagné !`;
                jeuTerminePuissance4 = true;
                return;
            }

            // Diagonale montante
            if (i - 3 >= 0 && j + 3 < 7 && grillePuissance4[i - 1][j + 1] === joueur && grillePuissance4[i - 2][j + 2] === joueur && grillePuissance4[i - 3][j + 3] === joueur) {
                document.getElementById('messagePuissance4').textContent = `Le joueur ${joueur} a gagné !`;
                jeuTerminePuissance4 = true;
                return;
            }
        }
    }
    // Si la grille est pleine, match nul
    if (grillePuissance4.every(row => row.every(cell => cell !== ''))) {
        document.getElementById('messagePuissance4').textContent = "Match nul !";
        jeuTerminePuissance4 = true;
    }
}

// Fonction boutton "quitter"
function quitterJeu() {
    // Cache toutes les sections de jeu
    document.getElementById('menu').style.display = 'block'; // Affiche menu principal
    document.getElementById('morpion').style.display = 'none'; // Cache le Morpion
    document.getElementById('puissance4').style.display = 'none'; // Cache le Puissance 4
    document.getElementById('menuMorpion').style.display = 'none'; // Cache le sous-menu
}

// event boutton "quitter" morpion
document.getElementById('btnQuitterMorpion').addEventListener('click', quitterJeu);

// event boutton "quitter" puissance 4
document.getElementById('btnQuitterPuissance4').addEventListener('click', quitterJeu);



// Réinitialisation du jeu Morpion
function recommencerMorpion() {
    // Réinitialisation de la grille
    grilleMorpion = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    joueurActuel = 'X'; // X recommence
    jeuTermine = false; // Le jeu n'est pas terminé
    document.getElementById('message').textContent = `C'est au tour du joueur ${joueurActuel}`;
    afficherGrilleMorpion(); // Redessiner la grille vide
}

// Réinitialisation du jeu Puissance 4
function recommencerPuissance4() {
    // Réinitialisation de la grille
    grillePuissance4 = Array(6).fill().map(() => Array(7).fill(''));
    joueurActuelPuissance4 = 'X'; // X recommence
    jeuTerminePuissance4 = false; // Le jeu n'est pas terminé
    document.getElementById('messagePuissance4').textContent = `C'est au tour du joueur ${joueurActuelPuissance4}`;
    afficherGrillePuissance4(); // Redessiner la grille vide
}

// Ajouter l'événement pour le bouton "Recommencer" du jeu Morpion
document.getElementById('btnRecommencerMorpion').addEventListener('click', recommencerMorpion);

// Ajouter l'événement pour le bouton "Recommencer" du jeu Puissance 4
document.getElementById('btnRecommencerPuissance4').addEventListener('click', recommencerPuissance4);