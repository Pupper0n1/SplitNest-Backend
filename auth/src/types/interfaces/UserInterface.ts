export interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  user_pic?: string;
}
export interface UserCreationAttributes {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  user_pic?: string;
}
