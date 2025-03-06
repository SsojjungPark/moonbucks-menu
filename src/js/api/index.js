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

export default MenuApi;
