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

      const postData = await findPostById(postId);
      // setPostDetails(postData);
      return postData; // БУЛЕ ЗАПИСАНО В action.payload
    } catch (error) {
      // setError(error.message);
      // після неуспішного запиту ми повернемо thunkApi та викличемо спецільний метод rejectWithValue і передамо об'єкт помилки
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// !==========================End/ DAL========================

// створюємо початковий стан state
const INITIAL_STATE = {
  postDetailsData: null,
  isLoading: false,
  error: null,
  posts: [],
};

const postDetailsSlice = createSlice({
  // Ім'я слайсу
  name: 'postDetails',
  // Початковий стан редюсера слайсу
  initialState: INITIAL_STATE,
  // Об'єкт редюсерів
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setPostDetails(state, action) {
      state.postDetailsData = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addPost(state, action) {
      // state.posts.push(action.payload);
      state.posts = [...state.posts, action.payload];
    },
    deletePost(state, action) {
      state.posts = state.posts.filter(post => post.id !== action.payload);
      // const deletedPostIndex = state.posts.findIndex(post => post.id === action.payload);
      // state.posts.splice(deletedPostIndex, 1);
    },
  },
  // thunk повертає спеціальні ред'юсери які отримують builder.addCase(назва thunk)
  extraReducers: builder =>
    builder
      .addCase(requestPostDetails.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPostDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        // в Reducer дані потрапляють тільки через один спосіб action.payload
        state.postDetailsData = action.payload;
      }),
});

// Генератори екшенів
export const { setIsLoading, setPostDetails, setError, addPost, deletePost } =
  postDetailsSlice.actions;
// Редюсер слайсу
export const postDetailsReducer = postDetailsSlice.reducer;
