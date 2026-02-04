import { CgSpinner } from "react-icons/cg";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <CgSpinner className="animate-spin text-3xl text-primary" />
    </div>
  );
};
export default Spinner;
