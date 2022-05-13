/* eslint-disable require-jsdoc */
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { HomeCointainer } from "../styles/components/home";
import { FaFingerprint } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { BsFillMicFill } from "react-icons/bs";
import { BsFillMicMuteFill } from "react-icons/bs";
import { CgMenu } from "react-icons/cg";
import { BsFillCameraFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";

import Webcam from "react-webcam";
import FaceGallery from "./components/face_gallery";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

// import facemesh from "@tensorflow-models/face-landmarks-detection";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import * as facemesh from "@tensorflow-models/facemesh";
import { drawMesh } from "../util/ultilities";

const Home: NextPage = () => {
  // eslint-disable-next-line prefer-const
  let selectedmodel = 2;
  const [isOpen, setIsOpen] = React.useState(true);
  const [isMute, setIsMute] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(true);
  const [modelState, setModel] = React.useState<any>(null);
  const [people, setPeople] = React.useState<any>(0);
  const [isRunning, setIsRunning] = React.useState(false);

  const [webcam, setWebcam] = React.useState<any>();
  const [canvas, setCanvas] = React.useState<any>();
  const webcamRef = React.useRef<any>(null);
  const canvasRef = React.useRef<any>(null);

  tfjsWasm.setWasmPaths(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
  );
  React.useEffect(() => {
    initialLoading();
  }, []);

  const initialLoading = async () => {
    console.log("Initial Loading");
    await tf.setBackend("wasm");
    tf.ready().then(() => {
      console.log(tf.getBackend());
      loadModel();
    });
  };

  React.useEffect(() => {
    console.log("Webcam Ready");
    if (webcam != null) {
    }
  }, [webcam]);

  React.useEffect(() => {
    console.log("Canvas Ready");
    if (isOpen && modelState != null) {
      console.log("Started");
      loadModel();
    }
  }, [canvas]);
  React.useEffect(() => {
    predictionFunction(modelState);
    console.log("Prediction Function called by webcam Ready");
  }, [webcamRef?.current?.video?.readyState, isRunning]);

  async function loadModel() {
    try {
      if (modelState != null) {
        console.log("animationframe requested");
      }
      let model = null;
      if (selectedmodel === 1) {
        model = await blazeface.load();
      } else {
        model = await facemesh.load();
      }
      setModel(model);
      console.log("set loaded Model");
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      if (!isRunning) {
        console.log("animationframe requested");
        setIsRunning(true);
      } else {
        console.log("Already running 😀");
      }
    } catch (err) {
      console.log(err);
      console.log("failed load model");
    }
  }

  async function predictionFunction(model: any) {
    // console.log("called");
    if (!isOpen) return;
    if (typeof webcamRef.current == "undefined") {
      console.log("undefined");
      return;
    }
    if (webcamRef.current == null) {
      console.log("null");
      return;
    }
    if (webcamRef.current.video.readyState !== 4) {
      console.log("not ready");

      if (!isRunning) {
        setTimeout(() => {
          setIsRunning(true);
        }, 2500);
      }
      return;
    }

    const cnvs = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = cnvs.getContext("2d");
    const returnTensors = false;

    const predictions = await model.estimateFaces(
      document.getElementById("webcam")
      // returnTensors
    );

    setPeople(predictions.length);
    ctx?.clearRect(
      0,
      0,
      webcamRef.current.video.videoWidth,
      webcamRef.current.video.videoHeight
    );
    // console.log(predictions);
    if (selectedmodel === 1) {
      if (predictions.length > 0) {
        predictions.forEach((prediction: any) => {
          if (returnTensors) {
            prediction.topLeft = prediction.topLeft.arraySync();
            prediction.bottomRight = prediction.bottomRight.arraySync();
          }

          const start = prediction.topLeft;
          const end = prediction.bottomRight;
          const size = [end[0] - start[0], end[1] - start[1]];
          ctx!.fillStyle = "rgba(255, 0, 0, 0.5)";
          ctx!.fillRect(start[0], start[1] - 40, size[0], size[1] + 100);
          ctx!.font = "40px Comic Sans MS";
          ctx!.fillStyle = "red";
          ctx!.textAlign = "center";
          ctx!.fillText("Jão", start[0] + 25, start[1] - 80);
          console.log("drawing");
          // prediction.landmarks.forEach((landmark: any) => {
          //   ctx!.fillStyle = "rgba(0, 255, 0, 0.5)";
          //   ctx!.fillRect(landmark[0], landmark[1], 5, 5);
          // });
        });
        // console.log("called");
      }
    } else {
      if (predictions.length > 0) {
        // console.log(predictions);
        drawMesh(predictions, ctx!);
      }
    }

    requestAnimationFrame(() => predictionFunction(model));
  }
  return (
    <HomeCointainer>
      <Head>
        <title>LookFace - Home</title>
        <meta
          name="description"
          content="LookFace is an face recognition website"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutGroup>
        <motion.main
          layout
          className="overflow-hidden flex xl:justify-between flex-col xl:flex-row items-center w-full min-h-[100vh]"
        >
          <div
            className={`absolute top-10 hidden xl:block right-9 z-20 text-white`}
          >
            {isMenuOpen ? (
              <CgClose
                onClick={() => setIsMenuOpen(false)}
                className={`text-4xl cursor-pointer ${
                  isMenuOpen ? "text-black" : "text-white"
                } `}
              />
            ) : (
              <CgMenu
                onClick={() => setIsMenuOpen(true)}
                className={`text-4xl cursor-pointer ${
                  isMenuOpen ? "text-black" : "text-white"
                } `}
              />
            )}
          </div>
          <AnimatePresence>
            <motion.section
              id="camera_section"
              className="w-full min-h-[600px] xl:min-h-[100vh] relative flex bg-[#181820] flex-col items-center justify-center"
            >
              <div className="z-20 absolute top-7 left-7 flex items-center">
                <FaFingerprint className="text-white text-2xl mr-3 drop-shadow-lg'" />
                <h2 className="text-white text-2xl font-semibold drop-shadow-lg ">
                  LookFace
                </h2>
              </div>
              <div className="z-20 absolute bottom-5 right-7 flex items-center bg-[#343446] px-4 py-2 rounded-lg">
                {isOpen ? (
                  people ? (
                    <h2 className="text-white text-lg font-medim drop-shadow-lg ">
                      {people} people in the room
                    </h2>
                  ) : (
                    <h2 className="text-white text-lg font-medim drop-shadow-lg ">
                      There is no people in the room
                    </h2>
                  )
                ) : (
                  <h2 className="text-white text-lg font-medim drop-shadow-lg ">
                    There is no people in the room
                  </h2>
                )}
              </div>
              <div className="z-20 absolute bottom-5 flex gap-x-4">
                <div className="z-[10] gap-x-4 px-6 flex justify-center items-center min-w-[150px] w-auto h-[80px] bg-[#343446] rounded-[30px]">
                  <button
                    className="w-14 h-14 rounded-full flex justify-center items-center shadow-md bg-[#181820]/70"
                    onClick={() => {
                      setIsOpen(!isOpen);
                    }}
                  >
                    {isOpen ? (
                      <BsCameraVideoFill className="text-2xl text-white" />
                    ) : (
                      <BsCameraVideoOffFill className="text-2xl text-white" />
                    )}
                  </button>
                  <button
                    disabled={!isOpen}
                    className="hidden xl:flex w-32 h-14 justify-center items-center bg-[#181820] rounded-full shadow-md"
                  >
                    <h3
                      className={`${
                        isOpen ? "text-white" : "text-white/50"
                      } font-medium`}
                    >
                      Screenshot
                    </h3>
                  </button>
                  <button
                    disabled={!isOpen}
                    className="flex xl:hidden w-14 h-14 justify-center items-center bg-[#181820]/70 rounded-full shadow-md"
                  >
                    <BsFillCameraFill
                      className={`${
                        isOpen ? "text-white" : "text-white/70"
                      } font-medium text-2xl`}
                    ></BsFillCameraFill>
                  </button>
                  <button
                    // disabled={!isOpen}
                    onClick={() => setIsMute(!isMute)}
                    className="w-14 h-14 flex justify-center items-center bg-[#181820]/70 rounded-full shadow-md"
                  >
                    {isMute ? (
                      <BsFillMicFill
                        className={`text-2xl ${
                          isOpen ? "text-white" : "text-white"
                        }`}
                      />
                    ) : (
                      <BsFillMicMuteFill
                        className={`text-2xl ${
                          isOpen ? "text-white" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                </div>
              </div>

              {isOpen ? (
                <motion.div className="w-full min-h-[600px] xl:h-[100vh] relative flex justify-center items-center">
                  <canvas
                    ref={(el) => {
                      canvasRef.current = el;
                      setCanvas(el);
                    }}
                    id="canvas"
                    className="z-[5] absolute min-h-[100px] w-full h-auto"
                  />
                  <Webcam
                    ref={(el) => {
                      webcamRef.current = el;
                      setWebcam(el);
                    }}
                    className=" absolute min-h-[100px] w-full h-auto"
                    id="webcam"
                    audio={false}
                  />
                </motion.div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <h4 className="text-white/[.9] font text-lg">
                    Waiting for camera signal
                  </h4>
                  <FiLoader className="text-white/90 text-3xl mt-3 animate-spin" />
                </div>
              )}
            </motion.section>

            {isMenuOpen && (
              <motion.section
                key="menu"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: 30,
                  // width: 0,
                  transition: {
                    duration: 0.1,
                    ease: [0.83, 0, 0.17, 1],
                  },
                }}
                id="menu_section"
                className={`z-[10] relative w-[100vw] px-[3vw] xl:px-9 h-auto min-h-[300px] xl:m-0 xl:max-w-[390px] xl:w-[46vw] xl:min-h-[100vh] rounded-t-2xl xl:rounded-t-none xl:rounded-l-2xl flex bg-[#E9E5DD] flex-col `}
              >
                <nav className="flex items-start justify-between mt-10">
                  <h1 className="text-2xl xl:text-3xl font-extrabold text-black/90 cursor-pointer max-w-[200px]  transition-all duration-500">
                    LookFace is a A.I facial recognition website.
                  </h1>
                </nav>
                <FaceGallery name="Face Gallery" />
                <div className="absolute bottom-5 right-7">
                  <a
                    href="https://github.com/JoaoGabriel-Lima"
                    target="_blank"
                    rel="noreferrer"
                    className="flex text-sm items-center font-medium text-black/50 hover:text-black transition-all duration-500 cursor-pointer"
                  >
                    Made with all of my <FaHeart className="mx-[4px] text-sm" />{" "}
                    by Jão
                  </a>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </motion.main>
      </LayoutGroup>
    </HomeCointainer>
  );
};

export default Home;
