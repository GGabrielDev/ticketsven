import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { axiosConfig } from "../../../helpers/Axios";
import { RootState } from "../../store";

export const asyncActions = {
  getTicketsDispatcher: createAsyncThunk<
    MiniTicket[],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("ticket/getDispatcher", async (_, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/ticket/open", axiosConfig(getState().user.token))
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getTicket: createAsyncThunk<
    TicketType & Partial<DispatchTicket>,
    string,
    { state: RootState; rejectValue: ErrorType }
  >("ticket/get", async (id, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get(`/ticket/${id}`, axiosConfig(getState().user.token))
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getTicketDatePairs: createAsyncThunk<
    number[][],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("ticket/getDatePairs", async (_, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/supervisor/dates", axiosConfig(getState().user.token))
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  postTicketOperator: createAsyncThunk<
    string,
    Partial<TicketType>,
    { state: RootState; rejectValue: ErrorType }
  >("ticket/postOperator", async (payload, { rejectWithValue, getState }) => {
    try {
      return await axios.post(
        "/ticket",
        payload,
        axiosConfig(getState().user.token)
      );
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  postTicketCloseOperator: createAsyncThunk<
    string,
    Partial<TicketType> & { closing_state: "Sabotaje" | "Abandonada" },
    { state: RootState; rejectValue: ErrorType }
  >(
    "ticket/postCloseOperator",
    async (payload, { rejectWithValue, getState }) => {
      try {
        return await axios.post(
          "/ticket/close",
          payload,
          axiosConfig(getState().user.token)
        );
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  ),
  putTicketUpdateDispatcher: createAsyncThunk<
    string,
    { id: string } & Partial<DispatchTicket>,
    { state: RootState; rejectValue: ErrorType }
  >("ticket/putUpdate", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.put(
          `/ticket/edit/${payload.id}`,
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  putTicketCloseDispatcher: createAsyncThunk<
    { id: string },
    { id: string } & DispatchTicket,
    { state: RootState; rejectValue: ErrorType }
  >("ticket/putClose", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.put(
          `/ticket/close/${payload.id}`,
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
};
