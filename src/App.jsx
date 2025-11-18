import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Signup from './pages/Signup';

import DiaryList from './pages/DiaryList';
import DiaryDetail from './pages/DiaryDetail';
import DiaryEdit from './pages/DirayEdit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인/회원가입 */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 나머지는 임시로 텍스트만 띄움 */}
        <Route path="/diaries" element={<DiaryList/>} />
        <Route path="/diaries/:id" element={<DiaryDetail/>} />
        <Route path="/diaries/:id/edit" element={<DiaryEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;