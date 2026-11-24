// Proizvodi: matrica naziva i cijena, kao polja u vježbi križić-kružić.
let proizvodi = [["Miš", 15], ["Tipkovnica", 25], ["Slušalice", 30], ["USB memorija", 10]];
let kosarica = [];
let drzave_gradovi = { HR: ["Zagreb", "Split", "Rijeka"], SI: ["Ljubljana", "Maribor"], BIH: ["Sarajevo", "Tuzla"] };
let lista = document.getElementById("kosarica");
let poruka = document.getElementById("poruka");
let rezultat = document.getElementById("rezultat");

function kreirajProizvode() {
    for (let i = 0; i < proizvodi.length; i++) {
        let red = document.createElement("tr");
        red.innerHTML = '<td><input type="checkbox" name="proizvod" id="p-' + i + '" title="' + proizvodi[i][0] + '" value="' + proizvodi[i][1] + '" aria-label="Odaberi ' + proizvodi[i][0] + '"></td><td>' + proizvodi[i][0] + '</td><td>' + proizvodi[i][1] + ' €</td><td><input type="number" id="k-' + i + '" min="1" max="99" value="1" aria-label="Količina ' + proizvodi[i][0] + '"></td>';
        document.getElementById("proizvodi").append(red);
    }
}
function prikaziPoruku(tekst, uspjeh) {
    poruka.innerText = tekst;
    poruka.classList.remove("crvena", "zelena");
    if (uspjeh) poruka.classList.add("zelena");
    else poruka.classList.add("crvena");
}
function dodaj() {
    let oznaceni = document.querySelectorAll('input[name="proizvod"]:checked');
    if (oznaceni.length === 0) { prikaziPoruku("Odaberite barem jedan proizvod.", false); return; }
    let novi = [];
    let ispravno = true;
    oznaceni.forEach(item => {
        let i = parseInt(item.id.split("-")[1]);
        let kolicina = Number(document.getElementById("k-" + i).value);
        if (!Number.isInteger(kolicina) || kolicina < 1 || kolicina > 99) ispravno = false;
        novi.push({ naziv: item.title, cijena: Number(item.value), kolicina: kolicina });
    });
    if (!ispravno) { prikaziPoruku("Količina mora biti cijeli broj od 1 do 99.", false); return; }
    novi.forEach(item => {
        let postoji = false;
        for (let i = 0; i < kosarica.length; i++) {
            if (kosarica[i].naziv === item.naziv) { kosarica[i].kolicina += item.kolicina; postoji = true; }
        }
        if (!postoji) kosarica.push(item);
    });
    oznaceni.forEach(item => { item.checked = false; document.getElementById("k-" + item.id.split("-")[1]).value = 1; });
    prikaziKosaricu();
    prikaziPoruku("Proizvodi su dodani.", true);
}
function ukupno() {
    let zb = 0;
    for (let i = 0; i < kosarica.length; i++) zb += kosarica[i].cijena * kosarica[i].kolicina;
    return zb;
}
function prikaziKosaricu() {
    rezultat.innerHTML = "";
    lista.innerHTML = "";
    if (kosarica.length === 0) lista.innerText = "Košarica je prazna.";
    else {
        let tablica = document.createElement("table");
        tablica.innerHTML = "<thead><tr><th>Proizvod</th><th>Cijena</th><th>Količina</th><th>Ukupno</th><th>Brisanje</th></tr></thead>";
        let tijelo = document.createElement("tbody");
        for (let i = 0; i < kosarica.length; i++) {
            let p = kosarica[i];
            let red = document.createElement("tr");
            red.innerHTML = "<td>" + p.naziv + "</td><td>" + p.cijena + " €</td><td>" + p.kolicina + "</td><td>" + p.cijena * p.kolicina + " €</td>";
            let celija = document.createElement("td");
            let gumb = document.createElement("button");
            gumb.innerText = "Izbriši";
            gumb.id = "brisanje-" + i;
            gumb.addEventListener("click", brisanje);
            celija.append(gumb); red.append(celija); tijelo.append(red);
        }
        tablica.append(tijelo); lista.append(tablica);
    }
    document.getElementById("total").innerText = "Ukupno: " + ukupno() + " €";
}
function brisanje() {
    let i = parseInt(this.id.split("-")[1]);
    kosarica.splice(i, 1);
    prikaziKosaricu(); prikaziPoruku("Proizvod je obrisan.", true);
}
function izbrisiZadnji() { kosarica.pop(); prikaziKosaricu(); prikaziPoruku("Košarica je ažurirana.", true); }
function izbrisiSve() { kosarica = []; prikaziKosaricu(); prikaziPoruku("Košarica je prazna.", true); }
function odabirGrada() {
    let drzave = document.getElementById("drzave");
    let gradovi = document.getElementById("gradovi");
    let drzava = drzave.options[drzave.selectedIndex].value;
    while (gradovi.options.length) gradovi.remove(0);
    gradovi.options.add(new Option("Odaberite grad", ""));
    let svi = drzave_gradovi[drzava];
    if (svi) for (let i = 0; i < svi.length; i++) gradovi.options.add(new Option(svi[i], svi[i]));
    document.getElementById("lista_gradova").innerHTML = "";
}
function prikaziGradove() {
    let gradovi = document.getElementById("gradovi");
    let izlaz = document.getElementById("lista_gradova");
    izlaz.innerHTML = "";
    let ul = document.createElement("ul");
    for (let i = 1; i < gradovi.options.length; i++) {
        let li = document.createElement("li"); li.innerText = gradovi.options[i].text; ul.append(li);
    }
    if (ul.lastElementChild) izlaz.append(ul); else izlaz.innerText = "Prvo odaberite državu.";
}
function kupi() {
    rezultat.innerHTML = "";
    let ime = document.getElementById("ime").value.trim();
    let prezime = document.getElementById("prezime").value.trim();
    let drzave = document.getElementById("drzave");
    let gradovi = document.getElementById("gradovi");
    let placanje = document.querySelector('input[name="placanje"]:checked');
    if (!kosarica.length || !ime || !prezime || !drzave.value || !gradovi.value || !placanje) {
        prikaziPoruku("Napunite košaricu i unesite sve podatke.", false); return;
    }
    prikaziPoruku("Narudžba je uspješno simulirana!", true);
    rezultat.innerText = ime + " " + prezime + "\n" + drzave.options[drzave.selectedIndex].text + ", " + gradovi.options[gradovi.selectedIndex].text + "\nPlaćanje: " + placanje.value + "\nUkupno: " + ukupno() + " €";
    let ul = document.createElement("ul");
    kosarica.forEach(p => { let li = document.createElement("li"); li.innerText = p.naziv + " × " + p.kolicina; ul.append(li); });
    rezultat.append(ul);
}
kreirajProizvode(); prikaziKosaricu();
document.getElementById("dodaj").addEventListener("click", dodaj);
document.getElementById("izbrisi").addEventListener("click", izbrisiZadnji);
document.getElementById("izbrisi_sve").addEventListener("click", izbrisiSve);
document.getElementById("drzave").addEventListener("change", odabirGrada);
document.getElementById("prikazi").addEventListener("click", prikaziGradove);
document.getElementById("kupi").addEventListener("click", kupi);
