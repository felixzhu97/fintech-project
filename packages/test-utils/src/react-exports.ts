// React Testing Library 相关导出
// 这个文件单独导出，避免在 node 环境中自动加载
export {
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  waitForElement,
  within,
  queryBy,
  queryAllBy,
  getBy,
  getAllBy,
  findBy,
  findAllBy,
} from "@testing-library/react";

export { userEvent } from "@testing-library/user-event";
