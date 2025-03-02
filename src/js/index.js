// Step1 요규사항 구현을 위한 전략
// TODO: 메뉴 추가
// - [x] 메뉴의 이름을 입력 받고 엔터키 입력으로 메뉴가 추가된다.
// - [x] 메뉴의 이름을 입력 받고 확인 버트을 클릭하면 메뉴가 추가된다.
// - [x] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO: 메뉴 수정
// - [x] 메뉴의 수정 버튼 클릭 이벤트를 받고, 수정하는 모달창이 뜬다. => 이벤트 위임 사용
// - [x] 모달창에 신규메뉴 이름을 입력 받고, 확인 버튼을 클릭하면 메뉴 이름이 업데이트 된다.

// TODO: 메뉴 삭제
// - [x] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
// - [x] 확인 버튼을 클릭하면 메뉴가 삭제된다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.

// HTML로 부터 태그를 가져올 때 관용적으로 '$'기호 사용
const $ = selector => document.querySelector(selector);

const App = () => {
  const form = $("#espresso-menu-form");
  const input = $("#espresso-menu-name");
  const submitBtn = $("#espresso-menu-submit-button");
  const ul = $("#espresso-menu-list");
  const menuCountSpan = $(".menu-count");

  const updateMenuCount = () => {
    const menuCount = ul.querySelectorAll("li").length; // menuCount 변수 = li 객수를 카운팅
    menuCountSpan.innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    const espressoMenuName = input.value;

    if (espressoMenuName === "") {
      alert("에스프레소 메뉴 이름을 입력해주세요.");
      return;
    }

    const menuItemTemplate =
      espressoMenuName => `<li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;
    ul.insertAdjacentHTML("beforeend", menuItemTemplate(espressoMenuName));

    updateMenuCount();
    input.value = "";
  };

  const updateMenuName = e => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "메뉴명을 수정해주세요.",
      $menuName.innerText
    );
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = e => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  ul.addEventListener("click", e => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  // form 태그가 자동으로 전송되는 것을 막아준다.
  form.addEventListener("submit", e => {
    e.preventDefault();
  });

  submitBtn.addEventListener("click", addMenuName);

  input.addEventListener("keypress", e => {
    if (e.key !== "Enter") return;
    addMenuName();
  });
};

App();
