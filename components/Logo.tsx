import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="py-10 flex items-center justify-center">
      <Image src="/icon.png" width={250} height={250} alt="Picture" />
    </div>
  );
};

export default Logo;
