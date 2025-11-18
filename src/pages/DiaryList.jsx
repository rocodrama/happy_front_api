import { useState, useEffect } from 'react'; // useEffect 추가
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; 
import { createDiary, getDiaryList } from '../api'; // API 함수 불러오기

// --- 스타일 정의 (기존과 동일) ---

const Container = styled.div`
  background-color: #f0f8ff; 
  min-height: 100vh;
  padding-bottom: 50px;
`;

const ContentWrapper = styled.div`
  max-width: 800px; 
  margin: 0 auto;
  padding: 20px;
`;

const CreateSection = styled.div`
  background-color: white;
  border-radius: 20px;
  border: 2px solid #6aaefe;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: block;
    width: 5px;
    height: 20px;
    background-color: #6aaefe;
    margin-right: 10px;
    border-radius: 3px;
  }
`;

const MainTextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  resize: none;
  font-size: 16px;
  margin-bottom: 15px;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box; 

  &:focus {
    border-color: #6aaefe;
  }
`;

const CharacterInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 15px;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box; 
  background-color: #f9fcff;

  &:focus {
    border-color: #6aaefe;
    background-color: white;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const SmallInput = styled.input`
  flex: 1; 
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box; 

  &:focus {
    border-color: #6aaefe;
  }
`;

const CreateButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #6aaefe;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #5a9be0;
  }
  
  /* 로딩 중일 때 스타일 */
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DiaryCard = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px rgba(106, 174, 254, 0.15); 
    border-color: #6aaefe;
  }
`;

const CardDate = styled.div`
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextPreview = styled.div`
  font-size: 15px;
  color: #555;
  line-height: 1.4;
  
  strong {
    color: #6aaefe; /* 라벨 색상 */
    font-size: 13px;
    margin-right: 5px;
  }
`;

const ArrowIcon = styled.div`
  text-align: right;
  color: #6aaefe;
  font-weight: bold;
  margin-top: 10px;
  font-size: 14px;
`;

// --- 컴포넌트 로직 ---

function DiaryList() {
  const navigate = useNavigate();

  // 1. 입력 폼 데이터 State
  const [formData, setFormData] = useState({
    content: '',    
    character: '',  
    genre: '',      
    style: '',      
    cuts: ''        
  });

  // 2. 일기 목록 데이터 State (초기값은 빈 배열)
  const [diaries, setDiaries] = useState([]);
  
  // 3. 로딩 상태 (생성 중일 때 버튼 비활성화용)
  const [isLoading, setIsLoading] = useState(false);

  // 4. 페이지 로드 시 일기 목록 불러오기 (useEffect)
  useEffect(() => {
    const fetchDiaries = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) return; // 로그인 안 했으면 패스

      try {
        // API 호출
        const data = await getDiaryList(userId);
        setDiaries(data); // 받아온 데이터로 리스트 업데이트
      } catch (error) {
        console.error("일기 목록 불러오기 실패:", error);
        // 에러 시 그냥 빈 배열 유지 or 더미 데이터 사용
      }
    };

    fetchDiaries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 5. 생성 버튼 클릭 시 (백엔드 전송)
  const handleCreate = async () => {
    const userId = localStorage.getItem('user_id');
    
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate('/');
      return;
    }

    if (!formData.content) {
      alert("일기 내용을 입력해주세요!");
      return;
    }

    setIsLoading(true); // 로딩 시작 (버튼 비활성화)

    try {
      // 백엔드 API 명세에 맞춰 데이터 변환
      const payload = {
        user_id: userId,
        original_content: formData.content,
        genre: formData.genre || "일상", // 입력 안하면 기본값
        style: formData.style || "웹툰",
        character_note: formData.character,
        cuts_count: parseInt(formData.cuts) || 4 // 숫자로 변환
      };

      console.log("전송 데이터:", payload);

      // API 호출
      const response = await createDiary(payload);
      
      alert("일기 생성이 완료되었습니다!");
      // 생성된 일기 상세 페이지로 이동 (response.diary_id 활용)
      navigate(`/diaries/${response.diary_id}`);

    } catch (error) {
      console.error("일기 생성 실패:", error);
      alert("일기 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  const handleCardClick = (id) => {
    navigate(`/diaries/${id}`);
  };

  return (
    <Container>
      <Header /> 
      
      <ContentWrapper>
        <CreateSection>
          <SectionTitle>오늘의 일기 쓰기</SectionTitle>
          
          <MainTextArea 
            name="content"
            placeholder="오늘 있었던 일을 자유롭게 적어주세요..."
            value={formData.content}
            onChange={handleChange}
          />

          <CharacterInput
             name="character"
             placeholder="주인공 캐릭터 설정 (예: 파란색 후드티를 입은 고양이, 안경 쓴 남학생)"
             value={formData.character}
             onChange={handleChange}
          />
          
          <InputRow>
            <SmallInput 
              name="genre"
              placeholder="장르 (예: 판타지)" 
              value={formData.genre}
              onChange={handleChange}
            />
            
            <SmallInput 
              name="style"
              placeholder="작화 (예: 지브리풍)" 
              value={formData.style}
              onChange={handleChange}
            />
            
            <SmallInput 
              name="cuts"
              type="number" 
              placeholder="컷 수 (예: 4)" 
              value={formData.cuts}
              onChange={handleChange}
            />
          </InputRow>

          <CreateButton onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "생성 중입니다..." : "🎨 만화 일기 생성하기"}
          </CreateButton>
        </CreateSection>


        <SectionTitle>지난 일기장</SectionTitle>
        <ListSection>
          {/* 데이터가 없을 때 안내 문구 */}
          {diaries.length === 0 && (
             <div style={{textAlign: 'center', color: '#888', padding: '20px'}}>
               작성된 일기가 없습니다. 첫 일기를 만들어보세요!
             </div>
          )}

          {/* API에서 받아온 데이터로 리스트 렌더링 */}
          {diaries.map((diary) => (
            <DiaryCard key={diary.diary_id} onClick={() => handleCardClick(diary.diary_id)}>
              <CardDate>{diary.date}</CardDate>
              <CardContent>
                <TextPreview>
                  <strong>[원문]</strong> 
                  {/* 내용이 길면 자르기 */}
                  {diary.original_content && diary.original_content.length > 30 
                    ? diary.original_content.substring(0, 30) + "..." 
                    : diary.original_content}
                </TextPreview>
                
                <TextPreview style={{ color: '#333', fontWeight: 'bold' }}>
                  <strong>[이야기]</strong> 
                  {diary.full_story && diary.full_story.length > 30 
                    ? diary.full_story.substring(0, 30) + "..." 
                    : diary.full_story}
                </TextPreview>
              </CardContent>
              <ArrowIcon>자세히 보기 →</ArrowIcon>
            </DiaryCard>
          ))}
        </ListSection>

      </ContentWrapper>
    </Container>
  );
}

export default DiaryList;