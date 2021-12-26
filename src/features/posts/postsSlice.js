import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const responce = await client.get('/fakeApi/posts')
  return responce.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialpost) => {
    const response = await client.post('/fakeApi/posts', initialpost)
    return response.data
  }
)
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated: (state, action) => {
      const { id, title, content } = action.payload
      //const existingpost = state.data.find((post) => post.id === id)
      const existingpost = state.entities[id]
      if (existingpost) {
        existingpost.title = title
        existingpost.content = content
      }
    },
    reactionAdded: (state, action) => {
      const { postId, reaction } = action.payload
      // const existingpost = state.data.find((post) => post.id === postId)
      const existingpost = state.entities[postId]
      if (existingpost) {
        existingpost.reactions[reaction]++
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // state.data = state.data.concat(action.payload)
        postsAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
    builder.addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})
/*
export const selectAllPosts = (state) => state.posts.data
export const selectPostById = (state, postId) =>
  state.posts.data.find((post) => post.id === postId)
*/
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts)
export const selectPostByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId)
)
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
