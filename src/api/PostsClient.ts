import { ApiClient } from './ApiClient';
import { NewPost, Post } from './schemas/post.schema';

export class PostsClient extends ApiClient {
  createPost(post: NewPost) {
    return this.post<Post>('/posts', post);
  }

  getPost(id: number) {
    return this.get<Post>(`/posts/${id}`);
  }
}
