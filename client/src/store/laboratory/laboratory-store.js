import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

//import INIT_SAMPLES from "./samples";
//import INIT_DOCTORS from "./doctors";
//import INIT_SAMPLE_IN_LAB from "./sample-in-lab";
//import INIT_LABORATORIES from "./laboratories";

import usePatientsStore from "../patient/patients-store";

const useLaboratoryStore = create(
  persist(
    (set, get) => ({
      //doctors: INIT_DOCTORS,
      //samples: INIT_SAMPLES,
      //samples_in_lab: INIT_SAMPLE_IN_LAB,
      //laboratories: INIT_LABORATORIES,

      patientsLabs: [],
      uploadTestReqData: {},
      uploadExtraInfoPopUp: false,

      currentPatient: () => usePatientsStore.getState().currentPatient,

      togglePopUp: () =>
        set({ uploadExtraInfoPopUp: !get().uploadExtraInfoPopUp }),

      // Get samples for currentPatient
      getSamples: async () => {
        const id = get().currentPatient().id;
        return await axios.get(
          `http://localhost:3000/samples?patient_id=${id}`
        );
      },

      // get().samples.filter((sample) => sample.patient_id === id),

      // Get the sample_in_lab data (expert_approval_time & sample_in_lab_id)
      /*  getSampleInLab: async (id) => {
        const res = await axios.get("http://localhost:3000/tests?patient_id=1");
        const data = res.data;

        return data;
        const wantedIds = await get()
          .getSamples(id)
          .map((lab) => lab.sample_id);

        return get().samples_in_lab.filter((sample) =>
          wantedIds.includes(sample.sample_id)
        );
      },

      // Get Lab names for the samples_in_lab
      getLabNameFromSample: (id) => {
        const wantedIds = new Set(
          get()
            .getSampleInLab(id)
            .map((lab) => lab.lab_id)
        );

        const labs = get().laboratories.filter((lab) =>
          wantedIds.has(lab.lab_id)
        );

        return get()
          .getSampleInLab(id)
          .map((finalLab) => ({
            ...finalLab,
            ...labs.filter(
              (lab) => lab.lab_id === finalLab.lab_id && lab.lab_name
            )[0],
          }));
      },

      // Get the doctor name
      getDoctorIdFromSample: (id) =>
        get()
          .getLabNameFromSample(id)
          .map((lab) => ({
            ...lab,
            ...get()
              .getSamples(id)
              .filter((sample) => sample.sample_id === lab.sample_id)[0],
          })),

      getPatientsLab: () =>
        get()
          .getDoctorIdFromSample(get().currentPatient().id)
          .map((sample) => ({
            ...sample,
            ...get().doctors.filter(
              (doctor) => doctor.doctor_id === sample.doctor_id
            )[0],
          })), */

      // Return the new array of objects with only the needed data to show in Tests Page
      getFinalData: async () => {
        const id = get().currentPatient().id;
        const res = await axios.get(
          `http://localhost:3000/tests?patient_id=${id}`
        );
        const data = res.data;

        set({
          patientsLabs: data,
        });

        return data;
      },

      // Get lab name from sample_in_lab_id for the header in TestDetails Page
      getLabName: async (id) => {
        const labs = await get().getFinalData();
        const labName = labs.filter((lab) => lab.id === id)[0].lab_name;

        return labName;
      },

      // Search used in tests page
      TestsPageSearch: async (searchQuery) => {
        const res = await get().getFinalData();
        const data = res.filter((lab) =>
          searchQuery
            ? lab.lab_name.toUpperCase().includes(searchQuery.toUpperCase())
            : lab
        );

        set({
          patientsLabs: data,
        });
      },

      handleLabUpload: async (uploadData) => {
        // Add the patient id info and make it in JSON form to send
        uploadData = { ...uploadData, patient_id: get().currentPatient().id };
        // uploadData = JSON.stringify(uploadData);

        /*  set({
          uploadTestReqData: uploadData,
        }); */

        await axios.post("http://localhost:3000/upload", {
          ...uploadData,
        });

        //return res;

        //console.log(res);
      },

      // Filtering the data in Tests page using month & year
      handleFilter: async (year, month, doctorName, labName) => {
        const res = await get().getFinalData();
        let filteredData = res;

        if (year || month) {
          filteredData = filteredData.filter(
            ({ expert_approval_time }) =>
              expert_approval_time.split("-")[0].includes(year) &&
              expert_approval_time.split("-")[1].includes(month)
          );
        }
        if (doctorName) {
          filteredData = filteredData.filter(
            ({ doctor_name }) =>
              doctor_name.toUpperCase() === doctorName.toUpperCase()
          );
        }
        if (labName) {
          filteredData = filteredData.filter(
            ({ lab_name }) => lab_name.toUpperCase() === labName.toUpperCase()
          );
        }

        set(() => ({
          patientsLabs: filteredData,
        }));
      },

      clearLaboratories: () => set({ patientsLabs: [] }),
    }),
    { name: "laboratories" }
  )
);

export default useLaboratoryStore;
