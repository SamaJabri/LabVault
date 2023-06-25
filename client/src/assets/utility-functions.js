// Remove duplicate examinations for home bubbles view
const INIT_UNIQUE_EXAMINATIONS = (examinations) =>
  Array.from(new Set(examinations.map((examination) => examination.name))).map(
    (name) => examinations.find((examination) => examination.name === name)
  );

// Get the data related to a certain examination
const getExaminationData = (examinations, examinationName) =>
  examinations.filter(
    ({ name }) => name.toUpperCase() === examinationName.toUpperCase()
  );

// Filter the important data for graph view (date & result)
const graphData = (examinations, examinationName) =>
  getExaminationData(examinations, examinationName).map(({ date, result }) => ({
    date,
    result,
  }));

// Create examination variables for graph use
let examinationVariables = (examinations) =>
  examinations.map(
    (examination) =>
      (window[examination.name] = graphData(examinations, examination.name))
  );

// Upload image to Cloudinary
const saveToCloudinary = async (file, folderName, extraTasks) => {
  //alert("Please Wait");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "xts9tly0");
  formData.append("folder", folderName);

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/df9xmfkp1/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  alert("Image uploaded successfully: " + data.url);
  extraTasks();

  return data.url;
};

// Takes an array and returns it without duplicates
const removeDuplicates = (arr) => Array.from(new Set(arr));

export {
  INIT_UNIQUE_EXAMINATIONS,
  getExaminationData,
  graphData,
  examinationVariables,
  saveToCloudinary,
  removeDuplicates,
};
