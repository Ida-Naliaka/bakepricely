import React from "react";
import { BsEnvelopeAtFill } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="bg-black text-white h-fit p-3 absolute bottom-0">
      <div className="flex p-5 flex-1 justify-center items-center flex-wrap w-full">
            <BsEnvelopeAtFill style={{ marginRight: "10px" }} />
            bakepricely@support.com
      </div>
      <small className="flex p-5 flex-1 justify-center items-center flex-wrap w-full">
         &copy;BakePricely | All Rights Reserved
    </small>
    </div>
  );
};

export default Footer;