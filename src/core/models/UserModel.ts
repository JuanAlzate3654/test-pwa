/**
 * model that represents an user
 */
export interface UserModel {

  /**
   * user name
   */
  username: string;

  /**
   * user name
   */
  name: string;

  /**
   * user last name
   */
  lastname?: string;

  /**
   * user email
   */
  email: string;

  /**
   * light or dark mode
   */
  mode: "dark" | "light";
  roles: Array<string>
}
