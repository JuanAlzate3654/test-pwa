export interface UserModel {
    username: string;
    name: string;
    lastname?: string;
    email: string;
    mode: "dark" | "light";
    roles: Array<string>
}
