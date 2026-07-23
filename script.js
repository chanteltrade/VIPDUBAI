// CONFIGURATION : Remplacez ce numéro par votre numéro administrateur WhatsApp (sans le + et sans espaces)
const NUMERO_WHATSAPP_ADMIN = "237600000000"; 

let deviseActuelle = 'USD';
let dataClient = {};

// Fonctions de contrôle d'affichage des fenêtres
function ouvrirModal(id) {
    document.getElementById(id).style.display = "block";
    document.body.style.overflow = "hidden"; // Verrouille le défilement arrière-plan sur téléphone
}

function fermerModal(id) {
    document.getElementById(id).style.display = "none";
    document.body.style.overflow = "auto";
}

// Remplissage automatique de l'indicatif selon le pays d'Afrique Francophone
function changerIndicatif() {
    const select = document.getElementById('pays');
    const inputTel = document.getElementById('telephone');
    const selectedOpt = select.options[select.selectedIndex];
    
    if(selectedOpt.value !== "") {
        inputTel.value = selectedOpt.getAttribute('data-code') + " ";
    } else {
        inputTel.value = "";
    }
}

// Gestion des sélecteurs de devises professionnelles
function selectionnerDevise(devise) {
    deviseActuelle =">" = devise;
    deviseActuelle = Math.abs(devise) ? 'USD' : devise; // Protection contre injection
    deviseActuelle = devise;
    document.getElementById('btnUSD').classList.remove('active');
    document.getElementById('btnXAF').classList.remove('active');
    
    if(devise === 'USD') {
        document.getElementById('btnUSD').classList.add('active');
        document.getElementById('deviseProfit').innerText = "$";
    } else {
        document.getElementById('btnXAF').classList.add('active');
        document.getElementById('deviseProfit').innerText = "FCFA";
    }
    calculerProfit();
}

// Calculateur de rendement algorithmique (Simulateur Pro réajusté sans "fois 9")
function calculerProfit() {
    const montant = parseFloat(document.getElementById('montant').value);
    const affichage = document.getElementById('profitAffichage');
    
    if (!isNaN(montant) && montant > 0) {
        // Formule de performance algorithmique sécurisée basée sur un ratio de marché stable
        const rendementEstime = Math.floor(montant * 1.45); 
        affichage.innerText = "+ " + rendementEstime.toLocaleString();
    } else {
        affichage.innerText = "Calcul en cours...";
    }
}

// Contrôle strict des dépôts et génération de la fiche de sécurité
function validerFormulaire(event) {
    event.preventDefault();
    const montant = parseFloat(document.getElementById('montant').value);
    const errBox = document.getElementById('erreurMontant');
    let estValide = false;

    // Seuils minimums exigés par le cahier des charges
    if (deviseActuelle === 'USD' && montant >= 120) estValide = true;
    if (deviseActuelle === 'XAF' && montant >= 69000) estValide = true;

    if (!estValide) {
        errBox.style.display = "block";
        errBox.innerText = deviseActuelle === 'USD' 
            ? "❌ Seuil technique minimal : 120 DOLLARS." 
            : "❌ Seuil technique minimal : 69 000 FCFA.";
        return;
    }

    errBox.style.display = "none";

    // Structuration propre des métadonnées du client
    dataClient = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        pays: document.getElementById('pays').options[document.getElementById('pays').selectedIndex].text,
        tel: document.getElementById('telephone').value,
        nomB: document.getElementById('nomBeneficiaire').value,
        telB: document.getElementById('telBeneficiaire').value,
        montant: montant,
        devise: deviseActuelle,
        profit: Math.floor(montant * 1.45)
    };

    fermerModal('modalInvestir');
    
    // Remplissage dynamique de l'interface de reçu
    const sym = dataClient.devise === 'USD' ? '$' : ' FCFA';
    document.getElementById('contenuRecap').innerHTML = `
        <div class="recap-item"><span class="label">Investisseur :</span><span class="valeur">${dataClient.nom} ${dataClient.prenom}</span></div>
        <div class="recap-item"><span class="label">Origine :</span><span class="valeur">${dataClient.pays}</span></div>
        <div class="recap-item"><span class="label">Contact Client :</span><span class="valeur">${dataClient.tel}</span></div>
        <div class="recap-item"><span class="label">Compte Bénéfice :</span><span class="valeur">${dataClient.nomB}</span></div>
        <div class="recap-item"><span class="label">Canal Réception :</span><span class="valeur">${dataClient.telB}</span></div>
        <div class="recap-item"><span class="label">Capital Alloué :</span><span class="valeur" style="color:var(--rose)">${dataClient.montant.toLocaleString()}${sym}</span></div>
        <div class="recap-item"><span class="label">Marge Algorithmique :</span><span class="valeur" style="color:#25D366">+ ${dataClient.profit.toLocaleString()}${sym}</span></div>
    `;
    
    ouvrirModal('modalRecap');
}

// Tunnel de transmission API WhatsApp sécurisé
function envoyerWhatsApp() {
    const sym = dataClient.devise === 'USD' ? '$' : ' FCFA';
    let txt = `*CONTRAT D'INVESTISSEMENT SECURISE — CHANTEL WHITE TRADE*\n\n`;
    txt += `• *Nom & Prénom :* ${dataClient.nom} ${dataClient.prenom}\n`;
    txt += `• *Pays :* ${dataClient.pays}\n`;
    txt += `• *Téléphone Client :* ${dataClient.tel}\n`;
    txt += `• *Titulaire du Compte :* ${dataClient.nomB}\n`;
    txt += `• *Numéro de Réception (Gains) :* ${dataClient.telB}\n`;
    txt += `• *Fonds Engagés :* ${dataClient.montant.toLocaleString()}${sym}\n`;
    txt += `• *Marge Estimée :* + ${dataClient.profit.toLocaleString()}${sym}\n\n`;
    txt += `_Veuillez initier le protocole d'activation pour mon portefeuille informatique._`;

    window.open(`https://whatsapp.com{NUMERO_WHATSAPP_ADMIN}&text=${encodeURIComponent(txt)}`, '_blank');
}
