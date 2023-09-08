import { createSlice } from "@reduxjs/toolkit";
import { type IVotingText } from "../../components/voting/voting";

export interface VotingState {
  initialData: IVotingText[] | null;
  filteredData: IVotingText[];
  initialDataLoading: boolean
}

const initialState: VotingState = {
  initialData: null,
  filteredData: [],
  initialDataLoading: false
};

const votingSlice = createSlice({
  name: "voting",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      state.initialData = action.payload;
    },
    setFilteredData: (state, action) => {
      state.filteredData = action.payload;
    },
    setInitialDataLoading: (state, action) => {
      state.initialDataLoading = action.payload;
    }
  },
});

export const { setInitialData, setFilteredData, setInitialDataLoading} = votingSlice.actions;

export default votingSlice.reducer;
