import axios from 'axios';

// 백엔드 서버 주소 (나중에 백엔드 개발자가 알려주는 주소로 바꾸세요 예: http://3.14.15.92:8000)
const BASE_URL = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// 1. 회원가입
export const signupUser = async (userData) => {
  // userData 예시: { email: "a@a.com", password: "123", nickname: "kim" }
  const response = await api.post('/api/users/signup', userData);
  return response.data;
};

// 2. 로그인
export const loginUser = async (loginData) => {
  // loginData 예시: { email: "a@a.com", password: "123" }
  const response = await api.post('/api/auth/login', loginData);
  return response.data;
};

// 3. 일기 생성
export const createDiary = async (diaryData) => {
  // diaryData 예시: { user_id: 1, original_content: "...", genre: "..." }
  const response = await api.post('/api/diaries', diaryData);
  return response.data; 
  // 반환값 예시: { message: "완료", diary_id: 15 }
};

// 4. 일기 목록 조회
export const getDiaryList = async (userId) => {
  const response = await api.get(`/api/diaries?user_id=${userId}`);
  return response.data; 
  // 반환값: [{ diary_id: 15, original_content: "..." }, ... ]
};

// 5. 일기 상세 조회
export const getDiaryDetail = async (diaryId) => {
  const response = await api.get(`/api/diaries/${diaryId}`);
  return response.data;
};

// 6. 일기 수정
export const updateDiary = async (diaryId, updateData) => {
  const response = await api.put(`/api/diaries/${diaryId}`, updateData);
  return response.data;
};

// 7. 컷 이미지 재생성
export const regenerateCutImage = async (cutId, promptData) => {
  const response = await api.post(`/api/cuts/${cutId}/regenerate`, promptData);
  return response.data;
};