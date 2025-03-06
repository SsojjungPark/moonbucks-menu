const BASE_URL = "http://localhost:3000";

const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    };
  },
  PUT(data) {
    return {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };
  },
  DELETE() {
    return {
      method: "DELETE",
    };
  },
};

const request = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러가 발생했습니다.");
    console.error("에러가 발생했습니다.");
  }
  return response.json();
};

const requestWithoutJson = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러가 발생했습니다.");
    console.error("에러가 발생했습니다.");
  }
  return response;
};

const MenuApi = {
  // 카테고리 불러오기
  getAllMenuByCategory(category) {
    return request(`${BASE_URL}/api/category/${category}/menu`);
  },

  // 메뉴명 추가
  createMenu(category, name) {
    return request(
      `${BASE_URL}/api/category/${category}/menu`,
      HTTP_METHOD.POST({ name })
    );
  },

  // 메뉴명 수정
  updateMenu(category, name, menuId) {
    return request(
      `${BASE_URL}/api/category/${category}/menu/${menuId}`,
      HTTP_METHOD.PUT({ name })
    );
  },

  // 품절 메뉴 토글
  toggleSoldoutMenu(category, menuId) {
    return request(
      `${BASE_URL}/api/category/${category}/menu/${menuId}/soldout`,
      HTTP_METHOD.PUT()
    );
  },

  // 메뉴 삭제
  deleteMenu(category, menuId) {
    return requestWithoutJson(
      `${BASE_URL}/api/category/${category}/menu/${menuId}`,
      HTTP_METHOD.DELETE()
    );
  },
};

export default MenuApi;
