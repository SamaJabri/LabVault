import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

import useLaboratoryStore from "../laboratory/laboratory-store";
import usePatientsStore from "../patient/patients-store";

//import INIT_EXAMINATIONS from "./examinations";

const useExaminationStore = create(
  persist(
    (set, get) => ({
      examinations: [],

      filteredExaminations: [],
      favoriteExaminations: [],

      // For favorites page
      getFavorites: async () => {
        /* const res = await axios.get("http://localhost:3000/favorites");
        const data = res.data; */

        const data = get().examinations.filter((exam) => exam.is_favorite);

        set({
          favoriteExaminations: data,
        });

        // return data;
      },

      // Patient will have multiple data for same examination.
      // Here will filter to show only one bubble with his data.
      uniqueExaminations: async () => {
        const id = get().currentPatient().id;
        const res = await axios.get(
          `http://localhost:3000/home?patient_id=${id}`
        );
        const data = res.data;

        //set({ examinations: data });

        return data;
      },

      // Filter used in Home page (All, Normal, Abnormal)
      filterUniqueExaminations: async (filterType) => {
        const items = await get().uniqueExaminations();

        let filteredItems = items;

        if (filterType === "All") {
          filteredItems = items;
        } else if (filterType === "Normal") {
          filteredItems = items.filter(
            ({ result, starting_normal_range, ending_normal_range }) =>
              parseFloat(result) >= parseFloat(starting_normal_range) &&
              parseFloat(result) <= parseFloat(ending_normal_range)
          );
        } else if (filterType === "Abnormal") {
          filteredItems = items.filter(
            ({ result, starting_normal_range, ending_normal_range }) =>
              parseFloat(result) < parseFloat(starting_normal_range) ||
              parseFloat(result) > parseFloat(ending_normal_range)
          );
        } else {
          filteredItems = get().favoriteExaminations;
        }

        set({
          filteredExaminations: filteredItems,
        });
      },

      homePageSearch: async (searchQuery) => {
        const res = await get().uniqueExaminations();
        const data = res.filter((examination) =>
          searchQuery
            ? examination.name.toUpperCase().includes(searchQuery.toUpperCase())
            : examination
        );

        set({
          filteredExaminations: data,
        });
      },

      favoritesPageSearch: async (searchQuery) => {
        const data = get().favoriteExaminations.filter((examination) =>
          searchQuery
            ? examination.name.toUpperCase().includes(searchQuery.toUpperCase())
            : examination
        );

        set({
          favoriteExaminations: data,
        });
      },

      // Get data (examinations) related to single (logged in) patient
      // Used in Home, Favorites, and Examination pages
      currentPatient: () => usePatientsStore.getState().currentPatient,
      getSamples: () =>
        useLaboratoryStore.getState().getSamples(get().currentPatient()?.id),
      /*
      addExamination: (examination) =>
        set((state) => ({
          examinations: [examination, ...state.examinations],
        })),

      removeExamination: (examId) =>
        set((state) => ({
          examinations: state.examinations.filter(
            (examination) => examination.id !== examId
          ),
        })), */

      toggleIsFavoriteExamination: async (examId, isExamFavorite) => {
        await axios.put(`http://localhost:3000/examinations/${examId}`, {
          is_favorite: isExamFavorite,
        });

        /* set({
          examinations: get().examinations.map((examination) =>
            examination.id === examId
              ? {
                  ...examination,
                  isFavorite: !examination.isFavorite,
                }
              : examination
          ),
        }); */
      },
      // Get one examiantion
      getExamination: async (id) => {
        const res = await axios.get(`http://localhost:3000/examinations/${id}`);
        const data = res.data;

        return data[0];
      },

      // Get currentPatientExaminations (Home page)
      getCurrentPatientExaminations: async () => {
        const id = get().currentPatient().id;
        const res = await axios.get(
          `http://localhost:3000/examinations?patient_id=${id}`
        );
        const data = res.data;

        set({ examinations: data });

        return data;

        /*  get().currentPatient();

        const wantedIds = get()
          .getSamples()
          .map((sample) => sample.sample_id);

        return get().examinations.filter((examination) =>
          wantedIds.includes(examination.sample_id)
        ); */
      },

      // Get all examinations for a certain sample (TestDetails Page)
      getASampleExaminations: async (id) => {
        const res = await axios.get(`http://localhost:3000/tests/${id}`);
        const data = res.data;

        return data;
      },
      /*  get().examinations.filter(
          (examination) => examination.sample_in_lab_id === id
        ) */

      clearExaminations: () =>
        set({
          examinations: [],
          favoriteExaminations: [],
          filteredExaminations: [],
        }),
    }),
    {
      name: "examinations",
    }
  )
);

export default useExaminationStore;
