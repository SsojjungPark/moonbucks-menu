// Step2 요구사항
// TODO: localStorage Read & Write
// - [x] localStorage에 데이터를 저장한다.
//  - [X] 메뉴를 추가할 때
//  - [x] 메뉴를 수정할 때
//  - [x] 메뉴를 삭제할 때
// - [x] localStorage에 있는 데이터를 읽어온다.

// TODO: 카테고리별 메뉴판 관리
// - [x] 에스프레소 메뉴판 관리
// - [x] 프라푸치노 메뉴판 관리
// - [x] 블렌디드 메뉴판 관리
// - [x] 티바나 메뉴판 관리
// - [x] 디저트 메뉴판 관리

// TODO: 페이지 접근시 최초 데이터 Read & Rendring
// - [x] 페이지에 최초로 로딩될때 localStorage에서 에스프레소 메뉴를 읽어온다.
// - [x] 에스프레소 메뉴를 페이지에 렌더링한다.

// TODO: 품절
// - [x] 품절 버튼 추가
// - [x] sold-out class를 추가하여 상태를 변경한다.
// - [x] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// - [x] 클릭이벤트에서 가장 가까운 li 태그의 class 속성에 sold-out을 추간한다.

// HTML로 부터 태그를 가져올 때 관용적으로 '$'기호 사용
const $ = selector => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

function App() {
  const form = $("#menu-form");
  const input = $("#menu-name");
  const submitBtn = $("#menu-submit-button");
  const ul = $("#menu-list");
  const menuCountSpan = $(".menu-count");
  const nav = $("nav");

  // 상태: 변하는 데이터 - 메뉴명
  // 갯수는 length만 구하면 쉽게 구할수 있어서 데이터롤 저장 필요 X
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map(
        (
          menuItem,
          index
        ) => `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name ${
        menuItem.soldOut ? "sold-out" : ""
      }">${menuItem.name}</span>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
        품절
      </button>
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
    </li>`
      )
      .join("");
    ul.innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = ul.querySelectorAll("li").length;
    menuCountSpan.innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    const MenuName = input.value;

    this.menu[this.currentCategory].push({
      name: MenuName,
    });
    store.setLocalStorage(this.menu);
    render();
    input.value = "";

    if (MenuName === "") {
      alert("에스프레소 메뉴 이름을 입력해주세요.");
    }
  };

  const updateMenuName = e => {
    const { menuId } = e.target.closest("li").dataset;
    // 비구조화 할당 (Destructuring Assignment)
    // const menuId = e.target.closest("li").dataset.menuId;와 같음

    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "메뉴명을 수정해주세요.",
      $menuName.innerText
    );
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = e => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { menuId } = e.target.closest("li").dataset;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  const soldOutMenu = e => {
    const { menuId } = e.target.closest("li").dataset;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  ul.addEventListener("click", e => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
      return;
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
      return;
    }

    if (e.target.classList.contains("menu-sold-out-button")) {
      soldOutMenu(e);
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
  });

  submitBtn.addEventListener("click", addMenuName);

  input.addEventListener("keypress", e => {
    if (e.key !== "Enter") return;
    addMenuName();
  });

  nav.addEventListener("click", e => {
    const isCategoryBtn = e.target.classList.contains("cafe-category-name");
    if (isCategoryBtn) {
      const { categoryName } = e.target.dataset;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  });
}

const app = new App();
app.init();
