/* eslint-disable react/react-in-jsx-scope */
import { motion } from "framer-motion";
const OptionsSection = (props: any) => {
  return (
    <section id="options" className="flex justify-start items-start flex-col">
      <div className="flex w-full justify-between items-center gap-x-3 mt-16">
        <h2 className="text-lg font-semibold text-black/80 ">{props.name}</h2>
        {/* <div className="flex justify-center items-center px-4 py-2 rounded-full bg-black/80">
          <h4 className="text-white text-sm text-center">Coming Soon</h4>
        </div> */}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex justify-start items-start gap-3 mt-5 flex-wrap"
      >
        <button
          onClick={() => props.buttonfunc()}
          className={`flex justify-center items-center px-4 py-2 rounded-md text-white ${
            props.state ? "bg-black/70" : "bg-black/50"
          }`}
        >
          {props.state ? "Hide Video" : "Show Video"}
        </button>
      </motion.div>
    </section>
  );
};

export default OptionsSection;
