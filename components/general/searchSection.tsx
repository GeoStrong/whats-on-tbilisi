import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Form from "next/form";
import Image from "next/image";
import tbilisiImg from "@/public/images/tbilisi.jpg";

const SearchSection: React.FC = () => {
  return (
    <div className="relative mb-8 w-full">
      <Image
        src={tbilisiImg.src}
        width={100}
        height={100}
        alt="Tbilisi Panorama"
        className="h-[30rem] w-full object-cover object-top brightness-50 md:hidden"
        unoptimized
      />
      <div className="parallax-effect relative mb-8 hidden h-[30rem] w-full bg-[url(@/public/images/tbilisi.jpg)] brightness-50 md:block"></div>
      <div className="absolute top-1/3 flex w-full flex-col items-center gap-3">
        <h1 className="text-center text-5xl font-bold text-white">
          Discover Your
          <span className="linear text-5xl font-bold"> Next Adventure</span>
        </h1>
        <div className="md:w-1/2">
          <Form action="/discover" className="flex items-center">
            <Input
              type="text"
              name="search"
              className="rounded-full rounded-r-none border-2 border-white bg-white p-6 text-black focus:border-primary"
              placeholder="Search Activities, Places"
            />
            <Button
              type="submit"
              className="rounded-full rounded-l-none border-2 border-primary bg-primary p-6 text-white hover:bg-primary/80 hover:text-white md:px-10"
              variant="outline"
            >
              Search
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default SearchSection;
