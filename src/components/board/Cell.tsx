import type { Space } from '../../data/spaces';
import { placementOf, priceLabel, spaceCssClasses } from '../../model/board';

function CellContent({ space }: { space: Space }) {
  switch (space.type) {
    case 'corner':
      return (
        <>
          <div className="icon">{space.icon}</div>
          <div className="label">{space.name}</div>
          <div className="sub">{space.subtitle}</div>
        </>
      );
    case 'property':
      return (
        <>
          <div className="bar"></div>
          <div className="dept">{space.department}</div>
          <div className="name">{space.name}</div>
          <div className="price">{priceLabel(space.price)}</div>
        </>
      );
    case 'special':
      return (
        <>
          <div className="icon">{space.icon}</div>
          <div className="label">{space.name}</div>
          <div className="price">{priceLabel(space.price)}</div>
        </>
      );
    case 'card':
      return (
        <>
          <div className="icon">{space.icon}</div>
          <div className="label">{space.name}</div>
        </>
      );
  }
}

export function Cell({ space, index }: { space: Space; index: number }) {
  const { column, row, rotation } = placementOf(index);
  return (
    <div
      className={spaceCssClasses(space, rotation)}
      style={{ gridColumn: `${column}/${column + 1}`, gridRow: `${row}/${row + 1}` }}
    >
      <div className="inner">
        <CellContent space={space} />
      </div>
    </div>
  );
}
