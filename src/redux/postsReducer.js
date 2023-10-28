import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { findPostById } from 'services/api';

// !==============================DAL (Data Accsess Layer)=================
// створюємо асинхрону санку, яка приймає в собі два обов'язкові агрументи:
// 1) Так званий префікс санки, тобто кожна THUNK має мати унікальний префікс
// 2) Асинхрона колбек функція 'async () => {}', дана функція приймає якісь дані (data) та thunkApi

export const requestPosts = createAsyncThunk(
  'posts/get',

  async (query, thunkApi) => {
    try {
      // робимо мережевий запит
      const searchedPosts = await findPostById(query);
      return searchedPosts; //Буде записано в action.payload
    } catch (error) {
      // після невдалого запиту ми повернемо thunkApi та викличемо спеціальний метод rejectWithVale і передамо об'єкт помилки
      return thunkApi.rejectWithValue(error.message);
      //   rejected - виникне тільки коли ми руками переведемо проміс
    }
  }
);

// !========================End/ DAL =================================

// створюємо початковий стан state
const INITIAL_STATE = {
  posts: null,
  isLoading: false,
  error: null,
};

// Slice -створюємо новий слайс
const postsSlice = createSlice({
  // встановлюємо ім'я слайсу
  name: 'posts',
  // встановлюємо початковий стан ред'юсера слайсу
  initialState: INITIAL_STATE,
  // створюємо об'єкт ред'юсерів
  // !===========================REDUX BLL===========================
  // thunk повертає спеціальні ред'юсери які отримують builder.addCase та назву thank
  extraReducers: builder =>
    builder
      // PENDING - стан очікування запиту
      .addCase(requestPosts.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      //   FULFILED - запит пройшов успішно, та повернув дані
      .addCase(requestPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        // в Reducer дані потрапляють тільки через один спосіб -- action.payload
        state.posts = [action.payload];
        // [action.payload] = запихаємо в масив бо в санку searchedPosts прийде тільки один пост, із-за api, замість об'єкту
      })
      // REJECTED - виникла помилка під час запису
      .addCase(requestPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      }),
  //   !=====================End/ REDUX BLL===========================
});

// ред'юсер слайсу
export const postsReducer = postsSlice.reducer;
