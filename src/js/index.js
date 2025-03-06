import { $ } from "./utils/dom.js";
import MenuApi from "./api/index.js";

// Step3 요구사항

// TODO: 사용자 경험
// - [] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// - [x] 중복되는 메뉴는 추가할 수 없다.

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

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );

    const template = this.menu[this.currentCategory]
      .map(
        menuItem => `<li data-menu-id="${
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

    // 메뉴 중복 추가 방지
    const duplicatedMenu = this.menu[this.currentCategory].find(
      menuItem => menuItem.name === menuName
    );
    if (duplicatedMenu) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      input.value = "";
      return;
    }
    await MenuApi.createMenu(this.currentCategory, menuName);
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
    render();
  };

  const removeMenuName = async e => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { menuId } = e.target.closest("li").dataset;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const soldOutMenu = async e => {
    const { menuId } = e.target.closest("li").dataset;
    await MenuApi.toggleSoldoutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = e => {
    const isCategoryBtn = e.target.classList.contains("cafe-category-name");
    if (isCategoryBtn) {
      const { categoryName } = e.target.dataset;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
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

    nav.addEventListener("click", changeCategory);
  };
}

const app = new App();
app.init();
