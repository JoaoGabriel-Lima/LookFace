export const loadModels = async () => {
  const MODEL_URL = "/models";
  await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
  await faceapi.loadFaceExpressionModel(MODEL_URL);
  return true;
};

export const getFaceDetection = async () => {
  const image = await faceapi.fetchImage(
    "https://cors.jg-limamarinho202.workers.dev/?https://superherobrasil.com.br/wp-content/uploads/2020/11/jason-momoa.jpg"
  );
  const fullFaceDescriptions = await faceapi
    .detectAllFaces(image)
    .withFaceLandmarks()
    .withFaceExpressions()
    .withFaceDescriptors();
  //   fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions);

  const labels = ["jao"];
  console.log(fullFaceDescriptions.length);
  const labeledFaceDescriptors = await Promise.all(
    labels.map(async (label) => {
      // fetch image data from urls and convert blob to HTMLImage element
      const imgUrl = `https://cors.jg-limamarinho202.workers.dev/?https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Jason_Momoa_by_Gage_Skidmore_2.jpg/800px-Jason_Momoa_by_Gage_Skidmore_2.jpg`;
      const img = await faceapi.fetchImage(imgUrl);

      // detect the face with the highest score in the image and compute it's landmarks and face descriptor
      const fullFaceDescription = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!fullFaceDescription) {
        throw new Error(`no faces detected for ${label}`);
      }

      const faceDescriptors = [fullFaceDescription.descriptor];
      return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
    })
  );
  const maxDescriptorDistance = 0.6;
  const faceMatcher = new faceapi.FaceMatcher(
    labeledFaceDescriptors,
    maxDescriptorDistance
  );
  const descriptors = fullFaceDescriptions.map((face) => face.descriptor);
  const matches = [];
  console.log(fullFaceDescriptions);
  console.log(faceMatcher);
  for (const descriptor of descriptors) {
    const match = await faceMatcher.findBestMatch(descriptor);
    matches.push(match);
  }
  return matches;
};
