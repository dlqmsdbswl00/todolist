const calendar = document.querySelector(".calendar"), // 달력 컨테이너 요소 선택
  date = document.querySelector(".date"), // 날짜 표시 요소 선택
  daysContainer = document.querySelector(".days"), // 날짜 목록 컨테이너 요소 선택
  prev = document.querySelector(".prev"), // 이전 달 버튼 선택
  next = document.querySelector(".next"), // 다음 달 버튼 선택
  todayBtn = document.querySelector(".today-btn"), // 오늘 버튼 선택
  gotoBtn = document.querySelector(".goto-btn"), // 특정 날짜 이동 버튼 선택
  dateInput = document.querySelector(".date-input"), // 특정 날짜 입력 필드 선택
  eventDay = document.querySelector(".event-day"), // 이벤트 요일 표시 요소 선택
  eventDate = document.querySelector(".event-date"), // 이벤트 날짜 표시 요소 선택
  eventsContainer = document.querySelector(".events"), // 이벤트 목록 컨테이너 요소 선택
  addEventBtn = document.querySelector(".add-event"), // 이벤트 추가 버튼 선택
  addEventWrapper = document.querySelector(".add-event-wrapper "), // 이벤트 추가 폼 컨테이너 요소 선택
  addEventCloseBtn = document.querySelector(".close "), // 이벤트 추가 폼 닫기 버튼 선택
  addEventTitle = document.querySelector(".event-name "), // 이벤트 제목 입력 필드 선택
  addEventFrom = document.querySelector(".event-time-from "), // 이벤트 시작 시간 입력 필드 선택
  addEventTo = document.querySelector(".event-time-to "), // 이벤트 종료 시간 입력 필드 선택
  addEventSubmit = document.querySelector(".add-event-btn "); // 이벤트 추가 버튼 선택

let today = new Date(); // 현재 날짜 가져오기
let activeDay; // 활성화된 날짜를 추적하기 위한 변수
let month = today.getMonth(); // 현재 월 가져오기
let year = today.getFullYear(); // 현재 년도 가져오기

const months = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];  // 월 이름 배열 정의

const eventsArr = []; // 이벤트를 저장하는 배열 초기화
getEvents(); // 저장된 이벤트 불러오기
console.log(eventsArr);

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1); // 현재 월의 첫 날을 가져옴
  const lastDay = new Date(year, month + 1, 0); // 현재 월의 마지막 날을 가져옴
  const prevLastDay = new Date(year, month, 0); // 이전 월의 마지막 날을 가져옴
  const prevDays = prevLastDay.getDate(); // 이전 월의 일 수를 가져옴
  const lastDate = lastDay.getDate(); // 현재 월의 일 수를 가져옴
  const day = firstDay.getDay(); // 현재 월의 첫 날의 요일을 가져옴
  const nextDays = 7 - lastDay.getDay() - 1; // 다음 월의 날 수를 계산

  date.innerHTML = months[month] + " " + year;  // 날짜 표시 요소에 월과 년도 표시

  let days = "";

  for (let x = day; x > 0; x--) {
    // 이전 월들의 날들을 추가
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    // 현재 월의 날들을 추가
    // 날짜에 이벤트가 있는지 확인
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      // 오늘 날짜에 active 클래스를 추가하고 이벤트가 있는 경우 event 클래스도 추가
      activeDay = i;
      getActiveDay(i); // 활성 날짜의 요일 및 날짜 표시 업데이트
      updateEvents(i); // 이벤트 업데이트
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    // 다음 월의 날들을 추가
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days; // 날짜 목록 업데이트
  addListner(); // 각 날짜에 이벤트 리스너 추가
}

//function to add month and year on prev and next button
function prevMonth() {
  month--; // 이전 달로 이동
  if (month < 0) {
    month = 11; // 1월에서 이전 버튼을 누르면 12월로 이동
    year--;
  }
  initCalendar(); // 달력 업데이트
}

function nextMonth() {
  month++; // 다음 달로 이동
  if (month > 11) {
    month = 0; // 12월에서 다음 버튼을 누르면 1월로 이동
    year++;
  }
  initCalendar(); // 달력 업데이트
}

prev.addEventListener("click", prevMonth); // 이전 달 버튼에 클릭 이벤트 리스너 추가
next.addEventListener("click", nextMonth); // 다음 달 버튼에 클릭 이벤트 리스너 추가

initCalendar(); // 초기 달력 생성

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML); // 클릭한 날짜의 요일 및 날짜 표시 업데이트
      updateEvents(Number(e.target.innerHTML)); // 이벤트 업데이트
      activeDay = Number(e.target.innerHTML); // 활성 날짜 업데이트
      // 활성 클래스 제거
      days.forEach((day) => {
        day.classList.remove("active");
      });
      // 클릭한 날짜가 이전 월 또는 다음 월의 경우 해당 월로 전환
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        // 월이 변경된 후 클릭한 날짜에 활성 클래스 추가
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        // 월이 변경된 후 클릭한 날짜에 활성 클래스 추가
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date(); // 오늘 날짜로 이동
  month = today.getMonth(); // 현재 월 업데이트
  year = today.getFullYear(); // 현재 년도 업데이트
  initCalendar(); // 달력 업데이트
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/"; // 두 번째 문자 뒤에 슬래시 추가
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7); // 7자 이상 입력 방지
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2); // 슬래시 삭제
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

// 입력한 날짜로 이동하는 함수
function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1; // 0부터 시작하는 월로 변경
      year = dateArr[1];
      initCalendar(); // 달력 업데이트
      return;
    }
  }
  alert("날짜를 입력하세요"); // 잘못된 날짜 형식일 경우 경고 표시
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date); // 선택한 날짜의 Date 객체 생성
  const dayName = getKoreanDayName(day); // 한국어 요일을 가져오는 함수 호출
  eventDay.innerHTML = dayName; // 한국어 요일을 표시하는 부분 업데이트
  // const dayName = day.toString().split(" ")[0]; // 날짜의 요일을 추출
  // eventDay.innerHTML = dayName; // 이벤트 요일 업데이트
  eventDate.innerHTML = year + "년 " + months[month] + " " + date + "일 "; // 이벤트 날짜 업데이트
}

// 한국어 요일을 반환하는 함수 추가
function getKoreanDayName(date) {
  const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayIndex = date.getDay(); // 0부터 6까지의 숫자로 요일을 나타냅니다.
  return daysOfWeek[dayIndex];
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>할 일 없음</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events; // 이벤트 목록 업데이트
  saveEvents(); // 이벤트 저장
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active"); // 이벤트 추가 폼 표시/숨김 토글
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active"); // 이벤트 추가 폼 닫기
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active"); // 이벤트 추가 폼 영역 외를 클릭하면 숨김
  }
});

// 이벤트 제목 입력 필드에 50자 제한
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

function defineProperty() {
  var osccred = document.createElement("div");
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

// 이벤트 시작 및 종료 시간 입력 필드에 시간 형식 적용
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, ""); // 숫자와 콜론만 입력 가능하도록 필터링
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":"; // 두 번째 문자 뒤에 콜론 추가
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5); // 5자 이상 입력 방지
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, ""); // 숫자와 콜론만 입력 가능하도록 필터링
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":"; // 두 번째 문자 뒤에 콜론 추가
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5); // 5자 이상 입력 방지
  }
});

// 이벤트를 eventsArr 배열에 추가하는 함수
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("필수 요소가 비어있습니다"); // 필수 필드가 비어 있을 경우 경고 표시
    return;
  }

  // 올바른 시간 형식인지 확인 (24시간 형식)
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("올바른 시간을 입력하세요"); // 올바르지 않은 시간 형식일 경우 경고 표시
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  // 이벤트가 이미 추가되었는지 확인
  let eventExist = false;
  eventsArr.forEach((event) => {
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        if (event.title === eventTitle) {
          eventExist = true;
        }
      });
    }
  });
  if (eventExist) {
    alert("이미 추가되었습니다!"); // 이미 추가된 이벤트일 경우 경고 표시
    return;
  }
  const newEvent = {
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
  };
  console.log(newEvent);
  console.log(activeDay);
  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  console.log(eventsArr);
  addEventWrapper.classList.remove("active"); // 이벤트 추가 폼 숨기기
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay); // 이벤트 업데이트
  // 활성 날짜 선택 및 이벤트 클래스 추가 (만약 추가되지 않은 경우)
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("할 일을 완료했나요?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          // 만약 해당 날짜에 더 이상 이벤트가 없는 경우 eventsArr에서 해당 날짜 제거
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            // 날짜에서 이벤트 클래스 제거
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay); // 이벤트 업데이트
    }
  }
});

//function to save events in local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
  // 이벤트가 이미 로컬 스토리지에 저장되어 있는지 확인하고, 저장된 이벤트를 반환
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

// 시간 형식을 12시간 형식으로 변환하는 함수
function convertTime(time) {
  // 시간을 24시간 형식으로 변환
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}