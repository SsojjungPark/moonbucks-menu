import { $ } from "./utils/dom.js";
import { store } from "./store/index.js";

// Step3 요구사항
// TODO: 서버 요청 부분
// - [x] 웹 서버를 띄운다.
// - [x] 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
// - [x] 서버에 카테고리별 메뉴리스트를 요청한다.
// - [x] 서버에 저장되어 있는 메뉴명이 수정될 수 있도록 요청한다.
// - [x] 서버에 메뉴이 품절 상태를 토글될 수 있도록 요청한다.
// - [x] 서버 메뉴가 삭제될 수 있도록 요청한다.

// TODO: 리팩토링 부분
// - [x] localStorage에 저장하는 로직은 지운다.
// - [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO: 사용자 경험
// - [] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// - [] 중복되는 메뉴는 추가할 수 없다.

const BASE_URL = "http://localhost:3000";

const MenuApi = {
  // 카테고리 불러오기
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/api/category/${category}/menu`);
    return response.json();
  },

  // 메뉴명 추가
  async createMenu(category, name) {
    const response = await fetch(`${BASE_URL}/api/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
  },

  // 메뉴명 수정
  async updateMenu(category, name, menuId) {
    const response = await fetch(
      `${BASE_URL}/api/category/${category}/menu/${menuId}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
    return response.json();
  },

  // 품절 메뉴 토글
  async toggleSoldoutMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/api/category/${category}/menu/${menuId}/soldout`,
      {
        method: "PUT",
      }
    );
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
    return response.json();
  },

  // 메뉴 삭제
  async deleteMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/api/category/${category}/menu/${menuId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
  },
};

function App() {
  const form = $("#menu-form");
  const input = $("#menu-name");
  const submitBtn = $("#menu-submit-button");
  const ul = $("#menu-list");
  const menuCountSpan = $(".menu-count");
  const nav = $("nav");

  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListener();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map(
        (menuItem, index) => `<li data-menu-id="${
          menuItem.id
        }" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name ${
        menuItem.isSoldOut ? "sold-out" : ""
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
    const menuCount = this.menu[this.currentCategory].length;
    menuCountSpan.innerText = `총 ${menuCount}개`;
  };

  const addMenuName = async () => {
    const menuName = input.value;

    if (menuName === "") {
      alert("에스프레소 메뉴 이름을 입력해주세요.");
    }

    // 메뉴 생성
    await MenuApi.createMenu(this.currentCategory, menuName);

    // 카테고리 메뉴 리스트 데이터 요청
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    input.value = "";
  };

  const updateMenuName = async e => {
    const { menuId } = e.target.closest("li").dataset;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "메뉴명을 수정해주세요.",
      $menuName.innerText
    );
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
  };

  const removeMenuName = async e => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { menuId } = e.target.closest("li").dataset;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
        this.currentCategory
      );
      render();
    }
  };

  const soldOutMenu = async e => {
    const { menuId } = e.target.closest("li").dataset;
    await MenuApi.toggleSoldoutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );

    render();
  };

  const initEventListener = () => {
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

    nav.addEventListener("click", async e => {
      const isCategoryBtn = e.target.classList.contains("cafe-category-name");
      if (isCategoryBtn) {
        const { categoryName } = e.target.dataset;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
          this.currentCategory
        );
        render();
      }
    });
  };
}

const app = new App();
app.init();
