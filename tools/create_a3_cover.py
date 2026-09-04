from pathlib import Path


OUT = Path("output/pdf/cover_sida_a3.svg")


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    svg = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="420mm" height="297mm" viewBox="0 0 420 297">
  <title>Monopoly SIDA Limited Edition - A3 print cover</title>
  <rect width="420" height="297" fill="white"/>
  <!-- Finished trim: 396 x 268 mm, centred on an A3 landscape sheet. -->
  <g stroke="#808080" stroke-width="0.35" fill="none">
    <path d="M12 13.3v-6 M12 283.7v6 M408 13.3v-6 M408 283.7v6 M10.8 14.5H4.8 M409.2 14.5h6 M10.8 282.5H4.8 M409.2 282.5h6"/>
  </g>
  <g transform="translate(12 14.5)">
    <rect width="396" height="268" fill="#00447D"/>
    <g fill="none" stroke="#FFD400">
      <rect x="3" y="3" width="390" height="262" stroke-width="1.05"/>
      <rect x="6.2" y="6.2" width="383.6" height="255.6" stroke-width="0.72"/>
    </g>

    <!-- Plaques -->
    <g fill="#00447D" stroke="#FFD400">
      <rect x="135" y="2.8" width="126" height="19" stroke-width="1.05"/>
      <rect x="137.2" y="4.9" width="121.6" height="14.8" fill="none" stroke-width="0.55"/>
      <rect x="135" y="245.5" width="126" height="19" stroke-width="1.05"/>
      <rect x="137.2" y="247.6" width="121.6" height="14.8" fill="none" stroke-width="0.55"/>
    </g>
    <g fill="#FFD400" font-family="Arial, Helvetica, sans-serif" font-weight="700" text-anchor="middle">
      <text x="198" y="15.8" font-size="6.25">MONOPOLY</text>
      <text x="198" y="258.7" font-size="4.85">LIMITED EDITION</text>
    </g>

    <!-- Anniversary and SIDA vector mark -->
    <g fill="none" stroke="#FFD400" stroke-linecap="square">
      <path d="M119 154 L141 120 L151 120 M119 154H151 M141 120V166" stroke-width="0.9"/>
      <circle cx="163" cy="142.5" r="18" stroke-width="0.9"/>
      <path d="M176 127.5h8 M195 120.5v46" stroke-width="0.75"/>
    </g>
    <g fill="#FFD400" font-family="Arial, Helvetica, sans-serif" font-weight="700" text-anchor="middle">
      <text x="163" y="138.7" font-size="3.3">1986</text>
      <text x="163" y="144.2" font-size="3.3">2026</text>
    </g>
    <g fill="#FFD400" font-family="Arial, Helvetica, sans-serif" font-weight="700">
      <text x="209" y="149" font-size="25">SIDA</text>
      <text x="210" y="158" font-size="5.5">AutoSoft Multimedial</text>
    </g>
  </g>
</svg>
'''
    OUT.write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    main()
