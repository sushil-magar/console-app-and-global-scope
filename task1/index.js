'use strict';
const readlineSync = require('readline-sync');
const fetch = require('node-fetch');
const _ = require('lodash');
const responseCodes = {
  success: 200,
  notFound: 404,
};

class Blogs {
  static handleError(error) {
  	console.log(`Something went wrong: `, error);
    return new Error('Something went wrong...');
  }

  static async callFetch(url) {
  	const response = await fetch(url)
    	.then((res) => {
      	if (!res.ok || res.status === responseCodes.notFound) {
          this.handleError(res);
        }
        
        return res.json();
      })
      
      return response;
  }

  static fetchUsers() {
  	const url = `https://jsonplaceholder.typicode.com/users`;
    const users = this.callFetch(url);
    return users;
  }

  static async getUserPosts(user) {
  	const url = `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`;
  	const userInformation = await this.callFetch(url);
    return userInformation;
  }

  static async getUserAlbums(userId) {
	  const url = `https://jsonplaceholder.typicode.com/albums`;
  	const albums = await this.callFetch(url);
    return albums.filter((album) => album.userId === userId);
  }
  
  static async getUserTodos(userId) {
	  const url = `https://jsonplaceholder.typicode.com/todos`;
  	const todoItems = await this.callFetch(url);
    return todoItems.filter((item) => item.userId === userId);
  }
  
  static async getPostCommentsByPostId(postId) {
	  const url = `https://jsonplaceholder.typicode.com/comments?postId=${postId}`;
  	const postComments = await this.callFetch(url);
    return postComments;
  }

  static async begin() {
    try {
      const username = readlineSync.question('May I have username?: ');

      const users = await this.fetchUsers();
      const user = users.filter((user) => _.toLower(user.username) === _.toLower(username));
      const userPosts = await this.getUserPosts(user[0]);
      const userAlbums = await this.getUserAlbums(user[0].id);
      const userTodos = await this.getUserTodos(user[0].id);
      console.log(`${user[0].username} has ${userPosts.length} posts, ${userAlbums.length} albums, and ${userTodos.length} todos`);
      userPosts.forEach((post) => console.log(`Post ${post.id}: ${post.title}`));
      console.log(`\n`);

      const selectedPostId = readlineSync.question(`Enter the number of the post you are looking for: `);
      console.log(`\n`);
      
      const selectedPost = userPosts.filter((post) => post.id == selectedPostId);
      const postComments = await this.getPostCommentsByPostId(selectedPostId);

      console.log(`Viewing post ${selectedPost[0].title} which has ${postComments.length} comments.`, '\n');
      console.log('+++READ POST BELOW+++', '\n');
      console.log(selectedPost[0].body);
      console.log(`\n`);
    } catch (err) {
      console.log(err);
    }
  }
}

Blogs.begin();