import { useState } from 'react'; // 입력값 저장을 위해 추가
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api'; // API 함수 불러오기

// --- CSS (기존과 동일) ---

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f8ff;
`;

const LoginBox = styled.div`
  background-color: white;
  width: 400px;
  padding: 50px 40px;
  border-radius: 20px; 
  border: 2px solid #6aaefe; 
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.05); 
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const SubTitle = styled.h3`
  color: #6aaefe;
  font-size: 16px;
  margin-bottom: 40px;
  font-weight: 500;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #ddd; 
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-bottom: 2px solid #6aaefe; 
  }
  &::placeholder {
    color: #ccc;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  background-color: white;
  color: #6aaefe;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid #6aaefe;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #6aaefe;
    color: white;
  }
`;

const FooterLinks = styled.div`
  margin-top: 20px;
  font-size: 13px;
  
  a {
    color: #888;
    text-decoration: none;
    margin: 0 10px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// --- 컴포넌트 로직 ---

function Login() {
  const navigate = useNavigate();
  
  // 1. 사용자의 입력을 저장할 변수들 (State)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. 로그인 버튼 클릭 시 실행되는 함수
  const handleLogin = async () => {
    // 입력값 확인
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // 백엔드 API 호출 (api.js의 loginUser 함수 사용)
      const data = await loginUser({ email, password });

      // 성공 시 실행되는 부분
      console.log("로그인 성공:", data);
      
      // 중요: 토큰과 닉네임을 브라우저 저장소(localStorage)에 저장
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('nickname', data.nickname); 
      localStorage.setItem('user_id', data.user_id);

      alert(`환영합니다, ${data.nickname}님!`);
      navigate('/diaries'); // 메인 화면으로 이동

    } catch (error) {
      // 실패 시 실행되는 부분
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 이메일이나 비밀번호를 확인해주세요.");
    }

  };

  return (
    <Container>
      <LoginBox>
        <Title>오늘 맑음</Title>
        <SubTitle>-일기 만화 생성기-</SubTitle>

        <InputWrapper>
          <Label>* 이메일</Label>
          {/* state 변수와 onChange 연결 */}
          <StyledInput 
            type="email" 
            placeholder="이메일을 입력해주세요" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>* 비밀번호</Label>
          <StyledInput 
            type="password" 
            placeholder="비밀번호를 입력해주세요" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputWrapper>

        <LoginButton onClick={handleLogin}>로그인 하기</LoginButton>

        <FooterLinks>
          <Link to="/signup">회원가입</Link>
        </FooterLinks>
      </LoginBox>
    </Container>
  );
}

export default Login;