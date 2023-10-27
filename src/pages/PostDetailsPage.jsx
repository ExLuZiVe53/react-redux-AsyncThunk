import React, { Suspense, lazy, useEffect, useRef } from 'react';
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
// import PostCommentsPage from './PostCommentsPage';
import Loader from 'components/Loader';
import ErrorMessage from 'components/ErrorMessage';

import { findPostById } from 'services/api';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPost,
  requestPostDetails,
  setError,
  setIsLoading,
  setPostDetails,
} from 'redux/postDetailReducer';

const PostCommentsPage = lazy(() => import('pages/PostCommentsPage'));

const PostDetailsPage = () => {
  const { postId } = useParams();
  const location = useLocation();
  const backLinkHref = useRef(location.state?.from ?? '/');

  const postDetails = useSelector(state => state.postDetails.postDetailsData);
  const isLoading = useSelector(state => state.postDetails.isLoading);
  const error = useSelector(state => state.postDetails.error);
  const dispatch = useDispatch();
  // const [postDetails, setPostDetails] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  useEffect(() => {
    // коли у нас не прийде id поста, ми його просто відхиляємо, виходом з функції
    if (!postId) return;
    // thunk можна діспатчити, і дані які будуть у неї передані, прийдуть першим аргументои у async
    dispatch(requestPostDetails(postId));
  }, [postId, dispatch]);

  return (
    <div>
      <Link to={backLinkHref.current}>Go Back</Link>
      <button onClick={() => dispatch(addPost({ title: '123', body: '123' }))}>
        Click to add post to STATE
      </button>

      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {postDetails !== null && (
        <div>
          <h2>Post Title: {postDetails.title}</h2>
          <p>Post Body: {postDetails.body}</p>
        </div>
      )}

      <div>
        <NavLink to="comments" className="header-link">
          Comments
        </NavLink>
      </div>

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="comments" element={<PostCommentsPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default PostDetailsPage;
