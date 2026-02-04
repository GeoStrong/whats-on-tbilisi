import React from "react";
import Link from "next/link";
import { BsLinkedin } from "react-icons/bs";
import { BsPinterest } from "react-icons/bs";
import { BsWhatsapp } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";

const Socials: React.FC = () => {
  return (
    <>
      <div className="mt-2 flex items-center gap-3">
        <Link href="">
          <BsFacebook className="text-lg" />
        </Link>
        <Link href="">
          <BsInstagram className="text-lg" />
        </Link>
        <Link href="">
          <BsWhatsapp className="text-lg" />
        </Link>
        <Link href="">
          <BsPinterest className="text-lg" />
        </Link>
        <Link href="">
          <BsLinkedin className="text-lg" />
        </Link>
      </div>
    </>
  );
};
export default Socials;
