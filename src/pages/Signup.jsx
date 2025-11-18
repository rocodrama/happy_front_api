import { useState } from 'react'; // 상태 관리를 위해 추가
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../api'; // API 함수 불러오기

// --- CSS ---

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f8ff;
`;

const SignupBox = styled.div`
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

const SignupButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 10px;
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
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// --- 컴포넌트 로직 ---

function Signup() {
  const navigate = useNavigate();

  // 1. 입력값 저장을 위한 State 생성
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 2. 회원가입 버튼 클릭 시
  const handleSignup = async () => {
    // (1) 빈칸 검사
    if (!nickname || !email || !password || !confirmPassword) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    // (2) 비밀번호 일치 검사
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }

    try {
      // (3) 백엔드로 데이터 전송 ({ 이메일, 비번, 닉네임 })
      // 비밀번호 확인용(confirmPassword)은 백엔드에 안 보내도 됩니다.
      await signupUser({ email, password, nickname });
      
      // (4) 성공 시
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate('/'); // 로그인 화면으로 이동

    } catch (error) {
      // (5) 실패 시
      console.error("회원가입 에러:", error);
      alert("회원가입에 실패했습니다. 이미 존재하는 이메일일 수도 있습니다.");
    }
  };

  return (
    <Container>
      <SignupBox>
        <Title>회원 가입을 위해</Title>
        <SubTitle>정보를 입력해주세요</SubTitle>

        <InputWrapper>
          <Label>* 닉네임</Label>
          <StyledInput 
            type="text" 
            placeholder="사용하실 닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>* 이메일</Label>
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

        <InputWrapper>
          <Label>* 비밀번호 확인</Label>
          <StyledInput 
            type="password" 
            placeholder="비밀번호를 다시 한번 입력해주세요" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </InputWrapper>

        <SignupButton onClick={handleSignup}>가입하기</SignupButton>

        <FooterLinks>
          <Link to="/">이미 계정이 있으신가요? 로그인</Link>
        </FooterLinks>
      </SignupBox>
    </Container>
  );
}

export default Signup;