/* eslint-disable react/react-in-jsx-scope */
import { motion } from "framer-motion";
import { MdOutlineAddReaction } from "react-icons/md";
const FaceGallery = (props: any) => {
  return (
    <section
      id="face_gallery"
      className="flex justify-start items-start flex-col mb-24"
    >
      <div className="flex w-full justify-between items-center gap-x-3 mt-16">
        <h2 className="text-lg font-bold text-black/80 ">{props.name}</h2>
        <div className="flex justify-center items-center px-4 py-2 rounded-full bg-black/80">
          <h4 className="text-white text-sm text-center">Coming Soon</h4>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex justify-start items-start gap-3 mt-5 flex-wrap"
      >
        <div
          id="face_item"
          onClick={() => {
            window.scrollTo(0, 0);
            props.newface();
          }}
          className="cursor-pointer flex justify-center items-center bg-transparent hover:bg-black/5 hover:shadow-lg transition-colors border-[3px] rounded-xl border-black/[0.75] w-full max-w-[150px] h-[220px]"
        >
          <MdOutlineAddReaction className="text-4xl text-black/70" />
        </div>
      </motion.div>
    </section>
  );
};

export default FaceGallery;
