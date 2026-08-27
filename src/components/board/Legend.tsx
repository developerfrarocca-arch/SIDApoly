interface LineaDiBusiness {
    colore: string;
    testo: string;
}

const LINEE_DI_BUSINESS: readonly LineaDiBusiness[] = [
    {colore: 'pink', testo: 'Configurazione — SIDA Sync Test, SIDA Connect'},
    {colore: 'lightblue', testo: 'Formazione — Tachigrafo, Carico Sicuro, Guida Sicura'},
    {colore: 'orange', testo: 'Web — patenteonline.it, patente.it, sida.patente.it'},
    {colore: 'brown', testo: 'Mobile — SIDA QuizApp, SIDA Tools, SIDA Drive Controller'},
    {colore: 'red', testo: 'Didattica — Manuale AeB, Manuale Superiori, Manuale CQC'},
    {colore: 'yellow', testo: 'Simulatori — DRIVE 180°, DRIVE 360°, DRIVE CML'},
    {colore: 'green', testo: 'Ufficio — Aula, Quiz, Gestione Sida Millennium'},
    {colore: 'darkblue', testo: 'Sportello — TuttoPrenota, SIDA PagoPa'},
];

export function Legend() {
    return (
        <div className="panel">
            <h1>Il Monopoli di SIDA</h1>
            <div className="tagline">Edizione SIDA Autosoft Multimedia</div>

            <h2>Come si gioca</h2>
            <ul>
                <li>
                    Ogni giocatore riceve <b>1.500 Buoni Pasto</b> (tagli da 1, 5, 10, 20, 50, 100, 500) e
                    sceglie una pedina.
                </li>
                <li>
                    A turno si tira il dado e ci si muove in senso orario partendo da <b>Avvio sprint!</b>
                </li>
                <li>
                    Passando o fermandosi su <b>Avvio sprint!</b> si ritirano 200 BP.
                </li>
                <li>
                    Su una casella prodotto/servizio libera puoi <b>acquisirne la licenza</b> pagando il
                    valore indicato.
                </li>
                <li>
                    Se la casella è già di un altro giocatore, gli paghi il <b>canone</b> indicato.
                </li>
                <li>
                    Le caselle dello stesso colore formano una <b>Linea di business</b>: chi la possiede per
                    intero può rilasciare 🔄 <b>Aggiornamenti</b> (case) e una 🚀 <b>Major Release</b> (hotel)
                    per aumentare il canone dovuto.
                </li>
                <li>Vince chi resta l&apos;unico a non essere finito fuori budget (fallimento).</li>
            </ul>

            <h2>Legenda Linee di business</h2>
            <div className="swatches">
                {LINEE_DI_BUSINESS.map((linea) => (
                    <div className="swatch" key={linea.colore}>
                        <i style={{color: `var(--${linea.colore})`}}></i>
                        {linea.testo}
                    </div>
                ))}
            </div>

            <h2>Caselle speciali</h2>
            <ul className="special-list">
                <li>
                    <span className="ic">🧑‍💼</span>
                    <span>
            <b>Consulenza Nord / Sud / Est / Ovest</b> (4) — i consulenti assunti da Autosoft come
            referenti di zona; come le stazioni classiche: il canone dovuto raddoppia per ogni
            casella Consulenza posseduta dallo stesso giocatore.
          </span>
                </li>
                <li>
                    <span className="ic">⚡❄️</span>
                    <span>
            <b>Enel / Impianto clima</b> (2) — come le &quot;società&quot; classiche: l&apos;importo
            dovuto dipende dal tiro di dado.
          </span>
                </li>
                <li>
                    <span className="ic">🎲</span>
                    <span>
            <b>Imprevisti</b> (3) — pesca una carta con un evento casuale (bonus o malus).
          </span>
                </li>
                <li>
                    <span className="ic">❓</span>
                    <span>
            <b>Probabilità</b> (3) — pesca una carta dal mazzo Probabilità.
          </span>
                </li>
                <li>
                    <span className="ic">💶📄</span>
                    <span>
            <b>Tasse / Intrè</b> — versa l&apos;importo indicato al fondo cassa aziendale.
          </span>
                </li>
                <li>
                    <span className="ic">👥</span>
                    <span>
            <b>Riunione / Transito</b> — la &quot;prigione&quot; del Monopoli classico: di passaggio
            o convocato in sosta forzata.
          </span>
                </li>
                <li>
                    <span className="ic">☕</span>
                    <span>
            <b>Pausa caffè</b> — sosta gratuita, nessun effetto.
          </span>
                </li>
                <li>
                    <span className="ic">⏰</span>
                    <span>
            <b>Convocazione in riunione!</b> — manda direttamente in Riunione.
          </span>
                </li>
            </ul>

            <h2>Valuta</h2>
            <p className="currency">Buoni Pasto (BP)</p>

            <img className="panel-logo" src="/resources/logo-sida-blue.svg" alt="SIDA Autosoft Multimedia"/>
        </div>
    );
}
