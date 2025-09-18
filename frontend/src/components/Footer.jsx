import React from 'react';
import pjLogo from '../../assets/logo2.png';

const Footer = () => {
  return (
    <footer className="mb-5 text-gray-400 py-2 mt-5 text-center text-[7px] sm:text-[10px]">
      <div className="flex justify-center items-center gap-1">
        <img
          src={pjLogo}
          alt="PJ Logo"
          width={18}
          height={18}
          className="rounded-lg"
        />
      </div>
    </footer>
  );
};

export default Footer;
