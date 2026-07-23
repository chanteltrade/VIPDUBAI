const NUMERO_WHATSAPP_ADMIN = "237600000000"; 
let deviseActuelle = 'USD';
let dataClient = {};

function ouvrirModal(id) {
    document.getElementById(id).style.display = "block";
}

function fermerModal(id) {
    document.getElementById(id).style.display = "none";
}

function changerIndicatif() {
    const select = document.getElementById('pays');
    const inputTel = document.getElementById('telephone');
    const selectedOpt = select.options[select.selectedIndex];
    if(selectedOpt && selectedOpt.value !== "") {
        inputTel.value = selectedOpt.getAttribute('data-code') + " ";
    } else {
        inputTel.value = "";
    }
}

function selectionnerDevise(devise) {
    deviseActuelle = devise;
    document.getElementById('btnUSD').classList.remove('active');
    document.getElementById('btnXAF').classList.remove('active');
    
    if(deviseActuelle === 'USD') {
        document.getElementById('btnUSD').classList.add('active');
        document.getElementById('deviseProfit').innerText = "$";
    } else {
        document.getElementById('btnXAF').classList.add('active');
        document.getElementById('deviseProfit').innerText = "FCFA";
    }
    calculerProfit();
}

function calculerProfit() {
    const montant = parseFloat(document.getElementById('montant').value);
    const affichage = document.getElementById('profitAffichage');
    if (!isNaN(montant) && montant > 0) {
        const rendementEstime = Math.floor(montant * 1.45); 
        affichage.innerText = "+ " + rendementEstime.toLocaleString();
    } else {
        affichage.innerText = "Calcul en cours...";
    }
}

function validerFormulaire(event) {
    event.preventDefault();
    const montant = parseFloat(document.getElementById('montant').value);
    const errBox = document.getElementById('erreurMontant');
    let estValide = false;

    if (deviseActuelle === 'USD' && montant >= 120) estValide = true;
    if (deviseActuelle === 'XAF' && montant >= 69000) estValide = true;

    if (!estValide) {
        errBox.style.display = "block";
        errBox.innerText = deviseActuelle === 'USD' ? "❌ Seuil minimal : 120 DOLLARS." : "❌ Seuil minimal : 69 000 FCFA.";
        return;
    }

    errBox.style.display = "none";

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
    const sym = dataClient.devise === 'USD' ? '$' : ' FCFA';
    document.getElementById('contenuRecap').innerHTML = `
        <div class="recap-item"><span class="label">Client :</span><span class="valeur">${dataClient.nom} ${dataClient.prenom}</span></div>
        <div class="recap-item"><span class="label">Pays :</span><span class="valeur">${dataClient.pays}</span></div>
        <div class="recap-item"><span class="label">Téléphone :</span><span class="valeur">${dataClient.tel}</span></div>
        <div class="recap-item"><span class="label">Bénéficiaire :</span><span class="valeur">${dataClient.nomB}</span></div>
        <div class="recap-item"><span class="label">Canal :</span><span class="valeur">${dataClient.telB}</span></div>
        <div class="recap-item"><span class="label">Capital :</span><span class="valeur" style="color:var(--rose)">${dataClient.montant.toLocaleString()}${sym}</span></div>
        <div class="recap-item"><span class="label">Marge :</span><span class="valeur" style="color:#25D366">+ ${dataClient.profit.toLocaleString()}${sym}</span></div>
    `;
    ouvrirModal('modalRecap');
}

function envoyerWhatsApp() {
    const sym = dataClient.devise === 'USD' ? '$' : ' FCFA';
    let txt = `*INVESTISSEMENT SECURISE — CHANTEL WHITE TRADE*\n\n`;
    txt += `• *Client :* ${dataClient.nom} ${dataClient.prenom}\n`;
    txt += `• *Pays :* ${dataClient.pays}\n`;
    txt += `• *Téléphone :* ${dataClient.tel}\n`;
    txt += `• *Titulaire :* ${dataClient.nomB}\n`;
    txt += `• *Numéro Réception :* ${dataClient.telB}\n`;
    txt += `• *Fonds Engagés :* ${dataClient.montant.toLocaleString()}${sym}\n`;
    txt += `• *Marge :* + ${dataClient.profit.toLocaleString()}${sym}\n`;

    window.open(`https://whatsapp.com{NUMERO_WHATSAPP_ADMIN}&text=${encodeURIComponent(txt)}`, '_blank');
}
