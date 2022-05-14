/* eslint-disable react/react-in-jsx-scope */
import { Switch } from "@mui/material";
import { motion } from "framer-motion";
import { purple } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#2e2e2c",
    },
  },
});

const OptionsSection = (props: any) => {
  return (
    <ThemeProvider theme={theme}>
      <section id="options" className="flex justify-start items-start flex-col">
        <div className="flex w-full justify-between items-center gap-x-3 mt-16">
          <h2 className="text-lg font-bold text-black/80 ">{props.name}</h2>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex justify-start items-start gap-3 mt-1 flex-wrap"
        >
          <div
            id="options"
            className="flex items-center justify-between w-full"
          >
            <h3>Hide video</h3>
            <Switch
              checked={!props.state}
              onChange={() => props.buttonfunc()}
              inputProps={{ "aria-label": "controlled" }}
              color="secondary"
            />
          </div>
        </motion.div>
      </section>
    </ThemeProvider>
  );
};

export default OptionsSection;
