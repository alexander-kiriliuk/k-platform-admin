/*
 * Copyright 2023 Alexander Kiriliuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Media} from "../modules/media/media.types";
import {LocalizedString} from "../modules/locale/locale.types";
import {MenuItemCommandEvent} from "primeng/api";

export type SystemTheme = "light" | "dark";

export interface MenuCommandHandler {
  onMenuCommand: (event: MenuItemCommandEvent, id?: string) => void;
}

export type Env = {
  production: boolean;
  frontEndUrl: string;
  apiUrl: string;
  mediaUrl: string;
  fileUrl: string;
}

export interface ToastData {
  title?: string;
  message?: string;
}

export interface Category {
  id: number;
  code: string;
  url: string;
  name: LocalizedString[];
  attrs: string;
  icon: Media;
  parent: Category;
  children: Category[];
}

export interface User {
  id: string;
  avatar: Media;
  password: string;
  login: string;
  email: string;
  phone: string;
  firstName: LocalizedString[];
  lastName: LocalizedString[];
  active: boolean;
  roles: UserRole[];
  tsCreated: Date;
}

export interface UserRole {
  code: string;
  name: LocalizedString[];
  tsCreated: Date;
}

export interface PageableParams {
  limit: number;
  page: number;
  sort?: string;
  order?: SortOrder;
}

export interface PageableData<T = unknown> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export type SortOrder = "ASC" | "DESC";
