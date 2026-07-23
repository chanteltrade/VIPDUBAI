// CONFIGURATION : Remplacez ce numéro par votre numéro administrateur WhatsApp (sans le + et sans espaces)
const NUMERO_WHATSAPP_ADMIN = "237600000000"; 

let deviseActuelle = 'USD';
let dataClient = {};

// Fonctions d'ouverture et fermeture des fenêtres modales
function ouvrirModal(id) {
    document.getElementById(id).style.display = "block";
}

function fermerModal(id) {
    document.getElementById(id).style.display = "none";
}

// Ajoute automatiquement l'indicatif dans la case numéro lors du choix du pays
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

// Gère le changement de devise ($ / FCFA)
function selectionnerDevise(devise) {
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

// Calcule automatiquement le profit (Montant x 9) de façon invisible
function calculerProfit() {
    const montant = parseFloat(document.getElementById('montant').value);
    const affichage = document.getElementById('profitAffichage');
    
    if (!isNaN(montant) && montant > 0) {
        affichage.innerText = (montant * 9).toLocaleString();
    } else {
        affichage.innerText = "0";
    }
}

// Vérifie les montants minimums obligatoires et crée la fiche récapitulative
function validerFormulaire(event) {
    event.preventDefault();
    const montant = parseFloat(document.getElementById('montant').value);
    const errBox = document.getElementById('erreurMontant');
    let estValide = false;

    // Vérification des minimums requis
    if (deviseActuelle === 'USD' && montant >= 120) estValide = true;
    if (deviseActuelle === 'XAF' && montant >= 69000) estValide = true;

    if (!estValide) {
        errBox.style.display = "block";
        errBox.innerText = deviseActuelle === 'USD' 
            ? "❌ Minimum requis : 120 DOLLARS." 
            : "❌ Minimum requis : 69 000 FCFA.";
        return;
    }

    errBox.style.display = "none";

    // Enregistrement des données du client
    dataClient = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        pays: document.getElementById('pays').options[document.getElementById('pays').selectedIndex].text,
        tel: document.getElementById('telephone').value,
        nomB: document.getElementById('nomBeneficiaire').value,
        telB: document.getElementById('telBeneficiaire').value,
        montant: montant,
        devise: deviseActuelle,
        profit: montant * 9
    };

    fermerModal('modalInvestir');
    
    // Génération visuelle du récapitulatif
    const sym = dataClient.devise === 'USD' ? '$' : ' FCFA';
    document.getElementById('contenuRecap').innerHTML = `
        <div class="recap-item"><span class="label">Nom :</span><span class="valeur">${dataClient.nom}</span></div>
        <div class="recap-item"><span class="label">Prénom :</span><span class="valeur">${dataClient.prenom}</span></div>
        <div class="recap-item"><span class="label">Pays :</span><span class="valeur">${dataClient.pays}</span></div>
        <div class="recap-item"><span class="label">Téléphone :</span><span class="valeur">${dataClient.tel}</span></div>
        <div class="recap-item"><span class="label">Bénéficiaire :</span><span class="valeur">${dataClient.nomB}</span></div>
        <div class="recap-item"><span class="label">Tél Bénéf. :</span><span class="valeur">${dataClient.telB}</span></div>
        <div class="recap-item"><span class="label">Investi :</span><span class="valeur" style="color:var(--rose)">${dataClient.montant.toLocaleString()}${sym}</span></div>
        <div class="recap-item"><span class="label">Gain Estimé :</span><span class="valeur" style="color:#25D366">${dataClient.profit.toLocaleString()}${sym}</span></div>
    `;
    
    ouvrirModal('modalRecap');
}

// Transmet proprement toutes les informations sur WhatsApp
function envoyerWhatsApp() {
    const sym = dataClient.devise === 'USD' ? '$' : ' FCFA';
    let txt = `*INVESTISSEMENT CHANTEL WHITE TRADE*\n\n`;
    txt += `• *Client :* ${dataClient.nom} ${dataClient.prenom}\n`;
    txt += `• *Pays :* ${dataClient.pays}\n`;
    txt += `• *Tél Client :* ${dataClient.tel}\n`;
    txt += `• *Compte Bénéficiaire :* ${dataClient.nomB}\n`;
    txt += `• *Tél Bénéficiaire :* ${dataClient.telB}\n`;
    txt += `• *Montant Déposé :* ${dataClient.montant.toLocaleString()}${sym}\n`;
    txt += `• *Profit Prévu (x9) :* ${dataClient.profit.toLocaleString()}${sym}\n`;

    window.open(`https://whatsapp.com{NUMERO_WHATSAPP_ADMIN}&text=${encodeURIComponent(txt)}`, '_blank');
}
