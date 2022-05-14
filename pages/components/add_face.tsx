import { motion } from "framer-motion";

/* eslint-disable react/react-in-jsx-scope */
const AddFace = (props: any) => {
  return (
    <motion.section
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      exit={{ y: 20 }}
      transition={{ duration: 0.2 }}
      id="addface"
      className="px-[6vw] z-[70] my-8 cursor-default xl:my-0 xl:px-[80px] flex flex-col justify-start items-center rounded-xl w-full max-w-[800px] h-[500px] bg-[#E9E5DD]"
    >
      <h1 className="mt-14 text-3xl text-center font-bold">
        Add a new face in your gallery
      </h1>
      <h4 className="text-center mt-6 xl:mt-4">
        By adding a new face in LookFace, you will unlock new ways to recognize
        people and object in your screen by using your camera.
      </h4>
    </motion.section>
  );
};

export default AddFace;
