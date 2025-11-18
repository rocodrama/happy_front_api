import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';

// --- 스타일 정의 (Detail과 거의 동일하되, Input 스타일 추가) ---

const Container = styled.div`
  background-color: #f0f8ff;
  min-height: 100vh;
  padding-bottom: 80px;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const SectionBox = styled.div`
  background-color: white;
  border-radius: 20px;
  border: 1px solid #6aaefe; /* 수정 모드임을 알리는 파란 테두리 */
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 22px;
  font-weight: bold;
  margin: 0;
`;

const TopBtnGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SmallButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #ddd;
  background-color: white;
  color: #555;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &.save {
    border-color: #6aaefe;
    background-color: #6aaefe;
    color: white;
    &:hover {
      background-color: #5a9be0;
    }
  }
`;

/* 수정 가능한 입력 필드 스타일 */
const Label = styled.label`
  font-size: 13px;
  color: #6aaefe;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 10px;
  box-sizing: border-box;
  &:focus { border-color: #6aaefe; outline: none; }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
  &:focus { border-color: #6aaefe; outline: none; }
`;

const InfoGrid = styled.div`
  display: flex;           
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
`;

const TagRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3등분 */
  gap: 10px;
  margin-bottom: 20px;
`;

/* 컷 리스트 스타일 */
const CutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
`;

const CutItem = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: white;
  border: 2px dashed #6aaefe; /* 수정 모드 점선 테두리 */
  padding: 15px;
`;

const CutImagePlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #888;
  margin-bottom: 15px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7; /* 수정 모드에선 흐리게 */
  }
`;

const RegenButton = styled.button`
  position: absolute;
  background-color: rgba(0,0,0,0.7);
  color: white;
  border: 1px solid white;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover { background-color: black; }
`;

// --- 초기 데이터 (실제로는 백엔드에서 받아올 데이터) ---
const INITIAL_DATA = {
  date: '2025년 11월 18일',
  original: '오늘 아침에 늦잠을 자서 지각할 뻔했다. 뛰어가다가 넘어질 뻔했지만 다행히 세이프!',
  fullStory: '평범한 학생인 주인공은 아침에 눈을 뜨자마자 절망했다. 시계는 이미 등교 시간을 훌쩍 넘기고 있었다. "이건 지각 확정이야!" 그는 바람처럼 달리기 시작했다. 도중에 돌부리에 걸려 넘어질 뻔한 절체절명의 순간, 그는 놀라운 균형 감각으로 위기를 모면하고 교문 안으로 골인했다.',
  settings: {
    character: '파란 후드티를 입은 남학생',
    genre: '학원물/액션',
    style: '웹툰 스타일',
    cuts: 4
  },
  cuts: [
    { id: 1, image: 'https://via.placeholder.com/600x400?text=Image+1', text: '눈을 뜨니 8시 30분...?! 늦었다!!!' },
    { id: 2, image: 'https://via.placeholder.com/600x400?text=Image+2', text: '전속력으로 달리는 주인공. 바람을 가른다!' },
    { id: 3, image: 'https://via.placeholder.com/600x400?text=Image+3', text: '앗! 돌부리?! 중심을 잃은 그 순간...' },
    { id: 4, image: 'https://via.placeholder.com/600x400?text=Image+4', text: '휴... 간신히 세이프. 오늘도 평화로운 하루다.' },
  ]
};

// --- 컴포넌트 로직 ---

function DiaryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. 수정할 데이터를 담을 State (초기값은 불러온 데이터)
  const [editData, setEditData] = useState(INITIAL_DATA);

  // 2. 최상위 레벨 텍스트 변경 핸들러 (원문, 각색)
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  // 3. 설정 값(settings) 변경 핸들러 (중첩 객체라 따로 처리)
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      settings: {
        ...editData.settings,
        [name]: value
      }
    });
  };

  // 4. 컷 별 내용(cuts 배열) 변경 핸들러
  const handleCutChange = (index, newText) => {
    const newCuts = [...editData.cuts]; // 배열 복사
    newCuts[index].text = newText;      // 해당 순서의 텍스트 수정
    setEditData({ ...editData, cuts: newCuts });
  };

  // 5. 저장 버튼 클릭 (백엔드로 데이터 전송)
  const handleSave = () => {
    if (window.confirm("수정된 내용을 저장하시겠습니까?")) {
      console.log("서버로 전송될 수정 데이터:", editData);
      // TODO: axios.put('/api/diaries/1', editData)
      
      alert("저장되었습니다!");
      navigate(`/diaries/${id}`); // 상세 페이지로 돌아가기
    }
  };

  return (
    <Container>
      <Header />
      <ContentWrapper>
        
        <SectionBox>
          <HeaderRow>
            <Title>✏️ 일기 수정 모드</Title>
            <TopBtnGroup>
              <SmallButton onClick={() => navigate(-1)}>취소</SmallButton>
              <SmallButton className="save" onClick={handleSave}>저장 완료</SmallButton>
            </TopBtnGroup>
          </HeaderRow>
          
          {/* 설정값 수정 영역 */}
          <TagRow>
            <div>
              <Label>장르</Label>
              <StyledInput name="genre" value={editData.settings.genre} onChange={handleSettingChange} />
            </div>
            <div>
              <Label>작화 스타일</Label>
              <StyledInput name="style" value={editData.settings.style} onChange={handleSettingChange} />
            </div>
            <div>
              <Label>캐릭터 설정</Label>
              <StyledInput name="character" value={editData.settings.character} onChange={handleSettingChange} />
            </div>
          </TagRow>

          <InfoGrid>
            <InfoItem>
              <Label>📝 일기 원문 (수정 가능)</Label>
              <StyledTextarea 
                name="original" 
                value={editData.original} 
                onChange={handleTextChange} 
              />
            </InfoItem>
            
            <InfoItem style={{backgroundColor: '#e8f4fd'}}> 
              <Label>📖 AI 각색 이야기 (수정 가능)</Label>
              <StyledTextarea 
                name="fullStory" 
                value={editData.fullStory} 
                onChange={handleTextChange} 
                style={{ minHeight: '150px' }}
              />
            </InfoItem>
          </InfoGrid>
        </SectionBox>

        {/* 컷 별 수정 영역 */}
        <Title style={{ textAlign: 'center', marginBottom: '30px' }}>
          🎨 컷 별 내용 및 이미지 수정
        </Title>
        
        <CutList>
          {editData.cuts.map((cut, index) => (
            <CutItem key={cut.id}>
              <CutImagePlaceholder>
                <img src={cut.image} alt={`컷 ${cut.id}`} />
                <RegenButton onClick={() => alert(`${cut.id}번 컷 이미지를 재생성합니다.`)}>
                  🔄 이미지 재생성
                </RegenButton>
              </CutImagePlaceholder>
              
              <Label>{index + 1}컷 대사/상황묘사 수정</Label>
              <StyledTextarea 
                value={cut.text}
                onChange={(e) => handleCutChange(index, e.target.value)}
              />
            </CutItem>
          ))}
        </CutList>

      </ContentWrapper>
    </Container>
  );
}

export default DiaryEdit;