import { useState } from 'react'; // 상태 관리를 위해 import
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; 

// --- 스타일 정의 ---

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
  margin-bottom: 15px; /* 아래칸과 간격 */
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box; 
  background-color: #f9fcff; /* 살짝 다른 배경색 */

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


const DUMMY_DIARIES = [
  {
    id: 1,
    date: '2025. 11. 18',
    original: '오늘 아침에 늦잠을 자서 지각할 뻔했다. 뛰어가다가 넘어질 뻔했지만 다행히 세이프!',
    llm: '용사는 늦잠이라는 저주에 걸렸다. 전력질주 스킬을 사용하여 위기를 모면했다.',
  },
  {
    id: 2,
    date: '2025. 11. 17',
    original: '비가 와서 하루종일 집에 있었다. 파전을 해먹었는데 너무 맛있었다.',
    llm: '하늘에서 슬픔의 비가 쏟아졌다. 나는 은신처에서 전설의 음식 파전을 연성했다.',
  },
  {
    id: 3,
    date: '2025. 11. 16',
    original: '친구랑 싸웠다. 하지만 저녁에 화해하고 같이 치킨을 먹었다.',
    llm: '동료와 의견 충돌로 결투가 벌어질 뻔했다. 하지만 치킨이라는 평화 조약으로 해결했다.',
  }
];

// --- 컴포넌트 로직 ---

function DiaryList() {
  const navigate = useNavigate();

  // 백엔드로 보낼 데이터 변수
  const [formData, setFormData] = useState({
    content: '',    // 일기 원문
    character: '',  // [NEW] 캐릭터 설정
    genre: '',      // 장르
    style: '',      // 작화 스타일
    cuts: ''        // 컷 수
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCreate = () => {
    console.log("백엔드로 보낼 데이터:", formData); 

    if (!formData.content) {
      alert("일기 내용을 입력해주세요!");
      return;
    }

    alert("데이터 저장 완료! 콘솔창을 확인하세요. 상세 페이지로 이동합니다.");
    // TODO: 백엔드 전송 로직
    navigate('/diaries/1'); 
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

          <CreateButton onClick={handleCreate}>
            🎨 만화 일기 생성하기
          </CreateButton>
        </CreateSection>


        <SectionTitle>지난 일기장</SectionTitle>
        <ListSection>
          {DUMMY_DIARIES.map((diary) => (
            <DiaryCard key={diary.id} onClick={() => handleCardClick(diary.id)}>
              <CardDate>{diary.date}</CardDate>
              <CardContent>
                <TextPreview>
                  <strong>[원문]</strong> 
                  {diary.original.length > 30 ? diary.original.substring(0, 30) + "..." : diary.original}
                </TextPreview>
                
                <TextPreview style={{ color: '#333', fontWeight: 'bold' }}>
                  <strong>[이야기]</strong> 
                  {diary.llm}
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