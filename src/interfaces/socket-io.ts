export interface IoEventInfo<T = string|Object> { name: string, count?: number; once?: boolean; initialState?: T}
export interface SocketState { connected: boolean, id?: string; }
