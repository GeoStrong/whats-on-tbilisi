import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Form from "next/form";
import Image from "next/image";
import tbilisiImg from "@/public/images/tbilisi.jpg";
import { useTranslation } from "react-i18next";

const SearchSection: React.FC = () => {
  const { t } = useTranslation(["common", "navigation"]);

  return (
    <div className="relative mb-8 w-full">
      <Image
        src={tbilisiImg.src}
        width={100}
        height={100}
        alt="Tbilisi Panorama"
        className="h-[20rem] w-full object-cover object-top brightness-50 md:hidden"
        unoptimized
      />
      <div className="parallax-effect relative mb-8 hidden h-[30rem] w-full bg-[url(@/public/images/tbilisi.jpg)] brightness-50 md:block"></div>
      <div className="absolute top-1/3 flex w-full flex-col items-center gap-3">
        <h1 className="text-center text-2xl font-bold text-white md:text-5xl">
          Discover Your
          <span className="linear-light text-2xl font-bold md:text-5xl">
            {" "}
            Next Adventure
          </span>
        </h1>
        <div className="md:w-1/2">
          <Form action="/discover" className="flex items-center">
            <Input
              type="text"
              name="search"
              className="h-8 rounded-full rounded-r-none border-2 border-white bg-white text-base text-black focus:border-primary md:h-11 md:p-6"
              placeholder={t("common:inputs:search:placeholder")}
            />
            <Button
              type="submit"
              className="h-8 rounded-full rounded-l-none border-2 border-primary bg-primary text-sm text-white hover:bg-primary/80 hover:text-white md:p-6 md:px-10"
              variant="outline"
            >
              {t("navigation:search")}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default SearchSection;
