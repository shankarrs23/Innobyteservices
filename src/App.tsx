import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import MyPosts from './pages/MyPosts';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NewsProvider } from './context/NewsContext';
import { BlogProvider } from './context/BlogContext';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NewsProvider>
          <BlogProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/create-post" element={<CreatePost />} />
                  <Route path="/edit-post/:id" element={<EditPost />} />
                  <Route path="/my-posts" element={<MyPosts />} />
                </Routes>
              </Layout>
            </Router>
          </BlogProvider>
        </NewsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;