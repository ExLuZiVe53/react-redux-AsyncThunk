import React, { Suspense, lazy, useEffect, useRef } from 'react';
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';

import Loader from 'components/Loader';
import ErrorMessage from 'components/ErrorMessage';

import { useDispatch, useSelector } from 'react-redux';
import { requestPostDetails } from 'redux/postDetailReducer';
import { toast } from 'react-toastify';

const PostCommentsPage = lazy(() => import('pages/PostCommentsPage'));

const PostDetailsPage = () => {
  const { postId } = useParams();
  const location = useLocation();
  const backLinkHref = useRef(location.state?.from ?? '/');

  // пілписка на дані зі стору
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
    dispatch(requestPostDetails(postId))
      .unwrap()
      .then(() => {
        toast.success('Hi! Post details was success fetched', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      });
  }, [postId, dispatch]);

  return (
    <div>
      <Link to={backLinkHref.current}>Go Back</Link>

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
