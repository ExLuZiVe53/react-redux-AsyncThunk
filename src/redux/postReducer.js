import { createAsyncThunk } from '@reduxjs/toolkit';
import { findPostById } from 'services/api';

// !==============================DAL (Data Accsess Layer)=================
// створюємо асинхрону санку, яка приймає в собі два обов'язкові агрументи:
// 1) Так званий префікс санки, тобто кожна THUNK має мати унікальний префікс
// 2) Асинхрона колбек функція 'async () => {}', дана функція приймає якісь дані (data) та thunkApi

export const requestPostDetails = createAsyncThunk(
  'postDetails/get',

  async (postId, thunkApi) => {
    try {
      // робимо мережевий запит
      const postData = await findPostById(postId);
      return postData; //Буде записано в action.payload
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
  postDetailsData: null,
  isLoading: false,
  error: null,
  posts: [],
};
