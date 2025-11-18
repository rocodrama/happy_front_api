import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import { getDiaryDetail, updateDiary, regenerateCutImage, regenerateFullDiary } from '../api';

// --- 스타일 정의 (기존과 동일) ---
// ... (Container, ContentWrapper, SectionBox, HeaderRow, Title, TopBtnGroup, SmallButton 스타일은 유지) ...

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
  border: 1px solid #6aaefe; 
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

  &.regen {
    background-color: #ff9800;
    color: white;
    border-color: #ff9800;
  }
`;

const Label = styled.label`
  font-size: 13px;
  color: #6aaefe;
  font-weight: bold;
  margin-bottom: 5px;
  display: flex; /* 버튼 배치를 위해 flex 사용 */
  justify-content: space-between;
  align-items: center;
`;

// [NEW] 수정 불가능한 텍스트 스타일 (수정 불가능함을 시각적으로 명시)
const ReadonlyTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #e0e0e0; /* 연한 테두리 */
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
  background-color: #fafafa; /* 배경색으로 수정 불가능 명시 */
  cursor: default;
  color: #777; /* 글자색을 연하게 */
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
  grid-template-columns: 1fr 1fr 1fr; 
  gap: 10px;
  margin-bottom: 20px;
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
  border: 2px dashed #6aaefe; 
  padding: 15px;
`;

const CutImagePlaceholder = styled.div`
  width: 100%;
  height: auto;
  min-height: 300px;
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
    height: auto;
    object-fit: cover;
    opacity: 0.7; 
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
  z-index: 10;
  
  &:hover { background-color: black; }
  &:disabled { background-color: #555; cursor: not-allowed; }
`;


// --- 컴포넌트 로직 ---

function DiaryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // [NEW] 전체 재생성 중임을 나타내는 상태
  const [isFullRegenerating, setIsFullRegenerating] = useState(false); 

  // 2. 페이지 로드 시 기존 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDiaryDetail(id);
        setEditData(data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        alert("데이터를 불러올 수 없습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // 3. 텍스트 변경 핸들러 (원문만 사용)
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  // 4. 설정 값(settings) 변경 핸들러 (사용하지 않음)
  const handleSettingChange = (e) => {
    // 설정 변경을 막음
  };

  // 5. 컷 별 내용(cuts 배열) 변경 핸들러 (사용하지 않음)
  const handleCutChange = (index, newText) => {
    // 컷 별 내용 수정 막음
  };

  // 6. [저장] 버튼 클릭 시 (원문만 수정 가능하도록 하려면 저장 로직을 간소화해야 함)
  const handleSave = async () => {
    if (!window.confirm("수정된 내용을 저장하시겠습니까?")) return;

    try {
        // 1. API가 요구하는 형식으로 Payload 구성
        const payload = {
            // Frontend keys (original, fullStory) map to API keys (original_content, full_story)
            original_content: editData.original_content,
            full_story: editData.full_story, 
            
            // 2. 컷 내용도 함께 전송 (API 스키마 필수 조건)
            cuts: editData.cuts.map(cut => ({
                cut_id: cut.cut_id,
                text: cut.text // 수정 불가능하지만, API 스키마를 위해 보냄
            }))
        };

        // 3. 백엔드로 PUT 요청
        await updateDiary(id, payload);
        
        alert("원문과 컷 내용이 성공적으로 저장되었습니다!");
        navigate(`/diaries/${id}`); 
        
    } catch (error) {
        console.error("저장 실패 (422 오류 확인):", error);
        alert("저장 중 오류가 발생했습니다. 모든 필수 항목이 채워졌는지 확인해주세요.");
    }
  };


  // 7. [이미지 재생성] 버튼 클릭 시 (같은 프롬프트로 이미지 파일만 다시 요청)
  const handleRegenerate = async (cutId) => {
    if (isFullRegenerating) return;

    if (!window.confirm("같은 프롬프트로 이미지만 다시 생성하시겠습니까?")) return;

    // NOTE: 여기서는 prompt_override 없이 백엔드에서 기존 image_prompt를 재활용하도록 요청
    try {
      const response = await regenerateCutImage(cutId, { prompt_override: "" });

      // 성공 시 해당 컷의 이미지 URL만 업데이트 (State에 반영)
      const newCuts = editData.cuts.map(cut => 
        cut.cut_id === cutId ? { ...cut, image_url: response.new_image_url } : cut
      );
      
      setEditData({ ...editData, cuts: newCuts });
      alert("새로운 이미지가 생성되었습니다!");

    } catch (error) {
      console.error("이미지 재생성 실패:", error);
      alert("이미지 생성에 실패했습니다. (같은 프롬프트 사용)");
    }
  };

  // 8. [전체 재생성] 버튼 클릭 시 (일기 원문 기반으로 스토리/컷/이미지 ALL NEW)
  const handleFullRegenerate = async () => {
    if (isFullRegenerating) return;
    if (!window.confirm("수정된 원문 기반으로 스토리, 컷, 이미지를 모두 새로 만드시겠습니까?")) return;

    setIsFullRegenerating(true);

    try {
        // 1. 백엔드에 보낼 payload 준비
        const userId = localStorage.getItem('user_id');
        const payload = {
            // NOTE: 백엔드의 FullRegenerateRequest 스키마에 맞춤
            original_content: editData.original_content, 
            user_id: parseInt(userId) 
        };

        alert("전체 재생성 요청! AI 파이프라인을 실행합니다. 잠시만 기다려주세요! ⏳");
        
        // 2. [수정] 전체 재생성 전용 API 호출
        const response = await regenerateFullDiary(id, payload);
        
        // 3. 성공하면 상세 페이지로 이동 (ID는 그대로 사용)
        alert(`전체 재생성 완료! 일기 ID ${response.diary_id}를 확인합니다.`);
        navigate(`/diaries/${id}`); 

    } catch (error) {
        console.error("전체 재생성 실패:", error);
        alert(`전체 재생성 중 오류 발생: ${error.message}`);
    } finally {
        setIsFullRegenerating(false);
    }
};

  // 로딩 중 처리
  if (loading || isFullRegenerating) return (
    <Container>
      <Header />
      <div style={{textAlign:'center', marginTop:'50px', fontSize:'20px', color: isFullRegenerating ? 'red' : 'black'}}>
        {isFullRegenerating ? "전체 재생성 중입니다... 잠시만 기다려주세요! ⏳" : "불러오는 중입니다..."}
      </div>
    </Container>
  );

  if (!editData) return null;

  return (
    <Container>
      <Header />
      <ContentWrapper>
        
        <SectionBox>
          <HeaderRow>
            <Title>✏️ 일기 수정 모드</Title>
            <TopBtnGroup>
              <SmallButton onClick={() => navigate(-1)} disabled={isFullRegenerating}>취소</SmallButton>
              <SmallButton className="save" onClick={handleSave} disabled={isFullRegenerating}>저장</SmallButton>
            </TopBtnGroup>
          </HeaderRow>
          
          {/* 설정값은 수정 불가능하게 렌더링 (그대로 유지) */}
          <TagRow>
            {/* 설정값은 Readonly Input으로 보여주기만 함 */}
          </TagRow>

          <InfoGrid>
            <InfoItem>
              {/* [NEW] Label 안에 버튼 추가 */}
              <Label>
                <span>📝 일기 원문</span>
                <SmallButton 
                  className="regen" 
                  onClick={handleFullRegenerate} 
                  disabled={isFullRegenerating}
                  style={{ backgroundColor: isFullRegenerating ? 'grey' : '#ff9800' }}
                >
                  {isFullRegenerating ? '전체 재생성 중' : '원문 수정 및 전체 재생성'}
                </SmallButton>
              </Label>
              {/* 원문만 StyledTextarea (수정 가능) */}
              <StyledTextarea 
                name="original_content" 
                value={editData.original_content || ''} 
                onChange={handleTextChange} 
                disabled={isFullRegenerating}
              />
            </InfoItem>
            
            <InfoItem style={{backgroundColor: '#e8f4fd'}}> 
              <Label>📖 AI 각색 이야기 (수정 불가능)</Label>
              {/* 각색 이야기는 ReadonlyTextarea (수정 불가능) */}
              <ReadonlyTextarea 
                value={editData.full_story || ''} 
                readOnly 
                style={{ minHeight: '150px' }}
              />
            </InfoItem>
          </InfoGrid>
        </SectionBox>

        {/* 컷 별 수정 영역 */}
        <Title style={{ textAlign: 'center', marginBottom: '30px' }}>
          🎨 컷 별 이미지 재생성
        </Title>
        
        <CutList>
          {editData.cuts && editData.cuts.map((cut, index) => (
            <CutItem key={cut.cut_id}>
              <CutImagePlaceholder>
                {cut.image_url ? (
                    <img src={cut.image_url} alt={`컷 ${cut.cut_number}`} />
                ) : (
                    <span>이미지 없음</span>
                )}
                
                <RegenButton onClick={() => handleRegenerate(cut.cut_id)} disabled={isFullRegenerating}>
                  이미지 재생성
                </RegenButton>
              </CutImagePlaceholder>
              
              <Label>{index + 1}컷 대사/상황묘사 (고정)</Label>
              {/* 컷 내용은 ReadonlyTextarea (수정 불가능) */}
              <ReadonlyTextarea 
                value={cut.text}
                readOnly
              />
            </CutItem>
          ))}
        </CutList>

      </ContentWrapper>
    </Container>
  );
}

export default DiaryEdit;