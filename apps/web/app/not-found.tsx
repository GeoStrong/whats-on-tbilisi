import Link from "next/link";
import React from "react";
const NotFound: React.FC = () => {
  return (
    <div className="mt-10 h-full w-full text-center">
      <h3 className="mb-3 text-lg">
        This page could not be{" "}
        <span className="dark:linear-dark linear-light">found</span>
      </h3>
      <p className="">
        Please check the URL or go back to the{" "}
        <Link href="/" className="text-primary">
          homepage
        </Link>
      </p>
    </div>
  );
};
export default NotFound;
