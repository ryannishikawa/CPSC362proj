/**
 * @file Loading.jsx
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * 
 * @description This shows a spinning logo and says "Loading..." so users know the page is loading.
 * 
 * @see {@link: https://loading.io/} for the resource used to make the svg of the logo.
 * @see {@link: https://react-svgr.com/playground/} for the converter used as this export.
 * 
 */

/**
 * The LoadingLogo component shows a pretty animated spinner.
 */
export function LoadingLogo(props) {
    return (
        <svg
    xmlns="http://www.w3.org/2000/svg"
    width={300}
    height={300}
    preserveAspectRatio="xMidYMid"
    style={{
      shapeRendering: "auto",
      display: "block",
      background: "0 0",
    }}
    viewBox="0 0 100 100"
    {...props}
  >
    <rect width={4} height={5} x={48} y={27.5} fill="#395d93" rx={2} ry={2.5}>
      <animate
        attributeName="opacity"
        begin="-0.9166666666666666s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(30 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="-0.8333333333333334s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(60 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="-0.75s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(90 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="-0.6666666666666666s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(120 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="-0.5833333333333334s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(150 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="-0.5s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(180 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="-0.4166666666666667s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(210 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="-0.3333333333333333s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(240 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="-0.25s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(270 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="-0.16666666666666666s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(300 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="-0.08333333333333333s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
    <rect
      width={4}
      height={5}
      x={48}
      y={27.5}
      fill="#395d93"
      rx={2}
      ry={2.5}
      transform="rotate(330 50 50)"
    >
      <animate
        attributeName="opacity"
        begin="0s"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        values="1;0"
      />
    </rect>
  </svg>
    );
}