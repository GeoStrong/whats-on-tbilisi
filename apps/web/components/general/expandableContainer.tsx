import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiExpandAlt } from "react-icons/bi";

interface ExpandableContainerProps {
  layoutId: string;
  containerTrigger: React.ReactNode;
  children: React.ReactNode;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  customOpenIcon?: React.ReactNode;
}

const ExpandableContainer: React.FC<ExpandableContainerProps> = ({
  layoutId,
  containerTrigger,
  children,
  openDialog,
  setOpenDialog,
  customOpenIcon,
}) => {
  useEffect(() => {
    if (openDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openDialog]);

  return (
    <>
      <AnimatePresence>
        {customOpenIcon ? (
          <div className="relative inline-block">
            {!openDialog && (
              <motion.button
                layoutId={layoutId}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenDialog(true);
                }}
                className="flex cursor-pointer items-center justify-center rounded-xl border-0 bg-transparent p-0"
                type="button"
              >
                {customOpenIcon}
              </motion.button>
            )}
          </div>
        ) : (
          <div className="relative w-full rounded-xl bg-white px-3 py-4 shadow-md dark:bg-gray-800">
            {!openDialog && (
              <motion.div
                layoutId={`expandable${layoutId}`}
                onClick={() => setOpenDialog(true)}
                className="absolute right-0 top-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl"
              >
                <BiExpandAlt />
              </motion.div>
            )}
            <button onClick={() => setOpenDialog(true)}>
              {containerTrigger}
            </button>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none fixed inset-0 z-40 bg-black/50"
            />

            <motion.div
              layoutId={`expandable${layoutId}`}
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={() => setOpenDialog(false)}
            >
              <motion.div
                className="relative rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
                initial={{ borderRadius: 20 }}
                animate={{ borderRadius: 20 }}
                exit={{ borderRadius: 20 }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                {children}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default ExpandableContainer;
