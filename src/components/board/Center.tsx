import art from '../../images/extendedVersion.png';

export function Center() {
  return (
    <div className="center">
      <div className="diagonal-card" role="img" aria-label="Il team SIDA">
        <img className="art" src={art} alt="" />

        <div className="ribbon-flat">Il Monopoli di SIDA</div>

        <div className="license-plate">
          <img src="/resources/logo-sida.svg" alt="" />
        </div>
      </div>

      <div className="deck deck-imprevisti">
        <div className="deck-icon">🎲</div>
        <div className="deck-label">Imprevisti</div>
      </div>
      <div className="deck deck-probabilita">
        <div className="deck-icon">❓</div>
        <div className="deck-label">Probabilità</div>
      </div>
    </div>
  );
}
