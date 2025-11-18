import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';

// --- 스타일 정의 ---

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
  border: 1px solid #e0e0e0;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
`;

/* [NEW] 제목과 버튼을 가로로 배치하는 컨테이너 */
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between; /* 양쪽 끝으로 배치 */
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 22px;
  font-weight: bold;
  margin: 0; /* HeaderRow가 간격을 대신함 */
`;

/* [NEW] 상단 전용 작은 버튼 그룹 */
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
    color: #333;
  }

  /* 수정 버튼은 파란색 포인트 */
  &.edit {
    border-color: #6aaefe;
    color: #6aaefe;
    &:hover {
      background-color: #6aaefe;
      color: white;
    }
  }
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

  h4 {
    font-size: 16px;
    color: #6aaefe;
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  p {
    font-size: 15px;
    color: #333;
    line-height: 1.6;
    white-space: pre-wrap;
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background-color: #e3f2fd;
  color: #1e88e5;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
`;

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
  border: 2px solid #2c3e50;
  padding: 10px;
  box-shadow: 5px 5px 0px rgba(0,0,0,0.1);
`;

const CutImagePlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  font-size: 14px;
  margin-bottom: 15px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CutCaption = styled.div`
  font-family: 'Nanum Pen Script', cursive, sans-serif;
  font-size: 18px;
  color: #333;
  text-align: center;
  padding: 10px;
  line-height: 1.4;
  background-color: #fffbea;
  border-radius: 5px;
`;

/* 하단 큰 버튼 그룹 (유지하거나 제거 가능) */
const BottomButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
`;

const ActionButton = styled.button`
  padding: 12px 30px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.primary ? '#6aaefe' : '#e0e0e0'};
  color: ${props => props.primary ? 'white' : '#555'};
  border: none;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

// --- 임시 데이터 ---
const MOCK_RESULT = {
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

function DiaryDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const data = MOCK_RESULT; 

  return (
    <Container>
      <Header />
      <ContentWrapper>
        
        {/* 1. 상단: 설정 및 전체 이야기 */}
        <SectionBox>
          {/* [NEW] 제목과 버튼을 가로로 배치 */}
          <HeaderRow>
            <Title>{data.date}의 일기 기록</Title>
            <TopBtnGroup>
              <SmallButton onClick={() => navigate('/diaries')}>
                목록
              </SmallButton>
              <SmallButton className="edit" onClick={() => navigate(`/diaries/${id}/edit`)}>
                수정
              </SmallButton>
            </TopBtnGroup>
          </HeaderRow>
          
          <TagRow style={{marginBottom: '20px'}}>
            <Tag>#{data.settings.genre}</Tag>
            <Tag>#{data.settings.style}</Tag>
            <Tag>{data.settings.cuts}컷</Tag>
            <Tag>👤 {data.settings.character}</Tag>
          </TagRow>

          <InfoGrid>
            <InfoItem>
              <h4>📝 일기 원문</h4>
              <p>{data.original}</p>
            </InfoItem>
            
            <InfoItem style={{backgroundColor: '#e8f4fd', border: '1px solid #d1e9ff'}}> 
              <h4>📖 AI 각색 이야기</h4>
              <p>{data.fullStory}</p>
            </InfoItem>
          </InfoGrid>
        </SectionBox>

        {/* 2. 하단: 컷 별 이미지와 내용 */}
        <Title style={{ textAlign: 'center', marginBottom: '30px' }}>
          🎨 생성된 만화
        </Title>
        
        <CutList>
          {data.cuts.map((cut) => (
            <CutItem key={cut.id}>
              <CutImagePlaceholder>
                <img src={cut.image} alt={`컷 ${cut.id}`} />
              </CutImagePlaceholder>
              <CutCaption>
                {cut.id}. {cut.text}
              </CutCaption>
            </CutItem>
          ))}
        </CutList>

        {/* 3. 최하단: 큰 버튼 그룹 (필요하다면 유지, 위쪽 버튼으로 충분하다면 삭제 가능) */}
        <BottomButtonGroup>
          <ActionButton onClick={() => navigate('/diaries')}>
            목록
          </ActionButton>
          <SmallButton className="edit" onClick={() => navigate(`/diaries/${id}/edit`)}>
            수정
          </SmallButton>
        </BottomButtonGroup>

      </ContentWrapper>
    </Container>
  );
}

export default DiaryDetail;