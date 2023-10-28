import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { findPostById } from 'services/api';

// !=======================DAL(Data Accsess Layer)============================
// створюємо асинхрону санку, яка приймає в собі два обов'язкові аргументи:
// 1) Так званий префікс санки, тобто кожна Thunk має мати унікальний префікс
// 2) Асинхрона колбек функція 'async () => {}', дана фунці приймає якісь дані (data) та thunkApi
export const requestPostDetails = createAsyncThunk(
  'postDetails/get',

  async (postId, thunkApi) => {
    try {
      // setIsLoading(true);
      // робимо мережевий запит
      const postData = await findPostById(postId);
      // setPostDetails(postData);
      return postData; // БУЛЕ ЗАПИСАНО В action.payload
    } catch (error) {
      // setError(error.message);
      // після неуспішного запиту ми повернемо thunkApi та викличемо спецільний метод rejectWithValue і передамо об'єкт помилки
      return thunkApi.rejectWithValue(error.message);
      // rejected - виникне тільки коли ми руками переведемо проміс
    }
  }
);

// !==========================End/ DAL========================

// створюємо початковий стан state
const INITIAL_STATE = {
  postDetailsData: null,
  isLoading: false,
  error: null,
};

const postDetailsSlice = createSlice({
  // Ім'я слайсу
  name: 'postDetails',
  // Початковий стан редюсера слайсу
  initialState: INITIAL_STATE,
  // Об'єкт редюсерів
  // !========================REDUX BLL======================
  // thunk повертає спеціальні ред'юсери які отримують builder.addCase(назва thunk)
  extraReducers: builder =>
    builder
      // PENDING - стан очікування запиту
      .addCase(requestPostDetails.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      // FULFILED - запит пройшов успішно, та повернув дані
      .addCase(requestPostDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        // в Reducer дані потрапляють тільки через один спосіб action.payload
        state.postDetailsData = action.payload;
      })
      // REJECTED - виникла помилка під час запиту
      .addCase(requestPostDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      }),
  // !======================End/ REDUX BLL====================
});

// Редюсер слайсу
export const postDetailsReducer = postDetailsSlice.reducer;
