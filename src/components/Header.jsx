import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  // [수정 1] 로컬 스토리지에서 '진짜 닉네임' 가져오기
  // (만약 없으면 '게스트'라고 표시)
  const nickname = localStorage.getItem('nickname') || '게스트'; 

  const handleLogout = () => {
    // [수정 2] 로그아웃 시 저장해둔 토큰, 닉네임, 아이디 모두 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('nickname');
    localStorage.removeItem('user_id');
    
    alert("로그아웃 되었습니다.");
    navigate('/'); // 로그인 화면으로 이동
  };

  // --- 스타일 객체 (기존과 동일) ---
  const headerStyle = {
    borderBottom: '1px solid #ddd',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  };

  const linkStyle = {
    marginRight: '10px',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#2c3e50',
    fontSize: '18px'
  };

  const userStyle = {
    marginRight: '15px',
    fontWeight: 'bold',
    color: '#6aaefe' 
  };

  const btnStyle = {
    padding: '5px 10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: 'white',
    cursor: 'pointer'
  };

  return (
    <header style={headerStyle}>
      <nav>
        {/* 로고 */}
        <Link to="/diaries" style={linkStyle}>오늘 맑음</Link> 
      </nav>
      
      <div>
        {/* 가져온 실제 닉네임 표시 */}
        <span style={userStyle}>{nickname}님</span>
        <button onClick={handleLogout} style={btnStyle}>로그아웃</button>
      </div>
    </header>
  );
}

export default Header;