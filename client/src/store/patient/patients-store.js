import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useExaminationStore from "../examination/examination-store";
import useLaboratoryStore from "../laboratory/laboratory-store";

//import INIT_PATIENTS from "./patients";

const usePatientsStore = create(
  persist(
    (set, get) => ({
      //patients: INIT_PATIENTS,
      currentPatient: null,
      isLoggedIn: false,

      darkMode: false,
      isLoading: false,

      clearExaminations: () =>
        useExaminationStore.getState().clearExaminations(),
      clearLaboratories: () =>
        useLaboratoryStore.getState().clearLaboratories(),

      // Login
      loginPatient: async (username, password) => {
        try {
          const res = await axios.post(" http://localhost:3000/login", {
            username,
            password,
          });
          const data = res.data;

          set({
            currentPatient: data,
            isLoggedIn: true,
          });

          return res;
        } catch (error) {
          return error;
        }
      },

      // Sign Up & then login
      createAndLoginPatient: async (newPatient) => {
        try {
          const res = await axios.post("http://localhost:3000/sign-up", {
            ...newPatient,
          });

          console.log(res);
          res.status === 201 &&
            set({
              //patients: [...state.patients, newPatient],
              currentPatient: res.data,
              isLoggedIn: true,
            });

          return res;
        } catch (error) {
          return error;
        }
      },

      // Update user info (newInfo is an object of the updated fields)
      UpdatePatientInfo: async (newInfo) => {
        const res = await axios.put("http://localhost:3000/patient", {
          id: get().currentPatient.id,
          tc: get().currentPatient.tc,
          ...newInfo,
        });

        const data = res.data;

        set({
          currentPatient: data,
        });
      },

      // Update the user avatar
      updatePatientAvatar: async (imgSrc) => {
        const res = await axios.put("http://localhost:3000/patient-avatar", {
          id: get().currentPatient.id,
          img_src: imgSrc,
        });

        const data = res.data;

        console.log(data);

        set({
          currentPatient: data,
        });
      },

      // Log out
      logOutPatient: () => {
        get().clearExaminations();
        get().clearLaboratories();
        get().isLoading && get().toggleIsLoading();

        set({
          currentPatient: null,
          isLoggedIn: false,
        });
      },

      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      toggleIsLoading: () => set({ isLoading: !get().isLoading }),
    }),
    {
      name: "patients",
    }
  )
);

export default usePatientsStore;
