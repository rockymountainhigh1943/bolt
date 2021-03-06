// import { Preact, h } from '@bolt/core';
const LifeSciences = ({ color, size, ...otherProps }) => {
  color = color || 'currentColor';
  size = size || '24';
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" {...otherProps}>
      <title>Icon/Industry/Life Sciences</title>
      <g fill="currentColor" fill-rule="evenodd">
        <path d="M7.209 24.797h10.942v-2H8.838c1.158-1.22 2.483-2.295 3.847-3.296l-1.184-1.613c-4.202 3.085-8.498 7.174-8.498 14.108h2c0-.574.043-1.118.107-1.65v.136h16.041v-2H5.479a12.414 12.414 0 0 1 1.73-3.685M24.703 7.335H14.11v2h8.925c-1.147 1.183-2.45 2.233-3.792 3.211l1.18 1.617c4.242-3.098 8.58-7.203 8.58-14.162h-2c0 .573-.044 1.118-.108 1.649H11.11v2h15.378a12.493 12.493 0 0 1-1.785 3.685" />
        <path d="M16.555 15.169C10.613 11.208 5 7.466 5 .002H3c0 8.535 6.327 12.752 12.446 16.83C21.388 20.795 27 24.537 27 32h2c0-8.535-6.327-12.752-12.445-16.831" />
      </g>
    </svg>
  );
};
export default LifeSciences;
