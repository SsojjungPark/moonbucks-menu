import { $ } from "./utils/dom.js";
import store from "./store/index.js";

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
    initEventListener();
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
    const menuCount = this.menu[this.currentCategory].length;
    menuCountSpan.innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    const menuName = input.value;

    if (menuName === "") {
      alert("에스프레소 메뉴 이름을 입력해주세요.");
    }
    this.menu[this.currentCategory].push({
      name: menuName,
    });
    store.setLocalStorage(this.menu);
    render();
    input.value = "";
  };

  const updateMenuName = e => {
    const { menuId } = e.target.closest("li").dataset;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "메뉴명을 수정해주세요.",
      $menuName.innerText
    );
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = e => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { menuId } = e.target.closest("li").dataset;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = e => {
    const { menuId } = e.target.closest("li").dataset;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
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

    nav.addEventListener("click", e => {
      const isCategoryBtn = e.target.classList.contains("cafe-category-name");
      if (isCategoryBtn) {
        const { categoryName } = e.target.dataset;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

const app = new App();
app.init();
