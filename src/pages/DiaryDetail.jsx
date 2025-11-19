import { useState, useEffect } from 'react'; // State, Effect 추가
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import { getDiaryDetail, deleteDiary } from '../api'; // API 함수 불러오기

// --- 스타일 정의 (기존과 동일) ---

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
    color: #333;
  }

  &.edit {
    border-color: #6aaefe;
    color: #6aaefe;
    &:hover {
      background-color: #6aaefe;
      color: white;
    }
  }

  &.delete {
    border-color: #dc3545; /* 빨간색 계열 테두리 */
    color: #dc3545; 
    &:hover {
      background-color: #dc3545;
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
  height: auto;
  min-height: 300px;
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
    height: auto;
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

// --- 컴포넌트 로직 ---

function DiaryDetail() {
  const { id } = useParams(); // URL에서 ID 가져옴
  const navigate = useNavigate();
  
  // 1. 데이터를 담을 State (초기값 null)
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDeleteDiary = async () => {
    if (!window.confirm('정말로 이 일기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        return;
    }
    
    setLoading(true); // 로딩 상태 활성화 (UX 개선)
    try {
        await deleteDiary(id); // API 호출
        alert('일기가 성공적으로 삭제되었습니다.');
        navigate('/diaries'); // 삭제 후 일기 목록 페이지로 이동
    } catch (error) {
        console.error('Failed to delete diary:', error);
        alert('일기 삭제에 실패했습니다.');
    } finally {
        setLoading(false);
    }
  };

  // 2. 데이터 불러오기 (useEffect)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDiaryDetail(id);
        setDiary(data);
      } catch (error) {
        console.error("일기 상세 조회 실패:", error);
        alert("일기를 불러오는데 실패했습니다.");
        navigate('/diaries'); // 실패 시 목록으로 이동
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]); // id가 바뀔 때마다 재실행

  // 3. 로딩 중일 때 화면
  if (loading) {
    return (
      <Container>
        <Header />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          로딩 중입니다...
        </div>
      </Container>
    );
  }

  // 4. 데이터가 없을 때 화면 (안전장치)
  if (!diary) return null;

  return (
    <Container>
      <Header />
      <ContentWrapper>
        
        {/* 1. 상단: 설정 및 전체 이야기 */}
        <SectionBox>
          <HeaderRow>
            <Title>{diary.date}의 일기 기록</Title>
            <TopBtnGroup>
              <SmallButton onClick={() => navigate('/diaries')}>
                목록
              </SmallButton>
              <SmallButton className="edit" onClick={() => navigate(`/diaries/${id}/edit`)}>
                수정
              </SmallButton>
              <SmallButton className="delete" onClick={handleDeleteDiary} disabled={loading}>
                삭제
              </SmallButton>
            </TopBtnGroup>
          </HeaderRow>
          
          {/* settings가 있을 때만 태그 렌더링 (안전장치) */}
          {diary.settings && (
            <TagRow style={{marginBottom: '20px'}}>
              <Tag>#{diary.settings.genre}</Tag>
              <Tag>#{diary.settings.style}</Tag>
              <Tag>{diary.settings.cuts}컷</Tag>
              <Tag>👤 {diary.settings.character}</Tag>
            </TagRow>
          )}

          <InfoGrid>
            <InfoItem>
              <h4>📝 일기 원문</h4>
              <p>{diary.original_content}</p>
            </InfoItem>
            
            <InfoItem style={{backgroundColor: '#e8f4fd', border: '1px solid #d1e9ff'}}> 
              <h4>📖 AI 각색 이야기</h4>
              <p>{diary.full_story}</p>
            </InfoItem>
          </InfoGrid>
        </SectionBox>

        {/* 2. 하단: 컷 별 이미지와 내용 */}
        <Title style={{ textAlign: 'center', marginBottom: '30px' }}>
          🎨 생성된 만화
        </Title>
        
        <CutList>
          {/* cuts 배열 매핑 */}
          {diary.cuts && diary.cuts.map((cut) => (
            <CutItem key={cut.cut_id}>
              <CutImagePlaceholder>
                {cut.image_url ? (
                  <img src={cut.image_url} alt={`컷 ${cut.cut_number}`} />
                ) : (
                  <span>이미지 생성 중...</span>
                )}
              </CutImagePlaceholder>
              <CutCaption>
                {cut.cut_number}. {cut.text}
              </CutCaption>
            </CutItem>
          ))}
        </CutList>

        {/* 3. 최하단 버튼 */}
        <BottomButtonGroup>
          <ActionButton onClick={() => navigate('/diaries')}>
            목록으로 돌아가기
          </ActionButton>
          {/* 수정 버튼은 상단에 있으므로 하단은 목록만 둬도 깔끔함 (선택사항) */}
        </BottomButtonGroup>

      </ContentWrapper>
    </Container>
  );
}

export default DiaryDetail;