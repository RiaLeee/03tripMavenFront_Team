import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));
const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

export default function CustomizedAccordions() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqContent = [
    {
      tabTitle: '서비스 소개',
      questions: [
        'TripMaven은 어떤 서비스인가요?',
        'TripMaven의 주요 기능은 무엇인가요?',
        'TripMaven을 통해 어떤 종류의 여행 일정을 찾을 수 있나요?',
        'TripMaven의 서비스 이용료는 어떻게 되나요?',
        'TripMaven을 통해 여행 가이드를 선택하는 방법은 무엇인가요?',
      ],
      answers: [
        'TripMaven은 여행 가이드와 관광객을 연결해주는 플랫폼으로,가이드가 자신만의 여행 일정을 게시하고, 관광객이 이를 선택해 여행을 즐길 수 있도록 돕는 서비스입니다.',
        'TripMaven은 여행 가이드가 게시한 다양한 일정과 활동을 검색할 수 있으며, 관광객은 이를 통해 원하는 여행을 쉽게 계획할 수 있습니다. 또한, 가이드와 직접 연락하여 맞춤형 여행을 조율할 수 있는 기능도 제공합니다.',
        'TripMaven에서는 도시 탐방, 문화 체험, 자연 탐험, 미식 여행 등 다양한 종류의 여행 일정을 찾을 수 있습니다. 가이드들이 올린 일정은 각기 다른 주제와 스타일을 가지고 있어 다양한 취향을 만족시킬 수 있습니다',
        'TripMaven은 기본적으로 무료로 이용할 수 있으며, 결제는 선택한 여행 일정에 따라 개별적으로 이루어집니다. 서비스 이용료는 일정에 따라 다를 수 있으며, 상세한 정보는 각 게시글에서 확인할 수 있습니다',
        '원하는 여행 일정을 검색한 후, 각 가이드의 프로필과 일정을 검토하여 선택할 수 있습니다. 가이드의 리뷰와 평점을 참고하면 더 나은 선택을 할 수 있습니다',
      ],
    },
    {
      tabTitle: '이용 방법',
      questions: [
        'TripMaven에 회원가입은 어떻게 하나요?',
        '가이드가 올린 여행 일정에 어떻게 연락할 수 있나요?',
        '원하는 여행 일정을 검색하는 방법은 무엇인가요?',
        '가이드와의 연락은 어떤 방식으로 이루어지나요?',
        'TripMaven을 처음 이용하는 사용자에게 추천하는 팁은 무엇인가요?',
      ],
      answers: [
        'TripMaven 홈페이지에서 "회원가입" 버튼을 클릭하고, 이메일 주소 또는 소셜 미디어 계정을 통해 간편하게 가입할 수 있습니다',
        '원하는 일정 게시글에서 "문의하기" 버튼을 클릭하여 가이드에게 직접 메시지를 보낼 수 있습니다. 이후 가이드와 메시지를 주고받으며 세부 사항을 조율할 수 있습니다.',
        'TripMaven의 검색창에 여행하고 싶은 장소나 관심 있는 키워드를 입력하여 일정을 검색할 수 있습니다. 검색 결과는 필터를 통해 더 구체적으로 좁힐 수 있습니다',
        'TripMaven 플랫폼 내에서 제공되는 메시징 시스템을 통해 가이드와 연락할 수 있습니다.',
        '먼저 가이드의 프로필과 리뷰를 꼼꼼히 확인한 후 일정을 선택하세요. 또한, 가이드와 사전에 충분히 소통하여 기대하는 여행 경험을 공유하고 일정을 확정하는 것이 좋습니다',
      ],
    },

    {
      tabTitle: '계정 관리',
      questions: [
        'TripMaven 계정 비밀번호를 잊어버렸을 때 어떻게 복구할 수 있나요?',
        '계정 정보를 업데이트하려면 어떻게 해야 하나요?',
        '계정을 비활성화하거나 삭제할 수 있나요?',
        '가이드와의 메시지 기록은 어디서 확인할 수 있나요?',
        '알림 설정은 어떻게 변경하나요?',
      ],
      answers: [
        '로그인 페이지에서 "비밀번호 찾기" 링크를 클릭하세요. 등록된 아이디를 입력하면 본인확인 후 새로운 비밀번호를 설정할 수 있습니다.',
        '계정에 로그인한 후, 마이 프로필 페이지로 이동하여 개인 정보를 업데이트할 수 있습니다. 이름, 이메일 주소, 연락처 정보 등 필요한 정보를 수정한 후 저장 버튼을 클릭하면 변경 사항이 반영됩니다.',
        '계정 비활성화 기능은 아직 제공하고 있지 않습니다. 계정을 삭제하는 경우에는, 하단의 1:1문의를 통해 관리자에게 문의해주세요. 계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없으니 신중하게 결정해 주세요.',
        'TripMaven 내 메시지 센터에서 가이드와 주고받은 모든 메시지를 확인할 수 있습니다. 로그인 후 마이페이지에서 "채팅방" 메뉴를 클릭하면 모든 대화 기록이 나열되며, 각 대화를 클릭하면 세부 내용을 볼 수 있습니다.',
        '알림 설정은 프로필 설정의 "알림 설정" 섹션에서 변경할 수 있습니다. 특정 유형의 알림을 켜거나 끌 수 있으며, 원치 않는 알림을 받지 않도록 설정을 조정할 수 있습니다.',
      ],
    },
    {
      tabTitle: '취소/환불',
      questions: [
        '여행 일정을 취소하고 싶은데, 어떻게 해야 하나요?',
        '환불 정책은 어떻게 되나요?',
        '가이드 측에서 일정을 취소한 경우 환불은 어떻게 이루어지나요?',
        '취소 시 추가 수수료가 부과되나요?',
        '환불 절차는 얼마나 시간이 걸리나요?',
      ],
      answers: [
        '여행 일정을 취소하려면, 가이드와의 메시지 창에서 직접 요청해아합니다. 취소 시 취소 수수료가 발생할 수 있습니다.',
        '환불 정책은 가이드의 취소 정책에 따라 다를 수 있습니다. 대부분의 일정은 여행 시작 전 일정 기간 내에 취소하면 전액 환불이 가능하지만, 일부 일정은 부분 환불만 가능할 수 있습니다.',
        '가이드 측에서 일정을 취소한 경우, 결제된 금액은 전액 환불됩니다.',
        '취소 수수료는 가이드의 환불 정책에 따라 달라질 수 있습니다. 취소 정책을 사전에 확인하고, 필요 시 가이드와 협의하는 것이 중요합니다.',
        '환불은 취소 요청 후 5~10 영업일 내에 처리됩니다. 다만, 결제 수단과 가이드에 따라 환불 기간이 다를 수 있으므로 참고해 주세요.',
      ],
    },
    {
      tabTitle: '가이드 등록',
      questions: [
        '가이드로 등록하려면 어떻게 해야 하나요?',
        '가이드 등록에 필요한 조건은 무엇인가요?',
        '여행 일정을 게시할 때 유의할 점은 무엇인가요?',
        '가이드로서 수익은 어떻게 확인하나요?',
        '가이드로서 TripMaven을 이용할 때의 장점은 무엇인가요?',
      ],
      answers: [
        'TripMaven 홈페이지에서 "가이드 등록" 버튼을 클릭한 후, 필요한 정보를 입력하여 가이드 계정을 생성할 수 있습니다. 이후, 인증 절차를 거쳐 가이드로 활동할 수 있습니다.',
        '가이드로 등록하기 위해서는 신원 확인이 필요하며, 여행 관련 경험과 자격을 증명하는 자료를 제출해야 합니다. 가이드 자격증이 요구됩니다.',
        '여행 일정 게시 시, 명확하고 상세한 일정 설명, 포함 사항, 가격, 그리고 예상 소요 시간을 정확히 기재해야 합니다. 또한, 고객 리뷰와 평점 관리에도 신경 써야 합니다.',
        'TripMaven 플랫폼 내 가이드 대시보드에서 수익을 실시간으로 확인할 수 있습니다. 여기에는 예약된 일정과 예정된 지급 내역이 포함됩니다.',
        'TripMaven을 가이드로서 이용할 때의 주요 장점 중 하나는 AI를 활용한 역량 평가와 발전 기회입니다. TripMaven의 AI 시스템은 발음 테스트, 실전 테스트, 퀴즈 맞추기 등 다양한 도구를 통해 가이드의 언어 능력, 지식, 그리고 대화 스킬을 평가합니다. 이 분석을 바탕으로 가이드의 강점을 파악하고, 개선할 부분을 구체적으로 제시합니다. 이러한 피드백을 통해 가이드는 자신의 역량을 지속적으로 발전시킬 수 있으며, 향상된 능력을 고객에게 효과적으로 어필할 수 있어 더욱 신뢰받는 가이드로 성장할 수 있습니다.',
      ],
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto', marginTop: 25 }}>
      <Typography variant="h3">
        <div style={{ color: 'black', marginBottom: 15, marginTop: '-30px', paddingLeft: '20px' }}>FAQ</div>
      </Typography>

      <Box sx={{ width: '100%' }}>
        <AppBar position="static" color="defanult" elevation={1} sx={{ width: '100%', maxWidth: '950px', margin: 'auto', border: 'solid', borderWidth: '0.5px', borderColor: 'lightgray', marginBottom: 0 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#003CFF',
              },
              '& .Mui-selected': {
                color: '#0066FF',
              },
            }}
          >

            {faqContent.map((tab, index) => (
              <Tab key={index} label={tab.tabTitle} {...a11yProps(index)} sx={{ fontSize: '17px' }} />
            ))}
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
          style={{ width: '100%' }}
          animateTransitions={false} // 애니메이션 비활성화
        >
          {faqContent.map((tab, index) => (
            <TabPanel value={value} index={index} dir={theme.direction} key={index}>
              {tab.questions.map((question, qIndex) => (
                <Accordion
                  expanded={expanded === `panel${qIndex}`}
                  onChange={handleAccordionChange(`panel${qIndex}`)}
                  key={qIndex}
                >
                  <AccordionSummary
                    aria-controls={`panel${qIndex}d-content`}
                    id={`panel${qIndex}d-header`}
                  >
                    <Typography>{question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{tab.answers[qIndex]}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </TabPanel>
          ))}
        </SwipeableViews>
      </Box>
    </Box>
  );
}
