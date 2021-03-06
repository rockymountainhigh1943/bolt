// import { Preact, h } from '@bolt/core';
const ExternalLink = ({ color, size, ...otherProps }) => {
  color = color || 'currentColor';
  size = size || '24';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
      <title>Icon/utility/Indigo/24px/External link</title>
      <g fill="currentColor" fill-rule="evenodd">
        <path
          d="M0,64a64,64 0 1,0 128,0a64,64 0 1,0 -128,0"
          class="c-bolt-icon--background c-bolt-icon--circle-background"
          fill="none"
        />
        <g fill="currentColor">
          <path d="M18 11.977c-.55 0-1 .45-1 1v6c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1v-11c0-.55.45-1 1-1h6c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.656 0-3 1.344-3 3v11c0 1.656 1.344 3 3 3h11c1.656 0 3-1.344 3-3v-6c0-.55-.45-1-1-1" />
          <path d="M22 2.94v-.03a.939.939 0 0 0-.069-.3v-.012s0-.006-.006-.006a1.104 1.104 0 0 0-.156-.256l-.006-.006-.006-.006-.006-.006v-.006c-.025-.025-.044-.05-.069-.069h-.006l-.006-.006s-.006 0-.006-.006h-.006l-.006-.006a.812.812 0 0 0-.256-.156H21.378a.966.966 0 0 0-.3-.069H15.01c-.55 0-1 .45-1 1s.45 1 1 1h3.588l-9.3 9.275a1.005 1.005 0 0 0 0 1.413.999.999 0 0 0 1.412 0l9.294-9.294v3.588c0 .55.45 1 1 1s1-.45 1-1V2.945L22 2.94z" />
        </g>
      </g>
    </svg>
  );
};
export default ExternalLink;
